const MAX_RESULTS = 7;
let perfumes = [];
let fuse;
let selectedGender = 'all'; // Standard: Alle Gender
let searchTimeout; // Timeout für das Debouncing
let savedPerfumeIds = JSON.parse(localStorage.getItem('savedPerfumes')) || []; // IDs der gespeicherten Parfüms

// Fuse.js Optionen
const options = {
  includeScore: true, // Zeigt den Score an, damit wir sehen, wie relevant jedes Ergebnis ist
  shouldSort: true,   // Sortiert die Ergebnisse nach Relevanz
  threshold: 0.4,     // Eine niedrigere Schwelle, damit nur sehr exakte Übereinstimmungen stärker gewichtet werden
  keys: [
    {
      name: "brand",
      weight: 0.3 // Gewicht für die Marke
    },
    {
      name: "name",
      weight: 0.65 // Höheres Gewicht für den Namen
    },
    {
      name: "combined",
      weight: 1.0 // Die Kombination von Marke und Name hat das höchste Gewicht
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

  // Überprüfen, ob ein gespeicherter Suchbegriff existiert
  const savedSearchQuery = localStorage.getItem('searchQuery');
  if (savedSearchQuery) {
    const searchBar = document.getElementById('searchBar');
    searchBar.value = savedSearchQuery; // Setze den gespeicherten Suchbegriff ins Suchfeld
    
    // Zeige den Clear-Button, wenn der Suchbegriff mindestens 2 Zeichen hat
    const clearButton = document.getElementById('clearSearch');
    if (savedSearchQuery.length >= 2) {
      clearButton.classList.remove('hidden');
    }

    searchPerfumes(); // Führe die Suche durch
  }

  updateSavedPerfumeCount(); // Aktualisiere den Zähler nach dem Laden der Seite
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
    scrollToElementWithDynamicOffset("results","querybox");
    results = results.filter(perfume => perfume.gender === selectedGender);
  }

  // Zeige maximal 10 Ergebnisse
  results = results.slice(0, MAX_RESULTS);

  displayResults(results);
}

// Verzögerung der Suche (Debouncing) um die Performance zu verbessern
function handleSearchInput() {
  const searchBar = document.getElementById('searchBar');
  const clearButton = document.getElementById('clearSearch');
  const searchString = searchBar.value.trim();

  // Speichere den aktuellen Suchbegriff in localStorage
  localStorage.setItem('searchQuery', searchString);

  if (searchString.length >= 2) {
    clearButton.classList.remove('hidden');
  } else {
    clearButton.classList.add('hidden');
  }

  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(searchPerfumes, 300); // 300ms Verzögerung
}


// Funktion zum Speichern der Parfüm-ID in localStorage
function togglePerfumeSave(perfumeId, buttonElement) {
  if (savedPerfumeIds.includes(perfumeId)) {
    // Entferne die ID, wenn sie bereits gespeichert ist
    savedPerfumeIds = savedPerfumeIds.filter(id => id !== perfumeId);
    buttonElement.innerHTML = 'Merken'; // Ändere den Text zu "Merken"
    buttonElement.classList.remove('bg-green-600', 'text-white');
    buttonElement.classList.add('bg-green-100', 'text-green-700');
  } else {
    // Füge die ID hinzu, wenn sie noch nicht gespeichert ist
    savedPerfumeIds.push(perfumeId);
    buttonElement.innerHTML = 'Gemerkt'; // Ändere den Text zu "Gemerkt"
    buttonElement.classList.remove('bg-green-100', 'text-green-700');
    buttonElement.classList.add('bg-green-600', 'text-white');
  }

  // Speichere das Array in localStorage
  localStorage.setItem('savedPerfumes', JSON.stringify(savedPerfumeIds));
  updateSavedPerfumeCount(); // Aktualisiere den Zähler der gemerkten Düfte
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
      resultItem.className = "grid grid-cols-[6rem_auto] gap-2 rounded-md border border-gray-300 p-2 text-slate-800 mb-4 bg-white shadow-sm";

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

      const inspiredText = document.createElement('p');
      inspiredText.textContent = 'Inspiriert von';
      inspiredText.className = "text-xs text-gray-400";
      textContainer.appendChild(inspiredText);

      const nameText = document.createElement('h2');
      let fname = perfume.name ?? 'xxx';
      nameText.textContent = fname;
      nameText.className = "text-lg font-bold";
      textContainer.appendChild(nameText);

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
      
      // Setze den Text basierend auf dem gespeicherten Status
      if (savedPerfumeIds.includes(perfume.id)) {
        button.innerHTML = 'Gemerkt';
        button.classList.remove('bg-green-100', 'text-green-700');
        button.classList.add('bg-green-600', 'text-white');
      } else {
        button.innerHTML = 'Merken';
      }

      button.addEventListener('click', () => togglePerfumeSave(perfume.id, button));
      footer.appendChild(button);

      resultItem.appendChild(footer);
      resultsDiv.appendChild(resultItem);
    });
  }
}

// Funktion zum Zählen der gemerkten Parfüms und zur Anzeige des Zählers
function updateSavedPerfumeCount() {
  const savedPerfumeCount = savedPerfumeIds.length;
  const fixedFooter = document.getElementById('fixed-footer');

  if (savedPerfumeCount > 0) {
    // Zeige den Zähler und den Link an
    fixedFooter.innerHTML = `<a href="selected.html" class="text-white">Gemerkt: ${savedPerfumeCount} Düfte ansehen</a>`;
    fixedFooter.style.display = 'block';
  } else {
    // Verstecke das Feld, wenn keine Düfte gemerkt sind
    fixedFooter.style.display = 'none';
  }
}

// Funktion zum Filtern nach Geschlecht
function filterByGender(gender) {
  selectedGender = gender;
  searchPerfumes();

  // Alle Buttons zurücksetzen (weiß mit grauem Text)
  document.getElementById('btn-all').classList.remove('bg-[#38393a]', 'text-white');
  document.getElementById('btn-w').classList.remove('bg-[#38393a]', 'text-white');
  document.getElementById('btn-m').classList.remove('bg-[#38393a]', 'text-white');
  document.getElementById('btn-x').classList.remove('bg-[#38393a]', 'text-white');

  document.getElementById('btn-all').classList.add('bg-white', 'text-gray-800');
  document.getElementById('btn-w').classList.add('bg-white', 'text-gray-800');
  document.getElementById('btn-m').classList.add('bg-white', 'text-gray-800');
  document.getElementById('btn-x').classList.add('bg-white', 'text-gray-800');

  // Ausgewählten Button hervorheben (schwarz mit weißem Text)
  if (gender === 'all') {
    document.getElementById('btn-all').classList.add('bg-[#38393a]', 'text-white');
    document.getElementById('btn-all').classList.remove('bg-white', 'text-gray-800');
  } else if (gender === 'female') {
    document.getElementById('btn-w').classList.add('bg-[#38393a]', 'text-white');
    document.getElementById('btn-w').classList.remove('bg-white', 'text-gray-800');
  } else if (gender === 'male') {
    document.getElementById('btn-m').classList.add('bg-[#38393a]', 'text-white');
    document.getElementById('btn-m').classList.remove('bg-white', 'text-gray-800');
  } else if (gender === 'unisex') {
    document.getElementById('btn-x').classList.add('bg-[#38393a]', 'text-white');
    document.getElementById('btn-x').classList.remove('bg-white', 'text-gray-800');
  }
}

// ScrollTo Fuktion
function scrollToElementWithDynamicOffset(targetId, offsetElementId) {
  const targetElement = document.getElementById(targetId);
  const offsetElement = document.getElementById(offsetElementId);

  if (targetElement && offsetElement) {
    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const offset = offsetElement.offsetHeight + 18; // Höhe des Offset-Elements (querybox)
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth' // Smooth scrolling animation
    });
  }
}

// Starte die Anwendung, indem die Parfüm-Daten geladen werden
loadPerfumeData();