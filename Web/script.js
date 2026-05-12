const neptunCode = "R5KXM8";

const carContainer = document.getElementById("carList");
const loadButton = document.getElementById("loadBtn");
const carForm = document.getElementById("carForm");
const feedback = document.getElementById("message");
let currentEditId = null;

const API_URL = `https://iit-playground.arondev.hu/api/${neptunCode}/car`;

loadButton.addEventListener("click", getCars);


/*----------------------Autó részletek (kattintásnál) ----------------------*/

function showCarDetails(car) {
    alert(`
    Márka: ${car.brand}
    Modell: ${car.model}
    Dátum: ${car.dayOfCommission}
    Tulajdonos: ${car.owner}
    Fogyasztás: ${car.fuelUse} Liter
    Elektromos: ${car.electric ? "Igen" : "Nem"} `);
}

/*---------------------- Bevitel ellenőrzése ----------------------*/

function validateForm(car) {
    if (car.brand.length < 2) return "Túl rövid márkanév!";
    if (car.model.length < 1) return "Add meg a modellt!";
    if (!car.owner.includes(" ")) return "Add meg teljes nevet!";
    if (!car.dayOfCommission) return "A dátum megadása kötelező!";

    if (!car.electric && car.fuelUse <= 0)
        return "A fogyasztásnak nagyobbnak kell lennie mint 0!";

    if (car.electric && car.fuelUse !== 0)
        return "Elektromos autónál a fogyasztás midnig 0!";

    return null;
}


/*---------------------- Autó adatok mentése -> objektummá alakítás ----------------------*/

carForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const carData = {
        brand: document.getElementById("brand").value.trim(),
        model: document.getElementById("model").value.trim(),
        dayOfCommission: document.getElementById("dayOfCommission").value,
        owner: document.getElementById("owner").value.trim(),
        fuelUse: parseFloat(document.getElementById("fuelUse").value),
        electric: document.getElementById("electric").checked
    };

    const errorMessage = validateForm(carData);

    if (errorMessage) {
        showError(errorMessage);
        return;
    }

    if (currentEditId === null) {
        createNewCar(carData);
    } else {
        editCar(carData);
    }
});

/*---------------------- Autó létrehozása ----------------------*/

function createNewCar(car) {
    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(car)
    })
        .then(response => response.json())
        .then(result => {
            if (result.success === false) {
                showError(result.message);
                return;
            }

            getCars();
            carForm.reset();
            showSuccess("Autó sikeresen hozzáadva!");
        })
        .catch(() => showError("Hiba történt mentés közben."));
}

/*----------------------Autó lista megjelnítés ----------------------*/

function getCars() {
    fetch(API_URL)
        .then(response => response.json())
        .then(cars => {
            carContainer.innerHTML = "";

            cars.forEach(car => {
                const listItem = document.createElement("li");

                listItem.innerHTML = `
                    <span class="carText">
                        ${car.brand} ${car.model} (${car.fuelUse.toFixed(1)}L)
                    </span>
                    <div>
                        <button class="editBtn">Módosít</button>
                        <button class="deleteBtn">Töröl</button>
                    </div>
                `;

                listItem.querySelector(".carText").onclick = () => showCarDetails(car);
                listItem.querySelector(".editBtn").onclick = () => loadFormData(car);
                listItem.querySelector(".deleteBtn").onclick = () => removeCar(car.id);

                carContainer.appendChild(listItem);
            });
        })
        .catch(() => showError("Nem sikerült betölteni az autókat."));
}


/*---------------------------- Módosítás ------------------------------*/

function editCar(car) {
    fetch(API_URL, {
        method: "PUT", headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: currentEditId, ...car
        })
    })
        .then(response => response.json())
        .then(result => {
            if (result.success === false) {
                showError(result.message);
                return;
            }

            currentEditId = null;
            carForm.reset();
            getCars();

            showSuccess("Autó sikeresen módosítva!");
        })
        .catch(() => showError("Nem sikerült frissíteni."));
}

/*------------------------------- Törlés --------------------------------*/

function removeCar(id) {
    if (!confirm("Biztosan törölni szeretnéd ezt az autót?")) return;

    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })
        .then(() => {
            getCars();
            showSuccess("Autó törölve.");
        })
        .catch(() => showError("Hiba történt törléskor."));
}

/*---------------------- Autók betöltése ----------------------*/

function loadFormData(car) {


    document.getElementById("brand").value = car.brand;
    document.getElementById("model").value = car.model;
    document.getElementById("dayOfCommission").value = car.dayOfCommission;
    document.getElementById("owner").value = car.owner;
    document.getElementById("fuelUse").value = car.fuelUse.toFixed(1);
    document.getElementById("electric").checked = car.electric;

    currentEditId = car.id;

    showSuccess("Szerkesztési mód bekapcsolva.");
}

/*---------------------Egyebek-----------------------------*/

document.getElementById("electric")
    .addEventListener("change", function () {
        const fuelInput = document.getElementById("fuelUse");

        if (this.checked) {
            fuelInput.value = 0;
            fuelInput.disabled = true;
        } else {
            fuelInput.disabled = false;
        }
    });

function showError(text) {
    feedback.style.color = "red";
    feedback.textContent = text;
}

function showSuccess(text) {
    feedback.style.color = "green";
    feedback.textContent = text;
}