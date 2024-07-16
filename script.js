document.addEventListener("DOMContentLoaded", () => {
    const featuredSection = document.getElementById("featured");
    // const searchInput = document.getElementById("searchInput");
     
    // Fetch games from db.json
    fetch("http://localhost:3000/games")
        .then((response) => response.json())
        .then((games) => {
            games.forEach((game) => {
                const gameArticle = document.createElement("article");
                gameArticle.innerHTML = `
          <img src="${game.image}" alt="${game.title}" />
          <h2>${game.title}</h2>
          <div class="card-footer">
            <button class="btn-add" data-id="${game.id}" onclick="addToCart('${game.title}', ${game.price}, '${game.image}')">
              <img src="/images/shopping-cart.png" />
            </button>
            <span class="price">$${game.price.toFixed(2)}</span>
          </div>
        `;
                featuredSection.appendChild(gameArticle);
            });
        });
});


// Open cart modal
function openCartModal() {
    let modal = document.getElementById("cartModal");
    modal.style.display = "block";
}

// Close cart modal
function closeCartModal() {
    let modal = document.getElementById("cartModal");
    modal.style.display = "none";
}

// Add items to cart
function addToCart(gameTitle, price, imageUrl) {
    // Update cart notification
    let cartNotification = document.getElementById("cart-notification");
    cartNotification.innerText = parseInt(cartNotification.innerText) + 1;

    // Make list item for cart
    let cartItems = document.getElementById("cart-items");
    let li = document.createElement("li");
    li.innerHTML = `
    <img src="${imageUrl}" alt="${gameTitle}" />
    <div class="item-details">
      <h3>${gameTitle}</h3>
      <p class="price">$${price.toFixed(2)}</p>
    </div>
   <button class="remove-btn" onclick="removeFromCart(this, ${price.toFixed(2)})">
  <span>&times;</span>
   </button>
  `;
    cartItems.appendChild(li);

    // Update total
    updateTotal();
}

// Remove items from cart
function removeFromCart(element, price) {
    let cartNotification = document.getElementById("cart-notification");
    cartNotification.innerText = parseInt(cartNotification.innerText) - 1;

    let item = element.parentElement;
    item.remove();

    // Update total
    updateTotal();
}

// Update cart total
function updateTotal() {
    let cartItems = document.getElementById("cart-items");
    let items = cartItems.getElementsByTagName("li");
    let total = 0;

    for (let i = 0; i < items.length; i++) {
        let priceElement = items[i].querySelector(".price");
        let price = parseFloat(priceElement.textContent.replace("$", ""));
        total += price;
    }

    let totalElement = document.getElementById("cart-total");
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Checkout
function checkout() {
    alert("Checking out...");
}

// Clear cart
function clearCart() {
    let cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";
    let cartNotification = document.getElementById("cart-notification");
    cartNotification.innerText = "0";

    // Update total
    updateTotal();
}
