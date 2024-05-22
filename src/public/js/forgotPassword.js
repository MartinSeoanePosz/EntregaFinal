async function postForgotPassword(email) {
    try {
        const response = await fetch("/forgotPassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            console.log("Password reset email sent successfully");
        } else {
            console.error("Failed to send password reset email");
        }
    } catch (error) {
        console.error("Error during forgot password:", error);
    }
}

const forgotPasswordButton = document.getElementById("forgotPassword");
if (forgotPasswordButton) {
    forgotPasswordButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        await postForgotPassword(email);
    });
}
