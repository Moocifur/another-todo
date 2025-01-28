// index.js
import "./styles.css";
import { createTodo } from "./todo.js";
import { createProject } from "./project.js";
import { projectManager } from "./projectManager.js";
import { renderProjects, renderTodos } from "./ui.js";
import { storage } from "./storage.js";

// Track the currently selected project
let currentProject = null;

// Check if a project name already exists
function isDuplicateProjectName(projectName) {
    return projectManager.getProjects().some((project) => project.name === projectName);
}

// Handle selecting a project
function handleProjectClick(project) {
    console.log(`Project select: ${project.name}`);
    currentProject = project; // Update the currently selected project
    renderTodos(project);
}

// Handle removing a project
function handleProjectRemove(project) {
    const projects = projectManager.getProjects();
    const projectIndex = projects.indexOf(project); 
    if (projectIndex !== -1) { 
        projects.splice(projectIndex, 1);
        currentProject = projects[0] || null; // Reset the current project if it was removed
        renderProjects(handleProjectClick, handleProjectRemove, renderTodos); 
        storage.save(); //Save to local storage
    }
}

// Set up the project form for adding new projects
function setupProjectForm() {
    const projectForm = document.getElementById('project-form');
    const projectInput = document.getElementById('project-input');

    projectForm.onsubmit = (e) => {
        e.preventDefault(); 

        const projectName = projectInput.value.trim(); 
        if (projectName) {
            if (isDuplicateProjectName(projectName)) {
                alert('Project with this name already exists.');
            } else {
                const newProject = createProject(projectName); 
                projectManager.addProject(newProject); 
                renderProjects(handleProjectClick, handleProjectRemove, renderTodos);
                storage.save(); 
                projectInput.value = '';
            }
        } else {
            alert ('Please enter a project name.');
        }
    };
}

// Set up the todo form for adding new todos
function setupTodoForm() {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');

    todoForm.onsubmit = (e) => {
        e.preventDefault(); // Prevent the form from submitting and refreshing the page

        const todoTitle = todoInput.value.trim();
        if (todoTitle) {
            const targetProject = currentProject || projectManager.getDefaultProject()[0] || createProject('General');

            targetProject.addTodo(createTodo(todoTitle, '', '', 'Medium'));
            renderTodos(targetProject); // Refresh the todo list
            storage.save(); // Save the state to localStorage
            todoInput.value = ''; // Clear the input field
        }
    };
}

// INITIAL CALLS
storage.load();
renderProjects(handleProjectClick, handleProjectRemove, renderTodos);
setupProjectForm();
setupTodoForm();