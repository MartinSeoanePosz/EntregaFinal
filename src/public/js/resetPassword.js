async function postResetPassword(token, newPassword) {
    try {
        const response = await fetch(`/passwordReset/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newPassword}), 
        });

        if (response.ok) {
            window.location.href = "/login"; 
        } else {
            console.error("Failed to reset password");
        }
    } catch (error) {
        console.error("Error during reset password:", error);
    }
}

const resetPasswordButton = document.getElementById("resetPassword");
if (resetPasswordButton) {
    resetPasswordButton.addEventListener("click", async (e) => {
        e.preventDefault();
        
        const token = window.location.pathname.split('/').pop(); 
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (newPassword !== confirmPassword) {
            console.error("Passwords do not match");
            return;
        }

        await postResetPassword(token, newPassword); 
    });
}
