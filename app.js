document.addEventListener('DOMContentLoaded', loadTasks);

const form = document.getElementById('task-form');
const titleInput = document.getElementById('task-title');
const descriptionInput = document.getElementById('task-description');
const tagsInput = document.getElementById('task-tags');
const formTitle = document.getElementById('form-title');
const submitButton = document.getElementById('submit-button');
const todoListContainer = document.getElementById('todo-list');
let editingTaskIndex = null;

function openForm(mode = 'add', index = null) {
    if (mode === 'edit') {
        formTitle.textContent = 'Edit Task';
        submitButton.textContent = 'Save';
        editingTaskIndex = index;
        const tasks = getTasks();
        const task = tasks[index];
        titleInput.value = task.title;
        descriptionInput.value = task.description;
        tagsInput.value = task.tags.join(', ');
    } else {
        formTitle.textContent = 'Add New Task';
        submitButton.textContent = 'Add';
        editingTaskIndex = null;
        resetFormFields();
    }
    form.classList.remove('hidden');
}

function closeForm() {
    form.classList.add('hidden');
}

function resetFormFields() {
    titleInput.value = '';
    descriptionInput.value = '';
    tagsInput.value = '';
}

function addTask() {
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const tags = tagsInput.value.trim();

    if (!title || !description) {
        alert('Both Title and Description are required!');
        return;
    }

    const tasks = getTasks();

    if (editingTaskIndex !== null) {
        tasks[editingTaskIndex] = {
            title,
            description,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            done: tasks[editingTaskIndex].done,
        };
        editingTaskIndex = null;
    } else {
        tasks.push({
            title,
            description,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            done: false,
        });
    }

    saveTasks(tasks);
    renderTasks();
    closeForm();
}

function renderTasks() {
    console.log('Rendering tasks...');
    const tasks = getTasks();
    todoListContainer.innerHTML = ''; // Clear the list

    tasks.forEach((task, index) => {
        const taskElement = document.createElement('li');
        taskElement.className = `task ${task.done ? 'done' : 'pending'}`;
        taskElement.innerHTML = `
            <div class="task-content">
                <svg onclick="toggleTaskDone(${index})" class="done-icon ${task.done ? 'done' : 'not-done'}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
                    <path class="checkmark" d="${task.done ? 'M6 12l4 4 8-8' : ''}" stroke="currentColor" stroke-width="2" fill="none" />
                </svg>
                <div>
                    <strong onclick="toggleDetails(${index})" style="cursor: pointer"> ${task.title}</strong>
                    <div id="task-details-${index}" class="hidden">
                        <p>Description: ${task.description || 'No description available.'}</p>
                        <p><small>Tags: ${task.tags.join(', ') || 'No tags'}</small></p>
                    </div>
                </div>
                <div class="icons">
                   <svg onclick="openForm('edit', ${index})" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
          <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
          </svg>
          <svg onclick="deleteTask(${index})" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
          </svg>
                </div>
            </div>
        `;

        todoListContainer.appendChild(taskElement);
    });
}

function toggleDetails(index) {
    const taskDetails = document.getElementById(`task-details-${index}`);
    taskDetails.classList.toggle('hidden');
}

function toggleTaskDone(index) {
    const tasks = getTasks();
    tasks[index].done = !tasks[index].done;
    saveTasks(tasks);
    renderTasks();
}

function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        const tasks = getTasks();
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks();
    }
}

function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    renderTasks();
    showTab('pending');
}

function showTab(tabName) {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        const isDone = task.classList.contains('done');
        if (tabName === 'pending' && isDone) {
            task.style.display = 'none';
        } else if (tabName === 'completed' && !isDone) {
            task.style.display = 'none';
        } else {
            task.style.display = '';
        }
    });

    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.toggle('active', button.id === `${tabName}-tab`);
    });
}

// Event listeners for tabs
document.getElementById('pending-tab').addEventListener('click', () => showTab('pending'));
document.getElementById('completed-tab').addEventListener('click', () => showTab('completed'));

// Form submit event
form.addEventListener('submit', function (e) {
    e.preventDefault();
    addTask();
});
