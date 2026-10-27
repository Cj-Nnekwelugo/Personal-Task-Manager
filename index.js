// ========================================
// 1. SELECT HTML ELEMENTS
// ========================================

const taskForm = document.getElementById("task-form");

const taskTitle = document.getElementById("task-title");
const taskDescription = document.getElementById("task-description");
const taskPriority = document.getElementById("task-priority");
const taskDate = document.getElementById("date");

const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const taskCount = document.getElementById("task-count");

const formStatus = document.getElementById("form-status");
const addTaskBtn = document.getElementById("add-task-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");

const taskFilter = document.getElementById("task-filter");



let tasks = [];

let editingTaskId = null;

const STORAGE_KEY = "personal-task-manager-tasks";


function loadTasks() {
try {
const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (savedTasks === null) {
        tasks = [];
        return;
    }

    const parsedTasks = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
        throw new Error("Saved tasks are not in the expected format.");
    }

    tasks = parsedTasks;
} catch (error) {
    console.error("Could not load saved tasks:", error);

    tasks = [];

    showMessage(
        "Saved tasks could not be loaded. Check the browser console for details.",
        true
    );
}

}


function saveTasks() {
try {
localStorage.setItem(
STORAGE_KEY,
JSON.stringify(tasks)
);

    return true;
} catch (error) {
    console.error("Could not save tasks:", error);

    showMessage(
        "Your changes could not be saved. Check your browser storage settings.",
        true
    );

    return false;
}

}



function showMessage(message, isError = false) {
formStatus.textContent = message;

formStatus.className = isError
    ? "mt-3 text-red-600"
    : "mt-3 text-green-600";

}


function resetForm() {
taskForm.reset();

editingTaskId = null;

addTaskBtn.textContent = "Add Task";

cancelEditBtn.classList.add("hidden");

}


taskForm.addEventListener("submit", function (event) {
event.preventDefault();

const title = taskTitle.value.trim();
const description = taskDescription.value.trim();
const priority = taskPriority.value;
const dueDate = taskDate.value;



if (title === "") {
    showMessage("Please enter a task title.", true);
    taskTitle.focus();
    return;
}



if (!["low", "medium", "high"].includes(priority)) {
    showMessage("Please select a valid priority.", true);
    return;
}



if (editingTaskId !== null) {
    const taskIndex = tasks.findIndex(function (task) {
        return task.id === editingTaskId;
    });

    if (taskIndex === -1) {
        showMessage("This task could not be found.", true);
        resetForm();
        return;
    }

    const oldTask = tasks[taskIndex];

    tasks[taskIndex] = {
        ...oldTask,
        title: title,
        description: description,
        priority: priority,
        dueDate: dueDate
    };

    if (!saveTasks()) {
        tasks[taskIndex] = oldTask;
        return;
    }

    showMessage("Task updated successfully.");

} else {
  

    const newTask = {
        id: createTaskId(),
        title: title,
        description: description,
        priority: priority,
        dueDate: dueDate,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);

    if (!saveTasks()) {
        tasks.pop();
        return;
    }

    showMessage("Task added successfully.");
}

resetForm();

renderTasks();

});

