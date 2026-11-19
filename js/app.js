  async function loadData() {

    try {

        const response = await fetch("./data/shareholders.json");

        if (!response.ok) {
            throw new Error(
                `Aktienregister konnte nicht geladen werden (${response.status})`
            );
        }

        const shareholders = await response.json();

        console.log(shareholders);

    } catch (error) {

        console.error(error);

    }
}

loadData();