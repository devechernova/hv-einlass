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

     tableBody.innerHTML = "";

      for (const shareholder of shareholders) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${shareholder.id}</td>
            <td>${shareholder.name}</td>
            <td>${shareholder.type}</td>
            <td>${shareholder.address[0].city}</td>
            <td>${shareholder.shares}</td>
            <td>-</td>
        `;

    
    tableBody.appendChild(row);

    }

}
loadData();