import { Meteor } from "meteor/meteor";
import Todos from "./todoSchema";

Meteor.methods({
  "todos.insert"(text) {
    Todos.insert({
      text,
      completed: false
    });
  },
  "todos.toggle"(_id) {
    const completed = !Todos.find({ _id }).fetch()[0].completed;
    Todos.update(
      { _id },
      {
        $set: {
          completed
        }
      }
    );
  },
  "todos.delete"(_id) {
    Todos.remove({ _id }); //.fetch();
  },
  "todos.drop"() {
    Todos.remove({});
  }
});
