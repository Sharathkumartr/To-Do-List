document.addEventListener('DOMContentLoaded', () => {
  loadTasks();

  document.getElementById('date-picker').addEventListener('change', (e) => {
    const date = new Date();
    if (e.target.value === 'today') {
      document.getElementById('due-date').valueAsDate = date;
    } else if (e.target.value === 'tomorrow') {
      date.setDate(date.getDate() + 1);
      document.getElementById('due-date').valueAsDate = date;
    }
  });

  document.getElementById('search').addEventListener('input', filterBySearch);
});

function addTask() {
  const text = document.getElementById('task-input').value.trim();
  const date = document.getElementById('due-date').value;
  const startTime = document.getElementById('start-time').value;
  const endTime = document.getElementById('end-time').value;
  const priority = document.getElementById('priority').value;

  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    completed: false,
    priority,
    date,
    startTime,
    endTime
  };

  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
  clearInputs();
  renderTasks(tasks);
}

function clearInputs() {
  document.getElementById('task-input').value = '';
  document.getElementById('due-date').value = '';
  document.getElementById('start-time').value = '';
  document.getElementById('end-time').value = '';
  document.getElementById('priority').value = 'Low';
  document.getElementById('date-picker').value = '';
}

function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  renderTasks(getTasks());
}

function renderTasks(tasks) {
  const list = document.getElementById('task-list');
  list.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.onchange = () => toggleComplete(task.id);

    const span = document.createElement('span');
    span.textContent = task.text;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML = `
      <span class="tag ${task.priority.toLowerCase()}">${task.priority}</span>
      ${task.date ? `<small>📅 ${task.date}</small>` : ''}
      ${task.startTime ? `<small>🕐 ${task.startTime}</small>` : ''}
      ${task.endTime ? `<small>➡️ ${task.endTime}</small>` : ''}
    `;

    const del = document.createElement('button');
    del.textContent = '🗑️';
    del.className = 'delete';
    del.onclick = () => deleteTask(task.id);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(meta);
    li.appendChild(del);

    list.appendChild(li);
  });
}

function toggleComplete(id) {
  const tasks = getTasks().map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks(tasks);
  renderTasks(tasks);
}

function deleteTask(id) {
  const tasks = getTasks().filter(t => t.id !== id);
  saveTasks(tasks);
  renderTasks(tasks);
}

function filterTasks(type) {
  const tasks = getTasks();
  const todayStr = new Date().toISOString().split('T')[0];

  let filtered = tasks;

  if (type === 'active') {
    filtered = tasks.filter(t => !t.completed && t.date === todayStr);
  } else if (type === 'completed') {
    filtered = tasks.filter(t => t.completed);
  }

  renderTasks(filtered);
}

function filterBySearch(e) {
  const term = e.target.value.toLowerCase();
  const tasks = getTasks().filter(t => t.text.toLowerCase().includes(term));
  renderTasks(tasks);
}
