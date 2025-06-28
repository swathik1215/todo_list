const allTasks = JSON.parse(localStorage.getItem('allTasks')) || [], taskInput = document.getElementById('taskInput');
let currentFilter = 'all';
const saveTasks = () => localStorage.setItem('allTasks', JSON.stringify(allTasks));
const playSound = () => new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3").play();
const setReminder = t => setTimeout(() => { if (!t.completed && !t.trashed) alert(`Reminder: ${t.text}`); }, 60000);
const addTask = () => {
  const text = taskInput.value.trim();
  if (!text) return;
  const priority = prompt("Set priority: low / medium / high", "low").toLowerCase();
  const task = {
    text, completed: false, trashed: false,
    priority: ["low", "medium", "high"].includes(priority) ? priority : "low",
    reminder: Date.now() + 60000
  };
  allTasks.push(task);
  taskInput.value = '';
  renderTasks(currentFilter);
  setReminder(task);
  playSound();
  saveTasks();
};
const renderTasks = (filter = 'all') => {
  currentFilter = filter;
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  const search = document.getElementById('searchInput')?.value?.toLowerCase() || '';
  allTasks.filter(t => {
    const f = filter === 'completed' ? t.completed && !t.trashed :
              filter === 'trashed' ? t.trashed :
              filter === 'remainders' ? !t.completed && !t.trashed : !t.trashed;
    return f && t.text.toLowerCase().includes(search);
  }).forEach(t => {
    const card = document.createElement('div');
    card.className = `task-card${t.completed ? ' completed' : ''}${t.trashed ? ' trashed' : ''}`;
    const textEl = document.createElement('span');
    textEl.innerHTML = `<span class="priority-label priority-${t.priority}">${t.priority}</span> ${t.text}`;
    textEl.ondblclick = () => {
      const input = document.createElement('input');
      input.type = 'text'; input.value = t.text; input.className = 'form-control';
      input.onblur = () => { t.text = input.value; renderTasks(currentFilter); saveTasks(); };
      card.replaceChild(input, textEl); input.focus();
    };
    const btns = document.createElement('div');
    ['✅', '🗑️'].forEach((sym, i) => {
      const btn = document.createElement('button');
      btn.className = 'icon-btn'; btn.innerHTML = sym;
      btn.onclick = () => {
        if (i === 0) t.completed = !t.completed;
        else t.trashed = true;
        renderTasks(currentFilter); saveTasks();
      };
      btns.appendChild(btn);
    });
    card.appendChild(textEl); card.appendChild(btns); list.appendChild(card);
  });
};
taskInput.addEventListener("keypress", e => { if (e.key === "Enter") addTask(); });
const toggleSidebar = () => document.getElementById("sidebar").classList.toggle("active");
const filterTasks = cat => renderTasks(cat);
const loadAdminData = () => {
  const tasks = JSON.parse(localStorage.getItem("allTasks")) || [];
  document.getElementById("totalTasks").innerText = tasks.length;
  document.getElementById("completedTasks").innerText = tasks.filter(t => t.completed).length;
  document.getElementById("trashedTasks").innerText = tasks.filter(t => t.trashed).length;
  document.getElementById("highPriority").innerText = tasks.filter(t => t.priority === 'high').length;
};
const clearAllData = () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    localStorage.removeItem("allTasks");
    loadAdminData();
    alert("All data cleared!");
  }
};
window.onload = () => { renderTasks(); loadAdminData(); };
