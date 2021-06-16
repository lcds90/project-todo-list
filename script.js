const listTasks = document.querySelector('#lista-tarefas');
const taskText = document.querySelector('#texto-tarefa');
const btnCreateTask = document.querySelector('#criar-tarefa');
const btnEraseAll = document.querySelector('#apaga-tudo');
const btnEraseCompleted = document.querySelector('#remover-finalizados');
const btnSaveAll = document.querySelector('#salvar-tarefas');
const btnEraseSelected = document.querySelector('#remover-selecionado');
const btnMoveUp = document.querySelector('#mover-cima');
const btnMoveDown = document.querySelector('#mover-baixo');

function message(title, text, type) {
  Swal.fire({
    title,
    text,
    timer: 2000,
    icon: type,
    toast: true,
    showConfirmButton: false,
  });
}

function moveUp() {
  const element = document.querySelector('.selected');
  const tl = gsap.timeline({
    clearProps: 'all',
    defaults: { duration: 2 },
    onStart: () => {
      element.parentNode.insertBefore(element, element.previousElementSibling);
    },
  });
  if (element === null) return;
  if (element.previousElementSibling) {
    tl.from(element, { y: 38 });
    tl.from(element.previousElementSibling, { y: -75 }, '-=2');
  }
}

function moveDown() {
  const element = document.querySelector('.selected');
  const tl = gsap.timeline({
    clearProps: 'all',
    defaults: { duration: 2 },
    onStart: () => {
      element.parentNode.insertBefore(element.nextElementSibling, element);
    },
  });
  if (element === null) return;
  if (element.nextElementSibling) {
    tl.from(element, { y: -38 });
    tl.from(element.nextElementSibling, { y: 70 }, '-=2');
  }
}

function saveList() {
  const getHTML = listTasks.innerHTML.toString();
  localStorage.setItem('taskList', getHTML);
  message('Lista salva', 'Sua lista foi salva com sucesso!', 'success');
}

function taskEraseWithAnimation(el) {
  const anim = gsap.timeline({
    defaults: {
      duration: 1,
      ease: 'power2',
      onComplete: () => {
        el.remove();
      },
    },
  });
  anim.to(el, { x: -1000, stagger: 1 });
}

function eraseAll() {
  listTasks.innerHTML = '';
  localStorage.removeItem('taskList');
  message('Itens deletados', '', 'warning');
}

function eraseOnlySelected() {
  const selected = document.querySelector('.selected');
  taskEraseWithAnimation(selected);
  message('Item(s) deletado(s)', '', 'warning');
}

function eraseOnlyCompletedTasks() {
  const getCompletedTasks = document.querySelectorAll('.completed');
  for (let index = 0; index < getCompletedTasks.length; index += 1) {
    taskEraseWithAnimation(getCompletedTasks[index]);
  }
  message('Item(s) deletado(s)', '', 'warning');
}

function removeSelectedColorInEachLi(list) {
  const ol = list;
  for (let index = 0; index < ol.length; index += 1) {
    ol[index].classList.remove('selected');
  }
}

function applyColor(event) {
  const item = event.target;
  const ol = event.target.parentElement.children;
  removeSelectedColorInEachLi(ol);
  item.classList.toggle('selected');
}

function toggleComplete(event) {
  const li = event.target;
  li.classList.toggle('completed');
}

function applyEventListeners(element) {
  element.addEventListener('click', applyColor);
  element.addEventListener('dblclick', toggleComplete);
}

function taskAnimation(el, delayFor = '') {
  const anim = gsap.timeline({
    defaults: {
      duration: 0.5,
      ease: 'power2',
      clearProps: 'all',
    },
  });
  if (delayFor === 'forIntro') {
    anim.from(el, { delay: 2, duration: 2, scale: 1, x: 400, opacity: 0, stagger: 2 });
    return;
  }
  anim.from(el, { duration: 0.5, scale: 1, x: 400, opacity: 0, stagger: 1 });
}

function createTask() {
  const li = document.createElement('li');
  taskAnimation(li);
  li.innerText = taskText.value;
  applyEventListeners(li);
  listTasks.appendChild(li);
  message('Tarefa criada', '', 'success');
  taskText.value = '';
}

function getList() {
  if (localStorage.getItem('taskList')) {
    listTasks.innerHTML = localStorage.getItem('taskList');
    const getNewTasks = listTasks.children;
    for (let index = 0; index < getNewTasks.length; index += 1) {
      taskAnimation(getNewTasks[index], 'forIntro');
      applyEventListeners(getNewTasks[index]);
      getNewTasks[index].classList.remove('selected');
    }
  }
}

function introAnimation() {
  gsap.from('body', { duration: 1, opacity: 0 });
  gsap.from('.header', { duration: 2, x: 50 });
  gsap.from('.section-inputs', { duration: 2, y: 50 });
  gsap.from('.section-tasks', { duration: 2, y: -50 });
  gsap.from('h1', { delay: 2, x: -100, opacity: 0, duration: 1 });
  gsap.from('#funcionamento', { delay: 2, x: 100, opacity: 0, duration: 1 });
  gsap.from('.button', { x: 20, duration: 0.5, opacity: 0, ease: 'power2', stagger: 0.5 });
  gsap.from('#lista-tarefas', { duration: 2, opacity: 0, ease: 'power2', x: -20, delay: 1 });
}

window.onload = () => {
  introAnimation();
  getList();
  taskText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') createTask();
  });
  btnCreateTask.addEventListener('click', () => createTask());
  btnEraseAll.addEventListener('click', () => eraseAll());
  btnEraseCompleted.addEventListener('click', () => eraseOnlyCompletedTasks());
  btnEraseSelected.addEventListener('click', () => eraseOnlySelected());
  btnSaveAll.addEventListener('click', () => saveList());
  btnMoveUp.addEventListener('click', () => moveUp());
  btnMoveDown.addEventListener('click', () => moveDown());
};
