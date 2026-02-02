const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const path = require('path'); // Importante para localizar o arquivo HTML

const app = express();
app.use(express.json());
app.use(cors());

// Configuração do Banco de Dados
const client = new Client({
  user: 'lorenzo',
  host: '192.168.0.24',
  database: 'estudos_js',
  password: 'Samara123',
  port: 5432,
});

// Conecta no banco assim que o servidor liga
client.connect()
  .then(() => console.log('🔌 Banco de Dados conectado!'))
  .catch(err => console.error('❌ Erro no banco:', err));

// --- AQUI ESTÁ A ALTERAÇÃO ---
// Rota Principal: Agora entrega o arquivo index.html (o site)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
// -----------------------------

// Rota 2: Lista de Usuários (API que o site consulta)
app.get('/usuarios', async (req, res) => {
  try {
    const resultado = await client.query('SELECT * FROM usuarios');
    res.json(resultado.rows); // Entrega os dados em formato JSON
  } catch (erro) {
    res.status(500).json({ erro: 'Deu ruim ao buscar usuários' });
  }
});

// Rota 3: Criar usuário novo (Para testar via código depois)
app.post('/usuarios', async (req, res) => {
  const { nome } = req.body;
  try {
    const query = "INSERT INTO usuarios (nome) VALUES ($1) RETURNING *";
    const resultado = await client.query(query, [nome]);
    res.json(resultado.rows[0]);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao criar usuário' });
  }
});


// Liga o servidor na porta 3001
app.listen(3001, () => {
  console.log('🔥 Servidor rodando na porta 3001');
});

// Rota 4: Deletar usuário
app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await client.query('DELETE FROM usuarios WHERE id = $1', [id]);
        res.json({ mensagem: 'Usuário removido!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao deletar' });
    }
});

// Rota 5: Editar usuário
app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    try {
        const query = "UPDATE usuarios SET nome = $1 WHERE id = $2 RETURNING *";
        const resultado = await client.query(query, [nome, id]);
        res.json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao editar' });
    }
});