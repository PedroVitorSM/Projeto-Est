// Lista de tarefas com localStorage

var form = document.querySelector('#form-tarefa');
var container = document.querySelector('#tarefas');
var erro = document.querySelector("#erro");

var LISTA_STATUS = ['pendente', 'andamento', 'finalizado'];

// recupera o que já estava salvo no navegador
// se o que tiver salvo não for um json válido o parse estoura e a página
// inteira para de funcionar, por isso o try/catch aqui
var tarefas = [];

try {
  var salvo = JSON.parse(localStorage.getItem('tarefas'));

  if (Array.isArray(salvo)) {
    tarefas = salvo;
  }
} catch (e) {
  console.log('não consegui ler as tarefas salvas, começando com a lista vazia');
  tarefas = [];
}


function save() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

// antes a tarefa era só {id, nome, check}. agora tem os campos completos,
// então tudo que estiver no formato antigo precisa ser convertido na hora de
// abrir, senão a listagem nova quebra tentando ler campo que não existe.
// quem não tem status é do formato velho
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

// grava de volta já convertido, pra não precisar migrar de novo toda vez
save();

function mostrarErro(msg) {
    erro.textContent = msg;
}

// descobre em que posição do array está a tarefa
function acharPosicao(id) {
  for (var i = 0; i < tarefas.length; i++) {
    if (tarefas[i].id === id) {
      return i;
    }
  }

  return -1;
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

// monta o <li> de uma tarefa.
// deixei numa função separada de propósito: como o onclick lá de baixo usa a
// variável tarefa, se isso ficasse solto dentro do for todos os botões iam
// mexer na última tarefa da lista (o var não cria escopo por volta)
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

  // só mostra a descrição se a pessoa escreveu alguma coisa
  if (tarefa.descricao != '') {
    var descricao = document.createElement('p');
    descricao.textContent = tarefa.descricao;
    descricao.className = 'descricao';
    li.appendChild(descricao);
  }

  var rodape = document.createElement('div');
  rodape.className = 'rodape';

  // antes tinha um checkbox pra marcar como concluída. como agora são três
  // status e não dois, virou um select aqui na própria listagem
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

// o datetime-local devolve o texto no formato "2026-08-03T14:30".
// guardo exatamente assim (dá pra ordenar e comparar direto como texto,
// porque vem ano/mês/dia) e converto pro formato br só aqui, na hora de exibir
function formatarData(valor) {
  if (!valor) {
    return 'não informado';
  }

  var partes = valor.split('T');
  var data = partes[0].split('-');
  // var hora = partes[1].split(':');   nao precisou, a hora ja vem certa

  return data[2] + '/' + data[1] + '/' + data[0] + ' às ' + partes[1];
}

function mostrarTarefas() {
  // uso textContent e createElement no lugar de montar uma string com innerHTML.
  // além de ficar mais organizado, o textContent trata o que a pessoa digitou
  // como texto puro, então não tem como alguém salvar uma tag html no assunto
  // da tarefa e ela ser executada quando a lista aparecer na tela
  container.textContent = '';

  for (var i = 0; i < tarefas.length; i++) {
    container.appendChild(montarTarefa(tarefas[i]));
  }
}

form.onsubmit = function (e) {
  e.preventDefault();

  var assunto = document.querySelector('#assunto').value.trim();
  var responsavel = document.querySelector('#responsavel').value.trim();
  var dataInicio = document.querySelector('#dataInicio').value;
  var dataTermino = document.querySelector('#dataTermino').value;
  var descricao = document.querySelector('#descricao').value.trim();
  var status = document.querySelector('#status').value;

  if (assunto == '') {
    mostrarErro('Preencha o assunto da tarefa.');
    return;
  }

  if (responsavel == '') {
    mostrarErro('Preencha o responsável pela tarefa.');
    return;
  }

  // as duas datas são texto no mesmo formato, então dá pra comparar assim mesmo
  if (dataInicio != '' && dataTermino != '' && dataTermino < dataInicio) {
    mostrarErro('A data de término não pode ser antes da data de início.');
    return;
  }

  var novaTarefa = {
    id: Date.now(),
    responsavel: responsavel,
    dataInicio: dataInicio,
    dataTermino: dataTermino,
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
