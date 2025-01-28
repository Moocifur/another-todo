// storage.js
import { createProject } from "./project.js";
import { createTodo } from "./todo.js";
import { projectManager } from "./projectManager.js";

const STORAGE_KEY = "projects"; // Why do we write storage key as STORAGE_KEY and not storageKey or something?

export const storage = (() => {
    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projectManager.getProjects()));
    }

    function load() {
        const savedProjects = localStorage.getItem(STORAGE_KEY);
        if (savedProjects) {
            const projects = JSON.parse(savedProjects);
            projects.forEach((projectData) => {
                const project = createProject(projectData.name);
                projectData.todos.forEach((todoData) => {
                    const todo = createTodo(
                        todoData.title,
                        todoData.description,
                        todoData.dueDate,
                        todoData.priority
                    );
                    if (todoData.completed) {
                        todo.toggleCompleted(); // Preserve the completion state
                    }
                    project.addTodo(todo);
                });
                projectManager.addProject(project);
            });
        }
    }

    return {
        save,
        load,
    };
})();