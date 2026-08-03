// Lista de tarefas com localStorage

var form = document.querySelector('form');
var container = document.querySelector('#tarefas');

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

function ligarEventos() {
  var itens = container.getElementsByTagName('li');

  for (var i = 0; i < itens.length; i++) {
    itens[i].onclick = function (ev) {
      var id = Number(this.id);

      // descobre em que posição do array está essa tarefa
      var pos = -1;
      for (var j = 0; j < tarefas.length; j++) {
        if (tarefas[j].id === id) {
          pos = j;
        }
      }

      if (pos === -1) {
        return;
      }

      if (ev.target.className === 'delete') {
        tarefas.splice(pos, 1);
        save();
        mostrarTarefas();
      } else if (ev.target.className === 'check') {
        if (tarefas[pos].check === true) {
          tarefas[pos].check = false;
        } else {
          tarefas[pos].check = true;
        }
        save();
      }
    };
  }
}

function mostrarTarefas() {
  var html = '';

  for (var i = 0; i < tarefas.length; i++) {
    // se a tarefa já estava marcada, o checkbox precisa vir marcado
    var checked = '';
    if (tarefas[i].check === true) {
      checked = 'checked';
    }

    html = html + '<li id="' + tarefas[i].id + '">' +
      '<input type="checkbox" class="check" ' + checked + '>' +
      '<span>' + tarefas[i].nome + '</span>' +
      '<button class="delete">Excluir</button>' +
      '</li>';
  }

  container.innerHTML = html;
  ligarEventos();
}

form.onsubmit = function (e) {
  e.preventDefault();

  var input = form.querySelector('input[type="text"]');
  var nome = input.value.trim();

  // não deixa adicionar tarefa vazia
  if (nome === '') {
    return;
  }

  var novaTarefa = {
    nome: nome,
    id: Date.now(),
    check: false
  };

  tarefas.push(novaTarefa);
  save();
  mostrarTarefas();
  input.value = '';
};

window.onload = mostrarTarefas;