// Elemente referenzieren
const sliderContainer = document.getElementById("input-sliders");
const outputTableBody = document.querySelector("#output-table tbody");

// Platz für die Daten
let dataset = [];
let inputKeys = [];
let outputKeys = [];
let sliders = {};
let minValues = {};
let maxValues = {};

// CSV laden und verarbeiten
function loadCSV(filePath) {
    Papa.parse(filePath, {
        download: true,
        header: true, // CSV-Header wird verwendet
        dynamicTyping: true, // Automatische Konvertierung von Zahlen
        delimiter: ";",	// auto-detect
        complete: function (results) {
            for (var i = 0; i < results.data.length; i++) {
                for (var j = 0; j < results.data[i].length; j++) {
                    results.data[i][j] = parseFloat(results.data[i][j]);
                }
            }
            dataset = results.data;

            // Eingabe- und Ausgabe-Parameter extrahieren
            //            inputKeys = Object.keys(dataset[0]).filter((key) => key.startsWith("input"));
            //            outputKeys = Object.keys(dataset[0]).filter((key) => key.startsWith("output"));
            inputKeys = Object.keys(dataset[0]).slice(0, 5);
            outputKeys = Object.keys(dataset[0]).slice(0, dataset[0].length);

            // Slider initialisieren
            createSliders();
            updateOutputs();
        },
    });
}

// Slider erstellen
function createSliders() {
    sliderContainer.innerHTML = ""; // Alte Slider entfernen
    sliders = {}; // Slider-Referenzen zurücksetzen

    inputKeys.forEach((key) => {
        const values = dataset
            .map((row) => row[key])
            .filter((value) => typeof value === 'number' && !isNaN(value)); // Nur gültige Zahlen
        var minValue = 0;
        var maxValue = 123;
        if (values.length > 0) {
            minValue = Math.min(...values);
            maxValue = Math.max(...values);
            console.log(`Key: ${key}, Min: ${minValue}, Max: ${maxValue}`);
        } else {
            console.log(`Key: ${key}, keine gültigen Werte.`);
        }

        // Slider-HTML erstellen
        const container = document.createElement("div");
        container.classList.add("slider-container");
        container.innerHTML = `
            <label for="${key}">${key}:</label>
            <input type="range" id="${key}" class="slider" min="${minValue}" max="${maxValue}" value="${minValue}">
            <span id="${key}-value">${minValue}</span> (${minValue} / ${maxValue})
        `;
        sliderContainer.appendChild(container);

        // Event-Listener für den Slider hinzufügen
        const slider = document.getElementById(key);
        sliders[key] = slider;
        slider.addEventListener("input", () => {
            document.getElementById(`${key}-value`).textContent = slider.value;
            updateOutputs();
        });
    });
}
// Ausgabe aktualisieren
function updateOutputs() {
    // Eingabewerte sammeln
    const inputs = {};
    inputKeys.forEach((key) => {
        inputs[key] = sliders[key].value;
    });

    // Am nächsten passenden Datensatz orientieren
    let bestMatch = dataset[1];
    let smallestDifference = Infinity;
    let min = dataset[1];
    let max = dataset[1];

    // Get column names
    const columns = Object.keys(dataset[0]);
    console.log(columns)

    // Compute max values
    maxValues = columns.map(col => {
        return {
            column: col,
            max: Math.max(...dataset.map(row => parseFloat(row[col] || 0)))
        };
    });
    console.log(maxValues)
    minValues = columns.map(col => {
        return {
            column: col,
            min: Math.min(...dataset.map(row => row[col] !== undefined && row[col] !== null ? parseFloat(row[col]) : Infinity))
        };
    });
    console.log(minValues)

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
    outputTableBody.innerHTML = ""; // Tabelle leeren

    let i = 0;
    outputKeys.forEach((key) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${key}</td><td><input type="range" id="${key}-slider2" class="slider" min=${minValues[i].min} max=${maxValues[i].max} value=${parseFloat(bestMatch[key])}></td><td>${Math.round(parseFloat(bestMatch[key]) * 1000) / 1000}</td><td>${Math.round(parseFloat(minValues[i].min) * 1000) / 1000}</td><td>${Math.round(parseFloat(maxValues[i].max) * 1000) / 1000}</td>`;
        outputTableBody.appendChild(row);
        i++;
    });
}

// CSV-Datei laden (Pfad relativ zur HTML-Datei)
loadCSV("data.csv");