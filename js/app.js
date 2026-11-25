const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("search");
const cityFilter = document.getElementById("cityFilter");
const counter = document.getElementById("counter");

let shareholders = [];
let checkins = [];

async function loadData() {

    try {

        const response = await fetch("./data/shareholders.json");

        if (!response.ok) {
            throw new Error(
                `Aktienregister konnte nicht geladen werden (${response.status})`
            );
        }

        shareholders = await response.json();

        const savedCheckins = localStorage.getItem("hv-checkins");

checkins = savedCheckins
    ? JSON.parse(savedCheckins)
    : [];

        populateCityFilter();
        filterShareholders();
        updatePresence();

    }
     catch (error) {

        console.error(error);

         counter.textContent = error.message;
        tableBody.innerHTML = "";

    }
}

    // Städte aus allen Anschriften ermitteln
function populateCityFilter() {
    const cities = new Set();

    for (const shareholder of shareholders) {
        for (const address of shareholder.address) {
            cities.add(address.city);
        }
    }

    const sortedCities = [...cities].sort((a, b) =>
        a.localeCompare(b, "de")
    );

    for (const city of sortedCities) {
        const option = document.createElement("option");

        option.value = city;
        option.textContent = city;

        cityFilter.appendChild(option);
    }
}


// Suche und Stadtfilter kombinieren
function filterShareholders() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCity = cityFilter.value;

    const filteredShareholders = shareholders.filter(shareholder => {

        const matchesName = shareholder.name
            .toLowerCase()
            .includes(searchTerm);

        const matchesId = shareholder.id.toString() === searchTerm;

        const matchesSearch = searchTerm === "" ||
            matchesName || matchesId;

        const matchesCity = selectedCity === "" ||
            shareholder.address.some(address =>
                address.city === selectedCity
            );

        return matchesSearch && matchesCity;
    });

    renderTable(filteredShareholders);
}


// Tabelle anzeigen
function renderTable(list) {
    tableBody.innerHTML = "";

    counter.textContent = list.length === 0
        ? "Kein Aktionär gefunden."
        : `${list.length} von ${shareholders.length} Aktionären`;

    if (list.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 6;
        cell.textContent = "Kein Aktionär gefunden.";

        row.appendChild(cell);
        tableBody.appendChild(row);

        return;
    }

    for (const shareholder of list) {
       
const row = document.createElement("tr");

let city = shareholder.address[0].city;

if (shareholder.address.length > 1) {
    city += ` (+${shareholder.address.length - 1})`;
}

const values = [
    shareholder.id,
    shareholder.name,
    shareholder.type,
    city,
    shareholder.shares.toLocaleString("de-DE")
];

for (const value of values) {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.appendChild(cell);
}

// Status anzeigen
const statusCell = document.createElement("td");

if (checkins.includes(shareholder.id)) {

    statusCell.textContent = "✓ anwesend";
    row.classList.add("anwesend");

} else {

    const button = document.createElement("button");

    button.textContent = "Einchecken";
    button.dataset.id = shareholder.id;

    statusCell.appendChild(button);
}

row.appendChild(statusCell);
tableBody.appendChild(row);

    }
}

function updatePresence() {
     // Nur eingecheckte Aktionäre berücksichtigen
    const presentShareholders = shareholders.filter(shareholder =>
        checkins.includes(shareholder.id)
    );

     // Anzahl der anwesenden Aktionäre berechnen
    const presentCount = presentShareholders.length;
    const totalCount = shareholders.length;

    // Stimmen der anwesenden Aktionäre und Gesamtstimmen berechnen
    const presentShares = presentShareholders.reduce(
        (sum, shareholder) => sum + shareholder.shares,
        0
    );

    const totalShares = shareholders.reduce(
        (sum, shareholder) => sum + shareholder.shares,
        0
    );

    // Anteil der anwesenden Stimmen in Prozent berechnen
    const presencePercent = totalShares > 0
        ? (presentShares / totalShares) * 100
        : 0;

    // Ergebnisse auf der Webseite anzeigen
    document.getElementById("presenceCount").textContent =
        presentCount.toLocaleString("de-DE");

    document.getElementById("totalCount").textContent =
        totalCount.toLocaleString("de-DE");

    document.getElementById("presenceShares").textContent =
        presentShares.toLocaleString("de-DE");

    document.getElementById("totalShares").textContent =
        totalShares.toLocaleString("de-DE");

    document.getElementById("presencePercent").textContent =
        presencePercent.toLocaleString("de-DE", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }) + " %";
}

// Event Listener
searchInput.addEventListener("input", filterShareholders);

cityFilter.addEventListener("change", filterShareholders);

tableBody.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-id]");

    if (!button) {
        return;
    }

    const shareholderId = Number(button.dataset.id);

    if (!checkins.includes(shareholderId)) {

        checkins.push(shareholderId);

        localStorage.setItem(
            "hv-checkins",
            JSON.stringify(checkins)
        );
    }

    filterShareholders();
    updatePresence();

});
// Anwendung starten
loadData();