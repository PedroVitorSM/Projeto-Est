// Lista de tarefas com localStorage
// Comitt do codigo incorreto, comittei o codigo de leitura

var form = document.querySelector('#form-tarefa');
var container = document.querySelector('#tarefas');
var erro = document.querySelector("#erro");
var LISTA_STATUS = ['pendente', 'andamento', 'finalizado'];
var tarefas = [];

try {
  var salvo = JSON.parse(localStorage.getItem('tarefas'));

  if (Array.isArray(salvo)) {
    tarefas = salvo;
  }
} catch (e) {
  console.log('sem lista de tarefas');
  tarefas = [];
}


function save() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function migrarTarefa(t) {
  if (t.status) {
    return t;
  }

  var status = 'pendente';
  if (t.check === true) {
    status = 'finalizado';
  }

  return {
    id: t.id,
    responsavel: '',
    dataInicio: '',
    dataTermino: '',
    assunto: t.nome || '',
    descricao: '',
    status: status,
    respostas: []
  };
}

for (var i = 0; i < tarefas.length; i++) {
  tarefas[i] = migrarTarefa(tarefas[i]);
}
save();
function mostrarErro(msg) {
    erro.textContent = msg;
}

function nomeDoStatus(status) {
  if (status === 'andamento') {
    return 'Em andamento';
  }
  if (status === 'finalizado') {
    return 'Finalizado';
  }
  return 'Pendente';
  
}

function montarTarefa(tarefa) {
  var li = document.createElement('li');
  li.className = 'tarefa ' + tarefa.status;


  var assunto = document.createElement('h3');
  assunto.textContent = tarefa.assunto;
  li.appendChild(assunto);

  var responsavel = document.createElement('p');
  responsavel.textContent = 'Responsável: ' + tarefa.responsavel;
  li.appendChild(responsavel);

  var prazo = document.createElement('p');
  prazo.className = 'prazo';
  prazo.textContent = formatarData(tarefa.dataInicio) + ' até ' + formatarData(tarefa.dataTermino);
  li.appendChild(prazo);

  if (tarefa.descricao != '') {
    var descricao = document.createElement('p');
    descricao.textContent = tarefa.descricao;
    descricao.className = 'descricao';
    li.appendChild(descricao);
  }

  var rodape = document.createElement('div');
  rodape.className = 'rodape';

  var troca = document.createElement('select');

  for (var i = 0; i < LISTA_STATUS.length; i++) {
    var opcao = document.createElement('option');
    opcao.value = LISTA_STATUS[i];
    opcao.textContent = nomeDoStatus(LISTA_STATUS[i]);

    if (LISTA_STATUS[i] === tarefa.status) {
        opcao.selected = true;
    }

    troca.appendChild(opcao);
  }

  troca.onchange = function () {
    var pos = acharPosicao(tarefa.id);
    if (pos === -1) {
      return;
    }

    tarefas[pos].status = this.value;
    save();
    mostrarTarefas();
  };

  rodape.appendChild(troca);

  function acharPosicao(id) {
    for (var i = 0; i < tarefas.length; i++) {       // roda ate achar o id
      if (tarefas[i].id === id) {
        return i; // posição do id
      }
    }
    return -1; // rodo tudo e não achou
  }

  var excluir = document.createElement('button');
  excluir.className = 'delete';
  excluir.textContent = 'Excluir';
  excluir.onclick = function () {
    var pos = acharPosicao(tarefa.id);
    if (pos === -1) {
      return;
    }

    tarefas.splice(pos, 1);
    save();
    mostrarTarefas();
  };

  rodape.appendChild(excluir);
  li.appendChild(rodape);
  return li;
}

function formatarData(valor) {
  if (!valor) {
    return ' ';
  }

  var partes = valor.split('T');
  var data = partes[0].split('-');

  return data[2] + ' - ' + data[1] + ' - ' + data[0];
}

function mostrarTarefas() {

  container.textContent = '';

  for (var i = 0; i < tarefas.length; i++) {
    container.appendChild(montarTarefa(tarefas[i]));
  }
}

form.onsubmit = function (e) {
  e.preventDefault();

  var assunto = document.querySelector('#assunto').value;
  var responsavel = document.querySelector('#responsavel').value;
  var diaInicio = document.querySelector('#diaInicio').value;
  var diaTermino = document.querySelector('#diaTermino').value;
  var descricao = document.querySelector('#descricao').value;
  var status = document.querySelector('#status').value;

  if (assunto == '' || responsavel == '' || diaInicio == '' || diaTermino == '' ) {
    mostrarErro('Preencha todos os campos da tarefa.');
    return;
  }

  var novaTarefa = {
    id: Date.now(),
    responsavel: responsavel,
    dataInicio: diaInicio,
    dataTermino: diaTermino,
    assunto: assunto,
    descricao: descricao,
    status: status,
    respostas: []
  };

  tarefas.push(novaTarefa);
  save();
  mostrarTarefas();

  form.reset();
  mostrarErro('');
};

window.onload = mostrarTarefas;

