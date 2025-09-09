document.addEventListener('DOMContentLoaded', async () => {
    const availabilityContainer = document.getElementById('availability-container');

    try {
        const response = await fetch('/api/availability');
        if (!response.ok) {
            throw new Error('Errore nella risposta del server');
        }
        const availability = await response.json();

        // Aggiungo il titolo della sezione
        const title = document.createElement('h2');
        title.textContent = 'Disponibilità Stanze';
        availabilityContainer.appendChild(title);

        const rooms = [
            { type: 'single-room', name: 'Stanza Singola' },
            { type: 'double-room', name: 'Stanza Doppia' },
            { type: 'triple-room', name: 'Stanza Tripla' },
            { type: 'quadruple-room', name: 'Stanza Quadrupla' }
        ];

        rooms.forEach(room => {
            const count = availability[room.type] || 0;
            const roomDiv = document.createElement('div');
            roomDiv.classList.add('room');

            const roomTitle = document.createElement('h3');
            roomTitle.textContent = room.name;
            roomDiv.appendChild(roomTitle);

            const status = document.createElement('p');
            if (count > 0) {
                status.textContent = `${count} ${count === 1 ? 'posto' : 'stanze'} disponibile`;
                const button = document.createElement('button');
                button.textContent = 'Prenota ora';
                button.classList.add('btn');
                button.addEventListener('click', () => {
                    window.location.href = `booking.html?room=${room.type}`;
                });
                roomDiv.appendChild(button);
            } else {
                status.textContent = 'Esaurito';
                roomDiv.classList.add('sold-out');
            }
            roomDiv.appendChild(status);

            availabilityContainer.appendChild(roomDiv);
        });

    } catch (error) {
        console.error('Errore nel caricamento della disponibilità:', error);
        availabilityContainer.innerHTML = '<p class="error">Si è verificato un errore nel caricamento della disponibilità delle stanze. Riprova più tardi.</p>';
    }
});