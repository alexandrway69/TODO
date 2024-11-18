// eslint-disable-next-line func-names
(function () {
  // Функция для сохранения данных в LocalStorage
  function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Функция для чтения данных из LocalStorage
  function loadFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : []; // Возвращаем пустой массив, если данных нет
  }

  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = true; // Изначально кнопка будет отключена

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    // Включаем или отключаем кнопку в зависимости от состояния поля ввода
    input.addEventListener('input', () => {
      button.disabled = !input.value.trim();
    });

    return {
      form,
      input,
      button,
    };
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  // создаем элемент списка (дело)
  function createTodoItem({ id, name, done }, deleteItem, toggleDone) {
    let item = document.createElement('li');
    let bottomGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

    if (done) {
      item.classList.add('list-group-item-success');
    }

    bottomGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    bottomGroup.append(doneButton);
    bottomGroup.append(deleteButton);
    item.append(bottomGroup);

    doneButton.addEventListener('click', () => {
      toggleDone(id);
      item.classList.toggle('list-group-item-success');
    });

    deleteButton.addEventListener('click', () => {
      if (confirm('Вы уверены?')) {
        deleteItem(id); // Удаляем объект из массива
        item.remove(); // Удаляем элемент из DOM
      }
    });

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  // Функция для создания Todo приложения
  function createTodoApp(container, title = 'Список дел', listName = 'default') {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    let todoArray = loadFromLocalStorage(listName); // Загружаем задачи из LocalStorage

    // Определяем следующий ID (если массив не пустой, то берем максимальный ID + 1)
    let currentId = todoArray.length > 0 ? Math.max(...todoArray.map((item) => item.id)) + 1 : 1;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    // Отображаем все задачи из массива (если есть)
    todoArray.forEach((item) => {
      // eslint-disable-next-line no-use-before-define
      let todoItem = createTodoItem(item, deleteItem, toggleDone);
      todoList.append(todoItem.item);
    });

    // Событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Игнорируем создание элемента, если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        return;
      }

      // Создаем новый объект задачи
      let newItem = {
        id: currentId++,
        name: todoItemForm.input.value.trim(),
        done: false,
      };

      // Добавляем задачу в массив
      todoArray.push(newItem);

      // Сохраняем задачи в LocalStorage
      saveToLocalStorage(listName, todoArray);

      // Создаем элемент списка и добавляем его в DOM
      let todoItem = createTodoItem(newItem, deleteItem, toggleDone);
      todoList.append(todoItem.item);

      // Очищаем поле ввода
      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true; // Кнопка снова отключается
    });

    // Функция для удаления задачи
    function deleteItem(id) {
      // Удаляем объект из массива по id
      todoArray = todoArray.filter((item) => item.id !== id);

      // Сохраняем обновленный массив в LocalStorage
      saveToLocalStorage(listName, todoArray);
    }

    // Функция для изменения статуса задачи
    function toggleDone(id) {
      // Находим задачу по id и изменяем её статус
      // eslint-disable-next-line no-shadow
      let item = todoArray.find((item) => item.id === id);
      if (item) {
        item.done = !item.done; // Изменяем статус задачи
      }

      // Сохраняем обновленный массив в LocalStorage
      saveToLocalStorage(listName, todoArray);
    }
  }

  // Инициализация приложения при загрузке страницы
  document.addEventListener('DOMContentLoaded', () => {
    createTodoApp(document.getElementById('todo-app'), 'Мои дела', 'my');
  });

  // Экспортируем функцию для использования в других скриптах
  window.createTodoApp = createTodoApp;
}());
