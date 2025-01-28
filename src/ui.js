// ui.js
import { projectManager } from "./projectManager.js";

//Clear the content of an element
export function clearElement(element) {
    element.innerHTML = '';
}

// Helper: Create a button with text, classes, and an optional click handler
function createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(className);
    if (onClick) button.addEventListener('click', onClick);
    return button;
}

// Render all projects in the sidebar
export function renderProjects(handleProjectClick, handleProjectRemove, renderTodos) {
    const projectList = document.getElementById('project-list');
    clearElement(projectList);

    // Add the "All" filter---
    const allItem = document.createElement('li');
    allItem.textContent = 'All';
    allItem.classList.add('project-item', 'all-item');
    allItem.addEventListener('click', () => {
        console.log('Show All Todos clicked');
        renderTodos(null, true); // Show todos from all projects
    });
    projectList.appendChild(allItem);

    // Add the "General" project
    const generalProject = projectManager.getDefaultProject();
    const generalItem = document.createElement('li');
    generalItem.textContent = generalProject.name;
    generalItem.classList.add('project-item', 'general-item');
    generalItem.addEventListener('click', () => handleProjectClick(generalProject));
    projectList.appendChild(generalItem);

    // Add user-created projects
    const projects = projectManager.getProjects().filter((p) => p !== generalProject); //So this means get projects except the general project?
    projects.forEach((project) => {
        const li = document.createElement('li');
        li.textContent = project.name;
        li.classList.add('project-item');

        // Add a click event to render the todos for this project
        li.addEventListener('click', () => handleProjectClick(project)); 

        // Add a remove button for this project
        const removeButton = createButton("Remove", "remove-project", (e) => {
            e.stopPropagation();
            handleProjectRemove(project);
        });

        li.appendChild(removeButton);
        projectList.appendChild(li);
    });

    // Show a placeholder if no user-created projects exist
    if (projects.length === 0) {
        const placeholder = document.createElement('p');
        placeholder.textContent = 'No projects yet. Add one!';
        placeholder.classList.add('placeholder');
    }
}

// Render todos for a project or all todos for Default
export function renderTodos(project, isDefault = false) {
    const todoList = document.getElementById('todo-list');
    clearElement(todoList);

    // Decide which todos to render (default: all todos, otherwise: specific project todos)
    const todos = isDefault
    ? projectManager.getProjects().flatMap((p) => p.todos)
    : project.todos;

    // Add a header
    const header = document.createElement('h3');
    header.textContent = isDefault ? "All Todos" : `Todos for ${project.name}`;
    todoList.appendChild(header);

    // Show a placeholder if no todos exist
    if (todos.length === 0) {
        const placeholder = document.createElement('p');
        placeholder.textContent = "No todos yet. Add one!";
        placeholder.classList.add('placeholder');
        todoList.appendChild(placeholder);
        return; // Stop rendering further
    }

    // Render each todo
    todos.forEach((todo) => {
        const li = document.createElement('li');
        li.textContent = todo.title;
        li.classList.add('todo-item');

        // Add toggle button
        const toggleButton = createButton(
            todo.completed ? 'Mark Incomplete' : 'Mark Completed',
            'todo-toggle',
            () => {
                todo.toggleCompleted();
                renderTodos(project, isDefault);
            }
        );

        // Add delete button
        const deleteButton = createButton('Delete', 'todo-delete', () => {
            if (isDefault) {
                const projectWithTodo = projectManager.getProjects().find((p) => p.todos.includes(todo));
                if (projectWithTodo) {
                    projectWithTodo.removeTodo(todo.title);
                }
            } else {
                project.removeTodo(todo.title);
            }
            renderTodos(project, isDefault);
        });

        li.appendChild(toggleButton);
        li.appendChild(deleteButton);
        todoList.appendChild(li);
    });
}