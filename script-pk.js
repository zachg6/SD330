// script-pk.js

// General Navbar and Button Navigation
document.addEventListener("DOMContentLoaded", () => {
    // Navbar buttons navigation
    document.querySelectorAll("button[data-page]").forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("data-page");
            if (page) location.href = page;
        });
    });

    // Check which page is loaded
    const path = window.location.pathname;

    // Lots Page Script
    if (path.includes("lots.html")) {
        fetch('./parking.json')
            .then(response => response.json())
            .then(data => {
                const lotsContainer = document.getElementById('lots-container');
                data.parkingLots.forEach(lot => {
                    const lotCard = document.createElement('div');
                    lotCard.classList.add('lot-card');
                    lotCard.innerHTML = `
                        <img src="${lot.mapImage}" alt="${lot.name}" class="lot-image">
                        <h2>${lot.name}</h2>
                        <p><strong>Location:</strong> ${lot.locationDescription}</p>
                        <p><strong>Total Spaces:</strong> ${lot.totalParkingSpaces}</p>
                        <p><strong>Operating Hours:</strong> ${lot.operatingHours}</p>
                        <p><strong>Notes:</strong> ${lot.notes}</p>
                        <p><strong>Safety Rating:</strong> ${lot.safetyRating}</p>
                        <a href="spaces.html?lot=${encodeURIComponent(lot.name)}" class="view-spaces-btn">View Spaces</a>
                    `;
                    lotsContainer.appendChild(lotCard);
                });
            });
    }

    // Spaces Page Script
    if (path.includes("spaces.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        const lotName = urlParams.get('lot');

        if (lotName) {
            fetch('parking.json')
                .then(response => response.json())
                .then(data => {
                    const lot = data.parkingLots.find(l => l.name === lotName);
                    if (lot) {
                        document.getElementById('lot-name').textContent = lot.name;
                        lot.parkingSpaces.forEach(space => {
                            const spaceCard = document.createElement('div');
                            spaceCard.classList.add('space-card');
                            spaceCard.innerHTML = `
                                <h3>Space ID: ${space.spaceID}</h3>
                                <p><strong>Category:</strong> ${space.category}</p>
                                <p><strong>Status:</strong> ${space.status}</p>
                                <p><strong>Distance to Exit:</strong> ${space.distanceToExit}</p>
                            `;
                            document.getElementById('spaces-container').appendChild(spaceCard);
                        });
                    } else {
                        document.getElementById('spaces-container').innerHTML = "<p>Error: Lot not found.</p>";
                    }
                });
        } else {
            document.getElementById('spaces-container').innerHTML = "<p>Error: No lot specified.</p>";
        }
    }
});
