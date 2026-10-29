const Tarefa = require('../models/tarefaModel');

const STATUS = ['pendente', 'andamento', 'finalizado'];

// confere os campos, devolve o erro ou null se estiver tudo certo
function validar(tarefa) {
  if (!tarefa.responsavel || !tarefa.assunto || !tarefa.descricao || !tarefa.dataInicio || !tarefa.dataTermino || !tarefa.status) {
    return 'Campos obrigatórios não preenchidos';
  }
  if (isNaN(Date.parse(tarefa.dataInicio)) || isNaN(Date.parse(tarefa.dataTermino))) {
    return 'Data inválida';
  }
  if (tarefa.dataTermino < tarefa.dataInicio) {
    return 'A data de término não pode ser antes da data de início';
  }
  if (!STATUS.includes(tarefa.status)) {
    return 'Status inválido';
  }
  return null;
}


async function listar(req, res) {
  try {
    const tarefas = await Tarefa.listar();
    res.json(tarefas);
  } catch (erro) {
    console.error('Erro ao listar tarefas:', erro.message);
    res.status(500).json({ erro: 'Não foi possível listar as tarefas' });
  }
}

async function criar(req, res) {
  const tarefa = req.body || {};
  const erroValidacao = validar(tarefa);
  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao });
  }

  try {
    const nova = await Tarefa.criar(tarefa);
    res.status(201).json(nova);
  } catch (erro) {
    console.error('Erro ao criar tarefa:', erro.message);
    res.status(500).json({ erro: 'Não foi possível criar a tarefa' });
  }
}

async function editar(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ erro: 'Id inválido' });
  }

  const tarefa = req.body || {};
  const erroValidacao = validar(tarefa);
  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao });
  }

  try {
    const editada = await Tarefa.editar(id, tarefa);
    if (!editada) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }
    res.json(editada);
  } catch (erro) {
    console.error('Erro ao editar tarefa:', erro.message);
    res.status(500).json({ erro: 'Não foi possível editar a tarefa' });
  }
}

async function excluir(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ erro: 'Id inválido' });
  }

  try {
    const apagou = await Tarefa.excluir(id);
    if (!apagou) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }
    res.status(204).end();
  } catch (erro) {
    console.error('Erro ao excluir tarefa:', erro.message);
    res.status(500).json({ erro: 'Não foi possível excluir a tarefa' });
  }
}


module.exports = { listar, criar, editar, excluir };
