// index.js
import "./styles.css";
import { createTodo } from "./todo.js";
import { createProject } from "./project.js";
import { projectManager } from "./projectManager.js"

//FUNCTIONS

// Check if a project name already exists
function isDuplicateProjectName(projectName) {
    return projectManager.getProjects().some((project) => project.name === projectName);
}

// Clear the content of an element
function clearElement(element) {
    element.innerHTML = '';
}

// Handle selecting a project
function handleProjectClick(project) {
    console.log(`Project select: ${project.name}`);
    renderTodos(project);
}

// Handle removing a project
function handleProjectRemove(project) {
    const projects = projectManager.getProjects();
    const projectIndex = projects.indexOf(project); 
    if (projectIndex !== -1) {
        projects.splice(projectIndex, 1); 
        renderProjects(); 
    }
}

// Render all projects in the sidebar
function renderProjects() {
    const projectList = document.getElementById('project-list');
    clearElement(projectList); 

    // Default Project
    const defaultItem = document.createElement('li');
    defaultItem.textContent = 'Default'; 
    defaultItem.classList.add('project-item', 'default-item');
    projectList.appendChild(defaultItem);

    // Show all todos when clicking Default
    defaultItem.addEventListener('click', () => {
        console.log('Show All Todos clicked');
        renderTodos(null, true);
    });

    // Add user-created projects
    const projects = projectManager.getProjects();
    projects.forEach((project) => {
        const li = document.createElement('li');
        li.textContent = project.name;
        li.classList.add('project-item');

        // Add a click event to render the todos for this project
        li.addEventListener('click', () => handleProjectClick(project));

        // Add a remove button for this project
        const removeButton = document.createElement('button');
        removeButton.textContent = "Remove";
        removeButton.classList.add('remove-project');

        // Prevents the click event on the project from triggering and removes the project
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents bubbling
            handleProjectRemove(project);
        });

        // Append the button and the project to the list
        li.appendChild(removeButton);
        projectList.appendChild(li);
    });
};

// Set up the project form for adding new projects
function setupProjectForm() {
    const projectForm = document.getElementById('project-form');
    const projectInput = document.getElementById('project-input');

    // When submit is activated..
    projectForm.onsubmit = (e) => {
        e.preventDefault(); 

        const projectName = projectInput.value.trim(); 
        if (projectName) {
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

// Render todos for a project or all todos for Default
function renderTodos(project, isDefault = false) {
    const todoList = document.getElementById('todo-list');
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');   
    clearElement(todoList); // Clear existing todos

    // Decide which todos to render (default: all todos, otherwise: specific project todos)
    const todos = isDefault
    ? projectManager.getProjects().flatMap((p) => p.todos)
    : project.todos;

    // Add a header for the Default Project view
    if (isDefault) {
        const header = document.createElement('h3');
        header.textContent = "All Todos";
        todoList.appendChild(header);
    } else {
        const header = document.createElement('h3');
        header.textContent = `Todos for ${project.name}`;
        todoList.appendChild(header);
    }

    // Create a list item for each todo
    todos.forEach((todo) => {
        const li = document.createElement('li');
        li.textContent = todo.title; 
        li.classList.add('todo-item');

        // Add a toggle button to mark the todo as complete/incomplete
        const toggleButton = document.createElement('button');
        toggleButton.textContent = todo.completed ? 'Mark Incomplete' : 'Mark Complete';
        toggleButton.classList.add('todo-toggle');

        // Add toggle functionality
        toggleButton.addEventListener('click', () => {
            todo.toggleCompleted();
            renderTodos(project, isDefault);
        });

        // Add delete button for the todo ---
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.classList.add('todo-delete');

        // Add delete functionality
        deleteButton.addEventListener('click', () => {
            if (isDefault) {
                // If in "Show All Todos," find the project the todo belongs to
                const ProjectWithTodo = projectManager.getProjects().find((p) => 
                    p.todos.includes(todo)
                ); 
                if (projectWithTodo) {
                    projectWithTodo.removeTodo(todo.title);
                }
            } else {
                project.removeTodo(todo.title);
            }
            renderTodos(project, isDefault);
        
        });

        // Append
        li.appendChild(toggleButton);
        li.appendChild(deleteButton);
        todoList.appendChild(li);
    });

    // Add a new todo to the selected project
    todoForm.onsubmit = (e) => {
        e.preventDefault();

        const todoTitle = todoInput.value.trim(); 
        if (todoTitle) {
            const targetProject = isDefault
            ? projectManager.getProjects()[0] || createProject('General')
            : project;

            // Add the new todo to the appropriate project
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

// INITIAL CALLS
renderProjects();
setupProjectForm();