from pydantic import BaseModel
 
 
class DrinkResponse(BaseModel):
    """What the API returns for a single drink."""
 
    id: int
    name: str
    caffeine_mg: int
    focus_minutes: int
 