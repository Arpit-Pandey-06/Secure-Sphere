from pydantic import BaseModel, EmailStr

from pydantic import BaseModel, EmailStr, field_validator

class UserCreate(BaseModel):
    username: str
    email: EmailStr  # Automatically validates syntax
    password: str

    @field_validator("email")
    @classmethod
    def restrict_disposable_domains(cls, v: str):
        disposable_domains = ["mailinator.com", "tempmail.com"]
        domain = v.split("@")[-1]
        if domain in disposable_domains:
            raise ValueError("Disposable email addresses are not allowed")
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str