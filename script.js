let perfumes = [];
let fuse;
let selectedGender = 'all'; // Standard: Alle Gender
let searchTimeout; // Timeout für das Debouncing

// Fuse.js Optionen
const options = {
  keys: ["brand", "name", "family"], // Füge "family" hinzu
  threshold: 0.3 // Wie präzise die Übereinstimmung sein soll
};

// Lade die Parfüm-Daten aus der externen JSON-Datei
async function loadPerfumeData() {
  try {
    const response = await fetch('perfumes.json'); // Lade die externe JSON-Datei
    perfumes = await response.json(); // Speichere die Daten in der perfumes-Variablen
    fuse = new Fuse(perfumes, options); // Initialisiere Fuse.js mit den geladenen Daten
  } catch (error) {
    console.error('Fehler beim Laden der Parfüm-Daten:', error);
  }
}

// Funktion zum Leeren der Suche
function clearSearch() {
  const searchBar = document.getElementById('searchBar');
  const clearButton = document.getElementById('clearSearch');

  searchBar.value = ''; // Suchfeld leeren
  document.getElementById('results').innerHTML = ''; // Ergebnisse leeren
  clearButton.classList.add('hidden'); // Löschen-Button verstecken
}

// Funktion zur Durchführung der Suche (nach einer Verzögerung)
function searchPerfumes() {
  const searchString = document.getElementById('searchBar').value.trim();
  const clearButton = document.getElementById('clearSearch');

  // Nur starten, wenn mindestens 2 Zeichen eingegeben wurden
  if (searchString.length < 2) {
    document.getElementById('results').innerHTML = ''; // Leere Ergebnisse, wenn zu wenig Zeichen
    clearButton.classList.add('hidden'); // Löschen-Button verstecken
    return;
  }

  let results = fuse.search(searchString).map(result => result.item);

  // Filtere die Ergebnisse basierend auf dem ausgewählten Geschlecht
  if (selectedGender !== 'all') {
    results = results.filter(perfume => perfume.gender === selectedGender);
  }

  // Zeige maximal 10 Ergebnisse
  results = results.slice(0, 10);

  displayResults(results);
}

// Verzögerung der Suche (Debouncing) um die Performance zu verbessern
function handleSearchInput() {
  const searchBar = document.getElementById('searchBar');
  const clearButton = document.getElementById('clearSearch');
  const searchString = searchBar.value.trim();

  // Wenn mindestens 2 Zeichen im Suchfeld sind, zeige den Löschen-Button an
  if (searchString.length >= 2) {
    clearButton.classList.remove('hidden');
  } else {
    clearButton.classList.add('hidden');
  }

  // Suchfunktion mit Verzögerung ausführen
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(searchPerfumes, 300); // 300ms Verzögerung
}

// Funktion zur Anzeige der Ergebnisse
function displayResults(results) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; // Vorherige Ergebnisse leeren

  if (results.length === 0) {
    resultsDiv.innerHTML = '<p class="text-gray-500">Keine Ergebnisse gefunden.</p>';
  } else {
    results.forEach(perfume => {
      const resultItem = document.createElement('div');
      resultItem.className = "flex justify-between bg-white space-x-4 mb-4 p-4 border rounded-lg shadow-sm";

      // Erstelle den div-Platzhalter für das Bild
      const imagePlaceholder = document.createElement('div');
      imagePlaceholder.className = "size-24 -m-2 shadow-lg bg-gray-200 rounded overflow-hidden"; // overflow-hidden stellt sicher, dass das Bild den runden Rahmen nicht verlässt
      resultItem.appendChild(imagePlaceholder);

      // Erstelle das img-Element und setze die Bildquelle und den Alt-Text
      const imageElement = document.createElement('img');
      imageElement.src = perfume.img ? perfume.img : ''; // Falls keine Bild-URL vorhanden ist, bleibt das src leer
      imageElement.alt = 'no image'; // Alt-Text
      imageElement.className = "w-full h-full object-cover"; // Bild passt sich dem div an und object-fit sorgt für das Cover-Verhalten

      // Füge das img-Element in den Platzhalter ein
      imagePlaceholder.appendChild(imageElement);

      const textContainer = document.createElement('div');
      textContainer.className = "flex flex-col grow pl-2";

      const brandText = document.createElement('span');
      brandText.textContent = perfume.brand;
      brandText.className = "text-sm text-gray-500";
      textContainer.appendChild(brandText);

      const nameText = document.createElement('span');
      nameText.textContent = perfume.name;
      nameText.className = "text-lg text-gray-800 font-semibold";
      textContainer.appendChild(nameText);

      const familyGenderText = document.createElement('span');
      familyGenderText.className = "text-sm text-gray-600 flex items-center";

      // Kreis basierend auf dem Geschlecht
      const genderCircle = document.createElement('span');
      genderCircle.className = "inline-block w-3 h-3 rounded-full mr-2";

      // Farben für die Geschlechter
      if (perfume.gender === 'male') {
        genderCircle.style.backgroundColor = 'blue'; // Blauer Kreis für männlich
      } else if (perfume.gender === 'female') {
        genderCircle.style.backgroundColor = 'pink'; // Rosafarbener Kreis für weiblich
      } else if (perfume.gender === 'unisex') {
        genderCircle.style.backgroundColor = 'darkgoldenrod'; // Dunkelgelber Kreis für Unisex
      }

      familyGenderText.appendChild(genderCircle);
      familyGenderText.appendChild(document.createTextNode(`${perfume.family}`)); // Familie anzeigen
      textContainer.appendChild(familyGenderText);

      resultItem.appendChild(textContainer);

      const priceText = document.createElement('div');
      priceText.className = "text-right";
      priceText.innerHTML = `<span class="text-sm text-gray-600">Günstigster Preis</span><br><span class="text-xl font-bold text-gray-800">€${perfume.price ? perfume.price.toFixed(2) : 'n.a.'}</span>`;
      resultItem.appendChild(priceText);

      resultsDiv.appendChild(resultItem);
    });
  }
}

// Funktion zum Filtern nach Geschlecht
// Funktion zum Filtern nach Geschlecht
function filterByGender(gender) {
  selectedGender = gender;
  searchPerfumes();

  // Alle Buttons zurücksetzen (weiß mit grauem Text)
  document.getElementById('btn-all').classList.remove('bg-black', 'text-white');
  document.getElementById('btn-w').classList.remove('bg-black', 'text-white');
  document.getElementById('btn-m').classList.remove('bg-black', 'text-white');
  document.getElementById('btn-x').classList.remove('bg-black', 'text-white');

  document.getElementById('btn-all').classList.add('bg-white', 'text-gray-800');
  document.getElementById('btn-w').classList.add('bg-white', 'text-gray-800');
  document.getElementById('btn-m').classList.add('bg-white', 'text-gray-800');
  document.getElementById('btn-x').classList.add('bg-white', 'text-gray-800');

  // Ausgewählten Button hervorheben (schwarz mit weißem Text)
  if (gender === 'all') {
    document.getElementById('btn-all').classList.add('bg-black', 'text-white');
    document.getElementById('btn-all').classList.remove('bg-white', 'text-gray-800');
  } else if (gender === 'female') {
    document.getElementById('btn-w').classList.add('bg-black', 'text-white');
    document.getElementById('btn-w').classList.remove('bg-white', 'text-gray-800');
  } else if (gender === 'male') {
    document.getElementById('btn-m').classList.add('bg-black', 'text-white');
    document.getElementById('btn-m').classList.remove('bg-white', 'text-gray-800');
  } else if (gender === 'unisex') {
    document.getElementById('btn-x').classList.add('bg-black', 'text-white');
    document.getElementById('btn-x').classList.remove('bg-white', 'text-gray-800');
  }
}

  
// Starte die Anwendung, indem die Parfüm-Daten geladen werden
loadPerfumeData();
