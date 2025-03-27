import os
from dotenv import load_dotenv
from typing import Optional

# Load environment variables
load_dotenv()


# Config class
class Config:
    OPENWEATHER_API_KEY: Optional[str] = os.getenv('OPENWEATHER_API_KEY')
