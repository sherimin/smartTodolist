// Client facing scripts here

const taskInput = document.querySelector(".task-input input"),
  dateInput = document.querySelector(".due-date input"),
  priorityRanking = document.querySelector("priority"),
  priorityInput = $(".priority :selected").val(),
  categoryInput = $(".category :selected").val(),
  filters = document.querySelectorAll(".filters span"),
  clearAll = document.querySelector(".clear-btn"),
  taskBox = document.querySelector(".task-box");
let editId,
  isEditTask = false,
  todos = JSON.parse(localStorage.getItem("todo-list")); //fetch data from localStorage
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

// Icon color for indicating priorities
const iconColor = {
  0: 'blue',
  1: 'grey',
  2: 'yellow',
  3: 'orange',
  4: 'red'
};

const showTodo = function(filter) {
  let liTag = "";
  taskBox.innerHTML = liTag;
  let checkTask = taskBox.querySelectorAll(".task");
  !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
  taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
};

//hide category input box by default
document.querySelectorAll('.category').forEach(el => el.hidden = true);

// Show all activities when refreshing page
showTodo("all");
const showMenu = function(selectedTask) {
  let menuDiv = selectedTask.parentElement.lastElementChild;
  menuDiv.classList.add("show");
  document.addEventListener("click", e => {
    if (e.target.tagName !== "I" || e.target !== selectedTask) {
      menuDiv.classList.remove("show");
    }
  });
};

const updateStatus = function(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
};

//notes: needs to add priority and categorys
const editTask = function(taskId, textName, date, priority) {
  document.querySelectorAll('.category').forEach(el => el.hidden = false);
  editId = taskId;
  isEditTask = true;
  taskInput.value = textName;
  dateInput.value = date;
  priorityInput.value = priority;
  categoryInput.value = category;
  //console.log('Test edit, priority', priority, ' .Test edit, category, ', category);
  taskInput.focus();
  taskInput.classList.add("active");
};

const deleteTask = function(deleteId, filter) {
  isEditTask = false;
  console.log(deleteId);
  $.ajax({
    type: 'POST',
    url: `/api/tasks/${deleteId}/delete`,
    success: function() {
      loadTasks();
    }
  });
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(filter);
};

clearAll.addEventListener("click", () => {
  isEditTask = false;
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
});

taskInput.addEventListener("keyup", e => {
  let userTask = taskInput.value.trim();
  let date = dateInput.value.trim();
  let priority = $(".priority :selected").val();
  let category = $(".category :selected").val();
  let taskInfo = {};

  if (e.key == "Enter" && userTask) {
    //console.log('test priority', priority);
    //console.log('test category', category);
    let taskInfo;
    if (!isEditTask) {
      todos = !todos ? [] : todos;
      taskInfo = {name: userTask, date: date, priority: priority, category: category,status: "pending"};
      todos.push(taskInfo);
      //console.log(priorityInput) => default
    } else {
      isEditTask = false;
      todos[editId].name = userTask;
      todos[editId].date = date;
      todos[editId].priority = priority;
      todos[editId].category = category;
    }

    //Clear up the input boxes after submission
    taskInput.value = "";
    dateInput.value = "";
    priorityInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    console.log(taskInfo);
    $.ajax({
      type: 'POST',
      url: '/api/tasks',
      data: taskInfo,
      success: function() {
        showTodo(document.querySelector("span.active").id);
        loadTasks();
      }
    });
  }
});
