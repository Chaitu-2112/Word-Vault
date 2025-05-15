async function searchWord() {
    let word = document.getElementById("search-box").value.trim();
    let resultDiv = document.getElementById("result");

    if (word === "") {
        resultDiv.innerHTML = "<p>Please enter a word!</p>";
        return;
    }

    try {
        let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        let data = await response.json();

        if (data.title === "No Definitions Found") {
            resultDiv.innerHTML = "<p>No definition found. Try another word.</p>";
            return;
        }

        let firstMeaning = data[0].meanings[0].definitions[0].definition;
        let examples = [];

        for (let meaningItem of data[0].meanings) {
            for (let def of meaningItem.definitions) {
                if (def.example) examples.push(def.example);
            }
        }

        let exampleText = examples.length > 0 ? examples.join("<br>") : "No examples available.";
        let audio = data[0].phonetics.find(p => p.audio)?.audio || null;
        let audioHTML = audio 
            ? `<audio controls><source src="${audio}" type="audio/mpeg">Your browser does not support audio.</audio>` 
            : "<p>No pronunciation available.</p>";

        let synonyms = data[0].meanings[0].synonyms || [];
        let synonymsText = synonyms.length > 0 ? synonyms.join(", ") : "No synonyms available.";

        resultDiv.innerHTML = `
            <h2>${word}</h2>
            <p><strong>Meaning:</strong> ${firstMeaning}</p>
            <p><strong>Examples:</strong> ${exampleText}</p>
            <p><strong>Synonyms:</strong> ${synonymsText}</p>
            <p><strong>Pronunciation:</strong></p> ${audioHTML}
        `;
    } catch (error) {
        resultDiv.innerHTML = "<p>Error fetching data. Try again later.</p>";
    }
}

function voiceSearch() {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    recognition.onresult = function(event) {
        document.getElementById("search-box").value = event.results[0][0].transcript;
        searchWord();
    };
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
