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

       renderTable(shareholders);

    }
     catch (error) {

        console.error(error);

    }
}

function renderTable(list) {

     tableBody.innerHTML = "";

      for (const shareholder of list) {

        const row = document.createElement("tr");

        let city = shareholder.address[0].city;

        if (shareholder.address.length > 1) {

    city += ` (+${shareholder.address.length - 1})`;

}

        row.innerHTML = `
            <td>${shareholder.id}</td>
            <td>${shareholder.name}</td>
            <td>${shareholder.type}</td>
            <td>${city}</td>
            <td>${shareholder.shares.toLocaleString("de-DE")}</td>
            <td>-</td>
        `;

    
    tableBody.appendChild(row);

    }

}
loadData();