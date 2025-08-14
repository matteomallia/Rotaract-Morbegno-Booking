document.addEventListener('DOMContentLoaded', () => {
    // 1. Legge il tipo di stanza dall'URL
    const params = new URLSearchParams(window.location.search);
    const roomType = params.get('room');

    const form = document.getElementById('booking-form');
    const occupantsGroup = document.getElementById('other-occupants-group');
    const roomTypeInput = document.getElementById('room-type');

    if (roomType) {
        // Assegna il tipo di stanza al campo nascosto del form
        roomTypeInput.value = roomType;

        // 2. Mostra/nasconde il campo per gli altri occupanti
        if (roomType !== 'single-room') {
            occupantsGroup.style.display = 'block';
        }
    } else {
        // Se il tipo di stanza non è specificato, torna alla home
        alert('Tipo di stanza non specificato. Torna alla pagina principale.');
        window.location.href = 'index.html';
    }

    // 3. Gestisce l'invio del modulo
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Raccoglie tutti i dati del form
        const formData = {
            roomType: roomTypeInput.value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            club: document.getElementById('club').value,
            occupants: document.getElementById('occupants').value,
            winePackage: document.getElementById('wine-package').value,
        };
        
        // Invia i dati al server
        fetch('/api/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Prenotazione effettuata con successo! Ti invieremo un’email di conferma.');
                window.location.href = 'index.html'; // Reindirizza alla home
            } else {
                alert('Errore: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Errore durante la prenotazione:', error);
            alert('Si è verificato un errore durante la prenotazione.');
        });
    });
});