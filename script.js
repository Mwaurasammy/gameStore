let games = []; // games in the global scope
let isAuthenticated = false; //track user authentication status

// Check authentication status from sessionStorage
function checkAuthStatus() {
    const storedAuthStatus = sessionStorage.getItem('isAuthenticated');
    isAuthenticated = storedAuthStatus === 'true';

    if (isAuthenticated) {
        enableCart(); // Enable cart functionality if authenticated
    }
}

// Function to enable cart functionality by enabling buttons
function enableCart() {
    const addToCartButtons = document.querySelectorAll('.btn-add');
    addToCartButtons.forEach(button => {
        button.disabled = false;
    });
}

// Function to disable cart functionality by disabling buttons
function disableCart() {
    const addToCartButtons = document.querySelectorAll('.btn-add');
    addToCartButtons.forEach(button => {
        button.disabled = true;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const featuredSection = document.getElementById("featured");
    const searchInput = document.getElementById("searchInput");

    // Check authentication status from sessionStorage
    checkAuthStatus();

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
                    <button class="btn-add" data-id="${game.id}" onclick="addToCart('${game.title}', ${game.price}, '${game.image}')" ${isAuthenticated ? '' : 'disabled'}>
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
        const searchWord = searchInput.value.toLowerCase();
        const filteredGames = games.filter(game => game.title.toLowerCase().includes(searchWord));
        displayGames(filteredGames);
    }

    // Initial modal display check
    const authModal = document.querySelector('.container');
    if (!isAuthenticated) {
        authModal.style.display = 'block';
    } else {
        authModal.style.display = 'none';
    }
});

// Open cart modal
function openCartModal() {
    if (isAuthenticated) {
        let modal = document.getElementById("cartModal");
        modal.style.display = "block";
    } else {
        alert('Please sign in or sign up to view your cart.');
    }
}

// Close cart modal
function closeCartModal() {
    let modal = document.getElementById("cartModal");
    modal.style.display = "none";
}

// Add items to cart
function addToCart(gameTitle, price, imageUrl) {
    if (isAuthenticated) {
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
    } else {
        alert('Please sign in or sign up to add items to your cart.');
    }
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

// Signup and signin modal functionality
document.addEventListener("DOMContentLoaded", function () {
    const signupBtn = document.getElementById("signupBtn");
    const signinBtn = document.getElementById("signinBtn");
    const nameField = document.getElementById("nameField");
    const title = document.getElementById("title");
    const authModal = document.querySelector('.container');
    const logoutModal = document.getElementById('logoutModal');

    signinBtn.onclick = function () {
        nameField.style.maxHeight = "0";
        title.innerHTML = "Sign In";
        signinBtn.classList.remove("disable");
        signupBtn.classList.add("disable");
    }

    signupBtn.onclick = function () {
        nameField.style.maxHeight = "65px"; // Adjust max height as per your design
        title.innerHTML = "Sign Up";
        signupBtn.classList.remove("disable");
        signinBtn.classList.add("disable");
    }

    // User button click event
    document.querySelector('.user-btn').onclick = function () {
        if (isAuthenticated) {
            logoutModal.style.display = 'block';
        } else {
            authModal.style.display = 'block';
        }
    }

    // Close the signup/signin modal when clicking on the close button
    document.querySelector('.signup-close').onclick = function () {
        authModal.style.display = 'none';
    }

    // Close the logout modal when clicking on the close button
    document.querySelector('.close-logout-modal').onclick = function () {
        logoutModal.style.display = 'none';
    }

    // Handle logout confirmation
    document.getElementById('confirmLogout').onclick = function () {
        logoutModal.style.display = 'none';
        alert('Come back again!');
        isAuthenticated = false;
        sessionStorage.setItem('isAuthenticated', 'false');
        disableCart(); // Function to disable cart buttons
        authModal.style.display = 'block';
    }

    document.getElementById('cancelLogout').onclick = function () {
        logoutModal.style.display = 'none';
    }
});

// Handle sign-up and sign-in functionality
document.addEventListener('DOMContentLoaded', function () {
    const authForm = document.getElementById('authForm');
    const nameField = document.getElementById('nameField');
    const title = document.getElementById('title');
    const signupBtn = document.getElementById('signupBtn');
    const toggleSigninBtn = document.getElementById('toggleSigninBtn');
    const signinBtn = document.getElementById('signinBtn');

    let isSignUpMode = true;

    // Toggle between Sign Up and Sign In modes
    function toggleMode() {
        isSignUpMode = !isSignUpMode;
        if (isSignUpMode) {
            title.textContent = 'Sign Up';
            nameField.style.display = 'block';
            signupBtn.style.display = 'inline-block';
            toggleSigninBtn.style.display = 'inline-block';
            signinBtn.style.display = 'none';
        } else {
            title.textContent = 'Sign In';
            nameField.style.display = 'none';
            signupBtn.style.display = 'none';
            toggleSigninBtn.style.display = 'none';
            signinBtn.style.display = 'inline-block';
        }
    }

    // Event listener for Sign Up button
    signupBtn.addEventListener('click', handleSignUp);

    // Event listener for toggling to Sign In mode
    toggleSigninBtn.addEventListener('click', toggleMode);

    // Event listener for Sign In button
    signinBtn.addEventListener('click', handleSignIn);

    // Handle Sign Up
    function handleSignUp(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;

        if (!email || !name || !password) {
            alert('Please enter all required fields!');
            return;
        }

        const user = { email, name, password };

        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => {
                if (response.ok) {
                    alert('Sign up successful! You can now sign in.');
                    toggleMode();
                } else {
                    alert('Sign up failed.');
                }
            })

    }

    // Handle Sign In
    function handleSignIn(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert('Please enter all required fields!');
            return;
        }

        fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(users => {
                const user = users.find(user => user.email === email && user.password === password);
                if (user) {
                    alert(`Welcome! ${user.name}`);
                    isAuthenticated = true; // Update authentication status
                    sessionStorage.setItem('isAuthenticated', 'true'); // Store authentication status in sessionStorage
                    document.querySelector('.container').style.display = 'none'; // Hide the modal
                    enableCart(); // Enable cart functionality after sign-in
                } else {
                    alert('Invalid email or password.');
                }
            })

    }
});


document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('trailers-trailer-modal');
    const btn = document.getElementById('trailers-btn');
    const span = document.querySelector('.trailer-close');
    const videoContainer = document.querySelector('.trailer-video-container');

    async function fetchVideos() {
        try {
            const response = await fetch('http://localhost:3000/videos'); // Adjust URL if necessary
            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }
            const data = await response.json();
            const videos = data;

            videoContainer.innerHTML = '';

            videos.forEach(video => {
                const videoWrapper = document.createElement('div');
                videoWrapper.className = 'trailer-video-wrapper';

                const videoElement = document.createElement('video');
                videoElement.src = video.src;
                videoElement.controls = true;
                videoElement.className = 'trailer-modal-video';

                videoElement.addEventListener('click', function () {
                    videoElement.classList.toggle('expanded');
                    if (videoElement.classList.contains('expanded')) {
                        videoElement.setAttribute('controls', true);
                    } else {
                        videoElement.removeAttribute('controls');
                    }
                });

                const videoTitle = document.createElement('div');
                videoTitle.className = 'trailer-video-title';
                videoTitle.textContent = video.title; //video.title in the JSON

                videoWrapper.appendChild(videoElement);
                videoWrapper.appendChild(videoTitle);
                videoContainer.appendChild(videoWrapper);
            });

            modal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    }

    btn.addEventListener('click', fetchVideos);

    span.addEventListener('click', function () {
        modal.style.display = 'none';
        pauseVideos();
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            pauseVideos();
        }
    });

    function pauseVideos() {
        const videos = document.querySelectorAll('.trailer-modal-video');
        videos.forEach(video => {
            video.pause();
        });
    }
});


// Get the modal
var modal = document.getElementById("faq-modal");

// Get the button that opens the modal
var btn = document.getElementById("faq-btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("faq-close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}












