from flask import Flask, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load API key
API_KEY = os.getenv("VITE_TMDB_API_KEY")

# Load movie data
with open("movies_dict.pkl", "rb") as f:
    movies_dict = pickle.load(f)
movies = pd.DataFrame(movies_dict)

# Initialize CountVectorizer
cv = CountVectorizer(max_features=3000, stop_words="english")
movie_vectors = cv.fit_transform(movies["tags"]).toarray()


def get_similarity_scores(movie_index):
    """Compute similarity scores for a single movie"""
    movie_vector = movie_vectors[movie_index].reshape(1, -1)
    return cosine_similarity(movie_vector, movie_vectors).flatten()


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

        # Compute similarity scores for this movie only
        similarity_scores = get_similarity_scores(movie_index)

        # Get top 5 similar movies
        similar_movies_indices = similarity_scores.argsort()[::-1][1:6]

        # Fetch details for recommended movies
        recommendations = []
        for idx in similar_movies_indices:
            movie_id = movies.iloc[idx].movie_id
            movie_details = fetch_movie_details(movie_id)
            if movie_details:
                recommendations.append(movie_details)

        return recommendations
    except Exception as e:
        print(f"Error getting recommendations: {e}")
        return []


@app.route("/")
def home():
    """Home endpoint"""
    return "Welcome to the Movie Recommendation API!"


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


if __name__ == "__main__":
    app.run(debug=False, port=8080)
