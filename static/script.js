const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');

// Load tasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Form submission
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask();
});

async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
    }
}

async function addTask() {
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();

    if (!title) {
        alert('Por favor, insira um título para a tarefa');
        return;
    }

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        });

        if (response.ok) {
            taskTitle.value = '';
            taskDescription.value = '';
            loadTasks();
        }
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
    }
}

async function toggleTask(id, completed) {
    try {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !completed })
        });

        if (response.ok) {
            loadTasks();
        }
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
    }
}

async function deleteTask(id) {
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadTasks();
            }
        } catch (error) {
            console.error('Erro ao deletar tarefa:', error);
        }
    }
}

function renderTasks(tasks) {
    tasksList.innerHTML = '';

    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    tasks.forEach(task => {
        const taskDate = new Date(task.created_at).toLocaleDateString('pt-BR');
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;

        taskElement.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id}, ${task.completed})"
            >
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.title)}</div>
                ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                <div class="task-date">📅 ${taskDate}</div>
            </div>
            <button class="btn-delete" onclick="deleteTask(${task.id})">🗑️ Deletar</button>
        `;

        tasksList.appendChild(taskElement);
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
