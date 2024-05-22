document.addEventListener('DOMContentLoaded', () => {
    const completePurchaseButton = document.getElementById('complete-purchase-button');
    
    if (completePurchaseButton) {
      completePurchaseButton.addEventListener('click', async () => {
        try {
          const response = await fetch('/generate-ticket', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              cartId: window.cartId
            })
          });
  
          if (!response.ok) {
            throw new Error('Failed to generate ticket');
          }

          const ticketData = await response.json();
          console.log('Ticket Data:', ticketData);
          console.log('Ticket:', ticketData.ticket);
          Swal.fire({
            title: 'Ticket Generated Successfully',
            html: `
              <p><strong>Ticket Code:</strong> ${ticketData.ticket.code}</p>
              <p><strong>Total Products:</strong> ${ticketData.ticket.totalAmount}</p>
            `,
            icon: 'success',
            showCloseButton: true,
            showConfirmButton: false
          });
        } catch (error) {
          console.error('Error generating ticket:', error);
        }
      });
    }
  });