from flask import Flask, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os
from dotenv import load_dotenv
import requests
from config import Config


def create_app():

    # Load environment variables
    load_dotenv()

    # Initialize Flask app
    app = Flask(__name__)
    CORS(app)

    # Load API key
    API_KEY = os.getenv("VITE_TMDB_API_KEY")

    # Load pre-computed data
    try:
        with open("movies_dict.pkl", "rb") as f:
            movies_dict = pickle.load(f)
        movies = pd.DataFrame(movies_dict)

        # Load pre-computed similarity matrix
        similarity = np.load("similarity_matrix.npy")
    except Exception as e:
        print(f"Error loading data: {e}")

    def fetch_movie_details(movie_id):
        """Fetch movie details from TMDB API"""
        url = f"https://api.themoviedb.org/3/movie/{movie_id}?language=en-US"
        headers = {"accept": "application/json", "Authorization": f"Bearer {API_KEY}"}

        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()

            return {
                "id": int(movie_id),
                "title": data["title"],
                "vote_average": round(data["vote_average"]),
                "poster_path": data["poster_path"],
                "release_date": str(data["release_date"]).split("-")[0],
                "original_language": data["original_language"],
            }
        except Exception as e:
            print(f"Error fetching movie details: {e}")
            return None

    def get_recommendations(movie_title):
        """Get movie recommendations based on similarity"""
        try:
            # Find movie index
            movie_index = movies[movies["title"] == movie_title].index
            if len(movie_index) == 0:
                return []

            movie_index = movie_index[0]
            distances = similarity[movie_index]

            # Get top 5 similar movies
            similar_movies = sorted(
                list(enumerate(distances)), reverse=True, key=lambda x: x[1]
            )[1:6]

            # Fetch details for recommended movies
            recommendations = []
            for idx, _ in similar_movies:
                movie_id = movies.iloc[idx].movie_id
                movie_details = fetch_movie_details(movie_id)
                if movie_details:
                    recommendations.append(movie_details)

            return recommendations
        except Exception as e:
            print(f"Error getting recommendations: {e}")
            return []

    @app.route("/")
    def index():
        """Index page"""
        return jsonify({"message": "Welcome to the Movie Recommender API!"})

    @app.route("/health")
    def health_check():
        """Health check endpoint"""
        return jsonify({"status": "healthy"})

    @app.route("/api/recommend/<string:movie>", methods=["GET"])
    def get_recommendation(movie):
        """Get movie recommendations endpoint"""
        try:
            recommendations = get_recommendations(movie)
            if not recommendations:
                return jsonify({"error": "Movie not found or error occurred"}), 404
            return jsonify(recommendations)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Required for Vercel
    app.debug = False
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=Config.PORT, debug=Config.DEBUG, use_reloader=False)
