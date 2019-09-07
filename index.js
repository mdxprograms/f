const R = {
  addListeners(listeners) {
    listeners.forEach(listener => {
      const { element, evt, fn } = listener;

      element.addEventListener(evt, fn);
    });
  },
  children(parent, fns) {
    fns.forEach(f => parent.appendChild(R.isFn(f) ? f() : f));
  },
  isFn(test) {
    return typeof test === "function";
  },
  makeEl(type, text = "") {
    let el = document.createElement(type);

    if (text.length > 0) {
      const textNode = document.createTextNode(text);
      R.children(el, [textNode]);
    }

    return el;
  }
};

const initialState = {
  currentTodo: "",
  todos: []
};

// container
const app = document.getElementById("app");

// intialized state
let state = initialState;

// actions
const addTodo = () => {
  const todo = {
    id: state.todos.length + 1,
    value: state.currentTodo
  };

  state.todos = [todo, ...state.todos];
  render();
};

const removeTodo = id => {
  state.todos = state.todos.filter(t => t.id !== id);
  render();
};

const setCurrentTodo = text => {
  state.currentTodo = text;
};

// views
const todoForm = () => {
  let form = R.makeEl("div");
  let todoInput = R.makeEl("input");
  let submit = R.makeEl("button", "Add");

  R.addListeners([
    {
      element: submit,
      evt: "click",
      fn: addTodo
    },
    {
      element: todoInput,
      evt: "keyup",
      fn: e => setCurrentTodo(e.target.value)
    }
  ]);

  R.children(form, [todoInput, submit]);

  return form;
};

const todoList = () => {
  let list = R.makeEl("ul");

  state.todos.forEach(todo => {
    const t = R.makeEl("li", todo.value);
    const delBtn = R.makeEl("button", "Delete");

    R.addListeners([
      { element: delBtn, evt: "click", fn: () => removeTodo(todo.id) }
    ]);

    R.children(t, [delBtn]);
    R.children(list, [t]);
  });

  return list;
};

// render
const render = () => {
  app.innerHTML = "";
  R.children(app, [todoForm, todoList]);
};

render();
