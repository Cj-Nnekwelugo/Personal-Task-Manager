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

