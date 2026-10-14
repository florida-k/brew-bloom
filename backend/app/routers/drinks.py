from fastapi import APIRouter, HTTPException
 
from app.schemas.drink import DrinkResponse
 
router = APIRouter(prefix="/api/drinks", tags=["drinks"])
 
# Mock data until the SQLAlchemy Drink model is connected to PostgreSQL.
# The caffeine and focus values are placeholders; confirm real numbers with the team.
MOCK_DRINKS = [
    DrinkResponse(id=1, name="Matcha", caffeine_mg=70, focus_minutes=25),
    DrinkResponse(id=2, name="Chai", caffeine_mg=50, focus_minutes=25),
    DrinkResponse(id=3, name="Latte", caffeine_mg=120, focus_minutes=45),
    DrinkResponse(id=4, name="Cappuccino", caffeine_mg=130, focus_minutes=50),
]
 
 
@router.get("", response_model=list[DrinkResponse])
def list_drinks():
    """Return all drinks."""
    return MOCK_DRINKS
 
 
@router.get("/{drink_id}", response_model=DrinkResponse)
def get_drink(drink_id: int):
    """Return one drink by id, or 404 if it doesn't exist."""
    for drink in MOCK_DRINKS:
        if drink.id == drink_id:
            return drink
    raise HTTPException(status_code=404, detail="Drink not found")