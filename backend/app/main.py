from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.routes.auth_route import router as auth_router

# ============================================================================
# CONFIGURACIÓN LOGGING
# ============================================================================

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)

# ============================================================================
# APP
# ============================================================================

app = FastAPI(
    title="AlecTours API",
    description="API para gestión de hoteles y reservas",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# ============================================================================
# CORS
# ============================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# MIDDLEWARE LOGS
# ============================================================================

@app.middleware("http")
async def log_requests(request, call_next):

    logger.info(f"{request.method} {request.url.path}")

    response = await call_next(request)

    logger.info(f"Response: {response.status_code}")

    return response

# ============================================================================
# ROUTERS
# ============================================================================

app.include_router(auth_router)

# ============================================================================
# ENDPOINTS
# ============================================================================

@app.get("/")
def root():

    return {
        "message": "API Alecktours funcionando"
    }