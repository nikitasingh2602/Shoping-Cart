document.addEventListener("DOMContentLoaded", () => {
  let cart = {};
  const cartSidebar = document.getElementById("cartSidebar");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  // Toggle cart sidebar
  document.getElementById("cartBtn").addEventListener("click", () => {
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("show");
  });

  // Close cart when clicking overlay
  cartOverlay.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("show");
  });

  function updateCartDisplay() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    if (Object.keys(cart).length === 0) {
      cartItemsContainer.innerHTML = "<p>No items in the cart.</p>";
    } else {
      Object.keys(cart).forEach((id) => {
        const item = cart[id];
        const itemTotal = (item.price * item.quantity).toFixed(2);
        total += parseFloat(itemTotal);

        // Create cart item display
        const cartItemDiv = document.createElement("div");
        cartItemDiv.classList.add("cart-item");
        cartItemDiv.innerHTML = `
                    <p>Product ${id}: $${item.price} x ${item.quantity} = $${itemTotal}</p>
                    <button class="increase" data-id="${id}">+</button>
                    <button class="decrease" data-id="${id}">-</button>
                `;
        cartItemsContainer.appendChild(cartItemDiv);
      });
    }
    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = Object.keys(cart).length;
  }

  // Add to Cart
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.dataset.id;
      const quantityInput = document.getElementById(`quantity${id}`);
      const quantity = parseInt(quantityInput.value);
      const price = parseFloat(
        this.parentNode.previousElementSibling.textContent.replace("$", "")
      );

      if (quantity <= 0) {
        alert("Please select a valid quantity.");
        return;
      }

      if (cart[id]) {
        cart[id].quantity += quantity;
      } else {
        cart[id] = { quantity, price };
      }
      updateCartDisplay();
    });
  });

  // Increase/Decrease Quantity in Cart
  cartItemsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("increase")) {
      const id = e.target.dataset.id;
      cart[id].quantity++;
      updateCartDisplay();
    } else if (e.target.classList.contains("decrease")) {
      const id = e.target.dataset.id;
      if (cart[id].quantity > 1) {
        cart[id].quantity--;
      } else {
        delete cart[id];
      }
      updateCartDisplay();
    }
  });

  // Clear Cart
  document.getElementById("clearCartBtn").addEventListener("click", () => {
    cart = {};
    updateCartDisplay();
  });

  updateCartDisplay();

  // Product Rating Feature
  const ratingStars = document.querySelectorAll(".rating-star");
  const ratingResult = document.getElementById("rating-result");

  ratingStars.forEach((star) => {
    star.addEventListener("click", () => {
      const rating = star.getAttribute("data-value");
      ratingResult.textContent = `Rating: ${rating}/5`;

      // Reset all stars
      ratingStars.forEach((s) => s.classList.remove("selected"));

      // Highlight selected star and all before it
      for (let i = 0; i < rating; i++) {
        ratingStars[i].classList.add("selected");
      }
    });

    // Tooltip display
    star.addEventListener("mouseenter", () => {
      const tooltipText = star.getAttribute("data-tooltip");
      const tooltip = document.createElement("span");
      tooltip.className = "tooltip";
      tooltip.textContent = tooltipText;
      star.appendChild(tooltip);
    });

    star.addEventListener("mouseleave", () => {
      const tooltip = star.querySelector(".tooltip");
      if (tooltip) star.removeChild(tooltip);
    });
  });
});
