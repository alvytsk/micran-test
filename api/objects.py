import threading
from datetime import datetime
from typing import List, Literal, Optional, Union
from fastapi import HTTPException
from pydantic import BaseModel, Field, validator

# Модель для объектов
class Object(BaseModel):
    object_id: int
    object_name: str
    object_type: str
    object_description: str

class Objects(BaseModel):
    objects: List[Object]

class ObjectInsertData(BaseModel):
    object_name: str = Field(..., alias="object_name")
    object_type: Literal["EMS", "Network Node", "Data Element SNMP"] = Field(..., alias="object_type")
    object_description: str = Field(..., alias="object_description")

class ObjectUpdateData(BaseModel):
    object_id: int = Field(..., alias="object_id")
    object_name: Optional[str] = Field(None, alias="object_name")
    object_type: Optional[Literal["EMS", "Network Node", "Data Element SNMP"]] = Field(None, alias="object_type")
    object_description: Optional[str] = Field(None, alias="object_description")
    
    @validator('object_name', 'object_type', 'object_description', pre=True, always=True)
    def at_least_one_field(cls, v, values, **kwargs):
        if not any([v for v in [values.get('object_name'), values.get('object_type'), values.get('object_description')]]):
            raise ValueError('At least one field must be provided for update')
        return v

class ObjectDeleteData(BaseModel):
    object_id: int = Field(..., alias="object_id")

class ManageObjectRequest(BaseModel):
    operation_type: Literal["insert", "update", "delete"] = Field(..., description="Тип операции (insert, update, delete)")
    data: Union[ObjectInsertData, ObjectUpdateData, ObjectDeleteData]

    @validator('data')
    def validate_data(cls, v, values):
        operation = values.get('operation_type')
        if operation == "insert":
            if not isinstance(v, ObjectInsertData):
                raise ValueError("Invalid data for insert operation")
        elif operation == "update":
            if not isinstance(v, ObjectUpdateData):
                raise ValueError("Invalid data for update operation")
        elif operation == "delete":
            if not isinstance(v, ObjectDeleteData):
                raise ValueError("Invalid data for delete operation")
        return v

class ManageObjectResponse(BaseModel):
    operation: str
    object_id: Optional[int] = None
    object_instance: Optional[Object] = None
    updated_param: Optional[str] = None
    timestamp: str
    errors: str = ""

objects_store: List[Object] = []
objects_lock = threading.Lock()
OBJECT_TYPES = ["EMS", "Network Node", "Data Element SNMP"]
object_id_counter = 0 

def initialize_objects():
    global object_id_counter
    starter_objects = [
        {"object_name": "ems1 starter", "object_type": "EMS", "object_description": "starter obj 1"},
        {"object_name": "NN starter", "object_type": "Network Node", "object_description": "starter obj 2"},
        {"object_name": "DE starter", "object_type": "Data Element SNMP", "object_description": "starter obj 3"},
    ]
    with objects_lock:
        for obj in starter_objects:
            objects_store.append(Object(
                object_id=object_id_counter,
                object_name=obj["object_name"],
                object_type=obj["object_type"],
                object_description=obj["object_description"]
            ))
            object_id_counter += 1

initialize_objects()

def get_object_list(object_type, object_name, limit) -> Objects:
    with objects_lock:
        filtered_objects = objects_store.copy()
    
    # Применение фильтров, если они заданы
    if object_type:
        if object_type not in OBJECT_TYPES:
            raise HTTPException(status_code=400, detail="Invalid object type")
        filtered_objects = [obj for obj in filtered_objects if obj.object_type == object_type]
    
    if object_name:
        filtered_objects = [obj for obj in filtered_objects if object_name.lower() in obj.object_name.lower()]
    
    # Ограничение количества возвращаемых объектов
    filtered_objects = filtered_objects[-limit:]
    
    return {"objects": filtered_objects}

def proc_manage_object(request: ManageObjectRequest):
    global next_object_id
    operation = request.operation_type.lower()
    timestamp = datetime.now().isoformat()
    errors = ""
    
    if operation == "insert":
        data: ObjectInsertData = request.data
        with objects_lock:
            object_id = next_object_id
            next_object_id += 1
            new_object = Object(
                object_id=object_id,
                object_name=data.object_name,
                object_type=data.object_type,
                object_description=data.object_description
            )
            objects_store.append(new_object)
        
        return ManageObjectResponse(
            operation="insert",
            object_id=object_id,
            object_instance=new_object,
            timestamp=timestamp,
            errors=errors
        )
    
    elif operation == "update":
        data: ObjectUpdateData = request.data
        if not any([data.object_name, data.object_type, data.object_description]):
            raise HTTPException(status_code=400, detail="At least one field must be provided for update")
        
        with objects_lock:
            obj = next((obj for obj in objects_store if obj.object_id == data.object_id), None)
            if not obj:
                raise HTTPException(status_code=404, detail="Object not found")
            
            updated_param = None
            if data.object_name:
                obj.object_name = data.object_name
                updated_param = "object_name"
            if data.object_type:
                obj.object_type = data.object_type
                updated_param = "object_type"
            if data.object_description:
                obj.object_description = data.object_description
                updated_param = "object_description"
        
        return ManageObjectResponse(
            operation="update",
            updated_param=updated_param,
            timestamp=timestamp,
            errors=errors
        )
    
    elif operation == "delete":
        data: ObjectDeleteData = request.data
        with objects_lock:
            obj = next((obj for obj in objects_store if obj.object_id == data.object_id), None)
            if not obj:
                raise HTTPException(status_code=404, detail="Object not found")
            objects_store.remove(obj)
        
        return ManageObjectResponse(
            operation="delete",
            object_id=data.object_id,
            object_instance=obj,
            timestamp=timestamp,
            errors=errors
        )
    
    else:
        raise HTTPException(status_code=400, detail="Invalid operation_type. Must be one of: insert, update, delete")
    