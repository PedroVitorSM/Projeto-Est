const express = require('express');
const pool = require('./db');


const app = express();
const PORTA = 3000;
app.use(express.json());



const COLUNAS = `
  id,
  responsavel,
  assunto,
  to_char(data_inicio, 'YYYY-MM-DD"T"HH24:MI')  AS "dataInicio",
  to_char(data_termino, 'YYYY-MM-DD"T"HH24:MI') AS "dataTermino",
  descricao,
  status
`;

app.get('/', (req, res) => {
  res.send('olá');
});

app.get('/tarefas', async (req, res) => {
  try {
    const resultado = await pool.query(`SELECT ${COLUNAS} FROM tarefas ORDER BY id`);
    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao listar tarefas:', erro.message);
    res.status(500).json({ erro: 'Não foi possível listar as tarefas' });
  }
});

app.post('/tarefas', async (req, res) => {
  const { responsavel, assunto, dataInicio, dataTermino, descricao } = req.body || {};

  try {
    const resultado = await pool.query(
      `INSERT INTO tarefas (responsavel, assunto, data_inicio, data_termino, descricao)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${COLUNAS}`,
      [responsavel, assunto, dataInicio, dataTermino, descricao]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error('Erro ao criar tarefa:', erro.message);
    res.status(500).json({ erro: 'Não foi possível criar a tarefa' });
  }
});


pool.query('SELECT NOW()')
  .then(resultado => {
    console.log('Banco conectado! Hora no banco:', resultado.rows[0].now);
  })
  .catch(erro => {
    console.error('Erro ao conectar no banco:', erro.message);
  });


app.listen(PORTA, () => {
  console.log(`Servidor subiu em http://localhost:${PORTA}`);
});
