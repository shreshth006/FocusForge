const taskForm = document.getElementById('taskForm');
const taskTitleInput = document.getElementById('taskTitle');
const taskPriorityInput = document.getElementById('taskPriority');
const taskDueInput = document.getElementById('taskDue');
const taskList = document.getElementById('taskList');
const clearDoneBtn = document.getElementById('clearDoneBtn');

const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const focusSessionsEl = document.getElementById('focusSessions');

const timerDisplay = document.getElementById('timerDisplay');
const startTimerBtn = document.getElementById('startTimerBtn');
const pauseTimerBtn = document.getElementById('pauseTimerBtn');
const resetTimerBtn = document.getElementById('resetTimerBtn');
const modeButtons = document.querySelectorAll('.mode-btn');

const STORAGE_KEY = 'focusforge-data-v1';

const state = {
  tasks: [],
  focusSessions: 0,
  timer: {
    modeMinutes: 25,
    secondsLeft: 25 * 60,
    isRunning: false,
    intervalId: null,
  },
};

function saveData() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      tasks: state.tasks,
      focusSessions: state.focusSessions,
    })
  );
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    state.tasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];
    state.focusSessions = Number.isFinite(parsed.focusSessions) ? parsed.focusSessions : 0;
  } catch {
    state.tasks = [];
    state.focusSessions = 0;
  }
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function renderTasks() {
  taskList.innerHTML = '';

  state.tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = 'task-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const content = document.createElement('div');
    content.className = 'task-content';
    const title = document.createElement('p');
    title.textContent = task.title;
    title.className = `task-title ${task.done ? 'done' : ''}`;

    const meta = document.createElement('p');
    meta.className = 'task-meta';
    meta.textContent = `Due: ${formatDate(task.due)}`;

    content.append(title, meta);

    const right = document.createElement('div');
    right.className = 'task-actions';

    const priority = document.createElement('span');
    priority.className = `priority ${task.priority}`;
    priority.textContent = task.priority;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'secondary';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    right.append(priority, deleteBtn);
    item.append(checkbox, content, right);
    taskList.appendChild(item);
  });

  updateStats();
}

function updateStats() {
  const total = state.tasks.length;
  const completed = state.tasks.filter((task) => task.done).length;

  totalTasksEl.textContent = String(total);
  completedTasksEl.textContent = String(completed);
  focusSessionsEl.textContent = String(state.focusSessions);
}

function addTask(title, priority, due) {
  state.tasks.push({
    id: crypto.randomUUID(),
    title,
    priority,
    due,
    done: false,
  });
  saveData();
  renderTasks();
}

function toggleTask(taskId) {
  state.tasks = state.tasks.map((task) =>
    task.id === taskId ? { ...task, done: !task.done } : task
  );
  saveData();
  renderTasks();
}

function deleteTask(taskId) {
  state.tasks = state.tasks.filter((task) => task.id !== taskId);
  saveData();
  renderTasks();
}

function clearCompletedTasks() {
  state.tasks = state.tasks.filter((task) => !task.done);
  saveData();
  renderTasks();
}

function updateTimerDisplay() {
  const minutes = Math.floor(state.timer.secondsLeft / 60);
  const seconds = state.timer.secondsLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function stopTimerInterval() {
  if (state.timer.intervalId) {
    clearInterval(state.timer.intervalId);
    state.timer.intervalId = null;
  }
  state.timer.isRunning = false;
}

function startTimer() {
  if (state.timer.isRunning) return;

  state.timer.isRunning = true;
  state.timer.intervalId = setInterval(() => {
    if (state.timer.secondsLeft > 0) {
      state.timer.secondsLeft -= 1;
      updateTimerDisplay();
      return;
    }

    stopTimerInterval();
    state.focusSessions += 1;
    saveData();
    updateStats();
    alert('Session complete. Great work!');
  }, 1000);
}

function pauseTimer() {
  stopTimerInterval();
}

function resetTimer() {
  stopTimerInterval();
  state.timer.secondsLeft = state.timer.modeMinutes * 60;
  updateTimerDisplay();
}

function setMode(minutes, clickedButton) {
  modeButtons.forEach((button) => button.classList.remove('active'));
  clickedButton.classList.add('active');

  state.timer.modeMinutes = minutes;
  state.timer.secondsLeft = minutes * 60;
  stopTimerInterval();
  updateTimerDisplay();
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  const priority = taskPriorityInput.value;
  const due = taskDueInput.value;

  if (!title || !priority || !due) return;

  addTask(title, priority, due);
  taskForm.reset();
});

clearDoneBtn.addEventListener('click', clearCompletedTasks);
startTimerBtn.addEventListener('click', startTimer);
pauseTimerBtn.addEventListener('click', pauseTimer);
resetTimerBtn.addEventListener('click', resetTimer);

modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const minutes = Number(button.dataset.minutes);
    setMode(minutes, button);
  });
});

loadData();
renderTasks();
updateTimerDisplay();
