// Initialize global variables
let isPowerOn = false;
let is24HourFormat = false;
let timerInterval;
let fridgeTemp = 35; // Default fridge temperature in Fahrenheit
let freezerTemp = 0; // Default freezer temperature in Fahrenheit
let isCelsius = false; // Track if the display is in Celsius

// Load audio files
const tvSound = new Audio('tv_sound.mp3');
const alarmEndSound = new Audio('alarm_end.mp3');
const streamMusic = new Audio('stream_music.mp3');
let isMusicPlaying = false; // Track if music is playing

// Predefined weather statuses for random selection
const weatherOptions = [
    { description: "Sunny", temperature: 75 },
    { description: "Cloudy", temperature: 68 },
    { description: "Rainy", temperature: 60 },
    { description: "Snowy", temperature: 32 },
    { description: "Windy", temperature: 55 }
];

// Conversion functions
function fahrenheitToCelsius(f) {
    return Math.round((f - 32) * 5 / 9);
}

function celsiusToFahrenheit(c) {
    return Math.round((c * 9 / 5) + 32);
}

// Function to update clock
function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    clockElement.textContent = is24HourFormat ? `${String(hours).padStart(2, '0')}:${minutes}` : `${hours % 12 || 12}:${minutes} ${ampm}`;
}
setInterval(updateClock, 1000);
document.getElementById('clock').addEventListener('click', () => {
    is24HourFormat = !is24HourFormat;
    updateClock();
});

// Function to display a random weather status and current fridge/freezer temps on home screen
function displayHomeScreenInfo() {
    const weatherDisplay = document.getElementById('tempDisplay');
    const randomWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
    const displayedFridgeTemp = isCelsius ? fahrenheitToCelsius(fridgeTemp) : fridgeTemp;
    const displayedFreezerTemp = isCelsius ? fahrenheitToCelsius(freezerTemp) : freezerTemp;
    const displayedWeatherTemp = isCelsius ? fahrenheitToCelsius(randomWeather.temperature) : randomWeather.temperature;
    const tempUnit = isCelsius ? '°C' : '°F';

    weatherDisplay.style.fontSize = '0.8em';
    weatherDisplay.innerHTML = `Weather: ${randomWeather.description}, ${displayedWeatherTemp}${tempUnit}<br>Fridge: ${displayedFridgeTemp}${tempUnit}<br>Freezer: ${displayedFreezerTemp}${tempUnit}`;
}

// Power Button - toggles power, color change, and displays weather and temp info on home screen when powered on
document.getElementById('onOffBtn').addEventListener('click', () => {
    isPowerOn = !isPowerOn;
    const powerButton = document.getElementById('onOffBtn');
    powerButton.classList.toggle('power-on', isPowerOn);
    powerButton.classList.toggle('power-off', !isPowerOn);
    document.getElementById('homeScreen').style.display = isPowerOn ? 'block' : 'none';
    document.getElementById('homeScreenBtn').style.display = isPowerOn ? 'block' : 'none';
    if (isPowerOn) displayHomeScreenInfo();
    if (!isPowerOn) {
        document.getElementById('screenContent').style.display = 'none';
        stopAllSounds();
    }
});

// Home Button - clears content, returns to the home screen, and stops all sounds
document.getElementById('homeScreenBtn').addEventListener('click', () => {
    displayHomeScreen();
    stopAllSounds();
});

// Stop all sounds function
function stopAllSounds() {
    tvSound.pause();
    tvSound.currentTime = 0;
    alarmEndSound.pause();
    alarmEndSound.currentTime = 0;
    streamMusic.pause();
    streamMusic.currentTime = 0;
    isMusicPlaying = false;
}

// Helper functions to display content on `screenContent`
function displayHomeScreen() {
    document.getElementById('homeScreen').style.display = 'block';
    document.getElementById('screenContent').style.display = 'none';
    document.getElementById('screenContent').innerHTML = ''; // Clear content
    displayHomeScreenInfo(); // Ensure home screen info is refreshed
}

function displayContent(contentHtml, buttonName) {
    console.log(`Displaying content for: ${buttonName}`);
    document.getElementById('homeScreen').style.display = 'none';
    const screenContent = document.getElementById('screenContent');
    screenContent.style.display = 'flex';
    screenContent.style.backgroundColor = 'black'; // Set black background
    screenContent.innerHTML = contentHtml;
}

// Peek Inside Button - shows fridge interior image
document.getElementById('viewInsideBtn').addEventListener('click', () => {
    displayContent(`<img src="https://www.mrappliance.com/us/en-us/mr-appliance/_assets/expert-tips/images/mra-blog-how-to-properly-store-a-refrigerator-in-your-garage.webp" alt="Inside Fridge">`, "Peek Inside");
});

// Web Browser Button - shows browser image
document.getElementById('launchBrowserBtn').addEventListener('click', () => {
    displayContent(`<img src="https://searchengineland.com/wp-content/seloads/2024/09/Google-Search-on-a-mobile-device.png.webp" alt="Web Browser">`, "Web Browser");
});

// Streaming Button - displays options for YouTube, Netflix, and Music
document.getElementById('launchMediaBtn').addEventListener('click', () => {
    displayContent(`
        <div class="content">
            <button id="youtubeBtn" class="btn">YouTube</button>
            <button id="netflixBtn" class="btn">Netflix</button>
            <button id="musicBtn" class="btn">Music</button>
        </div>
    `, "Streaming");
    document.getElementById('youtubeBtn').addEventListener('click', () => {
        displayContent(`<img src="https://cdn.vox-cdn.com/thumbor/b36noYT2bfb68KwmdP4U8bo16hM=/0x0:1848x1036/1400x788/filters:focal(688x471:689x472)/cdn.vox-cdn.com/uploads/chorus_asset/file/19353488/Screen_Shot_2019_11_06_at_5.04.08_PM.png" alt="YouTube">`, "YouTube");
        stopAllSounds();
        tvSound.play(); // Play TV sound
    });
    document.getElementById('netflixBtn').addEventListener('click', () => {
        displayContent(`<img src="https://static01.nyt.com/images/2020/02/06/arts/06netflix/06netflix-articleLarge.jpg?quality=75&auto=webp&disable=upscale" alt="Netflix">`, "Netflix");
        stopAllSounds();
        tvSound.play(); // Play TV sound
    });
    document.getElementById('musicBtn').addEventListener('click', () => {
        displayContent(`
            <div style="font-size: 3em; text-align: center;">
                🎵<br>
                <button id="toggleMusicBtn" class="btn">Play/Pause Music</button>
            </div>
        `, "Music");

        // Toggle play/pause when button is clicked
        document.getElementById('toggleMusicBtn').addEventListener('click', () => {
            if (isMusicPlaying) {
                streamMusic.pause();
            } else {
                streamMusic.play();
            }
            isMusicPlaying = !isMusicPlaying;
        });

        stopAllSounds(); // Ensure no other sound is playing
        isMusicPlaying = true;
        streamMusic.play(); // Start music by default
    });
});

// Settings and Temp Button - allows temperature adjustments and unit switching
document.getElementById('settingsBtn').addEventListener('click', () => {
    displayContent(`
        <div class="temp-menu">
            <div class="temp-control">
                <span id="fridgeTempDisplay">Fridge: ${fridgeTemp}${isCelsius ? '°C' : '°F'}</span>
                <button id="fridgeUpBtn" class="arrow-btn">▲</button>
                <button id="fridgeDownBtn" class="arrow-btn">▼</button>
            </div>
            <div class="temp-control">
                <span id="freezerTempDisplay">Freezer: ${freezerTemp}${isCelsius ? '°C' : '°F'}</span>
                <button id="freezerUpBtn" class="arrow-btn">▲</button>
                <button id="freezerDownBtn" class="arrow-btn">▼</button>
            </div>
            <button id="toggleUnitsBtn" class="btn">Toggle to ${isCelsius ? 'Imperial' : 'Metric'}</button>
            <div id="unitToggleMessage" style="margin-top: 10px; font-size: 0.8em; color: red; display: none;">Click Home to reflect changes</div>
        </div>
    `, "Settings and Temp");

    document.getElementById('fridgeUpBtn').addEventListener('click', () => updateTemperature('fridge', 1));
    document.getElementById('fridgeDownBtn').addEventListener('click', () => updateTemperature('fridge', -1));
    document.getElementById('freezerUpBtn').addEventListener('click', () => updateTemperature('freezer', 1));
    document.getElementById('freezerDownBtn').addEventListener('click', () => updateTemperature('freezer', -1));

    // Toggle units button functionality
    document.getElementById('toggleUnitsBtn').addEventListener('click', () => {
        isCelsius = !isCelsius;
        is24HourFormat = isCelsius; // Use 24-hour format in metric
        updateClock();
        displayHomeScreenInfo();
        document.getElementById('toggleUnitsBtn').textContent = `Toggle to ${isCelsius ? 'Imperial' : 'Metric'}`;
        
        // Show the "Click Home to reflect changes" message
        const unitToggleMessage = document.getElementById('unitToggleMessage');
        unitToggleMessage.style.display = 'block';
        
        // Hide the message after a few seconds
        setTimeout(() => {
            unitToggleMessage.style.display = 'none';
        }, 3000);
    });
});

function updateTemperature(type, delta) {
    if (type === 'fridge') {
        fridgeTemp += delta;
        document.getElementById('fridgeTempDisplay').textContent = `Fridge: ${fridgeTemp}${isCelsius ? '°C' : '°F'}`;
    } else {
        freezerTemp += delta;
        document.getElementById('freezerTempDisplay').textContent = `Freezer: ${freezerTemp}${isCelsius ? '°C' : '°F'}`;
    }
    displayHomeScreenInfo();
}

// Timer Button - allows countdown with minutes and seconds
document.getElementById('timerBtn').addEventListener('click', () => {
    displayContent(`
        <div class="content">
            <input type="number" id="timerMinutesInput" placeholder="Minutes" min="0" style="width: 80px;">
            <input type="number" id="timerSecondsInput" placeholder="Seconds" min="0" max="59" style="width: 80px;">
            <button id="startTimerBtn" class="btn">Start Timer</button>
            <div id="countdownDisplay"></div>
        </div>
    `, "Timer");

    document.getElementById('startTimerBtn').addEventListener('click', startTimer);
});

function startTimer() {
    const minutes = parseInt(document.getElementById('timerMinutesInput').value) || 0;
    const seconds = parseInt(document.getElementById('timerSecondsInput').value) || 0;
    let totalSecondsRemaining = minutes * 60 + seconds;
    
    if (totalSecondsRemaining <= 0) return;

    clearInterval(timerInterval);
    document.getElementById('countdownDisplay').textContent = ''; // Clear previous "Time is up!" message

    timerInterval = setInterval(() => {
        const displayMinutes = Math.floor(totalSecondsRemaining / 60);
        const displaySeconds = totalSecondsRemaining % 60;
        document.getElementById('countdownDisplay').textContent = `${String(displayMinutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;
        totalSecondsRemaining--;

        if (totalSecondsRemaining < 0) {
            clearInterval(timerInterval);
            document.getElementById('countdownDisplay').textContent = "Time is up!";
            stopAllSounds();
            alarmEndSound.play(); // Play alarm end sound
        }
    }, 1000);
}

// Initialize grocery list with memory support and default items
let defaultGroceryList = ["Milk", "Eggs", "Bread", "Butter", "Cheese"];
let groceryList = JSON.parse(localStorage.getItem('groceryList')) || [...defaultGroceryList];

// Shopping List Button - shows list with ability to add items, reset list, and save to localStorage
document.getElementById('shoppingListBtn').addEventListener('click', () => {
    displayContent(`
        <div class="content">
            <ul id="itemList">${groceryList.map(item => `<li>${item}</li>`).join('')}</ul>
            <input type="text" id="itemInput" placeholder="Add an item">
            <button id="addItemBtn" class="btn">Add</button>
            <button id="resetListBtn" class="btn">Reset</button>
        </div>
    `, "Shopping List");

    document.getElementById('addItemBtn').addEventListener('click', addItem);
    document.getElementById('resetListBtn').addEventListener('click', resetList);
});

function addItem() {
    const itemInput = document.getElementById('itemInput');
    const itemText = itemInput.value.trim();
    if (itemText === '') return;

    groceryList.push(itemText);
    localStorage.setItem('groceryList', JSON.stringify(groceryList));

    const itemList = document.getElementById('itemList');
    const newItem = document.createElement('li');
    newItem.textContent = itemText;
    itemList.appendChild(newItem);
    itemInput.value = '';
}

function resetList() {
    groceryList = [...defaultGroceryList];
    localStorage.setItem('groceryList', JSON.stringify(groceryList));

    const itemList = document.getElementById('itemList');
    itemList.innerHTML = groceryList.map(item => `<li>${item}</li>`).join('');
}
