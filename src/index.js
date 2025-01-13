// index.js
import "./styles.css";
import { createTodo } from "./todo.js";
import { createProject } from "./project.js";
import { projectManager } from "./projectManager.js"

// Example Usage
const exampleTodo = createTodo(
    'Finish Odin Project Todo App',
    'Work on Javascript module',
    '2025-01-15',
    'High',
    'Focus on modularity'
);
console.log(exampleTodo);
exampleTodo.toggleCompleted();
console.log(exampleTodo);

// Example Usage 2
const exampleProject = createProject('Personal Tasks');
const todo1 = createTodo('Buy groceries', 'Get fruits and vegtables', '2025-01-12', 'Medium');
exampleProject.addTodo(todo1);
console.log(exampleProject);
exampleProject.removeTodo('Buy groceries');
console.log(exampleProject);

// Example usage 3
const workProject = createProject('Work');
projectManager.addProject(workProject);
console.log(projectManager.getProjects());