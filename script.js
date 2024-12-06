// Include Navbar
fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar').innerHTML = data;
    });

// Include Footer
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });

// Fetch and display parking lots
if (document.URL.includes("lots.html")) {
    fetch('parking.json')
        .then(response => response.json())
        .then(data => {
            const lotsDiv = document.getElementById('parking-lots');
            data.parkingLots.forEach(lot => {
                const lotInfo = document.createElement('div');
                lotInfo.className = 'card';
                lotInfo.innerHTML = `
                    <h2>${lot.name}</h2>
                    <p>${lot.locationDescription}</p>
                    <p>Total Spaces: ${lot.totalParkingSpaces}</p>
                    <a href="spaces.html?lot=${encodeURIComponent(lot.name)}">View Spaces</a>
                `;
                lotsDiv.appendChild(lotInfo);
            });
        });
}

// Fetch and display spaces for a lot
if (document.URL.includes("spaces.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const lotName = urlParams.get('lot');
    fetch('parking.json')
        .then(response => response.json())
        .then(data => {
            const spacesDiv = document.getElementById('parking-spaces');
            const lot = data.parkingLots.find(lot => lot.name === lotName);
            if (lot && lot.parkingSpaces) {
                lot.parkingSpaces.forEach(space => {
                    const spaceInfo = document.createElement('div');
                    spaceInfo.className = 'card';
                    spaceInfo.innerHTML = `
                        <h3>Space ID: ${space.spaceID}</h3>
                        <p>Category: ${space.category}</p>
                        <p>Status: ${space.status}</p>
                        <p>Distance to Exit: ${space.distanceToExit}</p>
                    `;
                    spacesDiv
::contentReference[oaicite:1]{index=1}
 
