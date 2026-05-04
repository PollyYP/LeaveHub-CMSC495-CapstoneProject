from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.crud import users as users_crud

router = APIRouter(prefix="/auth", tags=["Auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(data: LoginRequest):
    user = users_crud.get_user_by_email(data.email)
    if user and user.password == data.password:
        return {
            "message": "Login successful",
            "user": user
        }

    raise HTTPException(status_code=401, detail="Invalid email or password")

class ChangePasswordRequest(BaseModel):
    userId: int
    currentPassword: str
    newPassword: str


@router.put("/change-password")
def change_password(data: ChangePasswordRequest):
    user = users_crud.get_user_by_id(data.userId)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.password != data.currentPassword:
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    users_crud.update_password(data.userId, data.newPassword)
    return {"message": "Password changed successfully"}