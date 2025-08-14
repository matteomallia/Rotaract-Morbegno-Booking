const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurazione di Supabase
const supabaseUrl = 'https://ncukukeoiflpemjucgih.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jdWt1a2VvaWZscGVtanVjZ2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzIyMTIsImV4cCI6MjA3MDc0ODIxMn0.oSoNqmj2I-_lZ331UTnX8u1TJ1scNOWAKyV1Jkzgesg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Middleware per servire i file statici dalla cartella 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint per servire la pagina principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint per ottenere la disponibilità delle stanze
app.get('/api/availability', async (req, res) => {
    try {
        const { data: availability, error } = await supabase
            .from('availability')
            .select('*')
            .single();

        if (error) {
            throw error;
        }

        res.json(availability);
    } catch (err) {
        console.error('Errore nella lettura della disponibilità:', err);
        res.status(500).send('Errore nella lettura della disponibilità.');
    }
});

// Endpoint per gestire la prenotazione
app.post('/api/book', async (req, res) => {
    const { roomType, name, email, club, occupants, winePackage } = req.body;

    try {
        const { data: availability, error: readError } = await supabase
            .from('availability')
            .select('*')
            .single();

        if (readError) {
            throw readError;
        }

        if (availability[roomType] > 0) {
            const newAvailability = { ...availability, [roomType]: availability[roomType] - 1 };
            const { error: updateError } = await supabase
                .from('availability')
                .update(newAvailability)
                .eq('id', availability.id);

            if (updateError) {
                throw updateError;
            }

            const { error: bookingError } = await supabase
                .from('bookings')
                .insert([{ roomType, name, email, club, occupants, winePackage }]);

            if (bookingError) {
                throw bookingError;
            }

            res.status(200).json({ success: true, message: 'Prenotazione effettuata con successo!' });
        } else {
            res.status(400).json({ success: false, message: 'Stanza esaurita!' });
        }
    } catch (err) {
        console.error('Errore durante la prenotazione:', err);
        res.status(500).json({ success: false, message: 'Si è verificato un errore durante la prenotazione.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});