// projectManager.js

// Project Manager
export const projectManager = (() => {
    const projects = [];

    // Ensure a default/general project exists
    const defaultProject = {
        name: 'General',
        todos: [],
        addTodo(todo) {
            this.todos.push(todo);
        },
        removeTodo(todoTitle) {
            this.todos = this.todos.filter((todo) => todo.title !== todoTitle);
        },
    };
    projects.push(defaultProject);

    return {
        getProjects() {
            return projects;
        },
        addProject(project) {
            if (projects.some((p) => p.name === project.name)) {
                console.error(`Project "${project.name}" already exists.`);
                return;
            }
            projects.push(project);
        },
        getProject(name) {
            return projects.find((project) => project.name === name) || nul;
        },
        getDefaultProject() {
            return defaultProject;
        },
    };
})();