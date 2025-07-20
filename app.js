const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(require('cors')());

// 1. ROTAS DA API PRIMEIRO

let dados = { nivel: 0, status: "OK" };
let historico = []; //array

app.get('/status', (req, res) => res.json(dados));

app.post('/update', (req, res) => {
  dados = req.body; //req.body = dados enviados no corpo da requisição (geralmente JSON).

  historico.unshift({ //unshift, insere o novo dado no início da lista (posição 0).O histórico é uma array
    nivel: dados.nivel, //nivel: número recebido.
    status: dados.status, //status: texto atual.
    timestamp:formatarDataHora()//timestamp: horário da atualização (formato ISO, como 2025-07-18T14:30:00.000Z).
  });
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

  console.log('Dados atualizados:', dados);
  res.send('Atualizado');
});

app.get('/historico', (req, res) => {
  res.json(historico);
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

