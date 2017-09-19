import { Meteor } from "meteor/meteor";
import Todos from "../imports/api/todoSchema";

var sel = el => document.querySelector(el);
var $ = el => document.querySelectorAll(el);

Meteor.startup(() => {
  var form = sel("[name='form']");
  var app = sel("#app");
  var todo = sel("[name='todo']");
  var text = "";

  function addEventListenerAndCallMeteorFn(allItems, callback) {
    [...allItems].map(item => {
      item.addEventListener("click", callback);
    });
  }
  Meteor.subscribe("todos");

  Meteor.autorun(() => {
    var todos = Todos.find().fetch();
    var items = [];
    todos.map(todo => {
      items.push(
        `
          <li class='item'>
            <span data-id=${todo._id} class='${todo.completed
          ? "completed"
          : ""}'>${todo.text}</span>
            <button data-id=${todo._id}>X</button>
          </li>
        `
      );
    });
    app.innerHTML = items.join("");

    addEventListenerAndCallMeteorFn($(".item>span"), function() {
      this.classList.toggle("completed");
      Meteor.call("todos.toggle", this.dataset.id);
    });

    addEventListenerAndCallMeteorFn($(".item>button"), function() {
      Meteor.call("todos.delete", this.dataset.id);
    });

    addEventListenerAndCallMeteorFn($("#deleteAll"), function() {
      Meteor.call("todos.drop");
    });
  });

  todo.addEventListener("change", e => {
    text = e.target.value;
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    var trimmedTodo = text.trim();
    text = "";
    todo.value = "";
    if (trimmedTodo !== "") Meteor.call("todos.insert", trimmedTodo);
  });
});
