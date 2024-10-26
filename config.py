import os
from dotenv import load_dotenv
from typing import Optional

load_dotenv()


class Config:
    OPENWEATHER_API_KEY: Optional[str] = os.getenv('OPENWEATHER_API_KEY')
