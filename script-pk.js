document.addEventListener("DOMContentLoaded", () => {
    // General: Navbar button navigation
    document.querySelectorAll("button[data-page]").forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("data-page");
            if (page) location.href = page;
        });
    });

    // Lots Page: Handle "View Spaces" buttons
    if (window.location.pathname.includes("lots.html")) {
        const lotsContainer = document.getElementById("lots-container");

        fetch('./parking.json')
            .then(response => response.json())
            .then(data => {
                // Populate parking lot cards without images, showing initials or code names
                data.parkingLots.forEach(lot => {
                    const lotCard = document.createElement('div');
                    lotCard.classList.add('lot-card');
                    const lotCode = lot.name.match(/\b\w/g).join('').toUpperCase(); // Extract initials
                    lotCard.innerHTML = `
                        <h2>${lotCode}</h2>
                        <p><strong>Full Name:</strong> ${lot.name}</p>
                        <p><strong>Location:</strong> ${lot.locationDescription}</p>
                        <p><strong>Total Spaces:</strong> ${lot.totalParkingSpaces}</p>
                        <p><strong>Operating Hours:</strong> ${lot.operatingHours}</p>
                        <p><strong>Notes:</strong> ${lot.notes}</p>
                        <p><strong>Safety Rating:</strong> ${lot.safetyRating}</p>
                        <button class="view-spaces-btn" data-lot-name="${lot.name}">View Spaces</button>
                    `;
                    lotsContainer.appendChild(lotCard);
                });

                // Add event listener for View Spaces buttons
                document.querySelectorAll(".view-spaces-btn").forEach(button => {
                    button.addEventListener("click", event => {
                        const lotName = event.target.getAttribute("data-lot-name");
                        if (lotName !== "North End Housing Lot") {
                            event.preventDefault();
                            location.href = "404.html";
                        } else {
                            location.href = `spaces.html?lot=${encodeURIComponent(lotName)}`;
                        }
                    });
                });
            });
    }

    // Spaces Page: Display all spaces
    if (window.location.pathname.includes("spaces.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        const spacesContainer = document.getElementById("spaces-container");

        fetch('./parking.json')
            .then(response => response.json())
            .then(data => {
                const lotName = urlParams.get('lot');
                spacesContainer.innerHTML = ""; // Clear existing content

                if (lotName) {
                    const selectedLot = data.parkingLots.find(lot => lot.name === lotName);
                    if (selectedLot && selectedLot.parkingSpaces) {
                        selectedLot.parkingSpaces.forEach(space => {
                            const spaceCard = document.createElement('div');
                            spaceCard.classList.add('space-card');
                            spaceCard.innerHTML = `
                                <h3>Space ID: ${space.spaceID}</h3>
                                <p><strong>Category:</strong> ${space.category}</p>
                                <p><strong>Status:</strong> ${space.status}</p>
                                <p><strong>Distance to Exit:</strong> ${space.distanceToExit}</p>
                            `;
                            spacesContainer.appendChild(spaceCard);
                        });
                    } else {
                        spacesContainer.innerHTML = "<p>No spaces available for this lot.</p>";
                    }
                } else {
                    // If no lot specified, list all spaces across all lots
                    data.parkingLots.forEach(lot => {
                        if (lot.parkingSpaces) {
                            lot.parkingSpaces.forEach(space => {
                                const spaceCard = document.createElement('div');
                                spaceCard.classList.add('space-card');
                                spaceCard.innerHTML = `
                                    <h3>Space ID: ${space.spaceID}</h3>
                                    <p><strong>Category:</strong> ${space.category}</p>
                                    <p><strong>Status:</strong> ${space.status}</p>
                                    <p><strong>Distance to Exit:</strong> ${space.distanceToExit}</p>
                                    <p><strong>Lot Name:</strong> ${lot.name}</p>
                                `;
                                spacesContainer.appendChild(spaceCard);
                            });
                        }
                    });
                }
            });
    }
});