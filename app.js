document.addEventListener('DOMContentLoaded', () => {
    const singleRoomButton = document.getElementById('single-room').querySelector('.book-button');
    const doubleRoomButton = document.getElementById('double-room').querySelector('.book-button');
    const tripleRoomButton = document.getElementById('triple-room').querySelector('.book-button');
    const quadrupleRoomButton = document.getElementById('quadruple-room').querySelector('.book-button');

    const roomButtons = {
        'single-room': singleRoomButton,
        'double-room': doubleRoomButton,
        'triple-room': tripleRoomButton,
        'quadruple-room': quadrupleRoomButton,
    };

    const updateAvailability = (availability) => {
        for (const room in availability) {
            const roomElement = document.getElementById(room);
            const button = roomButtons[room];
            const availabilityText = roomElement.querySelector('p');
            
            if (availability[room] <= 0) {
                button.disabled = true;
                button.textContent = 'Esaurito';
                button.style.backgroundColor = '#ccc';
                availabilityText.textContent = 'Esaurito';
                availabilityText.style.color = '#d9534f';
            } else {
                availabilityText.textContent = `${availability[room]} post${availability[room] === 1 ? 'o' : 'i'} disponibile${availability[room] === 1 ? '' : 'i'}`;
                button.disabled = false;
                button.textContent = 'Prenota ora';
                button.style.backgroundColor = '#f7a81c';
                availabilityText.style.color = '#333';
            }
        }
    };

    // Funzione per reindirizzare l'utente al form
    const redirectToBooking = (roomType) => {
        window.location.href = `booking.html?room=${roomType}`;
    };

    // Aggiunge un ascoltatore di eventi per ogni pulsante
    for (const room in roomButtons) {
        roomButtons[room].addEventListener('click', () => {
            redirectToBooking(room);
        });
    }

    // Carica la disponibilità iniziale all'avvio della pagina
    fetch('/api/availability')
        .then(response => response.json())
        .then(data => {
            updateAvailability(data);
        })
        .catch(error => {
            console.error('Errore nel recupero della disponibilità:', error);
        });
});