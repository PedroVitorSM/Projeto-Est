const express = require('express');
const pool = require('./db');
const tarefaRoutes = require('./routes/tarefaRoutes');


const app = express();
const PORTA = process.env.PORT || 3000;
app.use(express.json());


app.get('/', (req, res) => {
  res.send('olá');
});

app.use('/tarefas', tarefaRoutes);


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
