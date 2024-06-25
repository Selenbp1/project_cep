from pydantic import BaseModel

class UserInfo(BaseModel):
    full_name: str
    email: str
    contact: str

class UserCreateRequest(BaseModel):
    username: str
    password: str
    info: UserInfo
    permission: str
    
class UserUpdateRequest(BaseModel):
    username: str
    info: UserInfo
    permission: str
    
class UserResponse(BaseModel):
    id: int
    username: str
    full_name: str
    email: str
    contact: str
    permission: str