const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurazione di Supabase (usa le tue chiavi)
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

// Endpoint per la dashboard (può essere accessibile solo tramite API)
app.get('/api/bookings', async (req, res) => {
    try {
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(bookings);
    } catch (err) {
        console.error('Errore nel recupero delle prenotazioni:', err);
        res.status(500).send('Errore del server.');
    }
});

// Endpoint per la prenotazione
app.post('/api/book', async (req, res) => {
    const { roomType, name, email, phone, district, club, role, occupants } = req.body;
    let room_id;

    // Logica per gestire i diversi tipi di prenotazione
    switch (roomType) {
        case 'single-room':
            room_id = 1;
            break;
        case 'double-room':
            room_id = 2;
            break;
        case 'triple-room':
            room_id = 3;
            break;
        case 'quadruple-room':
            room_id = 4;
            break;
        case 'assemblea':
            room_id = 5; // Un nuovo ID per l'Assemblea
            break;
        case 'assemblea-pranzo':
            room_id = 6; // Un nuovo ID per Assemblea + Pranzo
            break;
        default:
            return res.status(400).json({ error: 'Tipo di stanza/opzione non valido.' });
    }

    try {
        // ... [Il tuo codice per salvare la prenotazione nel database]
    } catch (err) {
        console.error('Errore durante l\'iscrizione:', err);
        res.status(500).json({ error: 'Si è verificato un errore durante la prenotazione.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});