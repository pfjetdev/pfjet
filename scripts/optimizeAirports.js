const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../src/data/airports-full.json');
const outputPath = path.join(__dirname, '../src/data/airports.json');

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// Filter only airports with IATA codes and extract needed fields
const filtered = {};
Object.entries(data).forEach(([icao, airport]) => {
  if (airport.iata && airport.iata.trim() !== '') {
    filtered[airport.iata] = {
      code: airport.iata,
      icao: icao,
      name: airport.name,
      city: airport.city || '',
      country: airport.country,
      lat: airport.lat,
      lon: airport.lon
    };
  }
});

console.log('Original entries:', Object.keys(data).length);
console.log('Filtered entries:', Object.keys(filtered).length);

fs.writeFileSync(outputPath, JSON.stringify(filtered));
console.log('Written to', outputPath);

// Check file size
const stats = fs.statSync(outputPath);
console.log('New file size:', (stats.size / 1024).toFixed(2), 'KB');
