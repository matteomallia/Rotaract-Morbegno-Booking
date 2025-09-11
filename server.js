const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurazione di Supabase
const supabaseUrl = 'https://ncukukeoiflpemjucgih.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jdWt1a2VvaWZscGVtanVjZ2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzIyMTIsImV4cCI6MjA3MDc0ODIxMn0.oSoNqmj2I-_lZ331UTnX8u1TJ1scNOWAKyV1Jkzgesg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Middleware per servire i file statici dalla cartella 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware per leggere il JSON
app.use(express.json());

// Endpoint per la prenotazione
app.post('/api/book', async (req, res) => {
    const { roomType, name, email, phone, district, club, role, occupants } = req.body;

    let slotsToDecrement;
    if (roomType === 'assemblea' || roomType === 'assemblea-pranzo') {
        slotsToDecrement = 1;
    } else {
        // Calcola il numero di occupanti dalla stringa di nomi
        slotsToDecrement = occupants.split(',').length;
    }

    try {
        // Inserisci la prenotazione nella tabella 'bookings'
        const { data: bookingData, error: bookingError } = await supabase
            .from('bookings')
            .insert([
                { 
                    roomType,
                    name, 
                    email, 
                    phone,
                    district,
                    club,
                    role,
                    occupants
                }
            ]);

        // Aggiorna la disponibilità solo se non è un pacchetto con posti illimitati
        if (roomType !== 'assemblea' && roomType !== 'assemblea-pranzo') {
            const { data: availabilityData, error: availabilityError } = await supabase
                .from('availability')
                .update({ available_slots: supabase.sql`available_slots - ${slotsToDecrement}` })
                .eq('room_type', roomType);
        }

        res.status(200).json({ message: 'Iscrizione confermata con successo!' });

    } catch (err) {
        console.error('Errore durante l\'iscrizione:', err);
        res.status(500).json({ error: 'Si è verificato un errore durante la prenotazione.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});