from fastapi import APIRouter, HTTPException
from app.models.user import User
from app.crud import users as users_crud
from app.crud import leave_requests as leave_requests_crud
from app.crud import leave_balances as leave_balances_crud
from datetime import date

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/")
def get_users():
    return users_crud.get_all_users()


@router.post("/")
def create_user(user: User):
    if users_crud.email_exists(user.email):
        raise HTTPException(status_code=400, detail="Email already exists")

    created = users_crud.create_user(user)

    current_year = date.today().year
    leave_balances_crud.create_balance(created.userId, 1, 30, current_year)  # Vacation
    leave_balances_crud.create_balance(created.userId, 2, 10, current_year)  # Personal

    return {"message": "User created", "user": created}


@router.get("/{user_id}")
def get_user_by_id(user_id: int):
    user = users_crud.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/{user_id}/requests")
def get_requests_for_user(user_id: int):
    return leave_requests_crud.get_requests_by_user(user_id)


@router.get("/{user_id}/balances")
def get_balances_for_user(user_id: int):
    return leave_balances_crud.get_balances_by_user(user_id)