const express = require('express');
const { Client } = require('pg');

const app = express();
const port = 3000;

const db = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect()
  .then(() => console.log('✅ Conectado ao PostgreSQL'))
  .catch(err => console.error('❌ Erro ao conectar:', err));

app.get('/', (req, res) => {
  res.send('🚀 API rodando com sucesso e com deploy automático! hahahahaha');
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});


