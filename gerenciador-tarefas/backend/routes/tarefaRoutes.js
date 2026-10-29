const express = require('express');
const controller = require('../controllers/tarefaController');

const router = express.Router();

// tudo aqui já começa com /tarefas (ver server.js)
router.get('/', controller.listar);
router.post('/', controller.criar);
router.put('/:id', controller.editar);
router.delete('/:id', controller.excluir);

module.exports = router;
