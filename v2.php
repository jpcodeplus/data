<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parfüm-Suche</title>
    <link rel="apple-touch-icon" sizes="180x180" href="/img/fav/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/img/fav/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/img/fav/favicon-16x16.png">
    <link rel="manifest" href="/img/fav/site.webmanifest">
    <link rel="mask-icon" href="/img/fav/safari-pinned-tab.svg" color="#556670">
    <link rel="shortcut icon" href="/img/fav/favicon.ico">
    <meta name="apple-mobile-web-app-title" content="Flaverio">
    <meta name="application-name" content="Flaverio">
    <meta name="msapplication-TileColor" content="#00aba9">
    <meta name="msapplication-config" content="/img/fav/browserconfig.xml">
    <meta name="theme-color" content="#3d3b3b">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fuse.js/6.4.6/fuse.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-[#f9f4ec] p-8">

    <img src="/img/logo-flaverio.png" class=" mx-auto h-24 mb-4" alt="">

    <div class="max-w-xl mx-auto">

        <!-- Suchfeld mit Löschen-Button -->
        <div class="relative mb-4">
            <input type="text" id="searchBar" placeholder="Suche nach Marke oder Name" oninput="handleSearchInput()"
                class="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent">
            <button id="clearSearch" onclick="clearSearch()" class="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 hidden">
                &#x2715; <!-- "X"-Symbol -->
            </button>
        </div>

        <!-- Gender-Filter Buttons -->
        <div id="genderButtons" class="flex justify-start space-x-1 mb-6 *:rounded-full">
            <button id="btn-all" class="text-xs bg-black text-white py-1 px-3" onclick="filterByGender('all')">Alle</button>
            <button id="btn-w" class="text-xs bg-white text-gray-800 py-1 px-3" onclick="filterByGender('female')">Frauen</button>
            <button id="btn-m" class="text-xs bg-white text-gray-800 py-1 px-3" onclick="filterByGender('male')">Männer</button>
            <button id="btn-x" class="text-xs bg-white text-gray-800 py-1 px-3" onclick="filterByGender('unisex')">Unisex</button>
        </div>

        <!-- Ergebnisse -->
        <div id="results" class="bg-white/50 p-2 rounded-lg shadow-md"></div>
    </div>

    <script src="script.js"></script>

</body>

</html>