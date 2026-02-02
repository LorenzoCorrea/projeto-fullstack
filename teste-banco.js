const { Client } = require('pg');

const client = new Client({
  user: 'lorenzo',
  host: '192.168.0.24', // O IP do seu Zima
  database: 'estudos_js',
  password: 'Samara123',
  port: 5432,
});

async function testarConexao() {
  try {
    console.log('⏳ Batendo na porta do Banco de Dados...');
    await client.connect();
    console.log('✅ SUCESSO! O VS Code do Server conectou no Postgres.');
    
    // Vamos fazer um INSERT de teste na tabela 'usuarios'
    const insertQuery = "INSERT INTO usuarios (nome) VALUES ($1) RETURNING *";
    const res = await client.query(insertQuery, ['Lorenzo Dev']);
    
    console.log('📝 Usuário inserido:', res.rows[0]);
    
  } catch (erro) {
    console.error('❌ Ops, deu erro:', erro.message);
  } finally {
    await client.end();
  }
}

testarConexao();