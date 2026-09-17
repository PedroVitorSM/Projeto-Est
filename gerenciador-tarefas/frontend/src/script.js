// Lista de tarefas com localStorage

var form = document.getElementById('form-tarefa');
var container = document.getElementById('tarefas');
var LISTA_STATUS = [{id: 'pendente', slug: 'Pendente'}, {id: 'andamento', slug: 'Em Andamento'}, {id: 'finalizado', slug: 'Finalizado'}];
var tarefas = [];

// recupera o que já estava salvo no navegador
try {
  var salvo = JSON.parse(localStorage.getItem('tarefas'));
  if (Array.isArray(salvo)) {
    tarefas = salvo.map(migrarTarefa);
    save();
  }
} catch (e) {
  sendErro('Não foi possível ler as tarefas salvas.');
}

/*Storage Save*/
function save() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function sendErro(msg) {
  document.getElementById('erro').textContent = msg;
}

/*Converte tarefas do formato antigo { id, nome, check }*/
function migrarTarefa(t) {
  if (t.status) {
    return t;
  }
  return {
    id: t.id,
    responsavel: '',
    assunto: t.nome || '',
    dataInicio: '',
    dataTermino: '',
    descricao: '',
    status: t.check === true ? 'finalizado' : 'pendente'
  };
}

/*Adiciona uma nova tarefa*/
function addTarefa() {
  let responsavel = form.querySelector('#responsavel').value.trim();
  let assunto = form.querySelector('#assunto').value.trim();
  let dataInicio = form.querySelector('#diaInicio').value.trim();
  let dataTermino = form.querySelector('#diaTermino').value.trim();
  let descricao = form.querySelector('#descricao').value.trim();
  let status = form.querySelector('#status').value.trim();
  if (responsavel === '' || assunto === '' || dataInicio === '' || dataTermino === '' || descricao === '' || status === '') {
    sendErro('Campos obrigatórios não preenchidos');
    return;
  }
  if (dataTermino < dataInicio) {
    sendErro('A data de término não pode ser antes da data de início');
    return;
  }
  var novaTarefa = {
    id: Date.now(),
    responsavel,
    assunto,
    dataInicio,
    dataTermino,
    descricao,
    status
  };
  tarefas.push(novaTarefa);
  save();
  clearForm();
  addViewItem(novaTarefa);
}

function clearForm(){
  form.reset();
  sendErro('');
}

/*Deleta uma tarefa*/
function deleteTarefa(id){
  let pos = tarefas.findIndex(tarefa => tarefa.id === id);
  if (pos === -1) {
    return;
  }
  tarefas.splice(pos, 1);
  save();
  deleteViewItem(id);
}

/*Muda status da tarefa*/
function changeStatus(id, value){
  let pos = tarefas.findIndex(tarefa => tarefa.id === id);
  if (pos === -1) {
    return;
  }
  tarefas[pos].status = value;
  save();
  document.getElementById(id).className = 'tarefa ' + value;
}

/*Formata Data*/
function formatarData(str){
  if (!str) {
    return '--/--/----';
  }
  return str.split('T')[0].split('-').reverse().join('/');
}

/*Troca < > & e aspas para o texto digitado não virar HTML*/
function escapeHtml(texto){
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/*Create select options*/
function createSelect(selected){
  return `
  <select class='troca_status'>
  ${LISTA_STATUS.map(status => {
    return `<option value='${status.id}' ${status.id === selected ? 'selected' : ''}>${status.slug}</option>`;
  }).join('')}
</select>
`;
}

/*Layout da tarefa*/
function layoutTarefa(tarefa){
  let dataInicio = formatarData(tarefa.dataInicio);
  let dataTermino = formatarData(tarefa.dataTermino);

  let descricao = tarefa.descricao ? `<p>${escapeHtml(tarefa.descricao)}</p>` : '';
  let select_status = createSelect(tarefa.status);

  return `
<li id='${tarefa.id}' class='tarefa ${escapeHtml(tarefa.status)}'>
  <h3>${escapeHtml(tarefa.assunto)}</h3>
  <p>Responsável: ${escapeHtml(tarefa.responsavel)}</p>
  <p class='prazo'>${dataInicio} até ${dataTermino}</p>
  ${descricao}
  <div class='rodape'>
    ${select_status}
    <button class="delete">Excluir</button>
  </div>
</li>`;
}

/*Adiciona a tarefa na view*/
function addViewItem(tarefa){
  let layout = layoutTarefa(tarefa);
  container.innerHTML += layout;
}

/*Deleta a tarefa da view*/
function deleteViewItem(id){
  document.getElementById(id).remove();
}

/*Mostra todas as tarefas na view*/
function mostrarTarefas() {
  container.innerHTML = tarefas.map(tarefa => layoutTarefa(tarefa)).join('');
}

function filterTarefas(){
  let filter = document.getElementById('filterInput').value.toLowerCase();
  let items = document.querySelectorAll('li');
  items.forEach(item => {
    let text = item.textContent.toLowerCase();
    item.style.display = text.includes(filter) ? 'block' : 'none';
  });
}

function clearFilter(){
  document.getElementById('filterInput').value = '';
  filterTarefas();
}

/*Pega o id da tarefa a partir de qualquer elemento dentro do <li>*/
function idDaTarefa(elemento){
  return Number(elemento.closest('li').id);
}

/*Actions*/
container.addEventListener('click', function(e) {
  if (e.target.classList.contains('delete')) {
    deleteTarefa(idDaTarefa(e.target));
  }
});
container.addEventListener('change', function(e) {
  if (e.target.classList.contains('troca_status')) {
    changeStatus(idDaTarefa(e.target), e.target.value);
  }
});
var filter = document.getElementById('filter');
filter.addEventListener('click', function(e) {
  if (e.target.className === 'filter') {
    filterTarefas();
  }else if (e.target.className === 'clearFilter') {
    clearFilter();
  }
});

/*Submit Form*/
form.onsubmit = function (e) {
  e.preventDefault();
  addTarefa();
};

/*Carrega as tarefas na view se houver alguma salva no localStorage*/
window.onload = mostrarTarefas;
