async function postLogin(email, password) {
    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
            const data = await response.json();
            if (data.status === "ok") {
                if (data.role === 'user' || data.role === 'premium') {
                    window.location.href = '/products';
                } else if (data.role === 'admin') {
                    window.location.href = '/realtime';
                }
            } else {
                console.log("Login error:", data.error);
            }
        } else {
            console.log("Login error: Wrong credentials");
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
}

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    postLogin(email, password);
});

const forgotPasswordButton = document.getElementById("forgotPassword");

if (forgotPasswordButton) {
    forgotPasswordButton.addEventListener("click", () => {
        window.location.href = "/forgotpassword";
    });
}

