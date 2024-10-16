import os
import psutil

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

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


# Эндпоинт для получения текущей загрузки CPU
@app.get("/current_cpu_usage")
def get_current_cpu_usage():
    try:
        cpu_usage = psutil.cpu_percent(interval=.1, percpu=False)
        return {"cpu_usage": cpu_usage}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))