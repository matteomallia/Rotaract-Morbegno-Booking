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
            if (availability[room] <= 0) {
                const roomElement = document.getElementById(room);
                const button = roomButtons[room];
                
                // Disabilita il pulsante
                button.disabled = true;
                button.textContent = 'Esaurito';
                button.style.backgroundColor = '#ccc';

                // Aggiunge un messaggio di esaurito
                const availabilityText = roomElement.querySelector('p');
                availabilityText.textContent = 'Esaurito';
                availabilityText.style.color = '#d9534f';
            }
        }
    };

    fetch('/api/availability')
        .then(response => response.json())
        .then(data => {
            updateAvailability(data);
        })
        .catch(error => {
            console.error('Errore nel recupero della disponibilità:', error);
        });
});