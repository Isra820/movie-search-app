import { searchMovies,getMovieDetails,loadDefaultMovies } from "./api.js";
import { isValidSearch,isValidMovie } from "./validation.js";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const moviesContainer = document.getElementById("movies-container");
const statusSection = document.getElementById("status-section");

const modal = document.getElementById("movie-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const movieDetails = document.getElementById("movie-details");

const favoritesBtn = document.getElementById("favorites-btn");
const homeBtn = document.getElementById("home-btn");

favoritesBtn.addEventListener("click", showFavorites);
homeBtn.addEventListener("click", goHome);

closeModalBtn.addEventListener("click", closeModal);

searchForm.addEventListener("submit",async (e)=> {
    e.preventDefault();
    const query = searchInput.value ;
    if (!isValidSearch(query)) {
        showStatus("Please enter at least 2 characters.");
        moviesContainer.innerHTML = "";
        return;
    }
    showStatus("Loading movies...");
    try {
        const movies =await searchMovies(query);
        renderMovies(movies);
    } catch (error) {
       showStatus("Something went wrong. Try again."); 
    }
});

function renderMovies(movies) {
    moviesContainer.innerHTML = "";
    if (!movies || movies.length === 0) {
        showStatus("No movies found.");
        return;
    }
    showStatus("");

    movies.forEach(movie => {
        if (!isValidMovie(movie)) return;

        const card = createMovieCard(movie);
        moviesContainer.appendChild(card);
    });
}

function createMovieCard(movie) {
    const card = document.createElement("div");
    card.className = "movie-card";
     card.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    <div class="movie-info">
      <h3>${movie.title}</h3>
      <span>${movie.release_date?.slice(0, 4) || "N/A"}</span>
      <button class="fav-btn">♡</button>
    </div>`;
    card.addEventListener("click", () => openMovieDetails(movie.id));

    const favBtn = card.querySelector(".fav-btn");
    favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(movie);
        favBtn.textContent = isFavorite(movie.id) ? "❤️" : "♡";
    });
    return card;
}

async function openMovieDetails(movieId) {
    try {
        const movie = await getMovieDetails(movieId);
        movieDetails.innerHTML = `
        <h2>${movie.title}</h2><br>
        <p><strong>🎞️</strong> ${movie.release_date || "N/A"}</p><br>
        <p>${movie.overview || "No description available."}</p><br>
        <p><strong>⭐ Rating: </strong> ${movie.vote_average || "N/A"}/10</p>
      `;
        modal.removeAttribute("hidden");
    } catch {
        alert("Failed to load movie details.");
    }
}

function closeModal() {
    modal.setAttribute("hidden", "");
}

function showStatus(message) {
  statusSection.textContent = message;
}

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
}

function saveFavorites(favs) {
    localStorage.setItem("favorites", JSON.stringify(favs));
}

function isFavorite(movieId) {
    return getFavorites().some(m => m.id === movieId);
}

function toggleFavorite(movie) {
    let favs = getFavorites();
    if (isFavorite(movie.id)) {
        favs = favs.filter(m => m.id !== movie.id);
    } else {
        favs.push(movie);
    }
    saveFavorites(favs); 
}

function showFavorites() {
    searchInput.value = "";
    const favorites = getFavorites();
    renderMovies(favorites);
}

async function goHome() {
    searchInput.value = "";
    showStatus("Loading movies...");
    try {
        const movies = await loadDefaultMovies();
        renderMovies(movies);
    } catch (error) {
        showStatus("Failed to load movies.");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
  showStatus("Loading movies...");
  try {
    const movies = await loadDefaultMovies();
    renderMovies(movies);
  } catch (error) {
    showStatus("Failed to load movies.");
    console.error(error);
  }
});


