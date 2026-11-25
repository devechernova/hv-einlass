const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("search");
const cityFilter = document.getElementById("cityFilter");
const counter = document.getElementById("counter");

let shareholders = [];

async function loadData() {

    try {

        const response = await fetch("./data/shareholders.json");

        if (!response.ok) {
            throw new Error(
                `Aktienregister konnte nicht geladen werden (${response.status})`
            );
        }

        shareholders = await response.json();

        populateCityFilter();
        filterShareholders();

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
            shareholder.shares.toLocaleString("de-DE"),
            "-"
        ];

        for (const value of values) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    }
}


// Event Listener
searchInput.addEventListener("input", filterShareholders);

cityFilter.addEventListener("change", filterShareholders);


// Anwendung starten
loadData();