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

