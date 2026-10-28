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



function createTaskId() {
return (
Date.now().toString(36) +
Math.random().toString(36).slice(2)
);
}



function renderTasks() {
taskList.replaceChildren();

let filteredTasks = tasks;

// Apply the selected filter.

if (taskFilter.value === "pending") {
    filteredTasks = tasks.filter(function (task) {
        return !task.completed;
    });
}

if (taskFilter.value === "completed") {
    filteredTasks = tasks.filter(function (task) {
        return task.completed;
    });
}

// Display the empty-state message when needed.

emptyMessage.classList.toggle(
    "hidden",
    filteredTasks.length > 0
);

if (tasks.length === 0) {
    emptyMessage.textContent = "You haven't added any tasks yet.";
} else if (filteredTasks.length === 0) {
    emptyMessage.textContent = "No tasks match this filter.";
}

// Display task statistics.

const completedCount = tasks.filter(function (task) {
    return task.completed;
}).length;

const pendingCount = tasks.length - completedCount;

taskCount.textContent =
    "Total: " + tasks.length +
    " | Pending: " + pendingCount +
    " | Completed: " + completedCount;

// Create a card for each task.

filteredTasks.forEach(function (task) {
    const card = document.createElement("article");

    card.className =
        "rounded-lg border border-gray-200 p-4 shadow-sm";

    // Task title.

    const title = document.createElement("h3");

    title.className = "mb-2 text-lg font-bold";

    title.textContent = task.title;

    if (task.completed) {
        title.classList.add("line-through", "text-gray-500");
    }

    card.appendChild(title);

    // Task description.

    if (task.description) {
        const description = document.createElement("p");

        description.className = "mb-2 text-gray-600";

        description.textContent = task.description;

        card.appendChild(description);
    }

    // Task priority.

    const priority = document.createElement("p");

    priority.className = "mb-2";

    priority.textContent =
        "Priority: " + capitalize(task.priority);

    if (task.priority === "high") {
        priority.classList.add("font-semibold", "text-red-600");
    } else if (task.priority === "medium") {
        priority.classList.add("text-yellow-700");
    } else {
        priority.classList.add("text-green-700");
    }

    card.appendChild(priority);

    // Task due date.

    if (task.dueDate) {
        const dueDate = document.createElement("p");

        dueDate.className = "mb-2 text-sm text-gray-600";

        dueDate.textContent = "Due date: " + task.dueDate;

        card.appendChild(dueDate);
    }

    // Task status.

    const status = document.createElement("p");

    status.className = "mb-3 text-sm";

    status.textContent = task.completed
        ? "Status: Completed"
        : "Status: Pending";

    card.appendChild(status);

    // Create the task action buttons.

    const buttonContainer = document.createElement("div");

    buttonContainer.className = "flex flex-wrap gap-2";

    // Complete or reopen button.

    const completeBtn = document.createElement("button");

    completeBtn.type = "button";

    completeBtn.className =
        "rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700";

    completeBtn.textContent = task.completed
        ? "Reopen"
        : "Complete";

    completeBtn.addEventListener("click", function () {
        toggleTaskCompletion(task.id);
    });

    buttonContainer.appendChild(completeBtn);

    // Edit button.

    const editBtn = document.createElement("button");

    editBtn.type = "button";

    editBtn.className =
        "rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700";

    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", function () {
        editTask(task.id);
    });

    buttonContainer.appendChild(editBtn);

    // Delete button.

    const deleteBtn = document.createElement("button");

    deleteBtn.type = "button";

    deleteBtn.className =
        "rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700";

    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", function () {
        deleteTask(task.id);
    });

    buttonContainer.appendChild(deleteBtn);

    card.appendChild(buttonContainer);

    taskList.appendChild(card);
});

}



function toggleTaskCompletion(taskId) {
const task = tasks.find(function (task) {
return task.id === taskId;
});

if (!task) {
    showMessage("Task not found.", true);
    return;
}

const previousStatus = task.completed;

task.completed = !task.completed;

if (!saveTasks()) {
    task.completed = previousStatus;
    return;
}

showMessage(
    task.completed
        ? "Task marked as completed."
        : "Task reopened."
);

renderTasks();

}



function editTask(taskId) {
const task = tasks.find(function (task) {
return task.id === taskId;
});

if (!task) {
    showMessage("Task not found.", true);
    return;
}

// Put the existing task details into the form.

taskTitle.value = task.title;

taskDescription.value = task.description;

taskPriority.value = task.priority;

taskDate.value = task.dueDate;

// Remember which task is being edited.

editingTaskId = task.id;

addTaskBtn.textContent = "Update Task";

cancelEditBtn.classList.remove("hidden");

showMessage("Edit your task and select Update Task.");

// Move the user to the form.

document.getElementById("add-task").scrollIntoView({
    behavior: "smooth"
});

taskTitle.focus();

}

