// Clave de API de TMDB
const TMDB_API_KEY = "7787dd5dc689453346d1bca794089006";

// Lista de IMDb IDs (asegúrate de usar tu lista completa aquí)
const imdbIDs = "tt0111161,tt0068646,tt0071562,tt0468569".split(",");

// Elementos del DOM
const movieList = document.getElementById("movie-list");
const playerModal = document.getElementById("player-modal");
const videoPlayer = document.getElementById("video-player");
const closePlayerButton = document.getElementById("close-player");
const movieTitle = document.getElementById("movie-title");
const moviePoster = document.getElementById("movie-poster");
const movieOverview = document.getElementById("movie-overview");
const sourceSelect = document.getElementById("source-select");

// Función para obtener detalles de una película por su ID de IMDb
async function getMovieDetailsByIMDbID(imdbID) {
    const url = `https://api.themoviedb.org/3/find/${imdbID}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.movie_results && data.movie_results.length > 0 ? data.movie_results[0] : null;
    } catch (error) {
        console.error(`Error fetching movie ${imdbID}:`, error);
        return null;
    }
}

// Función para generar la lista de películas con detalles completos
async function generateMovieList() {
    movieList.innerHTML = ""; // Limpiar lista existente
    for (const imdbID of imdbIDs) {
        const movieDetails = await getMovieDetailsByIMDbID(imdbID);
        const movieItem = document.createElement("div");
        movieItem.classList.add("movie-item");

        movieItem.innerHTML = `
            <div class="movie-content">
                <img src="${movieDetails?.poster_path 
                    ? `https://image.tmdb.org/t/p/w200${movieDetails.poster_path}` 
                    : 'https://via.placeholder.com/200'}" 
                    alt="${movieDetails?.title || imdbID}" 
                    class="movie-poster clickable" 
                    data-imdb="${imdbID}">
                <div class="movie-details">
                    <h3>${movieDetails?.title || imdbID}</h3>
                    <p><strong>Fecha de lanzamiento:</strong> ${movieDetails?.release_date || 'N/A'}</p>
                    <p><strong>Calificación:</strong> ${movieDetails?.vote_average || 'N/A'} (${movieDetails?.vote_count || 0} votos)</p>
                    <p>${movieDetails?.overview || 'Sin sinopsis disponible'}</p>
                </div>
            </div>
        `;

        const poster = movieItem.querySelector('.movie-poster');
        poster.addEventListener("click", () => showPlayerOptions(imdbID));
        
        movieList.appendChild(movieItem);
    }
}

// Función para mostrar opciones de reproducción
function showPlayerOptions(imdbID) {
    getMovieDetailsByIMDbID(imdbID).then(movieDetails => {
        movieTitle.textContent = movieDetails?.title || imdbID;
        moviePoster.src = movieDetails?.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
            : "https://via.placeholder.com/200";
        movieOverview.innerHTML = `
            <p>${movieDetails?.overview || 'Sin sinopsis disponible'}</p>
            <div class="player-options">
                <button class="source-btn" onclick="openPlayer('${imdbID}', 'multiembed')">Ver en Multiembed</button>
                <button class="source-btn" onclick="openPlayer('${imdbID}', 'vidsrc')">Ver en Vidsrc</button>
            </div>
        `;
        videoPlayer.src = "";
        playerModal.style.display = "flex";
    });
}

// Función para abrir el reproductor con la fuente seleccionada
function openPlayer(imdbID, source) {
    let videoUrl = "";
    if (source === "multiembed") {
        videoUrl = `https://multiembed.mov/?video_id=${imdbID}`;
    } else if (source === "vidsrc") {
        videoUrl = `https://vidsrc.xyz/embed/movie?imdb=${imdbID}`;
    } else if (source === "shorticu") {
        videoUrl = `https://short.icu/${imdbID}`;
    }

    videoPlayer.src = videoUrl;
}

// Cerrar el modal
closePlayerButton.addEventListener("click", () => {
    playerModal.style.display = "none";
    videoPlayer.src = "";
});

// Inicializar
generateMovieList();

// Hacer openPlayer accesible globalmente
window.openPlayer = openPlayer;
