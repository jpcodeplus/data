let perfumes = [];
let fuse;
let selectedGender = 'all'; // Standard: Alle Gender
let searchTimeout; // Timeout für das Debouncing

// Fuse.js Optionen
const options = {
  includeScore: true, // Zeigt den Score an, damit wir sehen, wie relevant jedes Ergebnis ist
  shouldSort: true,   // Sortiert die Ergebnisse nach Relevanz
  threshold: 0.6,     // Eine niedrigere Schwelle, damit nur sehr exakte Übereinstimmungen stärker gewichtet werden
  keys: [
    {
      name: "brand",
      weight: 0.3 // Gewicht für die Marke
    },
    {
      name: "name",
      weight: 0.3 // Höheres Gewicht für den Namen
    },
    {
      name: "combined",
      weight: 4.0 // Die Kombination von Marke und Name hat das höchste Gewicht
    }
  ]
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
      resultItem.className = "grid grid-cols-[6rem_auto] gap-2 rounded-md border border-gray-300 p-2 text-slate-800 mb-4";

      // Bildbereich
      const imagePlaceholder = document.createElement('div');
      imagePlaceholder.className = "relative size-24 overflow-hidden rounded-md bg-green-200";
      resultItem.appendChild(imagePlaceholder);

      const imageElement = document.createElement('img');
      imageElement.src = perfume.img ? perfume.img : ''; // Falls keine Bild-URL vorhanden ist, bleibt das src leer
      imageElement.alt = 'no image';
      imageElement.className = "absolute h-full w-full object-cover";
      imagePlaceholder.appendChild(imageElement);

      // Optionaler Tag für Geschlecht oder andere Details unten links
      const genderTag = document.createElement('div');

      let gender = "X";
      genderTag.className = "absolute bottom-0 left-0 flex size-5 items-center justify-center rounded-tr-md bg-green-500 text-[10px] text-white";

      if(perfume.gender.charAt(0).toUpperCase() === "M"){
        gender = "M"
        genderTag.className = "absolute bottom-0 left-0 flex size-5 items-center justify-center rounded-tr-md bg-blue-500 text-[10px] text-white";

      }
      if(perfume.gender.charAt(0).toUpperCase() === "F"){
        gender = "W"
        genderTag.className = "absolute bottom-0 left-0 flex size-5 items-center justify-center rounded-tr-md bg-pink-500 text-[10px] text-white";

      }


      genderTag.textContent = gender;
      imagePlaceholder.appendChild(genderTag);

      // Textbereich
      const textContainer = document.createElement('div');
      resultItem.appendChild(textContainer);

      const nameText = document.createElement('h2');
      nameText.textContent = perfume.name;
      nameText.className = "text-lg font-bold";
      textContainer.appendChild(nameText);

      const inspiredText = document.createElement('p');
      inspiredText.textContent = 'Inspiriert von';
      inspiredText.className = "text-xs text-gray-400";
      textContainer.appendChild(inspiredText);

      const brandText = document.createElement('p');
      brandText.textContent = perfume.brand ? perfume.brand : 'Unbekannt';
      brandText.className = "-mt-0.5 text-sm text-gray-800";
      textContainer.appendChild(brandText);

      const familyGenderText = document.createElement('p');
      familyGenderText.textContent = `Duftrichtung: ${perfume.family ? perfume.family : 'n.a.'}`;
      familyGenderText.className = "mt-2 text-xs text-gray-400";
      textContainer.appendChild(familyGenderText);

      // Preis und Button
      const footer = document.createElement('div');
      footer.className = "col-span-2 flex items-center justify-between mt-2";
      
      const priceText = document.createElement('p');
      priceText.innerHTML = `ab €${perfume.price ? perfume.price.toFixed(2) : '9.90'}<span class="inline-block scale-75 rounded-full bg-slate-100 p-1 px-2 text-xs text-gray-400">10 ml</span>`;
      footer.appendChild(priceText);

      const button = document.createElement('button');
      button.className = "inline-flex flex-row-reverse items-center gap-1 rounded-full bg-green-100 fill-white stroke-green-600 stroke-1 p-1 px-3 text-sm font-light text-green-700 hover:bg-slate-100 hover:text-slate-700";
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4"><path stroke-width="1.5" d="M9.15 5.4C10.42 3.15 11.05 2 12 2c.95 0 1.58 1.14 2.85 3.4l.32.6c.36.64.54.96.83 1.18.28.21.63.29 1.32.45l.64.14c2.46.56 3.69.84 3.98 1.78.3.94-.54 1.92-2.22 3.88l-.43.5c-.48.56-.72.84-.83 1.19-.1.34-.07.71 0 1.46l.07.67c.25 2.62.38 3.93-.39 4.51-.76.58-1.91.05-4.22-1l-.6-.28c-.65-.3-.97-.46-1.32-.46-.35 0-.67.16-1.33.46l-.6.27c-2.3 1.06-3.45 1.6-4.21 1.01-.77-.58-.64-1.89-.4-4.5l.07-.68c.08-.75.11-1.12 0-1.46-.1-.35-.34-.63-.82-1.18l-.43-.51c-1.68-1.96-2.52-2.94-2.22-3.88.29-.94 1.52-1.22 3.98-1.78l.64-.14c.7-.16 1.04-.24 1.32-.45.29-.22.47-.54.83-1.18l.32-.6Z" /></svg><span class="text-xs font-light uppercase">gemerkt</span>`;
      footer.appendChild(button);

      resultItem.appendChild(footer);
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
