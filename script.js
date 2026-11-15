
const products = [
    {
        id: 1,
        name: "Premium Cotton Shirt",
        brand: "Roadster",
        category: "Men",
        price: 899,
        oldPrice: 1499,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600",
        description: "Premium everyday cotton shirt with a comfortable fit."
    },
    {
        id: 2,
        name: "Floral Summer Dress",
        brand: "StyleCast",
        category: "Women",
        price: 1299,
        oldPrice: 2199,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
        description: "Beautiful summer dress designed for effortless style."
    },
    {
        id: 3,
        name: "Urban Sneakers",
        brand: "HRX",
        category: "Footwear",
        price: 1799,
        oldPrice: 2999,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
        description: "Comfortable sneakers for your everyday adventures."
    },
    {
        id: 4,
        name: "Casual T-Shirt",
        brand: "HIGHLANDER",
        category: "Men",
        price: 599,
        oldPrice: 999,
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
        description: "A versatile casual T-shirt for daily wear."
    },
    {
        id: 5,
        name: "Classic Handbag",
        brand: "Lavie",
        category: "Women",
        price: 1599,
        oldPrice: 2499,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600",
        description: "Elegant handbag with a modern minimal design."
    },
    {
        id: 6,
        name: "Kids Fashion Outfit",
        brand: "YK",
        category: "Kids",
        price: 799,
        oldPrice: 1199,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600",
        description: "A comfortable and stylish outfit for kids."
    },
    {
        id: 7,
        name: "Minimal Watch",
        brand: "Fossil",
        category: "Men",
        price: 2299,
        oldPrice: 3499,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
        description: "A classic watch with a clean and timeless look."
    },
    {
        id: 8,
        name: "Beauty Essentials",
        brand: "Glow",
        category: "Beauty",
        price: 699,
        oldPrice: 999,
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
        description: "A curated beauty essentials collection."
    },
    {
        id: 9,
        name: "Modern Home Decor",
        brand: "HomeStyle",
        category: "Home",
        price: 1199,
        oldPrice: 1799,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600",
        description: "Minimal decor to refresh your living space."
    },
    {
        id: 10,
        name: "Running Shoes",
        brand: "Nike",
        category: "Footwear",
        price: 2499,
        oldPrice: 3999,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600",
        description: "Lightweight sports shoes for everyday comfort."
    }
];

// APP STATE
let cart = JSON.parse(localStorage.getItem("styleAuraCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("styleAuraWishlist")) || [];
let wishlistOnly = false;

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");

const toast = document.getElementById("toast");

// SAVE DATA
function saveData() {
    localStorage.setItem("styleAuraCart", JSON.stringify(cart));
    localStorage.setItem("styleAuraWishlist", JSON.stringify(wishlist));
}

// NOTIFICATION
let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

// DISPLAY PRODUCTS
function renderProducts() {

    const search = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;

    let filtered = products.filter(product => {

        const matchSearch =
            product.name.toLowerCase().includes(search) ||
            product.brand.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search);

        const matchCategory =
            category === "All" || product.category === category;

        const matchWishlist =
            !wishlistOnly || wishlist.includes(product.id);

        return matchSearch && matchCategory && matchWishlist;
    });

    if (sortFilter.value === "low") {
        filtered.sort((a, b) => a.price - b.price);
    }

    if (sortFilter.value === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    if (sortFilter.value === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    document.getElementById("productCount").textContent =
        `${filtered.length} products found`;

    document.getElementById("emptyState").hidden =
        filtered.length !== 0;

    grid.innerHTML = filtered.map(product => {

        const isWished = wishlist.includes(product.id);

        const discount = Math.round(
            (1 - product.price / product.oldPrice) * 100
        );

        return `
        <article class="product-card">

            <div class="product-image">

                <img src="${product.image}"
                     alt="${product.name}"
                     loading="lazy"
                     onerror="this.src='https://placehold.co/600x700?text=Product'">

                <button class="wish ${isWished ? "active" : ""}"
                    onclick="toggleWishlist(${product.id})">
                    ${isWished ? "♥" : "♡"}
                </button>

            </div>

            <div class="product-info">

                <h3>${product.brand}</h3>

                <p>${product.name} · ★ ${product.rating}</p>

                <div class="price">
                    <strong>₹${product.price.toLocaleString("en-IN")}</strong>
                    <span class="old-price">₹${product.oldPrice.toLocaleString("en-IN")}</span>
                    <span class="off">${discount}% OFF</span>
                </div>

                <div class="card-buttons">

                    <button onclick="quickView(${product.id})">
                        QUICK VIEW
                    </button>

                    <button class="add-button"
                        onclick="addToCart(${product.id})">
                        ADD TO BAG
                    </button>

                </div>

            </div>
        </article>
        `;
    }).join("");

    updateCounts();
}

// ADD TO CART
function addToCart(id) {

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, quantity: 1 });
    }

    saveData();
    updateCounts();
    renderCart();

    const product = products.find(item => item.id === id);

    showToast(`${product.name} added to your bag!`);
}

// WISHLIST
function toggleWishlist(id) {

    if (wishlist.includes(id)) {

        wishlist = wishlist.filter(item => item !== id);
        showToast("Removed from wishlist");

    } else {

        wishlist.push(id);
        showToast("Added to wishlist");
    }

    saveData();
    renderProducts();
}

// UPDATE COUNTS
function updateCounts() {

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    document.getElementById("cartCount").textContent = totalItems;
    document.getElementById("wishCount").textContent = wishlist.length;
}

// CART DRAWER
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

function openCart() {
    cartDrawer.classList.add("active");
    overlay.classList.add("active");
    renderCart();
}

function closeCart() {
    cartDrawer.classList.remove("active");
    overlay.classList.remove("active");
}

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// RENDER CART
function renderCart() {

    const cartItems = document.getElementById("cartItems");

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-state">
                <h3>Your bag is empty!</h3>
                <p>Discover something you love.</p>
            </div>
        `;

        document.getElementById("cartTotal").textContent = "₹0";
        return;
    }

    let total = 0;

    cartItems.innerHTML = cart.map(item => {

        const product = products.find(p => p.id === item.id);

        if (!product) return "";

        total += product.price * item.quantity;

        return `
        <div class="cart-item">

            <img src="${product.image}" alt="${product.name}">

            <div>

                <h4>${product.name}</h4>

                <p>₹${product.price.toLocaleString("en-IN")}</p>

                <div class="quantity">

                    <button onclick="changeQuantity(${item.id}, -1)">−</button>

                    <span>${item.quantity}</span>

                    <button onclick="changeQuantity(${item.id}, 1)">+</button>

                </div>

                <button class="remove-btn"
                    onclick="removeFromCart(${item.id})">
                    REMOVE
                </button>

            </div>

        </div>
        `;
    }).join("");

    document.getElementById("cartTotal").textContent =
        "₹" + total.toLocaleString("en-IN");
}

// CHANGE QUANTITY
function changeQuantity(id, amount) {

    const item = cart.find(p => p.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }

    saveData();
    renderCart();
    updateCounts();
}

// REMOVE PRODUCT
function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    saveData();
    renderCart();
    updateCounts();

    showToast("Product removed from bag");
}

// QUICK VIEW
function quickView(id) {

    const product = products.find(p => p.id === id);

    document.getElementById("modalContent").innerHTML = `
        <div class="quick-content">

            <img src="${product.image}" alt="${product.name}">

            <div>

                <span class="tag">${product.brand}</span>

                <h2>${product.name}</h2>

                <p>★ ${product.rating} Rating</p>

                <h3>₹${product.price.toLocaleString("en-IN")}</h3>

                <p>${product.description}</p>

                <button class="primary-btn"
                    onclick="addToCart(${product.id}); closeModal()">
                    ADD TO BAG
                </button>

            </div>

        </div>
    `;

    document.getElementById("modalOverlay").classList.add("active");
}

function closeModal() {
    document.getElementById("modalOverlay").classList.remove("active");
}

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("modalOverlay").addEventListener("click", event => {
    if (event.target.id === "modalOverlay") {
        closeModal();
    }
});

// SEARCH
searchInput.addEventListener("input", () => {
    wishlistOnly = false;
    renderProducts();
});

// CATEGORY FILTER
categoryFilter.addEventListener("change", () => {
    wishlistOnly = false;
    renderProducts();
});

// SORT
sortFilter.addEventListener("change", renderProducts);

// CATEGORY CARDS
document.querySelectorAll(".category-card").forEach(button => {

    button.addEventListener("click", () => {

        categoryFilter.value = button.dataset.category;
        wishlistOnly = false;

        renderProducts();

        document.getElementById("products").scrollIntoView({
            behavior: "smooth"
        });
    });
});

// NAVIGATION CATEGORY
document.querySelectorAll("nav a[data-category]").forEach(link => {

    link.addEventListener("click", () => {

        categoryFilter.value = link.dataset.category;
        wishlistOnly = false;

        renderProducts();

        document.getElementById("nav").classList.remove("open");
    });
});

// WISHLIST BUTTON
document.getElementById("wishlistBtn").addEventListener("click", () => {

    wishlistOnly = !wishlistOnly;

    categoryFilter.value = "All";
    searchInput.value = "";

    renderProducts();

    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });

    showToast(wishlistOnly ? "Your wishlist" : "Showing all products");
});

// MOBILE MENU
document.getElementById("menuBtn").addEventListener("click", () => {
    document.getElementById("nav").classList.toggle("open");
});

// PROFILE DEMO
document.getElementById("profileBtn").addEventListener("click", () => {
    showToast("Profile login feature coming soon!");
});

// NEWSLETTER
document.getElementById("newsletterForm").addEventListener("submit", event => {

    event.preventDefault();

    const email = document.getElementById("emailInput").value;

    showToast("Thanks for subscribing!");

    event.target.reset();
});

// DEMO CHECKOUT
document.getElementById("checkoutBtn").addEventListener("click", () => {

    if (cart.length === 0) {
        showToast("Your bag is empty!");
        return;
    }

    closeCart();
    showToast("Demo checkout! No payment was processed.");
});

// SHOW CURRENT YEAR
// INITIALIZE APP
renderProducts();
renderCart();
updateCounts();
