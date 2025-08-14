const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer'); // Aggiunto Nodemailer
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurazione di Supabase
const supabaseUrl = 'https://ncukukeoiflpemjucgih.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jdWt1a2VvaWZscGVtanVjZ2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzIyMTIsImV4cCI6MjA3MDc0ODIxMn0.oSoNqmj2I-_lZ331UTnX8u1TJ1scNOWAKyV1Jkzgesg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Configurazione Nodemailer (da aggiornare con i tuoi dati)
const transporter = nodemailer.createTransport({
    host: "smtp.example.com", // Es: smtp.gmail.com per Gmail
    port: 587,
    secure: false, // true per 465, false per altre porte
    auth: {
        user: "tua_email@example.com", // La tua email
        pass: "tua_password" // La tua password o password per app
    }
});

// Middleware per servire i file statici dalla cartella 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware per leggere il JSON dal body delle richieste POST
app.use(express.json());

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
    const { roomType, name, email, phone, district, club, role, occupants } = req.body;

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
                .insert([{ roomType, name, email, phone, district, club, role, occupants }]);

            if (bookingError) {
                throw bookingError;
            }

            // Invio dell'email di conferma
            const mailOptions = {
                from: '"Il tuo Nome" <tua_email@example.com>', // La tua email
                to: email, // L'email del prenotante
                subject: 'Conferma di Prenotazione: Morbegno tra le Montagne',
                html: `
                    <h1>Titolo dell'Evento: Morbegno tra le Montagne - Weekend in stile Jumanji</h1>
                    <p><strong>Data:</strong> Sabato 4 e Domenica 5 ottobre 2025</p>
                    <p><strong>Luogo:</strong> Hotel la Brace a Sondrio (ospiterà i momenti conviviali e l’assemblea) e Morbegno (Tour cantine)</p>
                    
                    <h2>Programma dell'Evento:</h2>
                    <p><strong>🗓 Sabato 4 ottobre – Inizio dell’avventura</strong></p>
                    <ul>
                        <li>🏨 Arrivo e sistemazione in hotel</li>
                        <li>🚐 Partenza per il tour “Morbegno in Cantina”</li>
                        <li>🍽️ Cena serale all’Hotel La Brace</li>
                    </ul>
                    <p><strong>🗓 Domenica 5 ottobre – Missione finale</strong></p>
                    <ul>
                        <li>☕ Colazione in hotel</li>
                        <li>🗂️ Prima Assemblea distrettuale</li>
                        <li>🍴 Pranzo di chiusura in hotel per festeggiare la riuscita della missione</li>
                    </ul>
                    
                    <h2>Informazioni Aggiuntive:</h2>
                    <p>I pass ufficiali di Morbegno in Cantina saranno comunicati a inizio settembre con i dettagli dei giri inclusi. Verrà richiesta un'integrazione al prezzo indicato nel seguente form così da procedere all'acquisto da parte del nostro team del pass selezionato.</p>
                    <p><strong>‼️Attenzione:</strong> Il pagamento dovrà pervenire entro 14 giorni dalla compilazione del form; in caso contrario la tua iscrizione verrà automaticamente annullata e ti invitiamo ad unirti alla prossima wave.</p>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log('Email di conferma inviata con successo');
            } catch (emailError) {
                console.error('Errore durante l\'invio dell\'email:', emailError);
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