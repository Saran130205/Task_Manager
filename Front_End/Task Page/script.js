const API_URL = 'http://localhost:3000/tasks';
let deleteTaskId = null;


async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();

  const list = document.getElementById('listcontainer');
  list.innerHTML = ''; // CLEAR OLD TASKS

 tasks.forEach((task, index) => {
  const li = document.createElement('li');
  li.className = 'task-card';

  li.innerHTML = `
    <div class="task-header">
      <span class="task-number">${index + 1}.</span>
      <input id="task-${task.id}" value="${task.title}" disabled />
    </div>

    <div class="task-desc">
      <textarea
        id="desc-${task.id}"
        class="task-desc-text"
        disabled
      >${task.description}</textarea>
    </div>

    <div class="task-meta">
      Added: ${task.created_at
        ? new Date(task.created_at).toLocaleString()
        : '—'}
    </div>

    <div class="task-actions">
      <button class="btn-edit" onclick="enableEdit(${task.id})">Edit</button>
      <button class="btn-save" onclick="saveEdit(${task.id})">Save</button>
      <button class="btn-delete" onclick="askDelete(${task.id})">Delete</button>
    </div>
  `;

  // 👇 ADD HERE (VERY IMPORTANT)
  list.appendChild(li);

  setTimeout(() => {
    const textarea = document.getElementById(`desc-${task.id}`);
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, 0);
});
  
}

//For Add Task
async function addTask() {
  const input = document.getElementById('task-input');
  const input2 = document.getElementById('desc');
  const errorMsg = document.getElementById('error_msg');

  const title = input.value.trim();
  const description = input2.value.trim();

  errorMsg.textContent = '';

  if (!title || !description) {
    errorMsg.textContent = 'Both title and description are required';
    errorMsg.style.color = 'red';
    return;
  }

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });

  errorMsg.textContent = 'Task added successfully';
  errorMsg.style.color = 'green';

  input.value = '';
  input2.value = '';

  loadTasks(); // 🔥 makes task visible immediately
}


// ElableEdit
function enableEdit(id) {
  const input = document.getElementById(`task-${id}`);
  const input2 = document.getElementById(`desc-${id}`);
  input.disabled = false;
  input2.disabled = false;    
  input.focus();
  input2.focus();
}

async function saveEdit(id) {
  const titleInput = document.getElementById(`task-${id}`);
  const descInput = document.getElementById(`desc-${id}`);
  const errorMsg = document.getElementById('error_msg');

  const title = titleInput.value.trim();
  const description = descInput.value.trim();

  errorMsg.textContent = '';

  if (!title || !description) {
    errorMsg.textContent = 'Both fields are required';
    errorMsg.style.color = 'red';
    return;
  }

  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });

  if (!res.ok) {
    errorMsg.textContent = 'Failed to update task';
    errorMsg.style.color = 'red';
    return;
  }

  errorMsg.textContent = 'Task updated successfully';
  errorMsg.style.color = 'green';

  titleInput.disabled = true;
  descInput.disabled = true;

  loadTasks();
}


function askDelete(id) {
  deleteTaskId = id; // 🔥 THIS LINE IS THE KEY
  document.getElementById('deleteConfirm').style.display = 'block';
}

function cancelDelete() {
  deleteTaskId = null;
  document.getElementById('deleteConfirm').style.display = 'none';
}

async function confirmDelete() {
  const errorMsg = document.getElementById('error_msg');

  // 🧪 DEBUG (DO NOT REMOVE YET)
  console.log('YES clicked, deleteTaskId =', deleteTaskId);

  if (deleteTaskId === null) {
    errorMsg.textContent = 'No task selected to delete';
    errorMsg.style.color = 'red';
    return;
  }

  const res = await fetch(`${API_URL}/${deleteTaskId}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    errorMsg.textContent = 'Failed to delete task';
    errorMsg.style.color = 'red';
    return;
  }

  errorMsg.textContent = 'Task deleted successfully';
  errorMsg.style.color = 'green';

  // ✅ RESET & HIDE CONFIRMATION
  deleteTaskId = null;
  document.getElementById('deleteConfirm').style.display = 'none';

  // ✅ REFRESH UI
  loadTasks();
}

function closeDeleteModal() {
  document.getElementById('deleteModal').style.display = 'none';
  deleteId = null;
}
loadTasks();

document.addEventListener('DOMContentLoaded', () => {
  const deleteBox = document.getElementById('deleteConfirm');
  if (deleteBox) {
    deleteBox.style.display = 'none';
  }
});


