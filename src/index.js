// index.js
import "./styles.css";
import { createTodo } from "./todo.js";
import { createProject } from "./project.js";
import { projectManager } from "./projectManager.js"

//FUNCTIONS

// Duplicate Project Checker
function isDuplicateProjectName(projectName) {
    return projectManager.getProjects().some((project) => project.name === projectName);
}

// Clear Page
function clearElement(element) {
    element.innerHTML = '';
}

// Handle Project Click
function handleProjectClick(project) {
    console.log(`Project select: ${project.name}`);
    renderTodos(project);
}

// Handle Project Remove
function handleProjectRemove(project) {
    const projects = projectManager.getProjects();
    const projectIndex = projects.indexOf(project);
    if (projectIndex !== -1) {
        projects.splice(projectIndex, 1);
        renderProjects();
    }
}

// Render Projects in Sidebar
function renderProjects() {
    const projectList = document.getElementById('project-list');
    clearElement(projectList);

    // Default Project
    const defaultItem = document.createElement('li');
    defaultItem.textContent = 'Default';
    defaultItem.classList.add('project-item', 'default-item');
    projectList.appendChild(defaultItem);

    defaultItem.addEventListener('click', () => {
        console.log('Show All Todos clicked');
        renderTodos(null, true); // Pass `true` for the default project
    }); // I'M HERE

    // Render Projects
    const projects = projectManager.getProjects();
    projects.forEach((project) => {

        // Create li
        const li = document.createElement('li');
        li.textContent = project.name;
        li.classList.add('project-item');

        // Add clickability to li
        li.addEventListener('click', () => handleProjectClick(project));

        // Add remove button with construction
        const removeButton = document.createElement('button');
        removeButton.textContent = "Remove";
        removeButton.classList.add('remove-project');

        removeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            handleProjectRemove(project);
        });

        // Add to the DOM
        li.appendChild(removeButton);
        projectList.appendChild(li);
    });

    // Render the default view on initial load
    renderTodos(null, true); // Show all tod.os by default
};

// Setup Project Form @@@@@@@
function setupProjectForm() {
    const projectForm = document.getElementById('project-form');
    const projectInput = document.getElementById('project-input');

    // When submit is activated..
    projectForm.onsubmit = (e) => {
        e.preventDefault();

        // Collect Input
        const projectName = projectInput.value.trim();
        if (projectName) {
            // if a project has same name as input...
            if (isDuplicateProjectName(projectName)) {
                alert('Project with this name already exists.');
            } else {
                const newProject = createProject(projectName);
                projectManager.addProject(newProject);
                renderProjects();
                projectInput.value = '';
            }
        } else {
            alert ('Please enter a project name.');
        }
    };
}

// Initial Calls?
renderProjects();
setupProjectForm();

// Render Todos in Main
function renderTodos(project, isDefault = false) {
    const todoList = document.getElementById('todo-list');
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');   
    clearElement(todoList);

    // True : False
    const todos = isDefault
    ? projectManager.getProjects().flatMap((p) => p.todos)
    : project.todos;

    //
    if (isDefault) {
        const header = document.createElement('h3');
        header.textContent = "All Todos";
        todoList.appendChild(header);
    }

    // Create todo
    todos.forEach((todo) => {
        const li = document.createElement('li');
        li.textContent = todo.title;
        li.classList.add('todo-item');

        // Complete toggle
        const toggleButton = document.createElement('button');
        toggleButton.textContent = todo.completed ? 'Mark Incomplete' : 'Mark Complete';
        toggleButton.classList.add('todo-toggle');
        toggleButton.addEventListener('click', () => {
            todo.toggleCompleted();
            renderTodos(project, isDefault);
        });

        li.appendChild(toggleButton);
        todoList.appendChild(li);
    });

    // Handle Todo Form Submission
    todoForm.onsubmit = (e) => {
        e.preventDefault();

        const todoTitle = todoInput.value.trim();
        if (todoTitle) {
            const targetProject = isDefault
            ? projectManager.getProject()[0] || createProject('General')
            : project;

            if (isDefault && !projectManager.getProjects().length) {
                projectManager.addProject(targetProject);
                renderProjects();
            }

            targetProject.addTodo(createTodo(todoTitle, '', '', 'Medium'));
            renderTodos(project, isDefault);
            todoInput.value = '';
        }
    }
}


// Example Usage--------------------------------
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