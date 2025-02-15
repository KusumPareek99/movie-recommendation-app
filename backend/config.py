import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Config:
    # API Configuration
    TMDB_API_KEY = os.getenv("VITE_TMDB_API_KEY")
    TMDB_API_BASE_URL = "https://api.themoviedb.org/3"

    # Flask Configuration
    DEBUG = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    PORT = int(os.getenv("FLASK_PORT", "8080"))

    # Model Configuration
    MAX_FEATURES = 5000
    TOP_N_RECOMMENDATIONS = 5

    # Cache Configuration
    CACHE_TIMEOUT = 3600  # 1 hour

    # Rate Limiting
    RATE_LIMIT_REQUESTS = 100
    RATE_LIMIT_PERIOD = 60  # 1 minute

    @staticmethod
    def get_tmdb_headers():
        return {
            "accept": "application/json",
            "Authorization": f"Bearer {Config.TMDB_API_KEY}",
        }
