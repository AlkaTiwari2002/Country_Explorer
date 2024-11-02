const countriesContainer = document.getElementById('countries-container');
const searchInput = document.getElementById('search');
const favoritesLink = document.getElementById('favorites-link');
const languageFilter = document.getElementById('language-filter');
const regionFilter = document.getElementById('region-filter');
const countryDetailsModal = document.getElementById('country-details');
const closeButton = document.querySelector('.close-button');
const favoritesList = document.getElementById('favorites-list');

let countries = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];


async function fetchCountries() {
    const response = await fetch(`https://restcountries.com/v3.1/all`);
    countries = await response.json();
    populateCountryCards();
    populateLanguageFilter();
}


function populateCountryCards() {
    countriesContainer.innerHTML = countries.map(country => createCountryCard(country)).join('');
}


function createCountryCard(country) {
    const isFavorite = favorites.includes(country.name.common);
    return `
        <div class="country-card">
            <img src="${country.flags.svg}" alt="${country.name.common} Flag">
            <h3>${country.name.common}</h3>
            <button onclick="viewDetails('${country.name.common}')">View Details</button>
            <button onclick="toggleFavorite('${country.name.common}')">${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</button>
        </div>
    `;
}


function viewDetails(countryName) {
    const country = countries.find(c => c.name.common === countryName);
    document.getElementById('country-name').innerText = country.name.common;
    document.getElementById('country-flag').src = country.flags.svg;
    document.getElementById('capital').innerText = country.capital ? country.capital[0] : 'N/A';
    document.getElementById('region').innerText = country.region;
    document.getElementById('population').innerText = country.population.toLocaleString();
    document.getElementById('area').innerText = country.area.toLocaleString() + ' km²';
    document.getElementById('languages').innerText = Object.values(country.languages).join(', ');

  
    countriesContainer.style.display = 'none';

    countryDetailsModal.style.display = 'block'; 
}


function toggleFavorite(countryName) {
    if (favorites.includes(countryName)) {
        favorites.splice(favorites.indexOf(countryName), 1);
    } else {
        if (favorites.length < 40) {
            favorites.push(countryName);
        } else {
            alert('You can only have 40 favorites.');
        }
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    populateCountryCards(); 
}


function populateLanguageFilter() {
    const languages = new Set();
    countries.forEach(country => {
        if (country.languages) {
            Object.values(country.languages).forEach(language => languages.add(language));
        }
    });
    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language;
        option.textContent = language;
        languageFilter.appendChild(option);
    });
}


languageFilter.addEventListener('change', () => {
    const selectedLanguage = languageFilter.value;
    const filteredCountries = countries.filter(country => {
        return selectedLanguage ? country.languages && Object.values(country.languages).includes(selectedLanguage) : true;
    });
    countriesContainer.innerHTML = filteredCountries.map(country => createCountryCard(country)).join('');
});


regionFilter.addEventListener('change', () => {
    const selectedRegion = regionFilter.value;
    const filteredCountries = countries.filter(country => {
        return selectedRegion ? country.region === selectedRegion : true;
    });
    countriesContainer.innerHTML = filteredCountries.map(country => createCountryCard(country)).join('');
});


searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredCountries = countries.filter(country => 
        country.name.common.toLowerCase().includes(searchTerm)
    );
    countriesContainer.innerHTML = filteredCountries.map(country => createCountryCard(country)).join('');
});


closeButton.addEventListener('click', () => {
    countryDetailsModal.style.display = 'none';
    countriesContainer.style.display = 'flex'; 
});


favoritesLink.addEventListener('click', (e) => {
    e.preventDefault();
    updateFavoritesList();
    document.getElementById('favorites-modal').style.display = 'block';
});


function updateFavoritesList() {
    favoritesList.innerHTML = favorites.map(country => `<li onclick="showFavoriteCountry('${country}')">${country}</li>`).join('');
}


function showFavoriteCountry(countryName) {
    viewDetails(countryName);
    document.getElementById('favorites-modal').style.display = 'none'; 
}


document.getElementById('close-favorites').addEventListener('click', () => {
    document.getElementById('favorites-modal').style.display = 'none';
});


fetchCountries();
