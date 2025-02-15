import React from "react";
import PropTypes from "prop-types";
import MovieCard from "./MovieCard";

export const MovieList = ({ title, movies, className = "" }) => {
  if (!movies?.length) return null;

  return (
    <section className={`all-movies ${className}`.trim()}>
      <h2>{title}</h2>
      <ul>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </ul>
    </section>
  );
};

MovieList.propTypes = {
  title: PropTypes.string.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      poster_path: PropTypes.string,
      vote_average: PropTypes.number,
      release_date: PropTypes.string,
      overview: PropTypes.string,
    })
  ).isRequired,
  className: PropTypes.string,
};

export const TrendingMoviesList = ({ movies }) => {
  if (!movies?.length) return null;

  return (
    <section className="trending">
      <h2>Trending Movies</h2>
      <ul>
        {movies.map((movie, index) => (
          <li key={movie.$id}>
            <p>{index + 1}</p>
            <img src={movie.poster_url} alt={movie.title} loading="lazy" />
          </li>
        ))}
      </ul>
    </section>
  );
};

TrendingMoviesList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      $id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      poster_url: PropTypes.string.isRequired,
    })
  ).isRequired,
};
