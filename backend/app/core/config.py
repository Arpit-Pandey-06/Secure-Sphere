from pydantic_settings import BaseSettings,SettingsConfigDict

class Settings(BaseSettings):
    MONGO_URL:str
    DATABASE_NAME:str
    ACCESS_TOKEN_KEY:str
    ACCESS_TOKEN_EXPIRE_MINUTES:int
    ALGORITHM:str

    model_config = SettingsConfigDict(
        env_file=".env"
    )

settings = Settings() # type: ignore