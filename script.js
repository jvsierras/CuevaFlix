// Reemplaza 'TU_API_KEY' con tu clave de TMDB
const API_KEY = 'TU_API_KEY';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Elementos del DOM
const featuredMovies = document.getElementById("featured-movies");
const searchInput = document.getElementById("search");
const playerModal = document.getElementById("player-modal");
const videoPlayer = document.getElementById("video-player");
const closePlayer = document.getElementById("close-player");

// Cargar películas destacadas desde TMDB
async function loadFeaturedMovies() {
    try {
        const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}&language=es`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error("Error al cargar películas:", error);
    }
}

// Mostrar películas en la cuadrícula
function displayMovies(movies) {
    featuredMovies.innerHTML = "";
    movies.forEach(movie => {
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie");
        movieDiv.innerHTML = `
            <img src="${IMG_BASE_URL}${movie.poster_path}" alt="${movie.title}">
            <p>${movie.title}</p>
        `;
        // Simulamos un enlace de video (reemplaza con tu fuente real)
        movieDiv.addEventListener("click", () => openPlayer("https://www.w3schools.com/html/mov_bbb.mp4"));
        featuredMovies.appendChild(movieDiv);
    });
}

// Abrir el reproductor de video
function openPlayer(videoUrl) {
    videoPlayer.querySelector("source").src = videoUrl;
    videoPlayer.load();
    playerModal.style.display = "flex";
}

// Cerrar el reproductor
closePlayer.addEventListener("click", () => {
    videoPlayer.pause();
    playerModal.style.display = "none";
});

// Búsqueda en tiempo real
searchInput.addEventListener("input", async (e) => {
    const query = e.target.value.trim();
    if (query.length < 3) return; // Evitar búsquedas cortas
    try {
        const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=es`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error("Error en la búsqueda:", error);
    }
});

// Iniciar carga de películas destacadas
window.onload = loadFeaturedMovies;
