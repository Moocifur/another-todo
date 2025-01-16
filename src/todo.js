/* todos.js */

// Factory Function
export const createTodo = (title, description, dueDate, priority, notes = '', checklist = []) => {
    let completed = false;

    return {
        title,
        description,
        dueDate,
        priority,
        notes,
        checklist,
        completed,
        toggleCompleted() {
            this.completed = !this.completed;
        }
    };
};

