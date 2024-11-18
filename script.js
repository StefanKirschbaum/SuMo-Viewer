// Simulation einer CSV-Datenstruktur
const dataset = [
    { input1: 1, input2: 2, input3: 3, input4: 4, input5: 5, input6: 6, output1: 10, output2: 20, output3: 30, /* ... */ },
    { input1: 2, input2: 3, input3: 4, input4: 5, input5: 6, input6: 7, output1: 15, output2: 25, output3: 35, /* ... */ },
    // Weitere Daten
];

// Eingabe- und Ausgabe-Parameter definieren
const inputKeys = ["input1", "input2", "input3", "input4", "input5", "input6"];
const outputKeys = ["output1", "output2", "output3"]; // Erweiterbar

// Slider-Bereich generieren
const sliderContainer = document.getElementById("input-sliders");
const sliders = {};

inputKeys.forEach((key) => {
    const container = document.createElement("div");
    container.classList.add("slider-container");
    container.innerHTML = `
        <label for="${key}">${key}:</label>
        <input type="range" id="${key}" class="slider" min="0" max="10" value="0">
        <span id="${key}-value">0</span>
    `;
    sliderContainer.appendChild(container);
    sliders[key] = document.getElementById(key);

    // Wert-Update bei Slider-Bewegung
    sliders[key].addEventListener("input", () => {
        document.getElementById(`${key}-value`).textContent = sliders[key].value;
        updateOutputs();
    });
});

// Ausgabe aktualisieren
function updateOutputs() {
    // Eingabewerte sammeln
    const inputs = {};
    inputKeys.forEach((key) => {
        inputs[key] = parseInt(sliders[key].value, 10);
    });

    // Am nächsten passenden Datensatz orientieren
    let bestMatch = dataset[0];
    let smallestDifference = Infinity;

    dataset.forEach((row) => {
        let diff = 0;
        inputKeys.forEach((key) => {
            diff += Math.abs(row[key] - inputs[key]);
        });
        if (diff < smallestDifference) {
            smallestDifference = diff;
            bestMatch = row;
        }
    });

    // Ausgabe darstellen
    const outputTableBody = document.querySelector("#output-table tbody");
    outputTableBody.innerHTML = ""; // Tabelle leeren

    outputKeys.forEach((key) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${key}</td><td>${bestMatch[key]}</td>`;
        outputTableBody.appendChild(row);
    });
}

// Initiale Ausgabe berechnen
updateOutputs();
