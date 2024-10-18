import threading
import psutil
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from events import event_generator, get_events, MAX_EVENTS, Events
from objects import get_object_list, Objects


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
@app.get("/objects_list", response_model=Objects)
def get_objects_list(
    object_type: Optional[str] = Query(None, description="Тип объекта (EMS, Network Node, Data Element SNMP)"),
    object_name: Optional[str] = Query(None, description="Имя объекта"),
    limit: Optional[int] = Query(100, ge=1, le=1000, description="Количество возвращаемых объектов")
):
    return get_object_list(object_type, object_name, limit)