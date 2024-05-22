document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById('uploadForm');

    uploadForm.addEventListener('submit', async function (event) {
        event.preventDefault(); 

        const formData = new FormData(); 

        formData.append('file', document.getElementById('file').files[0]);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData, 
            });
            if (response.ok) {
                Swal.fire("Success!", "Document uploaded successfully!", "success");
            } else {
                console.error('Upload failed:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    });
});