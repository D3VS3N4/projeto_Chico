const express = require('express');
const app = express();

app.use(express.json());
app.use(require('cors')());

let dados = { nivel: 0, status: "OK" };

app.get('/status', (req, res) => res.json(dados));

app.post('/update', (req, res) => {
  dados = req.body;
  console.log('Dados atualizados:', dados);
  res.send('Atualizado');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));

const path = require('path');

// Servir arquivos estáticos da pasta frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Rota principal para servir o visual.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'visual.html'));
});