const allTasks = JSON.parse(localStorage.getItem('allTasks')) || [];
let currentFilter = 'all';
function saveTasks() {
  localStorage.setItem('allTasks', JSON.stringify(allTasks));
}
function playSound() {
  const audio = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3");
  audio.play();
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
  renderTasks(currentFilter);
  setReminder(task);
  playSound();
  saveTasks();
}
function renderTasks(filter = 'all') {
  currentFilter = filter;
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  const searchText = document.getElementById('searchInput')?.value?.toLowerCase() || '';
  const filteredTasks = allTasks.filter(task => {
    const matchFilter =
      filter === 'completed' ? task.completed && !task.trashed :
      filter === 'trashed' ? task.trashed :
      filter === 'remainders' ? !task.completed && !task.trashed :
      !task.trashed;
    const matchSearch = task.text.toLowerCase().includes(searchText);
    return matchFilter && matchSearch;
  });
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
    taskTextElement.ondblclick = () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = task.text;
      input.className = 'form-control';
      input.onblur = () => {
        task.text = input.value;
        renderTasks(currentFilter);
        saveTasks();
      };
      taskCard.replaceChild(input, taskTextElement);
      input.focus();
    };
    const buttonGroup = document.createElement('div');
    const checkBtn = document.createElement('button');
    checkBtn.className = 'icon-btn';
    checkBtn.innerHTML = '✅';
    checkBtn.onclick = () => {
      task.completed = !task.completed;
      renderTasks(currentFilter);
      saveTasks();
    };
    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn';
    delBtn.innerHTML = '🗑️';
    delBtn.onclick = () => {
      task.trashed = true;
      renderTasks(currentFilter);
      saveTasks();
    };
    buttonGroup.appendChild(checkBtn);
    buttonGroup.appendChild(delBtn);
    taskCard.appendChild(taskTextElement);
    taskCard.appendChild(buttonGroup);
    taskList.appendChild(taskCard);
  });
}
document.getElementById("taskInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") addTask();
});
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("active");
}
function filterTasks(category) {
  renderTasks(category);
}
window.onload = () => renderTasks();

// activity
function loadAdminData() {
    const tasks = JSON.parse(localStorage.getItem("allTasks")) || [];
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const trashed = tasks.filter(t => t.trashed).length;
    const high = tasks.filter(t => t.priority === 'high').length;
    document.getElementById("totalTasks").innerText = total;
    document.getElementById("completedTasks").innerText = completed;
    document.getElementById("trashedTasks").innerText = trashed;
    document.getElementById("highPriority").innerText = high;
}
function clearAllData() {
    if (confirm("Are you sure you want to delete all tasks?")) {
    localStorage.removeItem("allTasks");
    loadAdminData();
    alert("All data cleared!");
    }
}
window.onload = loadAdminData;
