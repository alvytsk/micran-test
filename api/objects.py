import threading

from typing import List
from fastapi import HTTPException
from pydantic import BaseModel

# Модель для объектов
class Object(BaseModel):
    object_id: int
    object_name: str
    object_type: str
    object_description: str

class Objects(BaseModel):
    objects: List[Object]

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