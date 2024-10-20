import threading
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class ObjectModel(BaseModel):
    object_id: int = Field(..., description="Unique identifier for the object, auto-generated by the server")
    object_name: str = Field(..., description="Name of the object")
    object_type: str = Field(..., description="Type of the object. Must be one of ['EMS', 'Network Node', 'Data Element SNMP']")
    object_description: str = Field(..., description="Description of the object")

    class Config:
        schema_extra = {
            "example": {
                "object_id": 1,
                "object_name": "ems1 starter",
                "object_type": "EMS",
                "object_description": "Starter EMS object"
            }
        }

class ObjectsModel(BaseModel):
    objects: List[ObjectModel]

class ManageObjectRequest(BaseModel):
    operation_type: str = Field(..., description="Type of operation: 'insert', 'update', or 'delete'")
    data: dict = Field(..., description="Object data for the requested operation")

    class Config:
        schema_extra = {
            "example": {
                "operation_type": "insert",
                "data": {
                    "object_name": "ems2 example", 
                    "object_type": "EMS", 
                    "object_description": "ems2 example description"
                }
            }
        }

# In-memory object storage
object_store: List[ObjectModel] = []
current_id = 0
objects_lock = threading.Lock()

# Allowed object types
OBJECT_TYPES = ["EMS", "Network Node", "Data Element SNMP"]

def initialize_objects():
    global current_id
    starter_objects = [
        {"object_name": "ems1 starter", "object_type": "EMS", "object_description": "starter obj 1"},
        {"object_name": "NN starter", "object_type": "Network Node", "object_description": "starter obj 2"},
        {"object_name": "DE starter", "object_type": "Data Element SNMP", "object_description": "starter obj 3"},
    ]
    with objects_lock:
        for obj in starter_objects:
            object_store.append(ObjectModel(
                object_id=current_id,
                object_name=obj["object_name"],
                object_type=obj["object_type"],
                object_description=obj["object_description"]
            ))
            current_id += 1

initialize_objects()

# Helper Functions
def insert_object(data: dict):
    global current_id
    
    with objects_lock:    
        object_name = data.get("object_name")
        object_type = data.get("object_type")
        object_description = data.get("object_description")
        
        if not all([object_name, object_type, object_description]):
            return {"error": "All fields must be provided."}
        if object_type not in OBJECT_TYPES:
            return {"error": "Invalid object type."}
        
        new_object = ObjectModel(
            object_id=current_id,
            object_name=object_name,
            object_type=object_type,
            object_description=object_description
        )
        object_store.append(new_object)

    response = {
        "operation": "insert",
        "object_id": current_id,
        "object_instance": new_object,
        "timestamp": datetime.now(),
        "errors": ""
    }
    current_id += 1
    return response

# def update_object(data: dict):
#     with objects_lock:
#         object_id = data.get("object_id")
#         object_name = data.get("object_name")
#         object_type = data.get("object_type")
#         object_description = data.get("object_description")

#         if object_id is None:
#             return {"error": "object_id must be provided."}

#         obj = next((o for o in object_store if o.object_id == object_id), None)
#         if obj is None:
#             return {"error": "Object not found."}
        
#         updated_param = ""
#         if object_name:
#             obj.object_name = object_name
#             updated_param = "object_name"
#         if object_type:
#             if object_type not in OBJECT_TYPES:
#                 return {"error": "Invalid object type."}
#             obj.object_type = object_type
#             updated_param = "object_type"
#         if object_description:
#             obj.object_description = object_description
#             updated_param = "object_description"
        
#         if not updated_param:
#             return {"error": "At least one field must be updated."}
        
#         return {"operation": "update", "updated_param": updated_param, "errors": ""}

def update_object(data: dict):
    with objects_lock:
        object_id = data.get("object_id")

        if object_id is None:
            return {"error": "object_id must be provided."}

        obj = next((o for o in object_store if o.object_id == object_id), None)
        if obj is None:
            return {"error": "Object not found."}

        updated_fields = []

        if "object_name" in data:
            obj.object_name = data["object_name"]
            updated_fields.append("object_name")

        if "object_type" in data:
            object_type = data["object_type"]
            if object_type not in OBJECT_TYPES:
                return {"error": "Invalid object type."}
            obj.object_type = object_type
            updated_fields.append("object_type")

        if "object_description" in data:
            obj.object_description = data["object_description"]
            updated_fields.append("object_description")

        if not updated_fields:
            return {"error": "At least one field must be updated."}

        return {"operation": "update", "updated_params": updated_fields, "errors": ""}

def delete_object(data: dict):
    with objects_lock:
        object_id = data.get("object_id")
        if object_id is None:
            return {"error": "object_id must be provided."}
        
        obj = next((o for o in object_store if o.object_id == object_id), None)
        if obj is None:
            return {"error": "Object not found."}
        
        object_store.remove(obj)

    return {
        "operation": "delete",
        "object_id": object_id,
        "object_instance": obj,
        "timestamp": datetime.now(),
        "errors": ""
    }