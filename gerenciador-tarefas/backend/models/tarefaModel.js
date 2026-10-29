const pool = require('../db');

// to_char devolve a data como texto, no mesmo formato do input do front
const COLUNAS = `
  id,
  responsavel,
  assunto,
  to_char(data_inicio, 'YYYY-MM-DD"T"HH24:MI')  AS "dataInicio",
  to_char(data_termino, 'YYYY-MM-DD"T"HH24:MI') AS "dataTermino",
  descricao,
  status
`;


async function listar() {
  const resultado = await pool.query(`SELECT ${COLUNAS} FROM tarefas ORDER BY id`);
  return resultado.rows;
}

async function criar(t) {
  const resultado = await pool.query(
    `INSERT INTO tarefas (responsavel, assunto, data_inicio, data_termino, descricao, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${COLUNAS}`,
    [t.responsavel, t.assunto, t.dataInicio, t.dataTermino, t.descricao, t.status]
  );
  return resultado.rows[0];
}

// se o id não existir, não volta nenhuma linha (undefined)
async function editar(id, t) {
  const resultado = await pool.query(
    `UPDATE tarefas
     SET responsavel = $1, assunto = $2, data_inicio = $3, data_termino = $4, descricao = $5, status = $6
     WHERE id = $7
     RETURNING ${COLUNAS}`,
    [t.responsavel, t.assunto, t.dataInicio, t.dataTermino, t.descricao, t.status, id]
  );
  return resultado.rows[0];
}

// rowCount = quantas linhas foram apagadas
async function excluir(id) {
  const resultado = await pool.query('DELETE FROM tarefas WHERE id = $1', [id]);
  return resultado.rowCount > 0;
}


module.exports = { listar, criar, editar, excluir };
