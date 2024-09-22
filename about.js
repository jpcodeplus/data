
fetch('perfumes.json')  // Pfad zu deiner JSON-Datei
  .then(response => response.json())
  .then(data => {
    // Gesamtanzahl der Einträge
    const totalEntries = data.length;

    // Anzahl eindeutiger Brand-Namen
    const uniqueBrands = new Set(data.map(entry => entry.brand)).size;

    // Anzahl der Einträge je Geschlecht (male, female, unisex)
    const genderCount = data.reduce((acc, entry) => {
      const gender = entry.gender;
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    // Anzahl der Familien (eindeutig)
    const uniqueFamilies = new Set(data.map(entry => entry.family)).size;

    // Animiertes Hochzählen der Zahlen (von endValue - 60 hochzählen)
    animateCount('totalEntries', totalEntries);
    animateCount('uniqueBrands', uniqueBrands);
    animateCount('genderCountMale', genderCount.male || 0, "");
    animateCount('genderCountFemale', genderCount.female || 0, "");
    animateCount('genderCountUnisex', genderCount.unisex || 0, "");
    animateCount('uniqueFamilies', uniqueFamilies);
  })
  .catch(error => {
    console.error('Fehler beim Laden der JSON-Daten:', error);
  });

// Animationsfunktion für das Hochzählen
function animateCount(id, endValue, prefix = "") {
    let startValue = endValue - 60; // Startwert ist die genaue Zahl minus 60
    if (startValue < 0) startValue = 0; // Sicherstellen, dass der Startwert nicht negativ ist

    const element = document.getElementById(id);
    const increment = (endValue - startValue) / 100;  // Zähl-Schritt basierend auf Differenz

    const interval = setInterval(() => {
        startValue += increment;
        if (startValue >= endValue) {
            startValue = endValue;
            clearInterval(interval);
        }
        element.textContent = prefix + Math.floor(startValue);
    }, 10);  // Geschwindigkeit der Animation (je kleiner die Zahl, desto schneller)
}
