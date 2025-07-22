const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://franciscomoreira0202:JX8BOG9nzNQe9KkM@cluster0.udrclc3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('🟢 MongoDB conectado!'))
  .catch((err) => console.error('🔴 Erro ao conectar MongoDB:', err));

const Historico = mongoose.model('Historico', new mongoose.Schema({
  nivel: Number,
  status: String,
  timestamp: { type: Date, default: Date.now }
}));

app.use(express.json());
app.use(require('cors')());

  function formatarDataHora() {
    const agora = new Date();

    agora.setHours(agora.getHours() - 3); //Colocar em UTC-3

    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0'); // mês começa do 0
    const ano = String(agora.getFullYear()).slice(-2); // só os dois últimos dígitos

    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const segundos = String(agora.getSeconds()).padStart(2, '0');

    return `${dia}/${mes}/${ano} - ${horas}:${minutos}:${segundos}`;
  }

// 1. ROTAS DA API PRIMEIRO

let dados = { nivel: 0, status: "OK" };
let historico = []; //array

app.get('/status', (req, res) => res.json(dados));

app.post('/update', async (req, res) => {
  dados = req.body; //req.body = dados enviados no corpo da requisição (geralmente JSON).

    const novoItem = {
    nivel: dados.nivel,
    status: dados.status,
    timestamp: new Date()
  };

  try {
    await Historico.create(novoItem);
    console.log('📝 Dado salvo:', novoItem);
    res.send('Atualizado e salvo no banco');
  } catch (err) {
    console.error('Erro ao salvar no MongoDB:', err);
    res.status(500).send('Erro ao salvar');
  }
});

app.get('/historico', async (req, res) => {
  try {
    const registros = await Historico.find().sort({ timestamp: -1 }); // opcional: ordena do mais recente para o mais antigo
    res.json(registros);
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    res.status(500).json({erro:'Erro ao buscar histórico',  detalhes: err.message, stack: err.stack});
  }
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

