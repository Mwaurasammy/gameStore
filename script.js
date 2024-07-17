let games = []; // Define games in the global scope

document.addEventListener("DOMContentLoaded", () => {
    const featuredSection = document.getElementById("featured");
    const searchInput = document.getElementById("searchInput");

    // Load cart from local storage
    loadCart();

    // Fetch games from db.json
    fetch("http://localhost:3000/games")
        .then((response) => response.json())
        .then((data) => {
            games = data; // Assign fetched games to the global variable
            displayGames(games);

            // Add event listener to search button
            document.querySelector('.search-btn').addEventListener('click', () => {
                searchGames();
            });

            // Add event listener for Enter key in search input
            searchInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    searchGames();
                }
            });
        });

    // Function to display games
    function displayGames(games) {
        featuredSection.innerHTML = '';
        games.forEach((game) => {
            const gameArticle = document.createElement("article");
            gameArticle.innerHTML = `
                <img src="${game.image}" alt="${game.title}" />
                <h2>${game.title}</h2>
                <div class="card-footer">
                    <button class="btn-add" data-id="${game.id}" onclick="addToCart('${game.title}', ${game.price}, '${game.image}')">
                        <img src="images/shopping-cart.png" />
                    </button>
                    <span class="price">$${game.price.toFixed(2)}</span>
                </div>
            `;
            featuredSection.appendChild(gameArticle);
        });
    }

    // Function to search and filter games
    window.searchGames = function searchGames() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredGames = games.filter(game => game.title.toLowerCase().includes(searchTerm));
        displayGames(filteredGames);
    }
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

    // Save cart to local storage
    saveCart();

    // Update total
    updateTotal();
}

// Remove items from cart
function removeFromCart(element, price) {
    let cartNotification = document.getElementById("cart-notification");
    cartNotification.innerText = parseInt(cartNotification.innerText) - 1;

    let item = element.parentElement;
    item.remove();

    // Save cart to local storage
    saveCart();

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

    // Save cart to local storage
    saveCart();

    // Update total
    updateTotal();
}

// Save cart to local storage
function saveCart() {
    let cartItems = document.getElementById("cart-items").innerHTML;
    localStorage.setItem("cartItems", cartItems);

    let cartNotification = document.getElementById("cart-notification").innerText;
    localStorage.setItem("cartNotification", cartNotification);
}

// Load cart from local storage
function loadCart() {
    let cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
        document.getElementById("cart-items").innerHTML = cartItems;

        // Re-add remove button event listeners
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.onclick = () => removeFromCart(btn, parseFloat(btn.previousElementSibling.querySelector(".price").textContent.replace("$", "")));
        });

        // Update total
        updateTotal();
    }

    let cartNotification = localStorage.getItem("cartNotification");
    if (cartNotification) {
        document.getElementById("cart-notification").innerText = cartNotification;
    }
}
