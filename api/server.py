import threading
import psutil
import logging
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from events import event_generator, get_events, MAX_EVENTS, Events
from objects import object_store, OBJECT_TYPES, ObjectModel, ObjectsModel, ManageObjectRequest, insert_object, update_object, delete_object

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

app = FastAPI(title="Micran Test API")


# Разрешенные источники
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Добавление CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,             # Разрешенные источники
    allow_credentials=True,            # Разрешить отправку куки и авторизационных заголовков
    allow_methods=["*"],               # Разрешенные HTTP методы (например, GET, POST и т.д.)
    allow_headers=["*"],               # Разрешенные заголовки
)

class CpuUsage(BaseModel):
    cpu_usage: float

# Эндпоинт для получения текущей загрузки CPU
@app.get("/current_cpu_usage", response_model=CpuUsage)
def get_current_cpu_usage():
    try:
        cpu_usage = psutil.cpu_percent(interval=.1, percpu=False)
        return {"cpu_usage": cpu_usage}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# При запуске сервера запускается поток с генерацией событий
@app.on_event("startup")
def startup_event():
    event_generator_thread = threading.Thread(target=event_generator, daemon=True)
    event_generator_thread.start()

# Эндпоинт для получения недавних событий с возможной фильтрацией
@app.get("/recent_events", response_model=Events)
def get_recent_events(
    event_type: Optional[str] = Query(None, description="Тип события (critical, warning, info)"),
    date_start: Optional[str] = Query(None, description="Дата события в формате DD.MM.YYYY"),
    # time_start: Optional[str] = Query(None, description="Время события в формате HH:MM"),
    date_end: Optional[str] = Query(None, description="Дата события в формате DD.MM.YYYY"),
    # time_end: Optional[str] = Query(None, description="Время события в формате HH:MM"),
    limit: Optional[int] = Query(100, ge=1, le=MAX_EVENTS, description="Количество возвращаемых событий")
):
    return get_events(event_type, date_start, date_end, limit)


# Эндпоинт для получения списка объектов с возможной фильтрацией
@app.get("/objects_list", response_model=ObjectsModel)
def get_objects_list(
    object_type: Optional[str] = Query(None, description="Тип объекта (EMS, Network Node, Data Element SNMP)"),
    object_name: Optional[str] = Query(None, description="Имя объекта"),
    limit: Optional[int] = Query(100, ge=1, le=1000, description="Количество возвращаемых объектов")
):
    """
    Retrieve a list of all objects with optional filters.
    
    You can filter the objects by:
    - **object_type**: EMS, Network Node, Data Element SNMP
    - **object_name**: Substring match in the object name
    - **limit**: Maximum number of objects to return
    
    Example usage:
    - `/objects_list?object_type=EMS`
    - `/objects_list?object_name=starter`
    - `/objects_list?limit=2`
    """
    filtered_objects = object_store

    # Filter by object_type if provided
    if object_type:
        if object_type not in OBJECT_TYPES:
            raise HTTPException(status_code=400, detail="Invalid object type.")
        filtered_objects = [obj for obj in filtered_objects if obj["object_type"] == object_type]

    # Filter by object_name if provided
    if object_name:
        filtered_objects = [obj for obj in filtered_objects if object_name.lower() in obj["object_name"].lower()]

    # Apply limit if provided
    if limit is not None:
        filtered_objects = filtered_objects[:limit]

    return {"objects": filtered_objects}

# Эндпоинт для управления объектами (insert, update, delete)
@app.post("/manage_object", summary="Manage objects (insert, update, delete)", response_model=dict)
def manage_object(request: ManageObjectRequest):
    """
    This endpoint manages objects through three operations:
    
    - **Insert**: Creates a new object. All fields (`object_name`, `object_type`, `object_description`) must be provided.
    - **Update**: Updates an existing object. Requires `object_id` and at least one field to update (`object_name`, `object_type`, or `object_description`).
    - **Delete**: Deletes an existing object. Requires `object_id`.
    
    The `operation_type` field in the request determines the action: 'insert', 'update', or 'delete'.
    """
    operation_type = request.operation_type
    data = request.data

    if operation_type == "insert":
        response = insert_object(data)
        if "error" in response:
            raise HTTPException(status_code=400, detail=response["error"])
        return response

    elif operation_type == "update":
        response = update_object(data)
        if "error" in response:
            raise HTTPException(status_code=400, detail=response["error"])
        return response

    elif operation_type == "delete":
        response = delete_object(data)
        if "error" in response:
            raise HTTPException(status_code=400, detail=response["error"])
        return response

    else:
        raise HTTPException(status_code=400, detail="Invalid operation type.")