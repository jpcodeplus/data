const menuButton = document.getElementById("menuButton");
let menuIsOpen = false; // Variable, um den Zustand des Menüs zu verfolgen
const links = [
    {
        "label": "Parfum suche",
        "link": "index.html"
    },
    {
    "label": "Die Parfumes",
    "link": "about.html"
}, 
{
    "label": "Flaverio Club",
    "link": "club.html"
},
{
    "label": "FAQs",
    "link": "faq.html"
},
{
    "label": "Partner Login",
    "link": "partner.html"
}];

menuButton.addEventListener("click", function() {
    if (!menuIsOpen) {
        // Erstelle den Menü-Wrapper (dialog)
        const menuWrapper = document.createElement("dialog");
        menuWrapper.id = "mobileMenu"; // ID für Styling und Referenz

        // Erstelle die Liste der Links (ul)
        const menuList = document.createElement("ul");

        // Gehe durch das Array von Links und füge sie zum Menü hinzu
        links.forEach(function(linkItem) {
            const listItem = document.createElement("li");
            const anchor = document.createElement("a");

            // Setze den Text und das href-Attribut des Links
            anchor.textContent = linkItem.label;
            anchor.href = linkItem.link;

            // Füge den Link dem Listenelement hinzu
            listItem.appendChild(anchor);
            // Füge das Listenelement der Liste hinzu
            menuList.appendChild(listItem);
        });

        // Schließen-Button innerhalb des Dialogs
        const closeButton = document.createElement("button");
        closeButton.classList.add("close-btn");
        closeButton.innerText = "SCHLIESSEN";

        // Schließen des Menüs beim Klick auf den Schließen-Button
        closeButton.addEventListener("click", function() {
            menuWrapper.close(); // Schließt das Dialog-Element
            document.body.removeChild(menuWrapper); // Entfernt das Menü aus dem DOM
            menuIsOpen = false; // Setzt den Zustand auf geschlossen
        });

        // Füge die Liste und den Schließen-Button zum Wrapper hinzu
        menuWrapper.appendChild(menuList);
        menuWrapper.appendChild(closeButton);

        // Füge den Wrapper zum Body hinzu
        document.body.appendChild(menuWrapper);

        // Öffne den Dialog
        menuWrapper.showModal();

        // Schließe das Menü automatisch, wenn der Dialog geschlossen wird (z.B. durch Klick außerhalb)
        menuWrapper.addEventListener('close', () => {
            if (document.body.contains(menuWrapper)) {
                document.body.removeChild(menuWrapper); // Entfernt das Menü aus dem DOM
            }
            menuIsOpen = false; // Setzt den Zustand auf geschlossen
        });

        menuIsOpen = true; // Setzt den Zustand auf geöffnet
    } else {
        // Schließe das Menü, wenn es geöffnet ist
        const menu = document.getElementById("mobileMenu");
        if (menu) {
            menu.close(); // Schließt den Dialog
            document.body.removeChild(menu); // Entfernt das Menü aus dem DOM
            menuIsOpen = false;
        }
    }
});
