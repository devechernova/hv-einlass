const tableBody = document.getElementById("tableBody");

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

       renderTable();

    }
     catch (error) {

        console.error(error);

    }
}

function renderTable() {

    console.log("Tabelle wird erstellt");

}

loadData();