const authSection = document.getElementById("authSection");
const dashboardSection = document.getElementById("dashboardSection");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const message = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");

function showMessage(text) {
    message.textContent = text;
}

async function api(url, data = {}) {
    const response = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
    }

    return result;
}

showRegister?.addEventListener("click", () => {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
});

showLogin?.addEventListener("click", () => {
    registerForm.style.display = "none";
    loginForm.style.display = "block";
});

registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = registerForm.querySelector('input[name="username"]').value;
    const password = registerForm.querySelector('input[name="password"]').value;

    try {
        const result = await api("/register", {username, password});
        showMessage(result.message);
        registerForm.reset();
    } catch (error) {
        showMessage(error.message);
    }
});

loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = loginForm.querySelector('input[name="username"]').value;
    const password = loginForm.querySelector('input[name="password"]').value;

    try {
        const result = await api("/login", {username, password});
        showMessage(result.message);
        await loadDashboard();
    } catch (error) {
        showMessage(error.message);
    }
});

async function loadDashboard() {
    const response = await fetch("/me");
    if (!response.ok) return;

    const user = await response.json();

    authSection.style.display = "none";
    dashboardSection.style.display = "block";

    document.getElementById("balanceValue").textContent = user.balance;
}

logoutBtn?.addEventListener("click", async () => {
    await api("/logout");
    dashboardSection.style.display = "none";
    authSection.style.display = "block";
    showMessage("Logged out successfully.");
});

loadDashboard();