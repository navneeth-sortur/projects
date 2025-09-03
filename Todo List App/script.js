class TodoApp {
  constructor() {
    this.todos = [];
    this.currentFilter = "all";
    this.init();
  }

  init() {
    this.loadTodos();
    this.bindEvents();
    this.render();
    this.startClock();
  }

  startClock() {
    // Update time immediately
    this.updateDateTime();

    // Update time every second
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  updateDateTime() {
    const now = new Date();

    // Format date
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    const dateString = now.toLocaleDateString("en-US", options);
    document.getElementById("currentDate").textContent = dateString;

    // Format time
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    document.getElementById("currentTime").textContent = timeString;
  }

  bindEvents() {
    document
      .getElementById("addBtn")
      .addEventListener("click", () => this.addTodo());
    document.getElementById("taskInput").addEventListener("keypress", e => {
      if (e.key === "Enter") this.addTodo();
    });

    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", e =>
        this.setFilter(e.target.dataset.filter)
      );
    });

    // Prevent XSS by sanitizing input
    document.getElementById("taskInput").addEventListener("input", e => {
      e.target.value = this.sanitizeInput(e.target.value);
    });
  }

  sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  }

  addTodo() {
    const taskInput = document.getElementById("taskInput");
    const errorMessage = document.getElementById("errorMessage");
    const taskText = taskInput.value.trim();

    // Validation
    if (!taskText) {
      this.showError("Please enter a task");
      return;
    }

    if (taskText.length > 100) {
      this.showError("Task must be less than 100 characters");
      return;
    }

    // Clear error and input
    this.clearError();
    taskInput.value = "";

    const todo = {
      id: Date.now(),
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.todos.push(todo);
    this.saveTodos();
    this.render();
  }

  showError(message) {
    const errorElement = document.getElementById("errorMessage");
    errorElement.textContent = message;
    errorElement.style.display = "block";

    setTimeout(() => {
      this.clearError();
    }, 3000);
  }

  clearError() {
    const errorElement = document.getElementById("errorMessage");
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }

  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      todo.updatedAt = new Date().toISOString();
      this.saveTodos();
      this.render();
    }
  }

  editTodo(id, newText) {
    const todo = this.todos.find(t => t.id === id);
    if (todo && newText.trim()) {
      todo.text = this.sanitizeInput(newText.trim());
      todo.updatedAt = new Date().toISOString();
      this.saveTodos();
      this.render();
    }
  }

  deleteTodo(id) {
    const todoElement = document.querySelector(`[data-id="${id}"]`);
    if (todoElement) {
      todoElement.style.animation = "slideOut 0.3s ease forwards";

      setTimeout(() => {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
      }, 300);
    }
  }

  setFilter(filter) {
    this.currentFilter = filter;

    // Update active filter button
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.filter === filter);
    });

    this.render();
  }

  getFilteredTodos() {
    switch (this.currentFilter) {
      case "active":
        return this.todos.filter(todo => !todo.completed);
      case "completed":
        return this.todos.filter(todo => todo.completed);
      default:
        return this.todos;
    }
  }

  saveTodos() {
    try {
      localStorage.setItem("todos", JSON.stringify(this.todos));
    } catch (error) {
      console.error("Error saving todos:", error);
      this.showError("Failed to save tasks. Local storage might be full.");
    }
  }

  loadTodos() {
    try {
      const todosStr = localStorage.getItem("todos");
      if (todosStr) {
        this.todos = JSON.parse(todosStr);
      }
    } catch (error) {
      console.error("Error loading todos:", error);
      this.showError("Failed to load tasks. Data might be corrupted.");
      this.todos = [];
    }
  }

  updateStats() {
    const total = this.todos.length;
    const completed = this.todos.filter(todo => todo.completed).length;

    document.getElementById("totalTasks").textContent = `${total} task${
      total !== 1 ? "s" : ""
    }`;
    document.getElementById(
      "completedTasks"
    ).textContent = `${completed} completed`;
  }

  render() {
    const todosContainer = document.getElementById("todos");
    const emptyState = document.getElementById("emptyState");
    const filteredTodos = this.getFilteredTodos();

    this.updateStats();

    if (filteredTodos.length === 0) {
      todosContainer.innerHTML = "";
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";

    todosContainer.innerHTML = filteredTodos
      .map(
        todo => `
                  <div class="todo-item ${
                    todo.completed ? "completed" : ""
                  }" data-id="${todo.id}">
                      <input 
                          type="checkbox" 
                          class="todo-checkbox" 
                          ${todo.completed ? "checked" : ""}
                          onchange="app.toggleTodo(${todo.id})"
                      >
                      <span class="todo-text">${todo.text}</span>
                      <div class="todo-actions">
                          <button class="todo-btn edit-btn" onclick="app.startEdit(${
                            todo.id
                          })">
                              <i class="fas fa-edit"></i>
                          </button>
                          <button class="todo-btn delete-btn" onclick="app.deleteTodo(${
                            todo.id
                          })">
                              <i class="fas fa-trash"></i>
                          </button>
                      </div>
                  </div>
              `
      )
      .join("");
  }

  startEdit(id) {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) return;

    const todoElement = document.querySelector(`[data-id="${id}"]`);
    const todoText = todoElement.querySelector(".todo-text");

    const input = document.createElement("input");
    input.type = "text";
    input.value = todo.text;
    input.className = "edit-input";
    input.style.cssText = `
                  flex: 1;
                  padding: 8px;
                  border: 2px solid var(--primary-color);
                  border-radius: 6px;
                  font-size: 1rem;
              `;

    const saveEdit = () => {
      this.editTodo(id, input.value);
      todoElement.removeEventListener("blur", saveEdit);
    };

    const handleKeyPress = e => {
      if (e.key === "Enter") {
        saveEdit();
      } else if (e.key === "Escape") {
        this.render();
      }
    };

    input.addEventListener("blur", saveEdit);
    input.addEventListener("keydown", handleKeyPress);

    todoText.replaceWith(input);
    input.focus();
  }
}

// Initialize the app
const app = new TodoApp();

// Export for global access (for inline handlers)
window.app = app;
