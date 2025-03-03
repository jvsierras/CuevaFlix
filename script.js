// Clave de API de TMDB
const TMDB_API_KEY = "7787dd5dc689453346d1bca794089006";

// Lista de IMDb IDs (mantengo tu lista original)
const imdbIDs = `tt0000144,tt0000417,tt0001463,...`.split(",");

// Elementos del DOM
const movieList = document.getElementById("movie-list");
const playerModal = document.getElementById("player-modal");
const videoPlayer = document.getElementById("video-player");
const closePlayerButton = document.getElementById("close-player");
const movieTitle = document.getElementById("movie-title");
const moviePoster = document.getElementById("movie-poster");
const movieOverview = document.getElementById("movie-overview");

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

        // Crear contenido con detalles de la película
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
                    <p><strong>Release:</strong> ${movieDetails?.release_date || 'N/A'}</p>
                    <p><strong>Rating:</strong> ${movieDetails?.vote_average || 'N/A'} (${movieDetails?.vote_count || 0} votes)</p>
                    <p>${movieDetails?.overview || 'No overview available'}</p>
                </div>
            </div>
        `;

        // Añadir evento al póster
        const poster = movieItem.querySelector('.movie-poster');
        poster.addEventListener("click", () => showPlayerOptions(imdbID));
        
        movieList.appendChild(movieItem);
    }
}

// Función para mostrar opciones de reproducción
function showPlayerOptions(imdbID) {
    // Actualizar título básico
    movieTitle.textContent = `Select Source for ${imdbID}`;
    movieOverview.innerHTML = `
        <div class="player-options">
            <button class="source-btn" onclick="openPlayer('${imdbID}', 'multiembed')">Watch on Multiembed</button>
            <button class="source-btn" onclick="openPlayer('${imdbID}', 'vidsrc')">Watch on Vidsrc</button>
        </div>
    `;
    moviePoster.src = ""; // Limpiar póster en modal
    videoPlayer.src = ""; // Limpiar video
    playerModal.style.display = "flex";
}

// Función para abrir el reproductor con la fuente seleccionada
async function openPlayer(imdbID, source) {
    const movieDetails = await getMovieDetailsByIMDbID(imdbID);
    
    // Actualizar detalles en el modal
    movieTitle.textContent = movieDetails?.title || imdbID;
    moviePoster.src = movieDetails?.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
        : "https://via.placeholder.com/200";
    movieOverview.textContent = movieDetails?.overview || "No overview available";

    // Configurar URL del video según la fuente
    let videoUrl = "";
    if (source === "multiembed") {
        videoUrl = `https://multiembed.mov/?video_id=${imdbID}`;
    } else if (source === "vidsrc") {
        videoUrl = `https://vidsrc.xyz/embed/movie?imdb=${imdbID}`;
    }

    videoPlayer.src = videoUrl;
}

// Cerrar el modal
closePlayerButton.addEventListener("click", () => {
    playerModal.style.display = "none";
    videoPlayer.src = ""; // Detener video
});

// Inicializar
generateMovieList();

// Hacer openPlayer accesible globalmente para los botones onclick
window.openPlayer = openPlayer;
