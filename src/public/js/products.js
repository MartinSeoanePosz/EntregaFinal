const user = window.user;
const role = window.role;
const cartId = window.cartId;
  
function changeLimit(newLimit) {
  window.location.href = `/products?page={{page}}&limit=${newLimit}&sortBy={{sortBy}}&sortOrder={{sortOrder}}&category={{category}}`;
}
  
function changeSortBy(newSortBy) {
  window.location.href = `/products?page={{page}}&limit={{limit}}&sortBy=${newSortBy}&sortOrder={{sortOrder}}&category={{category}}`;
}
  
function changeSortOrder(newSortOrder) {
  window.location.href = `/products?page={{page}}&limit={{limit}}&sortBy={{sortBy}}&sortOrder=${newSortOrder}&category={{category}}`;
}
  
document.addEventListener('DOMContentLoaded', () => {
  const categoryButtons = document.querySelectorAll('.category-button');

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedCategory = button.getAttribute('data-category');
      updateURLWithCategory(selectedCategory);
    });
  });

  function updateURLWithCategory(category) {
    const currentURL = new URL(window.location.href);
    currentURL.searchParams.set('category', category);
    window.location.href = currentURL.href;
  }
});

// Welcome message
document.addEventListener('DOMContentLoaded', function () {

  const userDataCookie = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('userData='));
  
  if (userDataCookie) {

    const userData = JSON.parse(userDataCookie.split('=')[1]);
    const user = userData.user;
    const role = userData.role;

    console.log('User:', user);
    console.log('Role:', role);
  }
});

// Add to cart
const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
addToCartButtons.forEach(button => {
  button.addEventListener("click", async () => {
    const productId = button.dataset.productId;

    if (!user) {
      return; 
    }
    const response = await fetch(`/api/add-to-cart/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: user }),
    });

    if (response.ok) {
      console.log("Product added to cart!");
    } else {
      console.error("Failed to add product to cart");
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  Swal.fire({
    title: `Welcome, ${user}!`,
    text: `Your role is: ${role}`,
    icon: 'success',
    confirmButtonText: 'Got it!'
  });
});
//Chat button
document.addEventListener('DOMContentLoaded', () => {
  const chatButton = document.getElementById('chat-button');
  if (chatButton) {
    chatButton.addEventListener('click', () => {
      window.location.href = '/chat';
    });
  }
});
//Cart button
document.addEventListener('DOMContentLoaded', () => {
  const cartButton = document.getElementById('cart-button');

  if (cartButton) {
    cartButton.addEventListener('click', () => {
      const cartId = window.cartId;
      if (cartId) {

        window.location.href = '/' + cartId + '/purchase';
      } else {
        console.error('No cartId found');
      }
    });
  }
});
//Logout button
document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });  
      if (response.ok) {
        document.cookie = 'userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/login';
      } else {
        console.error('Failed to logout');
      }
    });
  }
});
document.addEventListener('DOMContentLoaded', function () {
  const currentButton = document.getElementById('current-btn');
  if (currentButton) {
      currentButton.addEventListener('click', () => {
          window.location.href = `/current`;
      });
  }
});