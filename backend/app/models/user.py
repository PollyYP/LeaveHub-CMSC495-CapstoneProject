from pydantic import BaseModel
from datetime import date


class User(BaseModel):
    userId: int
    name: str
    email: str
    password: str
    role: str
    managerId: int | None = None
    department: str | None = None
    profileImage: str | None = None
    startDate: date | None = None