import threading
import time
import random
from datetime import datetime
from typing import List

from fastapi import HTTPException
from pydantic import BaseModel

# Модель для событий
class Event(BaseModel):
    id: int
    event: str
    type: str
    date: str  # Формат: DD.MM.YYYY
    time: str  # Формат: HH:MM

class Events(BaseModel):
    events: List[Event]

# Счётчик для автоинкремента id
event_id_counter = 4
# Хранилище событий
events_store: List[Event] = [
    Event(id=1, event="Subsystem with id 267713 fallen", type="critical", date="15.01.2021", time="13:21"),
    Event(id=2, event="Node №76 fallen with non zero error", type="warning", date="05.11.2022", time="14:42"),
    Event(id=3, event="Node №5 connected", type="info", date="01.12.2023", time="10:00"),
    Event(id=4, event="Subsystem with id 571231 fallen", type="critical", date="15.02.2023", time="13:47")
]
events_lock = threading.Lock()
MAX_EVENTS = 1000  # Максимальное количество хранимых событий
EVENT_TYPES = ["critical", "warning", "info"]

def generate_event() -> Event:
    global event_id_counter
    event_type = random.choice(EVENT_TYPES)
    
    if event_type == "critical":
        subsystem_id = random.randint(100000, 999999)
        event_text = f"Subsystem with id {subsystem_id} fallen with non zero error"
    elif event_type == "warning":
        node_number = random.randint(0, 100)
        event_text = f"Node #{node_number} fallen with non zero error"
    else:  # info
        node_number = random.randint(0, 100)
        action = random.choice(["connected", "disconnected"])
        event_text = f"Node #{node_number} {action}"
    
    now = datetime.now()
    event_id_counter += 1
    return Event(
        id=event_id_counter,
        event=event_text,
        type=event_type,
        date=now.strftime("%d.%m.%Y"),
        time=now.strftime("%H:%M")
    )

def event_generator():
    while True:
        new_event = generate_event()
        with events_lock:
            events_store.append(new_event)
            if len(events_store) > MAX_EVENTS:
                events_store.pop(0)  # Удаление самого старого события
        time.sleep(10)

# Функция для получения событий
def get_events(
    event_type,
    date_start,
    date_end, 
    limit
) -> Events:
    with events_lock:
        filtered_events = events_store.copy()

    #  сортировка по id (по убыванию)
    filtered_events = sorted(filtered_events, key=lambda e: e.id, reverse=True)

    def str_to_datetime(date_str, time_str="00:00"):
        if date_str:
            return datetime.strptime(f"{date_str} {time_str}", "%d.%m.%Y %H:%M")
        return None
    
    # Применение фильтров, если они заданы
    if event_type:
        if event_type not in EVENT_TYPES:
            raise HTTPException(status_code=400, detail="Invalid event type")
        filtered_events = [event for event in filtered_events if event.type == event_type]
    
    # Фильтрация по начальной дате и времени
    if date_start:
        try:
            datetime.strptime(date_start, "%d.%m.%Y")
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date_start format. Use DD.MM.YYYY")
        
        # if time_start:
        #     try:
        #         datetime.strptime(time_start, "%H:%M")
        #     except ValueError:
        #         raise HTTPException(status_code=400, detail="Invalid time_start format. Use HH:MM")

        #     start_datetime = str_to_datetime(date_start, time_start)
        #     filtered_events = [e for e in filtered_events if str_to_datetime(e.date, e.time) >= start_datetime]
        # else:
        start_datetime = str_to_datetime(date_start)
        filtered_events = [e for e in filtered_events if str_to_datetime(e.date) >= start_datetime]

    # Фильтрация по конечной дате и времени
    if date_end:
        try:
            datetime.strptime(date_end, "%d.%m.%Y")
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date_end format. Use DD.MM.YYYY")

        # if time_end:
        #     try:
        #         datetime.strptime(time_end, "%H:%M")
        #     except ValueError:
        #         raise HTTPException(status_code=400, detail="Invalid time_end format. Use HH:MM")

        #     end_datetime = str_to_datetime(date_end, time_end)
        #     filtered_events = [e for e in filtered_events if str_to_datetime(e.date, e.time) <= end_datetime]
        # else:
        end_datetime = str_to_datetime(date_end)
        filtered_events = [e for e in filtered_events if str_to_datetime(e.date) <= end_datetime]

    # Ограничение количества возвращаемых событий
    filtered_events = filtered_events[:limit]
    
    return {"events": filtered_events}