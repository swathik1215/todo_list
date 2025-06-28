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
  filterTasks(currentFilter);
  setReminder(task);
  saveTasks();
}

function filterTasks(category) {
  currentFilter = category;
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  let filteredTasks = [];
  if (category === 'all') {
    filteredTasks = allTasks.filter(task => !task.trashed);
  } else if (category === 'completed') {
    filteredTasks = allTasks.filter(task => task.completed && !task.trashed);
  } else if (category === 'trashed') {
    filteredTasks = allTasks.filter(task => task.trashed);
  } else if (category === 'remainders') {
    filteredTasks = allTasks.filter(task => !task.completed && !task.trashed);
  }
  filteredTasks.forEach(task => {
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    if (task.completed) taskCard.classList.add('completed');
    if (task.trashed) taskCard.classList.add('trashed');
    const taskTextElement = document.createElement('span');
    const prioritySpan = document.createElement('span');
    prioritySpan.className = `priority-label priority-${task.priority}`;
    prioritySpan.textContent = task.priority;
    const taskText = document.createTextNode(` ${task.text}`);
    taskTextElement.appendChild(prioritySpan);
    taskTextElement.appendChild(taskText);

    const buttonGroup = document.createElement('div');
    const checkBtn = document.createElement('button');
    checkBtn.className = 'icon-btn';
    checkBtn.innerHTML = '✅';
    checkBtn.onclick = () => {
      task.completed = !task.completed;
      filterTasks(currentFilter);
      saveTasks();
    };

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn';
    delBtn.innerHTML = '🗑️';
    delBtn.onclick = () => {
      task.trashed = true;
      filterTasks(currentFilter);
      saveTasks();
    };
    
    buttonGroup.appendChild(checkBtn);
    buttonGroup.appendChild(delBtn);
    taskCard.appendChild(taskTextElement);
    taskCard.appendChild(buttonGroup);
    taskList.appendChild(taskCard);
  });
}
