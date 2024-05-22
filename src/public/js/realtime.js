const role = window.role;
const user = window.user;

const addProductBtn = document.getElementById("addProductBtn");
const deleteProductBtn = document.getElementById("deleteProductBtn");

addProductBtn.addEventListener("click", async () => {
  const productData = {
    title: document.getElementById("titleInput").value,
    description: document.getElementById("descriptionInput").value,
    price: parseFloat(document.getElementById("priceInput").value),
    thumbnail: document.getElementById("thumbnailInput").value,
    code: document.getElementById("codeInput").value,
    category: document.getElementById("categoryInput").value,
    stock: parseInt(document.getElementById("stockInput").value),
  };

  try {
    const response = await fetch("/api/products/newproduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      throw new Error("Failed to add product");
    }
    alert("Product added successfully!");
  } catch (error) {
    console.error("Error adding product:", error);
    alert("Failed to add product. Please try again later.");
  }
});


deleteProductBtn.addEventListener("click", async () => {
  const productId = document.getElementById("productId").value;

  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
    alert("Product deleted successfully!");
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Failed to delete product. Please try again later.");
  }
});


function updateProductList(products) {
  productListContainer.innerHTML = "";

  if (products && products.length > 0) {
    products.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.innerHTML = `<p>${product.title}</p>`;
      productListContainer.appendChild(productElement);
    });
  } else {
    productListContainer.innerHTML = "<p>No products available.</p>";
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const usersButton = document.getElementById('users-button');
  if (usersButton) {
    usersButton.addEventListener('click', () => {
      window.location.href = '/api/users';
    });
  }
});