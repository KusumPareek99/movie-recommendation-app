// import React, { useState, useEffect } from "react";
// import { useDebounce } from "react-use";
// import Search from "./components/Search";
// import Spinner from "./components/Spinner";
// import MovieCard from "./components/MovieCard";
// import { getTrendingMovies, updateSearchCount } from "./appwrite";

// const API_BASE_URL = "https://api.themoviedb.org/3";

// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// const API_OPTIONS = {
//   method: "GET",
//   headers: {
//     accept: "application/json",
//     Authorization: `Bearer ${API_KEY}`,
//   },
// };

// const App = () => {
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   const [errorMessage, seterrorMessage] = useState("");
//   const [moviesList, setMovieslist] = useState([]);
//   const [trendingMovies, setTrendingMovies] = useState([]);
//   const [recommendedMovies, setrecommendedMovies] = useState([]);
//   const [isLoading, setisLoading] = useState(false);

//   useDebounce(
//     () => {
//       setDebouncedSearchTerm(searchTerm);
//     },
//     1000,
//     [searchTerm]
//   );

//   const fetchMovies = async (query = "") => {
//     setisLoading(true);
//     seterrorMessage("");
//     try {
//       const endpoint = query
//         ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
//         : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

//       const response = await fetch(endpoint, API_OPTIONS);

//       if (!response.ok) {
//         throw new Error("Something went wrong while fetching movies!");
//       }

//       const data = await response.json();
//       if (data.response === "False") {
//         seterrorMessage(data.error || "Error fetching movies");
//         setMovieslist([]);
//         return;
//       }
//       setMovieslist(data.results || []);

//       if (query && data.results.length > 0) {
//         await updateSearchCount(query, data.results[0]);
//       }
//     } catch (error) {
//       console.log(`Error fetching movies: ${error}`);
//       seterrorMessage("Error fetching movies. Please try again later.");
//     } finally {
//       setisLoading(false);
//     }
//   };

//   const loadTrendingMovies = async () => {
//     try {
//       const movies = await getTrendingMovies();
//       setTrendingMovies(movies);
//     } catch (error) {
//       console.log(`Error fetching trending movies: ${error}`);
//     }
//   };

//   useEffect(() => {
//     fetchMovies(debouncedSearchTerm);
//   }, [debouncedSearchTerm]);

//   useEffect(() => {
//     if (debouncedSearchTerm && moviesList.length > 0) {
//       let movieName = moviesList[0].title;
//       getRecommendedMoviesList(movieName);
//     }
//   }, [moviesList, debouncedSearchTerm]);

//   useEffect(() => {
//     loadTrendingMovies();
//   }, []);

//   const getRecommendedMoviesList = async (movie) => {
//     const api_endpoint = `http://127.0.0.1:8080/api/recommend/${movie}`;
//     const response = await fetch(api_endpoint);
//     if (!response.ok) {
//       throw new Error("Something went wrong while fetching movies!");
//     }

//     const data = await response.json();

//     if (data.length > 0) {
//       console.log(data);
//       setrecommendedMovies(data);
//     }
//     return data;
//   };
//   return (
//     <main>
//       <div className="pattern" />
//       <div className="wrapper">
//         <header>
//           <img src="./hero.png" alt="hero" />
//           <h1>
//             Find <span className="text-gradient">Movies</span> You'll Enjoy
//             Without The Hassle
//           </h1>
//           <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//         </header>
//         {trendingMovies.length > 0 && (
//           <section className="trending">
//             <h2>Trending Movies</h2>
//             <ul>
//               {trendingMovies.map((movie, index) => (
//                 <li key={movie.$id}>
//                   <p>{index + 1}</p>
//                   <img src={movie.poster_url} alt={movie.title} />
//                 </li>
//               ))}
//             </ul>
//           </section>
//         )}

//         {isLoading ? (
//           <Spinner />
//         ) : errorMessage ? (
//           <p className="text-red-500">{errorMessage}</p>
//         ) : (
//           <div>
//             {recommendedMovies.length > 0 && (
//               <section className="all-movies">
//                 <h2>Top 5 Recommended Movies</h2>
//                 <ul>
//                   {recommendedMovies.map((movie) => (
//                     <MovieCard key={movie.id} movie={movie} />
//                   ))}
//                 </ul>
//               </section>
//             )}

//             <section className="all-movies mt-8">
//               <h2>All Movies</h2>
//               <ul>
//                 {moviesList.map((movie) => (
//                   <MovieCard key={movie.id} movie={movie} />
//                 ))}
//               </ul>
//             </section>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// };

// export default App;
import React from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import { MovieList, TrendingMoviesList } from "./components/MovieList";
import { useMovieSearch, useTrendingMovies } from "./hooks/useMovieSearch";
import ErrorBoundary from "./components/ErrorBoundary";

const MovieContent = ({ moviesList, recommendedMovies, isLoading, error }) => {
  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <MovieList
        title="Top 5 Recommended Movies for your search"
        movies={recommendedMovies}
      />
      <MovieList title="All Movies" movies={moviesList} className="mt-8" />
    </>
  );
};

const App = () => {
  const {
    searchTerm,
    setSearchTerm,
    moviesList,
    recommendedMovies,
    isLoading: moviesLoading,
    error: moviesError,
  } = useMovieSearch();

  const {
    trendingMovies,
    isLoading: trendingLoading,
    error: trendingError,
  } = useTrendingMovies();

  return (
    <ErrorBoundary>
      <main>
        <div className="pattern" />
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Movie Search Hero" loading="lazy" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without The Hassle
            </h1>
            <Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              disabled={moviesLoading}
            />
          </header>

          {!trendingLoading && !trendingError && (
            <TrendingMoviesList movies={trendingMovies} />
          )}

          <MovieContent
            moviesList={moviesList}
            recommendedMovies={recommendedMovies}
            isLoading={moviesLoading}
            error={moviesError}
          />
        </div>
      </main>
    </ErrorBoundary>
  );
};

export default App;
