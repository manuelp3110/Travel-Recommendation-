// Task 6: Fetch data and display recommendations
function searchRecommendations() {
    const keyword = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (!keyword) {
        resultsContainer.innerHTML = '<p style="padding:20px; font-size:1.2rem;">Please enter a keyword!</p>';
        return;
    }

    fetch('./travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            console.log('Data loaded:', data);

            let results = [];

            // Task 7: Keyword matching with all variations
            if (keyword === 'beach' || keyword === 'beaches') {
                results = data.beaches;

            } else if (keyword === 'temple' || keyword === 'temples') {
                results = data.temples;

            } else if (keyword === 'country' || keyword === 'countries') {
                data.countries.forEach(country => {
                    results = results.concat(country.cities);
                });

            } else {
                // Search by specific country or city name
                data.countries.forEach(country => {
                    if (country.name.toLowerCase().includes(keyword)) {
                        results = results.concat(country.cities);
                    }
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(keyword)) {
                            results.push(city);
                        }
                    });
                });

                // Search beaches by name
                data.beaches.forEach(beach => {
                    if (beach.name.toLowerCase().includes(keyword)) {
                        results.push(beach);
                    }
                });

                // Search temples by name
                data.temples.forEach(temple => {
                    if (temple.name.toLowerCase().includes(keyword)) {
                        results.push(temple);
                    }
                });
            }

            // Task 8: Display results
            if (results.length === 0) {
                resultsContainer.innerHTML = `
                    <p style="padding:20px; font-size:1.2rem;">
                        No results found. Try: beach, temple, country, Japan, Brazil, or Australia!
                    </p>`;
                return;
            }

            // Remove duplicates
            const unique = results.filter((item, index, self) =>
                index === self.findIndex(t => t.name === item.name)
            );

            // Task 8: Create cards
            unique.forEach(place => {
                const localTime = getLocalTime(place.name);
                const card = document.createElement('div');
                card.classList.add('result-card');
                card.innerHTML = `
                    <img src="${place.imageUrl}" alt="${place.name}">
                    <h3>${place.name}</h3>
                    <p>${place.description}</p>
                    <p class="local-time">🕐 Local Time: ${localTime}</p>
                    <button class="visit-btn">Visit</button>
                `;
                resultsContainer.appendChild(card);
            });

            // Scroll to results
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
        })
        .catch(error => {
            console.error('Error:', error);
            resultsContainer.innerHTML =
                '<p style="padding:20px">Error loading data. Please try again.</p>';
        });
}

// Task 9: Clear button
function clearResults() {
    document.getElementById('results').innerHTML = '';
    document.getElementById('searchInput').value = '';
}

// Task 10: Local time
function getLocalTime(placeName) {
    const timeZones = {
        'Sydney, Australia': 'Australia/Sydney',
        'Melbourne, Australia': 'Australia/Melbourne',
        'Tokyo, Japan': 'Asia/Tokyo',
        'Kyoto, Japan': 'Asia/Tokyo',
        'Rio de Janeiro, Brazil': 'America/Sao_Paulo',
        'São Paulo, Brazil': 'America/Sao_Paulo',
        'Angkor Wat, Cambodia': 'Asia/Phnom_Penh',
        'Taj Mahal, India': 'Asia/Kolkata',
        'Bora Bora, French Polynesia': 'Pacific/Tahiti',
        'Copacabana Beach, Brazil': 'America/Sao_Paulo'
    };

    const timeZone = timeZones[placeName];
    if (!timeZone) return 'N/A';

    const options = {
        timeZone: timeZone,
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    return new Date().toLocaleTimeString('en-US', options);
}

// Enter key search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchRecommendations();
            }
        });
    }
});