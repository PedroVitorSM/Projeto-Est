const form = document.querySelector('form');
const container = document.querySelector('#tarefas');
console.log(form, container);
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

const save = () => {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
};

const ligarEventos = () => {
  container.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', ev => {
      if (ev.target.classList.contains('delete')) {
        tarefas = tarefas.filter(t => t.id !== +li.id);
        save();
        mostrarTarefas();
      }
      if (ev.target.classList.contains('check')) {
        const i = tarefas.findIndex(t => t.id === +li.id);
        tarefas[i].check = !tarefas[i].check;
        save();
      }
    });
  });
};

const mostrarTarefas = () => {
  container.innerHTML = tarefas.map(t => `
    <li id="${t.id}">
      <input type="checkbox" class="check" ${t.check ? 'checked' : ''}>
      <span>${t.nome}</span>
      <button class="delete">Excluir</button>
    </li>
  `).join('');
  ligarEventos();
};

form.addEventListener('submit', e => {
  e.preventDefault();
  const input = e.target[0];
  if (input.value.trim().length > 0) {
    tarefas.push({ nome: input.value.trim(), id: Date.now(), check: false });
    save();
    mostrarTarefas();
    e.target.reset();
  }
});

window.addEventListener('load', mostrarTarefas);