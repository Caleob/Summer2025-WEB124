/*
Written by Caleob King
Date:7/25/25

The big learning opportuinty here was about PROMISES and the .then technique

I grew up programming in BASIC believe it or not so thinking about non-synchronous program execution
really blows my mind. I am used to a program starting, proceeding, and then stopping

JS seems more willing to send out a ping into the world and then continue on
until it is answered, then come back and execute the .then instructions.

It is willing to interupt what is doing and handle 'events' as they occur.

It is trippy

*/

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const mapImage = new Image();
mapImage.src = 'USmap.jpg';

const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';

const cities = [];
fetch(endpoint)
  .then(blob => blob.json())
  .then(data => {
      cities.push(...data);

      // Now that the data is loaded, place the markers.
      drawMarker(latLonToXY(cities[43].latitude, cities[43].longitude), cities[43].city, 'green');
      drawMarker(latLonToXY(cities[68].latitude, cities[68].longitude), cities[68].city, 'green');
      drawMarker(latLonToXY(cities[34].latitude, cities[34].longitude), cities[34].city, 'green');
      console.log(cities[43].city,cities[68].city,cities[34].city)
  })

  mapImage.onload = function() {

  canvas.width = mapImage.width;
  canvas.height = mapImage.height;

  // Draw the image onto the canvas
  ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

};

function latLonToXY(lat, lon) {
  // --- Projection Constants Derived from the Colorado Arc ---

  // The center of the projection circles, from your ctx.arc() call.
  const projCenterX = 530;
  const projCenterY = -1500;

  // --- Longitude to Angle Calculation ---
  // We solve a linear equation (y = mx + b) to map longitude to angle.
  // Known point 1: lon -102.05°W (CO SE corner) -> angle 88.2°
  // Known point 2: lon -109.05°W (CO SW corner) -> angle 96.8°
  const lonToAngleScale = .71; // The 'm' (slope)
  const lonToAngleOffset = -15.7;  // The 'b' (y-intercept)
  
  const angleDeg = (lon * lonToAngleScale) + lonToAngleOffset;
  const angleRad = angleDeg * Math.PI / 180;

  // --- Latitude to Radius Calculation (REFINED) ---
  // We now have two known data points:
  // 1. Latitude 37°N has a radius of 2050.
  // 2. Latitude 49°N has a radius of 1665.
  // From this, we can calculate the exact pixel-per-degree scale.
  const radiusAt37N = 2050;
  const pixelsPerDegreeLat = (2050 - 1665) / (49 - 37); // Approx. 32.083
  
  const radius = radiusAt37N - ((lat - 37) * pixelsPerDegreeLat);

  // --- Polar to Rectangular Transformation ---
  // This is the standard conversion from polar (radius, angle) to Cartesian (x, y) coordinates.
  const x = projCenterX + radius * Math.cos(-angleRad);
  const y = projCenterY + radius * Math.sin(-angleRad);

  return { x, y };
}

/**
 * Helper function to draw a labeled marker on the canvas.
 */
function drawMarker(pos, label, color) {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = 'black';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, pos.x, pos.y + 25);
}

function findMatches(wordToMatch, cities) {
  return cities.filter(place => {
    // here we need to figure out if the city or state matches what was searched
    const regex = new RegExp(wordToMatch, 'gi');
    return place.city.match(regex) || place.state.match(regex)
  });
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function displayMatches() {
  ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
  const matchArray = findMatches(this.value, cities);
  const html = matchArray.map(place => {
    const regex = new RegExp(this.value, 'gi');
    const cityName = place.city.replace(regex, `<span class="hl">${this.value}</span>`);
    const stateName = place.state.replace(regex, `<span class="hl">${this.value}</span>`);

    drawMarker(latLonToXY(place.latitude, place.longitude), '', 'green');
    return `
      <li>
        <span class="name">${cityName}, ${stateName}</span>
        <span class="population">${numberWithCommas(place.population)}</span>
      </li>
    `;
  }).join('');
  suggestions.innerHTML = html;
}

const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');

searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);


