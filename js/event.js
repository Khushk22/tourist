document.getElementById("getEvents").addEventListener("click", function () {
    const city = document.getElementById("eventLocation").value.trim();
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    const apiKey = "89UUo0FVzAHDusCnMIxDkaRQ9zAUyKmG";
    const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&apikey=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("API Data:", data);
            const eventsContainer = document.getElementById("eventsResult");

            if (data._embedded && data._embedded.events.length > 0) {
                let eventsHTML = "<h3>Upcoming Events:</h3>";
                data._embedded.events.forEach(event => {
                    eventsHTML += `
                        <div>
                            <h4>${event.name}</h4>
                            <p><strong>Date:</strong> ${event.dates.start.localDate}</p>
                            <p><strong>Venue:</strong> ${event._embedded.venues[0].name}</p>
                            <a href="${event.url}" target="_blank">View Event</a>
                            <hr>
                        </div>
                    `;
                });
                eventsContainer.innerHTML = eventsHTML;
            } else {
                eventsContainer.innerHTML = "<p>No events found for this city.</p>";
            }
        })
        .catch(error => {
            console.error("API Fetch Error:", error);
            document.getElementById("eventsResult").innerHTML = `<p style="color: red;">Error fetching events. Please try again later.</p>`;
        });
});
