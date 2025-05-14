const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Banco de Dados
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.error(err.message);
    else console.log('Conectado ao banco de dados.');
});

// Cria tabela se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT,
        senha TEXT
    )
`);

// Rotas
app.post('/usuarios', (req, res) => {
    const { nome, email, senha } = req.body;
    db.run(`INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`, [nome, email, senha], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, nome, email });
    });
});

app.get('/usuarios', (req, res) => {
    db.all(`SELECT id, nome, email FROM usuarios`, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Start server
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
