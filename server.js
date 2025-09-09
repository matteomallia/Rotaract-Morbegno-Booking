const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurazione di Supabase con i tuoi dati
const supabaseUrl = 'https://ncukukeoiflpemjucgih.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jdWt1a2VvaWZscGVtanVjZ2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzIyMTIsImV4cCI6MjA3MDc0ODIxMn0.oSoNqmj2I-_lZ331UTnX8u1TJ1scNOWAKyV1Jkzgesg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Configurazione Nodemailer (da aggiornare con i tuoi dati)
const transporter = nodemailer.createTransport({
    host: "smtp.example.com", // Sostituisci con il tuo host SMTP
    port: 587,
    secure: false, 
    auth: {
        user: "tua_email@example.com", // Sostituisci con la tua email
        pass: "tua_password" // Sostituisci con la tua password per app
    }
});

// Middleware per servire i file statici dalla cartella 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware per leggere il JSON
app.use(express.json());

// Endpoint per la prenotazione
app.post('/api/book', async (req, res) => {
    const { roomType, name, email, phone, district, club, role, occupants } = req.body;

    try {
        const { data, error } = await supabase
            .from('bookings')
            .insert([
                { 
                    event_type: roomType,
                    name, 
                    email, 
                    phone,
                    district,
                    club,
                    role,
                    occupants
                }
            ]);

        if (error) {
            throw error;
        }

        // ... [Codice per l'invio dell'email, da configurare in seguito]

        res.status(200).json({ message: 'Iscrizione confermata con successo!' });

    } catch (err) {
        console.error('Errore durante l\'iscrizione:', err);
        res.status(500).json({ error: 'Si è verificato un errore durante la prenotazione.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});