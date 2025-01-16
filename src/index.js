// index.js
import "./styles.css";
import { createTodo } from "./todo.js";
import { createProject } from "./project.js";
import { projectManager } from "./projectManager.js"

// projects in sidebar
function renderProjects() {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';

    // Default Project
    const defaultItem = document.createElement('li');
    defaultItem.textContent = 'Default';
    defaultItem.classList.add('project-item', 'default-item');
    projectList.appendChild(defaultItem);

    defaultItem.addEventListener('click', () => {
        console.log('poopie');
        renderTodos({
            todos: projectManager.getProjects().flatMap((project) => project.todos),
        });
    });

    // Render Projects
    const projects = projectManager.getProjects();
    projects.forEach((project) => {

        // Create li
        const li = document.createElement('li');
        li.textContent = project.name;
        li.classList.add('project-item');

        // Add clickability to li
        li.addEventListener('click', () => {
            console.log(`Project selected: ${project.name}`);
            renderTodos(project);
        });

        // Add remove button with construction
        const removeButton = document.createElement('button');
        removeButton.textContent = "Remove";
        removeButton.classList.add('remove-project');
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            projectManager.getProjects().splice(projects.indexOf(project), 1);
            renderProjects();
        });

        // Add to the DOM
        li.appendChild(removeButton);
        projectList.appendChild(li);
    });
};


function renderTodos(project) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    project.todos.forEach((todo) => {
        const li = document.createElement('li');
        li.textContent = todo.title;
        li.classList.add('todo-item');

        // Complete toggle
        const toggleButton = document.createElement('button');
        toggleButton.textContent = todo.completed ? 'Mark Incomplete' : 'Mark Complete';
        toggleButton.classList.add('todo-toggle');
        toggleButton.addEventListener('click', () => {
            todo.toggleCompleted();
            renderTodos(project);
        });

        li.appendChild(toggleButton);
        todoList.appendChild(li);
    })
}


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
const personalProject = createProject('Personal');
projectManager.addProject(workProject);
projectManager.addProject(personalProject);

// Example 4 
workProject.addTodo(createTodo('Prepare slides', 'for the meeting', '2025-01-20', 'High'));
personalProject.addTodo(createTodo('Buy milk', 'At the grocery store', '2025-01-10', 'Low'));

renderProjects();