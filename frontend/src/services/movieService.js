import { updateSearchCount, getTrendingMovies } from "../appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";
const RECOMMENDATION_API_URL =
  "https://movie-recommendation-app-backend.onrender.com/api";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export const movieService = {
  async searchMovies(query = "") {
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      if (data.response === "False") {
        throw new Error(data.error || "Error fetching movies");
      }

      if (query && data.results?.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

      return data.results || [];
    } catch (error) {
      console.error("Error in searchMovies:", error);
      throw error;
    }
  },

  async getRecommendedMovies(movieTitle) {
    try {
      const response = await fetch(
        `${RECOMMENDATION_API_URL}/recommend/${encodeURIComponent(movieTitle)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error("Error in getRecommendedMovies:", error);
      throw error;
    }
  },

  async getTrendingMovies() {
    try {
      const movies = await getTrendingMovies();
      return movies || [];
    } catch (error) {
      console.error("Error in getTrendingMovies:", error);
      throw error;
    }
  },
};
