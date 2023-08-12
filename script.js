const apiKeyInput = document.getElementById('apiKey');
const movieTitleInput = document.getElementById('movieTitle');
const searchBtn = document.getElementById('searchBtn');
const loader = document.getElementById('loader');
const errorDiv = document.getElementById('error');
const resultsDiv = document.getElementById('results');

searchBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    const movieTitle = movieTitleInput.value.trim();

    if (apiKey === '' || movieTitle === '') {
        showError('Please enter both API key and movie title.');
        return;
    }

    errorDiv.innerHTML = '';
    resultsDiv.innerHTML = '';
    loader.style.display = 'block';

    fetchMovies(apiKey, movieTitle)
        .then(movies => {
            loader.style.display = 'none';
            displayMovies(movies);
        })
        .catch(error => {
            loader.style.display = 'none';
            showError(error.message);
        });
});

async function fetchMovies(apiKey, movieTitle) {
    const response = await fetch(`http://www.omdbapi.com/?s=${encodeURIComponent(movieTitle)}&apikey=${apiKey}`);
    const data = await response.json();

    if (data.Response === 'True') {
        return data.Search;
    } else {
        throw new Error(data.Error);
    }
}

function displayMovies(movies) {
    resultsDiv.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const poster = movie.Poster === 'N/A' ? 'placeholder.png' : movie.Poster;

        movieCard.innerHTML = `
            <img src="${poster}" alt="${movie.Title} Poster">
            <h2>${movie.Title} (${movie.Year})</h2>
            <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank">More Details</a>
        `;

        resultsDiv.appendChild(movieCard);
    });
}

function showError(message) {
    errorDiv.textContent = message;
}
