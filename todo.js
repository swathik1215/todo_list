const allTasks = JSON.parse(localStorage.getItem('allTasks')) || [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('allTasks', JSON.stringify(allTasks));
}

function setReminder(task) {
  setTimeout(() => {
    if (!task.completed && !task.trashed) {
      alert(`Reminder: ${task.text}`);
    }
  }, 60000);
}

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();
  if (!taskText) return;
  const priority = prompt("Set priority: low / medium / high", "low").toLowerCase();
  const task = {
    text: taskText,
    completed: false,
    trashed: false,
    priority: ["low", "medium", "high"].includes(priority) ? priority : "low",
    reminder: Date.now() + 60000
  };
  allTasks.push(task);
  taskInput.value = '';
  searchtask(currentFilter);
  setReminder(task);
  saveTasks();
}

function filterAll(task) {
  return !task.trashed;
}

function filterCompleted(task) {
  return task.completed && !task.trashed;
}

function filterTrashed(task) {
  return task.trashed;
}

function filterRemainders(task) {
  return !task.completed && !task.trashed;
}

function getFilteredTasks(filter, searchText) {
  return allTasks.filter(task => {
    let matchFilter = false;
    if (filter === 'all') matchFilter = filterAll(task);
    else if (filter === 'completed') matchFilter = filterCompleted(task);
    else if (filter === 'trashed') matchFilter = filterTrashed(task);
    else if (filter === 'remainders') matchFilter = filterRemainders(task);
    const matchSearch = task.text.toLowerCase().includes(searchText);
    return matchFilter && matchSearch;
  });
}

function searchtask(filter = 'all') {
  currentFilter = filter;
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  const searchText = document.getElementById('searchInput')?.value?.toLowerCase() || '';
  const filteredTasks = getFilteredTasks(filter, searchText);

  filteredTasks.forEach(task => {
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    if (task.completed) taskCard.classList.add('completed');
    if (task.trashed) taskCard.classList.add('trashed');

    const taskTextElement = document.createElement('span');
    taskTextElement.innerHTML = `
      <span class="priority-label priority-${task.priority}">${task.priority}</span>
      ${task.text}
    `;

    const buttonGroup = document.createElement('div');
    const checkBtn = document.createElement('button');
    checkBtn.className = 'icon-btn';
    checkBtn.innerHTML = '✅';
    checkBtn.onclick = () => {
      task.completed = !task.completed;
      searchtask(currentFilter);
      saveTasks();
    };

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn';
    delBtn.innerHTML = '🗑️';
    delBtn.onclick = () => {
      task.trashed = true;
      searchtask(currentFilter);
      saveTasks();
    };

    buttonGroup.appendChild(checkBtn);
    buttonGroup.appendChild(delBtn);
    taskCard.appendChild(taskTextElement);
    taskCard.appendChild(buttonGroup);
    taskList.appendChild(taskCard);
  });
}
function filterTasks(category) {
  searchtask(category);
}