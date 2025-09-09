document.getElementById('bookingForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const roomType = urlParams.get('room');

    const formData = new FormData(event.target);
    const bookingData = {
        roomType: roomType,
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'), // Nuovo campo
        district: formData.get('district'), // Nuovo campo
        club: formData.get('club'),
        role: formData.get('role'), // Nuovo campo
        occupants: formData.get('occupants')
    };

    try {
        const response = await fetch('/api/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (result.success) {
            // Reindirizza alla nuova pagina di riepilogo
            window.location.href = 'riepilogo.html';
        } else {
            alert('Errore: ' + result.message);
        }
    } catch (error) {
        console.error('Errore durante la richiesta:', error);
        alert('Si è verificato un errore durante la prenotazione.');
    }
});