from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import drinks

app = FastAPI(
    title="Brew & Bloom API",
    description="Backend API for the Brew & Bloom productivity and wellness app",
    version="0.1.0"
)

app.include_router(drinks.router)

# Allow the React frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to the Brew & Bloom API!"}

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "Brew & Bloom backend is running!"
    }
