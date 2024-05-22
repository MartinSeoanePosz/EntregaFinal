document.addEventListener('DOMContentLoaded', () => {    

  const deleteUserButtons = document.querySelectorAll('.delete-user');
    deleteUserButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const email = event.target.getAttribute('data-email');
            try {
                const response = await fetch(`/api/users/${email}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('User deleted successfully');
                    location.reload();
                } else {
                    alert('Error deleting user');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error deleting user');
            }
        });
    });

  const deleteButton = document.querySelector('.delete-unused-users');
    deleteButton.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete old users?')) {
        try {
          const response = await fetch('/api/users/deleteOldUsers', {
            method: 'DELETE'
          });
  
          if (response.ok) {
            alert('Old users deleted successfully.');
            location.reload();
          } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
          }
        } catch (error) {
          console.error('Error deleting old users:', error);
          alert('An error occurred while deleting old users.');
        }
      }
    });
  });
  