from fastapi import FastAPI


app = FastAPI(
    title="Stackforge API",
    description="FastAPI API template",
    version="1.0.0",
    openapi_url="/api/openapi.json",
)


@app.get("/api")
@app.get("/api/")
def get_root() -> dict[str, str]:
    return {
        "service": "backend",
        "status": "ok",
        "message": "Stackforge FastAPI template is running",
    }


@app.get("/api/ping")
def get_ping() -> dict[str, bool]:
    return {"pong": True}


@app.get("/health")
def get_health() -> dict[str, str]:
    return {"status": "ok"}
