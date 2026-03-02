document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const resultDisplay = document.getElementById('resultDisplay');
    const historyList = document.getElementById('historyList');
    
    // --- CORE LOGIC ---

    // 1. Text to Binary
    const convertToBinary = () => {
        const text = userInput.value;
        if (!text) return alert("Please enter some text!");

        const binaryResult = text.split('')
            .map(char => {
                const ascii = char.charCodeAt(0);
                return ascii.toString(2).padStart(8, '0');
            })
            .join(' ');

        displayResult(binaryResult);
        addToHistory("Text ➔ Binary", binaryResult.substring(0, 20) + "...");
    };

    // 2. Binary to Text
    const convertToText = () => {
        const binaryInput = userInput.value.trim();
        if (!binaryInput) return alert("Please paste binary code!");

        const binaryArray = binaryInput.split(/\s+/);
        let textResult = "";

        for (let bin of binaryArray) {
            // Validation: Must be 8 bits and only 0 or 1
            if (bin.length !== 8 || !/^[01]+$/.test(bin)) {
                resultDisplay.style.color = "red";
                resultDisplay.innerText = "Error: Invalid binary format. Please enter 8-bit binary separated by spaces.";
                return;
            }
            textResult += String.fromCharCode(parseInt(bin, 2));
        }

        resultDisplay.style.color = "var(--neon-green)";
        displayResult(textResult);
        addToHistory("Binary ➔ Text", textResult.substring(0, 20) + "...");
    };

    // --- FEATURES ---

    const displayResult = (content) => {
        resultDisplay.innerText = content;
    };

    const addToHistory = (type, preview) => {
        let history = JSON.parse(localStorage.getItem('messengerHistory') || '[]');
        history.unshift({ type, preview, time: new Date().toLocaleTimeString() });
        history = history.slice(0, 5); // Keep last 5
        localStorage.setItem('messengerHistory', JSON.stringify(history));
        renderHistory();
    };

    const renderHistory = () => {
        const history = JSON.parse(localStorage.getItem('messengerHistory') || '[]');
        historyList.innerHTML = history.map(item => 
            `<li>[${item.time}] ${item.type}: ${item.preview}</li>`
        ).join('');
    };

    // --- EVENT LISTENERS ---

    document.getElementById('toBinaryBtn').addEventListener('click', convertToBinary);
    document.getElementById('toTextBtn').addEventListener('click', convertToText);

    document.getElementById('clearBtn').addEventListener('click', () => {
        userInput.value = "";
        resultDisplay.innerText = "Waiting for input...";
    });

    document.getElementById('copyBtn').addEventListener('click', () => {
        navigator.clipboard.writeText(resultDisplay.innerText);
        alert("Copied to clipboard!");
    });

    document.getElementById('themeToggle').addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
    });

    document.getElementById('secretModeBtn').addEventListener('click', () => {
        resultDisplay.classList.toggle('hidden-msg');
    });

    // Initialize history
    renderHistory();
});
// Add this inside your DOMContentLoaded event listener
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

clearHistoryBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to delete all conversion history?")) {
        // 1. Remove from Local Storage
        localStorage.removeItem('messengerHistory');
        
        // 2. Clear the UI list
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = "<li style='opacity: 0.5;'>History cleared...</li>";
        
        // Optional: Show a brief notification
        console.log("History Purged.");
    }
});

// Ensure your renderHistory function handles empty states nicely:
const renderHistory = () => {
    const history = JSON.parse(localStorage.getItem('messengerHistory') || '[]');
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
        historyList.innerHTML = "<li style='opacity: 0.5;'>No recent activity.</li>";
        return;
    }

    historyList.innerHTML = history.map(item => 
        `<li>[${item.time}] ${item.type}: ${item.preview}</li>`
    ).join('');
};
const secretModeBtn = document.getElementById('secretModeBtn');
const resultDisplay = document.getElementById('resultDisplay');

