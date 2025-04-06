// Grabbing all necessary DOM elements
const lengthSlider = document.getElementById("length");
const lengthVal = document.getElementById("lengthVal");
const passwordOutput = document.getElementById("password");
const strengthText = document.getElementById("strength");
const labelInput = document.getElementById("labelInput");
const savedList = document.getElementById("savedPasswords");

// Character sets for generating passwords
const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerChars = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/";

// Update the length display text as slider moves
lengthSlider.oninput = () => {
  lengthVal.textContent = lengthSlider.value;
};

// Generates a new password based on selected options
function generatePassword() {
  const length = +lengthSlider.value;
  const useUpper = document.getElementById("uppercase").checked;
  const useLower = document.getElementById("lowercase").checked;
  const useNumbers = document.getElementById("numbers").checked;
  const useSymbols = document.getElementById("symbols").checked;

  // Build a pool of characters based on user selection
  let charPool = "";
  if (useUpper) charPool += upperChars;
  if (useLower) charPool += lowerChars;
  if (useNumbers) charPool += numbers;
  if (useSymbols) charPool += symbols;

  // Ensure at least one option is selected
  if (!charPool) {
    passwordOutput.innerHTML = `<i class="fas fa-triangle-exclamation text-danger"></i> Please select at least one option!`;
    strengthText.textContent = "";
    return;
  }

  // Generate the password randomly
  let password = "";
  for (let i = 0; i < length; i++) {
    const randIndex = Math.floor(Math.random() * charPool.length);
    password += charPool[randIndex];
  }

  passwordOutput.textContent = password;
  checkStrength(password); // Show password strength
}

// Checks and displays the strength of the password
function checkStrength(pwd) {
  let score = 0;
  if (/[a-z]/.test(pwd)) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  if (pwd.length >= 16) score++;

  const levels = ["Weak", "Medium", "Strong", "Very Strong"];
  const colors = ["#ff6b6b", "#ffc107", "#28a745", "#00e1ff"];
  const idx = Math.min(score - 1, levels.length - 1);

  strengthText.textContent = `Strength: ${levels[idx]}`;
  strengthText.style.color = colors[idx];
}

// Copies the generated password to clipboard
function copyPassword() {
  const pwd = passwordOutput.textContent;
  if (pwd && !pwd.includes("Please select")) {
    navigator.clipboard.writeText(pwd).then(() => {
      alert("Password copied to clipboard!");
    });
  }
}

// Saves the password to localStorage with a custom label
function savePassword() {
  const label = labelInput.value.trim();
  const pwd = passwordOutput.textContent;

  if (!label) {
    alert("Please enter a label for the password (e.g., Gmail, Twitter)");
    return;
  }
  if (!pwd || pwd.includes("Please select")) {
    alert("Please generate a valid password first.");
    return;
  }

  let saved = JSON.parse(localStorage.getItem("savedPasswords") || "[]");
  saved.unshift({ label, pwd }); // Add new entry to the beginning
  localStorage.setItem("savedPasswords", JSON.stringify(saved));

  labelInput.value = "";
  displaySavedPasswords();
}

// Displays all saved passwords
function displaySavedPasswords() {
  const saved = JSON.parse(localStorage.getItem("savedPasswords") || "[]");

  savedList.innerHTML = saved.length === 0
    ? "<p>No passwords saved yet.</p>"
    : "";

  saved.forEach((entry, index) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <span><strong>${entry.label}:</strong> ${entry.pwd}</span>
      <button onclick="deleteSaved(${index})" title="Delete">
        <i class="fas fa-trash-alt text-danger"></i>
      </button>
    `;
    savedList.appendChild(div);
  });
}

// Deletes a specific password
function deleteSaved(index) {
  let saved = JSON.parse(localStorage.getItem("savedPasswords") || "[]");
  saved.splice(index, 1);
  localStorage.setItem("savedPasswords", JSON.stringify(saved));
  displaySavedPasswords();
}

// Clears all saved passwords after confirmation
function clearAll() {
  if (confirm("Are you sure you want to clear all saved passwords?")) {
    localStorage.removeItem("savedPasswords");
    displaySavedPasswords();
  }
}

// Display saved passwords on initial load
displaySavedPasswords();
