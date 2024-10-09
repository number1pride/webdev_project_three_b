// Existing Google Maps code...
let map;
let service;

const regions = {
    willamette: { lat: 45.2626, lng: -123.0479 },
    napa: { lat: 38.4975, lng: -122.4644 },
    woodinville: { lat: 47.7319, lng: -122.1465 },
    wallawalla: { lat: 46.0141, lng: -118.3510 },
    sonoma: { lat: 38.2358, lng: -122.4702 }
};

async function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: regions.willamette,
        zoom: 13,
        mapId: "DEMO_MAP_ID"
    });
    service = new google.maps.places.PlacesService(map);
    updateMap();
}

function updateMap() {
    const selectedRegion = document.getElementById('wine-region').value;
    const { AdvancedMarkerElement, PinElement } = google.maps.importLibrary("marker");
    const center = regions[selectedRegion];
    map.setCenter(center);

    // Search for wineries near the selected region
    // Tried different variations like: vineyard, wine tasting, wineries but
    //  keyword 'winery' and type 'establishment' returned the least false positives
    const request = {
        location: center,
        radius: '5000',
        keyword: 'winery',
        type: ['establishment']
    };

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            displayWineries(results);
            results.forEach(place => {
                new google.maps.marker.AdvancedMarkerElement({
                    position: place.geometry.location,
                    map: map,
                    title: place.name
                });
            });
        } else {
            console.error('PlacesServiceStatus:', status);
        }
    });
}


function displayWineries(wineries) {
    const list = document.getElementById('wineries-list');
    list.innerHTML = '<h3>Top Wineries In The Region</h3>';
    wineries.forEach(winery => {
        const listItem = document.createElement('div');
        listItem.textContent = winery.name;
        list.appendChild(listItem);
    });
}

// Picture Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function startSlider() {
    showSlide(currentSlide);
    setInterval(nextSlide, 2500); // Change slide every 3 seconds
}

document.addEventListener('DOMContentLoaded', startSlider);
