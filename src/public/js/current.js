const uid = window.uid;

document.addEventListener('DOMContentLoaded', function () {
    const premiumButton = document.getElementById('premium-btn');
    if (premiumButton) {
        premiumButton.addEventListener('click', () => {
            window.location.href = `/premium/${uid}`;
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const documentsButton = document.getElementById('documents-btn');
    if (documentsButton) {
        documentsButton.addEventListener('click', () => {
            window.location.href = `/users/${uid}/documents`;
        });
    }
});