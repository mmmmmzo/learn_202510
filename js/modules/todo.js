const addForm = document.querySelector('.td-add-form');
const addInput = document.querySelector('.td-add-input');
const todosUl = document.querySelector('.todos');
const donesUl = document.querySelector('.dones');
const searchForm = document.querySelector('.td-search-form');
const searchInput = document.querySelector('.td-search-input');

let todoData = [];

addForm.addEventListener('submit', e => {
    e.preventDefault();

    let todoObj = {
        content: addInput.value.trim(),
        isDone: false
    };

    if (todoObj.content) {
        todoData.push(todoObj);
    }

    addInput.value = '';
    updateLS();
    updateTodo();
})

function updateLS() {
    localStorage.setItem('myTodo', JSON.stringify(todoData));
}

function getTodoData() {
    return JSON.parse(localStorage.getItem('myTodo')) || [];
}

function createTodoElement(todo) {
    const todoItem = document.createElement('li');
    todoItem.classList.add('td-item');
    const todoContent = document.createElement('p');
    todoContent.classList.add('td-content');
    todoContent.textContent = todo.content;
    todoItem.appendChild(todoContent);

    const btnContainer = document.createElement('div');
    btnContainer.classList.add('td-btn-container');
    const btn = document.createElement('img');
    btn.classList.add('td-btn');
    const upBtn = btn.cloneNode(false);
    upBtn.setAttribute('src', './images/todo_button/up.png');

    if (!todo.isDone) {
        upBtn.classList.add('edit-btn');
        btn.classList.add('isDone-btn');
        btn.setAttribute('src', './images/todo_button/ok.png');
        btnContainer.appendChild(btn);
        btnContainer.appendChild(upBtn);
        todoItem.appendChild(btnContainer);
        todosUl.appendChild(todoItem);
    } else {
        upBtn.classList.add('undo-btn');
        btn.classList.add('delete-btn');
        btn.setAttribute('src', './images/todo_button/cancel.png');
        btnContainer.appendChild(btn);
        btnContainer.appendChild(upBtn);
        todoItem.appendChild(btnContainer);
        donesUl.appendChild(todoItem);
    }

    todoItem.addEventListener('click', e => {
        if (e.target.classList.contains('isDone-btn')) {
            todo.isDone = true;
        }
        if (e.target.classList.contains('undo-btn')) {
            todo.isDone = false;
        }
        if (e.target.classList.contains('edit-btn')) {
            addInput.value = e.target.parentElement.previousElementSibling.textContent;
            todoData = todoData.filter(data => data !== todo);
            addInput.focus();
        }
        if (e.target.classList.contains('delete-btn')) {
            todoData = todoData.filter(data => data !== todo);
        }

        updateLS();
        updateTodo();
    })
}

function updateTodo() {
    todosUl.innerHTML = '';
    donesUl.innerHTML = '';
    todoData = getTodoData();

    todoData.forEach(todo => {
        createTodoElement(todo);
    })
}

updateTodo();

searchForm.addEventListener('submit', () => {
    e.preventDefault();
})

searchInput.addEventListener('keyup', () => {
    const searchWord = searchInput.value.trim().toLowerCase();
    const todoItems = document.querySelectorAll('.td-item');

    todoItems.forEach(todoItem => {
        todoItem.classList.remove('hide');
        if (!todoItem.textContent.toLowerCase().includes(searchWord)) {
            todoItem.classList.add('hide');
        }
    })
})