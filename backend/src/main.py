from fastapi import FastAPI


app = FastAPI(
    title="Stackforge API",
    description="FastAPI API template",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    servers=[
        {"url": "/api", "description": "Nginx proxy"},
        {"url": "/", "description": "Direct backend access"},
    ]
)


@app.get("/")
def get_root() -> dict[str, str]:
    return {
        "service": "backend",
        "status": "ok",
        "message": "Stackforge FastAPI template is running",
    }


@app.get("/ping")
def get_ping() -> dict[str, bool]:
    return {"pong": True}


@app.get("/health")
def get_health() -> dict[str, str]:
    return {"status": "ok"}
