document.addEventListener('DOMContentLoaded', async () => {
    const supabaseUrl = 'https://ncukukeoiflpemjucgih.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jdWt1a2VvaWZscGVtanVjZ2ihIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzIyMTIsImV4cCI6MjA3MDc0ODIxMn0.oSoNqmj2I-_lZ331UTnX8u1TJ1scNOWAKyV1Jkzgesg';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

    const bookingModal = document.getElementById('booking-modal');
    const closeButton = document.querySelector('.close-button');
    const bookingButtons = document.querySelectorAll('.book-button');
    const modalContent = document.getElementById('modal-content-inner');

    async function updateRoomCounts() {
        try {
            const { data: availability, error } = await supabase
                .from('availability')
                .select('*');

            if (error) {
                console.error('Errore nel caricamento della disponibilità:', error);
                return;
            }

            if (availability && availability.length > 0) {
                availability.forEach(room => {
                    const countSpan = document.getElementById(`${room.room_type}-count`);
                    if (countSpan) {
                        countSpan.textContent = room.available_slots > 0 ? room.available_slots : 'Esaurito';
                    }
                });
            }

            // Imposta un testo fisso per i pacchetti che non hanno un conteggio
            const assembleaCount = document.getElementById('assemblea-count');
            if (assembleaCount) {
                assembleaCount.textContent = 'Disponibilità illimitata';
            }

            const assembleaPranzoCount = document.getElementById('assemblea-pranzo-count');
            if (assembleaPranzoCount) {
                assembleaPranzoCount.textContent = 'Disponibilità illimitata';
            }

        } catch (err) {
            console.error('Errore nel caricamento della disponibilità:', err);
        }
    }

    // Aggiorna i conteggi all'avvio
    updateRoomCounts();

    bookingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const roomType = button.dataset.roomType;
            let roomName;
            let formHTML;

            switch (roomType) {
                case 'single-room':
                    roomName = 'Stanza Singola';
                    formHTML = getRoomBookingForm();
                    break;
                case 'double-room':
                    roomName = 'Stanza Doppia';
                    formHTML = getRoomBookingForm();
                    break;
                case 'triple-room':
                    roomName = 'Stanza Tripla';
                    formHTML = getRoomBookingForm();
                    break;
                case 'quadruple-room':
                    roomName = 'Stanza Quadrupla';
                    formHTML = getRoomBookingForm();
                    break;
                case 'assemblea':
                    roomName = "Partecipazione all'Assemblea";
                    formHTML = getEventBookingForm();
                    break;
                case 'assemblea-pranzo':
                    roomName = "Assemblea + Pranzo";
                    formHTML = getEventBookingForm();
                    break;
                default:
                    return;
            }

            modalContent.innerHTML = `
                <h2>Iscrizione per: ${roomName}</h2>
                <form id="booking-form">
                    <input type="hidden" name="roomType" value="${roomType}">
                    ${formHTML}
                    <button type="submit" id="submit-button">Invia Iscrizione</button>
                </form>
            `;

            bookingModal.style.display = 'block';

            const bookingForm = document.getElementById('booking-form');
            bookingForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(bookingForm);
                const data = Object.fromEntries(formData.entries());

                try {
                    const response = await fetch('/api/book', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });

                    const result = await response.json();
                    if (!response.ok) {
                        throw new Error(result.error || 'Errore nella prenotazione.');
                    }
                    alert(result.message);
                    bookingModal.style.display = 'none';
                    updateRoomCounts();
                } catch (err) {
                    alert(err.message);
                }
            });
        });
    });

    closeButton.addEventListener('click', () => {
        bookingModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            bookingModal.style.display = 'none';
        }
    });

    function getRoomBookingForm() {
        return `
            <label for="name">Nome e Cognome:</label>
            <input type="text" id="name" name="name" required>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <label for="phone">Telefono:</label>
            <input type="tel" id="phone" name="phone">
            <label for="district">Distretto:</label>
            <input type="text" id="district" name="district" required>
            <label for="club">Club:</label>
            <input type="text" id="club" name="club" required>
            <label for="role">Ruolo:</label>
            <select id="role" name="role">
                <option value="Socio">Socio</option>
                <option value="Socio Onorario">Socio Onorario</option>
                <option value="Ospite">Ospite</option>
            </select>
            <label for="occupants">Numero di Occupanti:</label>
            <input type="number" id="occupants" name="occupants" min="1" required>
        `;
    }

    function getEventBookingForm() {
        return `
            <label for="name">Nome e Cognome:</label>
            <input type="text" id="name" name="name" required>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <label for="phone">Telefono:</label>
            <input type="tel" id="phone" name="phone">
            <label for="district">Distretto:</label>
            <input type="text" id="district" name="district" required>
            <label for="club">Club:</label>
            <input type="text" id="club" name="club" required>
            <label for="role">Ruolo:</label>
            <select id="role" name="role">
                <option value="Socio">Socio</option>
                <option value="Socio Onorario">Socio Onorario</option>
                <option value="Ospite">Ospite</option>
            </select>
        `;
    }
});