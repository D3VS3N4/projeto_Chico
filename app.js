const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(require('cors')());

// 1. ROTAS DA API PRIMEIRO

let dados = { nivel: 0, status: "OK" };

app.get('/status', (req, res) => res.json(dados));

app.post('/update', (req, res) => {
  dados = req.body;
  console.log('Dados atualizados:', dados);
  res.send('Atualizado');
});

// 2. ARQUIVOS ESTÁTICOS DEPOIS

// Servir arquivos estáticos da pasta frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// 3. ROTA PARA O HTML POR ÚLTIMO

// Rota principal para servir o visual.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'visual.html'));
});

// 4. listen() NO FINAL

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));

