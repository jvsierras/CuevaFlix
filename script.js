// Clave de API de TMDB
const TMDB_API_KEY = "7787dd5dc689453346d1bca794089006";

// Elementos del DOM
const movieList = document.getElementById("movie-list");
const playerModal = document.getElementById("player-modal");
const videoPlayer = document.getElementById("video-player");
const closePlayerButton = document.getElementById("close-player");

// Función para obtener detalles de una película por su ID de IMDb
async function getMovieDetailsByIMDbID(imdbID) {
    const url = `https://api.themoviedb.org/3/find/${imdbID}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.movie_results && data.movie_results.length > 0 ? data.movie_results[0] : null;
    } catch (error) {
        console.error(`Error al buscar película con ID ${imdbID}:`, error);
        return null;
    }
}

// Función para generar la lista de películas con detalles
async function generateMovieList() {
    movieList.innerHTML = ''; // Limpiar la lista existente
    
    for (const imdbID of imdbIDs) {
        const movieDetails = await getMovieDetailsByIMDbID(imdbID);
        
        const movieItem = document.createElement("div");
        movieItem.classList.add("movie-item");
        
        // Crear estructura para mostrar detalles
        const poster = document.createElement("img");
        poster.classList.add("movie-poster");
        poster.src = movieDetails && movieDetails.poster_path
            ? `https://image.tmdb.org/t/p/w200${movieDetails.poster_path}`
            : "https://via.placeholder.com/200";
        poster.alt = "Movie Poster";
        poster.addEventListener("click", () => openPlayerOptions(imdbID));
        
        const detailsContainer = document.createElement("div");
        detailsContainer.classList.add("movie-details");
        
        const title = document.createElement("h3");
        title.textContent = movieDetails?.title || imdbID;
        
        const overview = document.createElement("p");
        overview.textContent = movieDetails?.overview || "Sin sinopsis disponible";
        
        const releaseDate = document.createElement("span");
        releaseDate.textContent = `Fecha: ${movieDetails?.release_date || 'No disponible'}`;
        
        // Añadir elementos al contenedor
        detailsContainer.appendChild(title);
        detailsContainer.appendChild(releaseDate);
        detailsContainer.appendChild(overview);
        
        movieItem.appendChild(poster);
        movieItem.appendChild(detailsContainer);
        movieList.appendChild(movieItem);
    }
}

// Función para mostrar opciones de reproducción
function openPlayerOptions(imdbID) {
    // Limpiar el contenido anterior del modal
    playerModal.innerHTML = '';
    
    // Crear elementos del modal
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    
    const title = document.createElement("h2");
    title.textContent = "Selecciona una opción para ver la película";
    
    // Opción 1: Multiembed
    const option1 = document.createElement("button");
    option1.textContent = "Ver en Multiembed";
    option1.addEventListener("click", () => {
        openPlayer(imdbID, "multiembed");
        playerModal.style.display = "none";
    });
    
    // Opción 2: Vidsrc
    const option2 = document.createElement("button");
    option2.textContent = "Ver en Vidsrc";
    option2.addEventListener("click", () => {
        openPlayer(imdbID, "vidsrc");
        playerModal.style.display = "none";
    });
    
    // Botón cerrar
    const closeButton = document.createElement("button");
    closeButton.id = "close-player";
    closeButton.textContent = "Cerrar";
    closeButton.addEventListener("click", () => {
        playerModal.style.display = "none";
    });
    
    // Añadir elementos al modal
    modalContent.appendChild(title);
    modalContent.appendChild(option1);
    modalContent.appendChild(option2);
    modalContent.appendChild(closeButton);
    playerModal.appendChild(modalContent);
    
    playerModal.style.display = "flex";
}

// Función para abrir el reproductor
function openPlayer(imdbID, source) {
    let videoUrl = source === "multiembed" 
        ? `https://multiembed.mov/?video_id=${imdbID}`
        : `https://vidsrc.xyz/embed/movie?imdb=${imdbID}`;
    
    videoPlayer.src = videoUrl;
    const playerWindow = window.open('', '_blank');
    playerWindow.document.write(`
        <html>
            <head>
                <title>Reproduciendo ${imdbID}</title>
                <style>
                    body { margin: 0; padding: 0; background: #000; }
                    iframe { width: 100vw; height: 100vh; border: none; }
                </style>
            </head>
            <body>
                <iframe src="${videoUrl}" allowfullscreen></iframe>
            </body>
        </html>
    `);
}

// CSS adicional necesario
const style = document.createElement('style');
style.textContent = `
    .movie-item {
        display: flex;
        margin: 10px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }
    .movie-poster {
        cursor: pointer;
        margin-right: 15px;
    }
    .movie-details {
        flex: 1;
    }
    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 5px;
        text-align: center;
    }
    .modal-content button {
        margin: 10px;
        padding: 10px 20px;
        cursor: pointer;
    }
    #player-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: none;
        justify-content: center;
        align-items: center;
    }
`;
document.head.appendChild(style);

// Inicializar la aplicación
generateMovieList();
