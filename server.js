const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware per servire i file statici
app.use(express.static(path.join(__dirname, '')));

// Middleware per leggere il JSON dal body delle richieste POST
app.use(express.json());

// Endpoint per ottenere la disponibilità delle stanze
app.get('/api/availability', (req, res) => {
    fs.readFile('database.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Errore nella lettura del database.');
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint per gestire la prenotazione
app.post('/api/book', (req, res) => {
    const { roomType, name, email, club, occupants, winePackage } = req.body;

    fs.readFile('database.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Errore nella lettura del database.' });
        }

        const availability = JSON.parse(data);

        if (availability[roomType] > 0) {
            availability[roomType]--;

            fs.writeFile('database.json', JSON.stringify(availability, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Errore nell\'aggiornamento del database.' });
                }

                // Salva i dati della prenotazione
                const newBooking = {
                    roomType,
                    name,
                    email,
                    club,
                    occupants,
                    winePackage,
                    timestamp: new Date().toISOString()
                };

                fs.readFile('bookings.json', 'utf8', (err, bookingsData) => {
                    const bookings = err ? [] : JSON.parse(bookingsData);
                    bookings.push(newBooking);

                    fs.writeFile('bookings.json', JSON.stringify(bookings, null, 2), (err) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: 'Errore nel salvataggio della prenotazione.' });
                        }

                        res.status(200).json({ success: true, message: 'Prenotazione effettuata con successo!' });
                    });
                });
            });
        } else {
            res.status(400).json({ success: false, message: 'Stanza esaurita!' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});