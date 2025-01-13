// projectManager.js

// Project Manager
export const projectManager = (() => {
    const projects = [];

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
        }
    };
})();