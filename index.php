<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <title>Duftsuche</title>
</head>

<body>

    <input type="text" id="searchInput" placeholder="Marke oder Duftname eingeben">
    <button onclick="performSearch()">Suchen</button>

    <div id="results"></div>

    <!-- Einbindung von Fuse.js -->
    <script src="https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.min.js"></script>
    <script>
        // Daten
        const fragrances = [{
                code: "C005",
                gender: "w",
                brand: "Chanel",
                fragrance: "N°5"
            },
            {
                code: "C014",
                gender: "w",
                brand: "Dior",
                fragrance: "J'adore"
            },
            {
                code: "C017",
                gender: "w",
                brand: "Kenzo",
                fragrance: "Flower"
            },
            {
                code: "C032",
                gender: "w",
                brand: "Chloé",
                fragrance: "Signature"
            },
            {
                code: "C142",
                gender: "w",
                brand: "Narciso Rodriguez",
                fragrance: "Rouge"
            },
            {
                code: "C143",
                gender: "w",
                brand: "Narciso Rodriguez",
                fragrance: "All Of Me"
            },
            {
                code: "C165",
                gender: "w",
                brand: "Narciso Rodriguez",
                fragrance: "Pink Bottle"
            },
            {
                code: "C169",
                gender: "w",
                brand: "Yves Saint Laurent",
                fragrance: "Libre"
            },
            {
                code: "C170",
                gender: "w",
                brand: "Givenchy",
                fragrance: "L'interdit"
            },
            {
                code: "C171",
                gender: "w",
                brand: "Burberry",
                fragrance: "My Burberry"
            },
            {
                code: "C173",
                gender: "w",
                brand: "Chanel",
                fragrance: "Chance"
            },
            {
                code: "C177",
                gender: "w",
                brand: "Chloé",
                fragrance: "Chloé"
            },
            {
                code: "C187",
                gender: "w",
                brand: "Versace",
                fragrance: "Eros"
            },
            {
                code: "C192",
                gender: "w",
                brand: "Gucci",
                fragrance: "Flora"
            },
            {
                code: "C206",
                gender: "w",
                brand: "Lancôme",
                fragrance: "Trèsor"
            },
            {
                code: "C213",
                gender: "w",
                brand: "Guerlain",
                fragrance: "Rosa Rossa - Aqua Allegoria"
            },
            {
                code: "C229",
                gender: "w",
                brand: "Armani",
                fragrance: "MyWay"
            },
            {
                code: "L184",
                gender: "x",
                brand: "Morph",
                fragrance: "Nudo"
            },
            {
                code: "L199",
                gender: "w",
                brand: "Nasomatto",
                fragrance: "Narcotic Venus"
            },
            {
                code: "L240",
                gender: "w",
                brand: "Kilian",
                fragrance: "Good Girl Gone Bad"
            },
            {
                code: "L246",
                gender: "w",
                brand: "Victoria's Secret",
                fragrance: "First Love"
            },
            {
                code: "C019",
                gender: "w",
                brand: "Chanel",
                fragrance: "Coco Mademoiselle"
            },
            {
                code: "C185",
                gender: "w",
                brand: "Clinique",
                fragrance: "Aromatics Elixir"
            },
            {
                code: "C194",
                gender: "w",
                brand: "Dior",
                fragrance: "Miss Dior Cherie"
            },
            {
                code: "C217",
                gender: "w",
                brand: "Armani",
                fragrance: "Sì Fiori"
            },
            {
                code: "C075",
                gender: "m",
                brand: "Dior",
                fragrance: "Sauvage"
            },
            {
                code: "C007",
                gender: "m",
                brand: "Calvin Klein",
                fragrance: "One"
            },
            {
                code: "C009",
                gender: "m",
                brand: "Armani",
                fragrance: "Acqua di Gio"
            },
            {
                code: "C016",
                gender: "w",
                brand: "Dolce & Gabbana",
                fragrance: "Light Blue"
            },
            {
                code: "C035",
                gender: "m",
                brand: "Paco Rabanne",
                fragrance: "Invictus"
            },
            {
                code: "C039",
                gender: "x",
                brand: "Profumum Roma",
                fragrance: "Acqua di Sale"
            },
            {
                code: "C065",
                gender: "m",
                brand: "Dolce & Gabbana",
                fragrance: "Light Blue"
            },
            {
                code: "C136",
                gender: "m",
                brand: "Hugo Boss",
                fragrance: "Hugo"
            },
            {
                code: "C141",
                gender: "x",
                brand: "Creed",
                fragrance: "Silver Mountain"
            },
            {
                code: "C175",
                gender: "m",
                brand: "Armani",
                fragrance: "Acqua di Gio' Profondo"
            },
            {
                code: "C204",
                gender: "w",
                brand: "Calvin Klein",
                fragrance: "CKBe"
            },
            {
                code: "C238",
                gender: "x",
                brand: "Tom Ford",
                fragrance: "Neroli Portofino"
            },
            {
                code: "C239",
                gender: "x",
                brand: "Tom Ford",
                fragrance: "Soleil Blanc"
            },
            {
                code: "L188",
                gender: "x",
                brand: "Orto Parisi",
                fragrance: "Megamare"
            },
            {
                code: "L198",
                gender: "x",
                brand: "Spirit of Dubai",
                fragrance: "Bahar"
            },
            {
                code: "L212",
                gender: "x",
                brand: "Dior",
                fragrance: "Dioriviera"
            },
            {
                code: "L220",
                gender: "x",
                brand: "Mazzolari",
                fragrance: "Neroli"
            },
            {
                code: "L244",
                gender: "w",
                brand: "Victoria's Secret",
                fragrance: "Angel Gold"
            },
            {
                code: "C176",
                gender: "w",
                brand: "Bulgari",
                fragrance: "Blu"
            },
            {
                code: "C202",
                gender: "w",
                brand: "Byredo",
                fragrance: "Blanche"
            },
            {
                code: "C008",
                gender: "m",
                brand: "Versace",
                fragrance: "Dylan Blue"
            },
            {
                code: "C064",
                gender: "m",
                brand: "Abercrombie & Fitch",
                fragrance: "Fierce"
            },
            {
                code: "C030",
                gender: "w",
                brand: "Paco Rabanne",
                fragrance: "Lady Million"
            },
            {
                code: "C038",
                gender: "m",
                brand: "Creed",
                fragrance: "Aventus"
            },
            {
                code: "C128",
                gender: "w",
                brand: "Creed",
                fragrance: "Aventus for her"
            },
            {
                code: "C168",
                gender: "w",
                brand: "Burberry",
                fragrance: "Weekend"
            },
            {
                code: "C172",
                gender: "w",
                brand: "Dolce & Gabbana",
                fragrance: "Imperatrice"
            },
            {
                code: "C178",
                gender: "w",
                brand: "Armani",
                fragrance: "Terre di Gioia"
            },
            {
                code: "C179",
                gender: "m",
                brand: "Paco Rabanne",
                fragrance: "Phantom"
            },
            {
                code: "C190",
                gender: "w",
                brand: "Carolina Herrera",
                fragrance: "Very Good Girl"
            },
            {
                code: "C214",
                gender: "w",
                brand: "Dsquared2",
                fragrance: "Red Wood"
            },
            {
                code: "C216",
                gender: "w",
                brand: "Juicy Couture",
                fragrance: "Viva la Juicy"
            },
            {
                code: "C231",
                gender: "x",
                brand: "Tiziana Terenzi",
                fragrance: "Kirkè"
            },
            {
                code: "C247",
                gender: "x",
                brand: "Xerjoff",
                fragrance: "Erba Pura"
            },
            {
                code: "L183",
                gender: "x",
                brand: "Morph",
                fragrance: "Zeta Intense"
            },
            {
                code: "L224",
                gender: "m",
                brand: "Halbea",
                fragrance: "Sorgè N.1"
            },
            {
                code: "L242",
                gender: "w",
                brand: "Victoria's Secret",
                fragrance: "Bombshell"
            },
            {
                code: "C001",
                gender: "w",
                brand: "Yves Saint Laurent",
                fragrance: "Black Opium"
            },
            {
                code: "C006",
                gender: "w",
                brand: "Thierry Mugler",
                fragrance: "Angel"
            },
            {
                code: "C037",
                gender: "w",
                brand: "Lancôme",
                fragrance: "La Vie Est Belle"
            },
            {
                code: "C072",
                gender: "x",
                brand: "Montale",
                fragrance: "Intense Café"
            },
            {
                code: "C191",
                gender: "w",
                brand: "Jean Paul Gaultier",
                fragrance: "Scandal"
            },
            {
                code: "C193",
                gender: "w",
                brand: "Dior",
                fragrance: "Poison Girl"
            },
            {
                code: "C197",
                gender: "x",
                brand: "Acqua di Parma",
                fragrance: "Mandorlo di Sicilia"
            },
            {
                code: "C205",
                gender: "w",
                brand: "Guerlain",
                fragrance: "La Petite Robe Noire"
            },
            {
                code: "C207",
                gender: "w",
                brand: "Lolita Lempicka",
                fragrance: "Lolita Lempicka"
            },
            {
                code: "C225",
                gender: "m",
                brand: "Tom Ford",
                fragrance: "Tobacco Vanille"
            },
            {
                code: "C232",
                gender: "x",
                brand: "Giardini di Toscana",
                fragrance: "Bianco Latte"
            },
            {
                code: "C233",
                gender: "x",
                brand: "Tom Ford",
                fragrance: "Lost Cherry"
            },
            {
                code: "L245",
                gender: "w",
                brand: "Victoria's Secret",
                fragrance: "Tease"
            },
            {
                code: "C018",
                gender: "m",
                brand: "Givenchy",
                fragrance: "Gentleman Society"
            },
            {
                code: "C033",
                gender: "m",
                brand: "Hugo Boss",
                fragrance: "Bottled"
            },
            {
                code: "C061",
                gender: "m",
                brand: "Chanel",
                fragrance: "Bleu de Chanel"
            },
            {
                code: "C078",
                gender: "m",
                brand: "Hermès",
                fragrance: "Terre d'Hermes"
            },
            {
                code: "C137",
                gender: "m",
                brand: "Tom Ford",
                fragrance: "Oud Wood"
            },
            {
                code: "C151",
                gender: "x",
                brand: "Dior",
                fragrance: "Bois d'Argent"
            },
            {
                code: "C174",
                gender: "m",
                brand: "Burberry",
                fragrance: "Mr Burberry"
            },
            {
                code: "C195",
                gender: "m",
                brand: "Cartier",
                fragrance: "Declaration"
            },
            {
                code: "C210",
                gender: "m",
                brand: "Hugo Boss",
                fragrance: "Boss"
            },
            {
                code: "C211",
                gender: "m",
                brand: "Diesel",
                fragrance: "Only The Brave"
            },
            {
                code: "C221",
                gender: "m",
                brand: "Moncler",
                fragrance: "Homme 2023"
            },
            {
                code: "L236",
                gender: "m",
                brand: "Clive Christian",
                fragrance: "N°1 Men"
            },
            {
                code: "C181",
                gender: "x",
                brand: "Tom Ford",
                fragrance: "Ombre Leather"
            },
            {
                code: "C182",
                gender: "w",
                brand: "Hermès",
                fragrance: "Galop"
            },
            {
                code: "C002",
                gender: "w",
                brand: "Yves Saint Laurent",
                fragrance: "Opium"
            },
            {
                code: "C003",
                gender: "w",
                brand: "Gucci",
                fragrance: "Guilty"
            },
            {
                code: "C010",
                gender: "w",
                brand: "Laura Biagiotti",
                fragrance: "Roma"
            },
            {
                code: "C011",
                gender: "m",
                brand: "Laura Biagiotti",
                fragrance: "Roma Uomo"
            },
            {
                code: "C012",
                gender: "m",
                brand: "Dior",
                fragrance: "Fahrenheit"
            },
            {
                code: "C013",
                gender: "w",
                brand: "Dior",
                fragrance: "Hypnotic Poison"
            },
            {
                code: "C015",
                gender: "w",
                brand: "Dolce & Gabbana",
                fragrance: "Devotion"
            },
            {
                code: "C022",
                gender: "w",
                brand: "Thierry Mugler",
                fragrance: "Alien"
            },
            {
                code: "C027",
                gender: "m",
                brand: "Paco Rabanne",
                fragrance: "One Million"
            },
            {
                code: "C166",
                gender: "w",
                brand: "Narciso Rodriguez",
                fragrance: "Black Bottle"
            },
            {
                code: "C167",
                gender: "m",
                brand: "Dior",
                fragrance: "Sauvage Elixir"
            },
            {
                code: "C186",
                gender: "w",
                brand: "Versace",
                fragrance: "Crystal Noir"
            },
            {
                code: "C189",
                gender: "m",
                brand: "Armani",
                fragrance: "Code"
            },
            {
                code: "C196",
                gender: "m",
                brand: "Yves Saint Laurent",
                fragrance: "Opium"
            },
            {
                code: "C201",
                gender: "m",
                brand: "Jean Paul Gaultier",
                fragrance: "Scandal"
            },
            {
                code: "C208",
                gender: "m",
                brand: "Chanel",
                fragrance: "Allure"
            },
            {
                code: "C209",
                gender: "m",
                brand: "Yves Saint Laurent",
                fragrance: "La Nuit de l'Homme"
            },
            {
                code: "C218",
                gender: "w",
                brand: "Dolce & Gabbana",
                fragrance: "The One"
            },
            {
                code: "C219",
                gender: "m",
                brand: "Dolce & Gabbana",
                fragrance: "The One for man"
            },
            {
                code: "C222",
                gender: "x",
                brand: "Tom Ford",
                fragrance: "Black Orchid"
            },
            {
                code: "C226",
                gender: "x",
                brand: "Mancera",
                fragrance: "Red Tobacco"
            },
            {
                code: "C228",
                gender: "x",
                brand: "Louis Vuitton",
                fragrance: "Ombre Nomade"
            },
            {
                code: "C230",
                gender: "x",
                brand: "Montale",
                fragrance: "Arabians Tonka"
            },
            {
                code: "C235",
                gender: "m",
                brand: "Amouage",
                fragrance: "Interlude Man"
            },
            {
                code: "L041",
                gender: "x",
                brand: "Nasomatto",
                fragrance: "Black Afgano"
            },
            {
                code: "L180",
                gender: "x",
                brand: "Halbea",
                fragrance: "Sorgè N.2"
            },
            {
                code: "L200",
                gender: "x",
                brand: "F. Kurkdjian",
                fragrance: "Baccarat Rouge 540"
            },
            {
                code: "L203",
                gender: "x",
                brand: "Spirit of Dubai",
                fragrance: "Turath"
            },
            {
                code: "L223",
                gender: "w",
                brand: "Halbea",
                fragrance: "Sorgè N.3"
            },
            {
                code: "L227",
                gender: "x",
                brand: "Morph",
                fragrance: "Indomable"
            },
            {
                code: "L234",
                gender: "x",
                brand: "Louis Vuitton",
                fragrance: "Nuit de Feu"
            },
            {
                code: "L237",
                gender: "x",
                brand: "Dolce & Gabbana",
                fragrance: "Velvet Amber Sun"
            },
            {
                code: "L241",
                gender: "x",
                brand: "Morph",
                fragrance: "Disumano"
            },
            {
                code: "L243",
                gender: "w",
                brand: "Victoria's Secret",
                fragrance: "Dark Angel"
            },
            {
                code: "L248",
                gender: "x",
                brand: "Pantheon Roma",
                fragrance: "Annone"
            },
            {
                code: "L249",
                gender: "x",
                brand: "Jeroboam",
                fragrance: "Gozo"
            },
            {
                code: "C057",
                gender: "m",
                brand: "Acqua di Parma",
                fragrance: "Acqua di Parma"
            }
        ];



        // Fuse-Instanz erstellen

        // Suchfunktion
        function searchFragrances(query) {
            let threshold = 0.1; // Startwert für den Threshold
            const maxThreshold = 0.8; // Maximal erlaubter Threshold
            const thresholdIncrement = 0.05; // Schrittweite zur Erhöhung des Thresholds
            let results = [];

            while (threshold <= maxThreshold) {
                // Fuse.js Optionen mit aktuellem Threshold
                const options = {
                    shouldSort: true,
                    threshold: threshold,
                    keys: ["brand", "fragrance"]
                };

                // Neue Fuse-Instanz mit aktualisierten Optionen
                const fuse = new Fuse(fragrances, options);
                const searchResults = fuse.search(query);
                results = searchResults.map(item => item.item);

                // Ergebnisse auf maximal 5 Einträge begrenzen
                if (results.length > 5) {
                    results = results.slice(0, 5);
                }

                // Bedingung zum Beenden der Schleife
                if (results.length >= 3 || threshold >= maxThreshold) {
                    break;
                } else {
                    // Threshold erhöhen, wenn zu wenige Ergebnisse
                    threshold += thresholdIncrement;
                }
            }

            // Ergebnisse zurückgeben
            return results;
        }




        // Funktion, die bei Klick auf den Suchbutton aufgerufen wird
        function performSearch() {
            const query = document.getElementById('searchInput').value;
            const results = searchFragrances(query);
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';

            if (results.length > 0) {
                let html = '<h3>'+results.length+'Gefundene Einträge:</h3><ul>';
                results.forEach(entry => {
                    html += '<li>';
                    html += '<strong>Code:</strong> ' + entry.code + '<br>';
                    html += '<strong>Geschlecht:</strong> ' + entry.gender + '<br>';
                    html += '<strong>Marke:</strong> ' + entry.brand + '<br>';
                    html += '<strong>Duftname:</strong> ' + entry.fragrance;
                    html += '</li>';
                });
                html += '</ul>';
                resultsDiv.innerHTML = html;
            } else {
                resultsDiv.innerHTML = '<p>Keine Ergebnisse gefunden.</p>';
            }
        }
    </script>
</body>

</html>