document.addEventListener('DOMContentLoaded', function() {
    // Инициализация
    loadFromLocalStorage();
    renderAllTodos();

    // Обработчики событий
    document.getElementById('toDoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addToDo();
    });

    document.getElementById('deleteSelected').addEventListener('click', deleteSelected);
    document.getElementById('sortByDate').addEventListener('click', sortByDate);
    document.getElementById('filterPriority').addEventListener('change', filterByPriority);
    document.getElementById('clearCompleted').addEventListener('click', clearCompleted);
});

const todoList = [];
const STORAGE_KEY = 'todoList';

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todoList));
}

function loadFromLocalStorage() {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    if (savedTodos) {
        todoList.length = 0;
        todoList.push(...JSON.parse(savedTodos));
    }
}

function addToDo() {
    const form = document.getElementById('toDoForm');
    const formData = new FormData(form);
    
    if (!formData.get('title') || !formData.get('date')) {
        alert('Пожалуйста, заполните обязательные поля: название и дата');
        return;
    }

    const newTodo = {
        id: Date.now(),
        title: formData.get('title'),
        color: formData.get('color') || '#6c757d',
        description: formData.get('description'),
        date: formData.get('date'),
        priority: formData.get('priority') || 'medium',
        completed: false,
        selected: false
    };

    todoList.push(newTodo);
    saveToLocalStorage();
    renderAllTodos();
    form.reset();
}

function deleteElement(id) {
    const index = todoList.findIndex(item => item.id === id);
    if (index !== -1) {
        todoList.splice(index, 1);
        saveToLocalStorage();
        renderAllTodos();
    }
}

function toggleComplete(id) {
    const todo = todoList.find(item => item.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveToLocalStorage();
        renderAllTodos();
    }
}

function toggleSelect(id) {
    const todo = todoList.find(item => item.id === id);
    if (todo) {
        todo.selected = !todo.selected;
        saveToLocalStorage();
    }
}

function deleteSelected() {
    const selectedTodos = todoList.filter(todo => todo.selected);
    if (selectedTodos.length === 0) {
        alert('Выберите задачи для удаления');
        return;
    }

    if (confirm(`Удалить ${selectedTodos.length} задач?`)) {
        selectedTodos.forEach(todo => {
            const index = todoList.findIndex(item => item.id === todo.id);
            if (index !== -1) {
                todoList.splice(index, 1);
            }
        });
        saveToLocalStorage();
        renderAllTodos();
    }
}

function sortByDate() {
    todoList.sort((a, b) => new Date(a.date) - new Date(b.date));
    saveToLocalStorage();
    renderAllTodos();
}

function filterByPriority() {
    const priority = document.getElementById('filterPriority').value;
    renderAllTodos(priority);
}

function clearCompleted() {
    const completedTodos = todoList.filter(todo => todo.completed);
    if (completedTodos.length === 0) {
        alert('Нет выполненных задач для удаления');
        return;
    }

    if (confirm(`Удалить ${completedTodos.length} выполненных задач?`)) {
        completedTodos.forEach(todo => {
            const index = todoList.findIndex(item => item.id === todo.id);
            if (index !== -1) {
                todoList.splice(index, 1);
            }
        });
        saveToLocalStorage();
        renderAllTodos();
    }
}

function moveUp(id) {
    const index = todoList.findIndex(item => item.id === id);
    if (index > 0) {
        [todoList[index], todoList[index - 1]] = [todoList[index - 1], todoList[index]];
        saveToLocalStorage();
        renderAllTodos();
    }
}

function moveDown(id) {
    const index = todoList.findIndex(item => item.id === id);
    if (index < todoList.length - 1) {
        [todoList[index], todoList[index + 1]] = [todoList[index + 1], todoList[index]];
        saveToLocalStorage();
        renderAllTodos();
    }
}

function renderAllTodos(filterPriority = 'all') {
    const container = document.getElementById('todoItemsContainer');
    container.innerHTML = '';
    
    const todosToRender = filterPriority === 'all' 
        ? todoList 
        : todoList.filter(todo => todo.priority === filterPriority);
    
    todosToRender.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.className = `row my-3 priority-${todo.priority} ${todo.completed ? 'completed' : ''}`;
        todoElement.innerHTML = `
            <div class="col">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center" style="background-color: ${todo.color}">
                        <div>
                            <input type="checkbox" class="form-check-input me-2 select-checkbox" ${todo.selected ? 'checked' : ''} data-id="${todo.id}">
                            <small>${new Date(todo.date).toLocaleDateString('ru-RU')}</small>
                        </div>
                        <div>
                            <small>${getPriorityText(todo.priority)}</small>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="form-check">
                            <input class="form-check-input complete-checkbox" type="checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
                            <label class="form-check-label">
                                <h5 class="card-title">${todo.title}</h5>
                            </label>
                        </div>
                        <p class="card-text">${todo.description}</p>
                        <div class="d-flex justify-content-between">
                            <button type="button" class="btn btn-link text-danger delete-btn" data-id="${todo.id}">Удалить</button>
                            <div>
                                <button type="button" class="btn btn-link move-up-btn" data-id="${todo.id}">Вверх</button>
                                <button type="button" class="btn btn-link move-down-btn" data-id="${todo.id}">Вниз</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(todoElement);
    });

    // Добавляем обработчики событий для новых элементов
    document.querySelectorAll('.complete-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            toggleComplete(parseInt(this.dataset.id));
        });
    });

    document.querySelectorAll('.select-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            toggleSelect(parseInt(this.dataset.id));
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteElement(parseInt(this.dataset.id));
        });
    });

    document.querySelectorAll('.move-up-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            moveUp(parseInt(this.dataset.id));
        });
    });

    document.querySelectorAll('.move-down-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            moveDown(parseInt(this.dataset.id));
        });
    });
}

function getPriorityText(priority) {
    const priorities = {
        high: 'Высокий приоритет',
        medium: 'Средний приоритет',
        low: 'Низкий приоритет'
    };
    return priorities[priority] || '';
}