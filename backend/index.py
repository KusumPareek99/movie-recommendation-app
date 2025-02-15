from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from services.movie_service import MovieService
from utils.error_handlers import register_error_handlers, APIError
from config import Config


def create_app():
    app = Flask(__name__)

    # Initialize extensions
    CORS(app)

    # Configure caching
    cache = Cache(
        app,
        config={"CACHE_TYPE": "simple", "CACHE_DEFAULT_TIMEOUT": Config.CACHE_TIMEOUT},
    )

    # Configure rate limiting
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=[
            f"{Config.RATE_LIMIT_REQUESTS} per {Config.RATE_LIMIT_PERIOD} second"
        ],
    )

    # Initialize movie service
    movie_service = MovieService()

    # Register error handlers
    register_error_handlers(app)

    @app.route("/")
    def home():
        return "Welcome to the Movie Recommendation API!"

    @app.route("/health")
    @limiter.exempt
    def health_check():
        """Health check endpoint"""
        return jsonify({"status": "healthy"})

    @app.route("/api/recommend/<string:movie>", methods=["GET"])
    @cache.memoize(timeout=Config.CACHE_TIMEOUT)
    def get_recommendation(movie):
        """Get movie recommendations endpoint"""
        try:
            recommendations = movie_service.get_recommendations(movie)
            return jsonify(recommendations)
        except ValueError as e:
            raise APIError(str(e), status_code=404)
        except Exception as e:
            raise APIError(str(e), status_code=500)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=Config.PORT, debug=Config.DEBUG, use_reloader=False)
