const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Banco de dados
const db = new sqlite3.Database('./database.db');

// Cria a tabela, se não existir
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  email TEXT,
  serie TEXT,
  celular TEXT,
  endereco TEXT,
  turma TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  senha TEXT
)`);

// Rota de cadastro
app.post('/usuarios', (req, res) => {
  const { nome, email, serie, celular, endereco, turma, cidade, estado, cep, senha } = req.body;
  const stmt = `INSERT INTO usuarios (nome, email, serie, celular, endereco, turma, cidade, estado, cep, senha)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(stmt, [nome, email, serie, celular, endereco, turma, cidade, estado, cep, senha], function(err) {
    if (err) return res.status(500).send({ error: 'Erro ao cadastrar usuário' });
    res.send({ id: this.lastID });
  });
});

// Rota de listagem
app.get('/usuarios', (req, res) => {
  db.all("SELECT * FROM usuarios", [], (err, rows) => {
    if (err) return res.status(500).send({ error: 'Erro ao listar usuários' });
    res.send(rows);
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
