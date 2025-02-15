import pickle
import pandas as pd
import requests
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache
from config import Config


class MovieService:
    def __init__(self):
        self._load_movie_data()
        self._prepare_similarity_matrix()

    def _load_movie_data(self):
        """Load and prepare movie data from pickle file"""
        try:
            with open("movies_dict.pkl", "rb") as f:
                movies_dict = pickle.load(f)
            self.movies_df = pd.DataFrame(movies_dict)
        except Exception as e:
            raise RuntimeError(f"Failed to load movie data: {str(e)}")

    def _prepare_similarity_matrix(self):
        """Prepare similarity matrix for movie recommendations"""
        try:
            cv = CountVectorizer(max_features=Config.MAX_FEATURES, stop_words="english")
            vectors = cv.fit_transform(self.movies_df["tags"]).toarray()
            self.similarity_matrix = cosine_similarity(vectors)
        except Exception as e:
            raise RuntimeError(f"Failed to prepare similarity matrix: {str(e)}")

    @lru_cache(maxsize=1000)
    def fetch_movie_details(self, movie_id):
        """Fetch movie details from TMDB API with caching"""
        try:
            url = f"{Config.TMDB_API_BASE_URL}/movie/{movie_id}?language=en-US"
            response = requests.get(url, headers=Config.get_tmdb_headers())
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
        except requests.exceptions.RequestException as e:
            raise RuntimeError(f"Failed to fetch movie details: {str(e)}")

    def get_recommendations(self, movie_title):
        """Get movie recommendations based on similarity"""
        try:
            # Find movie index
            movie_index = self.movies_df[self.movies_df["title"] == movie_title].index
            if len(movie_index) == 0:
                raise ValueError(f"Movie '{movie_title}' not found in database")

            movie_index = movie_index[0]
            distances = self.similarity_matrix[movie_index]

            # Get top N similar movies
            similar_movies = sorted(
                list(enumerate(distances)), reverse=True, key=lambda x: x[1]
            )[1 : Config.TOP_N_RECOMMENDATIONS + 1]

            # Fetch details for recommended movies
            recommendations = []
            for idx, _ in similar_movies:
                movie_id = self.movies_df.iloc[idx].movie_id
                movie_details = self.fetch_movie_details(movie_id)
                recommendations.append(movie_details)

            return recommendations

        except Exception as e:
            raise RuntimeError(f"Failed to get recommendations: {str(e)}")
