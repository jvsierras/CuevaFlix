// Reemplaza 'TU_API_KEY' con tu clave de TMDB
const API_KEY = '7787dd5dc689453346d1bca794089006';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Elementos del DOM
const featuredMovies = document.getElementById("featured-movies");
const searchInput = document.getElementById("search");
const playerModal = document.getElementById("player-modal");
const videoPlayer = document.getElementById("video-player");
const closePlayer = document.getElementById("close-player");
const movieInfoContainer = document.getElementById("movie-info");

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
        // Al hacer clic en una película, cargamos su información detallada
        movieDiv.addEventListener("click", async () => {
            try {
                const movieDetails = await getMovieDetails(movie.id);
                openPlayerWithInfo(movieDetails);
            } catch (error) {
                console.error("Error al cargar detalles de la película:", error);
            }
        });
        featuredMovies.appendChild(movieDiv);
    });
}

// Obtener detalles completos de una película
async function getMovieDetails(movieId) {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es`);
    const data = await response.json();
    return data;
}

// Abrir el reproductor de video con información de la película
function openPlayerWithInfo(movieDetails) {
    // Mostrar información de la película
    movieInfoContainer.innerHTML = `
        <h2>${movieDetails.title}</h2>
        <p><strong>Fecha de lanzamiento:</strong> ${movieDetails.release_date}</p>
        <p><strong>Géneros:</strong> ${movieDetails.genres.map(genre => genre.name).join(", ")}</p>
        <p><strong>Resumen:</strong> ${movieDetails.overview}</p>
    `;

    // Simulamos un enlace de video (reemplaza con tu fuente real)
    const videoUrl = "https://short.icu/RvsOdlEUl";
    videoPlayer.querySelector("source").src = videoUrl;
    videoPlayer.load();

    // Mostrar la ventana modal
    playerModal.style.display = "flex";
}

// Cerrar el reproductor
function closePlayerModal() {
    videoPlayer.pause();
    playerModal.style.display = "none";
    movieInfoContainer.innerHTML = ""; // Limpiar la información de la película
}

// Evento para cerrar el reproductor al hacer clic en la "X"
closePlayer.addEventListener("click", closePlayerModal);

// Evento para cerrar el reproductor al hacer clic fuera de la ventana
playerModal.addEventListener("click", (e) => {
    if (e.target === playerModal) {
        closePlayerModal();
    }
});

// Evento para cerrar el reproductor al presionar la tecla Esc
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closePlayerModal();
    }
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
