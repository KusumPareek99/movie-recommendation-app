import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "react-use";
import { movieService } from "../services/movieService";

export const useMovieSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounce search term
  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    1000,
    [searchTerm]
  );

  const fetchMovies = useCallback(async (searchTerm) => {
    setIsLoading(true);
    setError("");
    try {
      const movies = await movieService.searchMovies(searchTerm);
      setMoviesList(movies);

      if (searchTerm && movies.length > 0) {
        const recommendations = await movieService.getRecommendedMovies(
          movies[0].title
        );
        setRecommendedMovies(recommendations);
      } else {
        setRecommendedMovies([]);
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching movies");
      setMoviesList([]);
      setRecommendedMovies([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchMovies]);

  return {
    searchTerm,
    setSearchTerm,
    moviesList,
    recommendedMovies,
    isLoading,
    error,
    refreshMovies: () => fetchMovies(debouncedSearchTerm),
  };
};

export const useTrendingMovies = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTrendingMovies = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const movies = await movieService.getTrendingMovies();
      setTrendingMovies(movies);
    } catch (err) {
      setError(
        err.message || "An error occurred while fetching trending movies"
      );
      setTrendingMovies([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendingMovies();
  }, [fetchTrendingMovies]);

  return {
    trendingMovies,
    isLoading,
    error,
    refreshTrending: fetchTrendingMovies,
  };
};
