// DOM Elements
const inputs = document.querySelectorAll(".control-input, .color-input");
const styledImage = document.getElementById("styled-image");
const resetBtn = document.getElementById("reset-btn");
const errorMessage = document.getElementById("error-message");
const imageOptions = document.querySelectorAll(".image-option");
const currentTimeElement = document.getElementById("current-time");

// Value display elements
const baseValue = document.getElementById("base-value");
const widthValue = document.getElementById("width-value");
const borderRadiusValue = document.getElementById("border-radius-value");
const paddingValue = document.getElementById("padding-value");
const blurValue = document.getElementById("blur-value");
const colorPreview = document.getElementById("color-preview");

// Initialize the app
function init() {
  updateTime();
  setInterval(updateTime, 1000);

  // Set initial values display
  updateValueDisplays();

  // Add event listeners
  inputs.forEach(input => {
    input.addEventListener("input", handleInputChange);
  });

  resetBtn.addEventListener("click", resetToDefaults);

  imageOptions.forEach(option => {
    option.addEventListener("click", handleImageChange);
  });

  // Set initial active image
  document.querySelector(".image-option.active").click();
}

// Update current time
function updateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };
  currentTimeElement.textContent = now.toLocaleDateString("en-US", options);
}

// Handle input changes
function handleInputChange() {
  try {
    const suffix = this.dataset.sizing || "";
    const propertyName = `--${this.name}`;
    const propertyValue = this.value + suffix;

    // Validate inputs - Convert to numbers for proper comparison
    if (this.type === "range") {
      const val = parseFloat(this.value);
      const minVal = parseFloat(this.min);
      const maxVal = parseFloat(this.max);

      if (val < minVal || val > maxVal) {
        throw new Error(`Value for ${this.name} is out of range`);
      }
    }

    // Update CSS custom property
    document.documentElement.style.setProperty(propertyName, propertyValue);

    // Update value displays
    updateValueDisplays();

    // Hide any previous error
    hideError();
  } catch (error) {
    showError(error.message);
  }
}

// Update all value displays
function updateValueDisplays() {
  const baseColor = document.getElementById("base").value;
  baseValue.textContent = baseColor;
  colorPreview.style.backgroundColor = baseColor;

  widthValue.textContent = document.getElementById("width").value + "%";
  borderRadiusValue.textContent =
    document.getElementById("border-radius-img").value + "px";
  paddingValue.textContent = document.getElementById("padding").value + "px";
  blurValue.textContent = document.getElementById("blur").value + "px";
}

// Reset to default values
function resetToDefaults() {
  try {
    // Reset input values
    document.getElementById("base").value = "#4a6cf7";
    document.getElementById("width").value = 50;
    document.getElementById("border-radius-img").value = 15;
    document.getElementById("padding").value = 20;
    document.getElementById("blur").value = 0;

    // Reset CSS custom properties
    document.documentElement.style.setProperty("--base", "#4a6cf7");
    document.documentElement.style.setProperty("--width", "50%");
    document.documentElement.style.setProperty("--border-radius-img", "15px");
    document.documentElement.style.setProperty("--padding", "20px");
    document.documentElement.style.setProperty("--blur", "0px");

    // Update value displays
    updateValueDisplays();

    // Hide any previous error
    hideError();
  } catch (error) {
    showError("Failed to reset values: " + error.message);
  }
}

// Handle image change
function handleImageChange() {
  try {
    const newSrc = this.dataset.src;

    // Validate image source
    if (!newSrc) {
      throw new Error("Invalid image source");
    }

    // Update active state
    imageOptions.forEach(option => option.classList.remove("active"));
    this.classList.add("active");

    // Update image source
    styledImage.src = newSrc;

    // Hide any previous error
    hideError();
  } catch (error) {
    showError("Failed to change image: " + error.message);
  }
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");

  // Auto-hide error after 5 seconds
  setTimeout(hideError, 5000);
}

// Hide error message
function hideError() {
  errorMessage.classList.remove("show");
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
