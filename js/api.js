const API_KEY = "b05eec2717521f0d4cff9a0389127e01";
const BASE_URL = "https://api.themoviedb.org/3";

export async function searchMovies(query) {
    const url =
    `${BASE_URL}/search/movie` +
    `?api_key=${API_KEY}` +
    `&query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch movies");
    }
    const data = await response.json();
    return data.results;
}

export async function getMovieDetails(movieId) {
    const url =
    `${BASE_URL}/movie/${movieId}` +
    `?api_key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch movie details");
    }
    const data = await response.json();
    return data;
}

export async function loadDefaultMovies() {
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
  );

  const data = await response.json();

  return data.results; 
}

