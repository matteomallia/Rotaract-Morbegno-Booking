const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware per servire i file statici
app.use(express.static(path.join(__dirname, '')));

// Endpoint per ottenere la disponibilità delle stanze
app.get('/api/availability', (req, res) => {
    fs.readFile('database.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Errore nella lettura del database.');
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});