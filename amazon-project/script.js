const { useMemo, useState } = React;

const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Home",
    "Books",
    "Gaming",
    "Beauty"
];

const products = [
    {
        id: 1,
        name: "boAt Rockerz 450 Bluetooth Headphones",
        category: "Electronics",
        price: 1499,
        mrp: 3990,
        rating: 4.3,
        reviews: 18241,
        badge: "Deal",
        description: "Wireless on-ear headphones with punchy bass and 15-hour playback.",
        image: "https://m.media-amazon.com/images/I/61u1VALn6JL._AC_UY218_.jpg"
    },
    {
        id: 2,
        name: "Apple iPhone 15 Silicone Case",
        category: "Electronics",
        price: 3999,
        mrp: 4900,
        rating: 4.6,
        reviews: 9621,
        badge: "Prime",
        description: "Soft-touch MagSafe compatible case with a snug protective fit.",
        image: "https://m.media-amazon.com/images/I/71xb2xkN5qL._AC_UY218_.jpg"
    },
    {
        id: 3,
        name: "Men's Regular Fit Cotton T-Shirt",
        category: "Fashion",
        price: 499,
        mrp: 999,
        rating: 4.1,
        reviews: 12530,
        badge: "50% off",
        description: "Breathable everyday cotton tee available in classic colors.",
        image: "https://m.media-amazon.com/images/I/71wS5eA3GLL._AC_UL320_.jpg"
    },
    {
        id: 4,
        name: "Casio Enticer Analog Men's Watch",
        category: "Fashion",
        price: 2195,
        mrp: 2995,
        rating: 4.4,
        reviews: 7134,
        badge: "Choice",
        description: "Minimal dial, stainless steel strap, and reliable quartz movement.",
        image: "https://m.media-amazon.com/images/I/61LO6l4zB4L._AC_UL320_.jpg"
    },
    {
        id: 5,
        name: "Amazon Basics 14-Piece Kitchen Set",
        category: "Home",
        price: 1899,
        mrp: 3499,
        rating: 4.2,
        reviews: 5381,
        badge: "Save 46%",
        description: "Daily cooking essentials with non-stick finish and sturdy handles.",
        image: "https://m.media-amazon.com/images/I/81pW0Zr8VPL._AC_UL320_.jpg"
    },
    {
        id: 6,
        name: "Atomic Habits by James Clear",
        category: "Books",
        price: 399,
        mrp: 799,
        rating: 4.7,
        reviews: 52142,
        badge: "Bestseller",
        description: "A practical guide to building better habits one small step at a time.",
        image: "https://m.media-amazon.com/images/I/81F90H7hnML._AC_UY218_.jpg"
    },
    {
        id: 7,
        name: "Cosmic Byte Gaming Keyboard and Mouse Combo",
        category: "Gaming",
        price: 1299,
        mrp: 2499,
        rating: 4.0,
        reviews: 4988,
        badge: "Limited",
        description: "RGB keyboard and precision mouse combo for casual gaming setups.",
        image: "https://m.media-amazon.com/images/I/71fRP7KY9hL._AC_UY218_.jpg"
    },
    {
        id: 8,
        name: "Minimalist Vitamin C Face Serum",
        category: "Beauty",
        price: 664,
        mrp: 699,
        rating: 4.2,
        reviews: 18340,
        badge: "Fresh",
        description: "Lightweight daily serum for brighter, more even-looking skin.",
        image: "https://m.media-amazon.com/images/I/51TSC6UogxL._AC_UL320_.jpg"
    }
];

const deals = [
    ["Today's deals", "Up to 60% off electronics and home essentials."],
    ["Prime delivery", "Fast, trackable delivery experience on eligible products."],
    ["Secure checkout", "Cart totals, quantities, and checkout summary are live."],
    ["Top categories", "Shop electronics, fashion, books, beauty, gaming, and more."]
];

function formatPrice(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(value);
}

function App() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [toast, setToast] = useState("");

    const visibleProducts = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return products.filter((product) => {
            const matchesCategory = category === "All" || product.category === category;
            const matchesSearch = [product.name, product.category, product.description]
                .join(" ")
                .toLowerCase()
                .includes(normalizedQuery);

            return matchesCategory && matchesSearch;
        });
    }, [category, query]);

    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    function addToCart(product, openCart = false) {
        setCart((currentCart) => {
            const existing = currentCart.find((item) => item.id === product.id);

            if (existing) {
                return currentCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...currentCart, { ...product, quantity: 1 }];
        });

        setToast(`${product.name} added to cart`);
        window.setTimeout(() => setToast(""), 1800);

        if (openCart) {
            setIsCartOpen(true);
        }
    }

    function updateQuantity(productId, amount) {
        setCart((currentCart) =>
            currentCart
                .map((item) =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity + amount }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    function removeFromCart(productId) {
        setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
    }

    function scrollToProducts() {
        document.getElementById("products").scrollIntoView({ behavior: "smooth" });
    }

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(Header, {
            query,
            setQuery,
            category,
            setCategory,
            itemCount,
            openCart: () => setIsCartOpen(true)
        }),
        React.createElement(Hero, { scrollToProducts, openCart: () => setIsCartOpen(true) }),
        React.createElement(
            "main",
            { className: "main-shell", id: "products" },
            React.createElement(
                "section",
                { className: "deal-strip", "aria-label": "Store highlights" },
                deals.map(([title, copy]) =>
                    React.createElement(
                        "article",
                        { className: "deal", key: title },
                        React.createElement("span", null, "Amazon clone"),
                        React.createElement("h3", null, title),
                        React.createElement("p", null, copy)
                    )
                )
            ),
            React.createElement(
                "section",
                { className: "section-head" },
                React.createElement(
                    "div",
                    null,
                    React.createElement("h2", null, "Recommended for you"),
                    React.createElement("p", null, "Search, filter, add products, and manage your cart.")
                ),
                React.createElement(
                    "div",
                    { className: "results-meta" },
                    `${visibleProducts.length} result${visibleProducts.length === 1 ? "" : "s"}`
                )
            ),
            visibleProducts.length
                ? React.createElement(
                    "section",
                    { className: "product-grid" },
                    visibleProducts.map((product) =>
                        React.createElement(ProductCard, {
                            key: product.id,
                            product,
                            addToCart
                        })
                    )
                )
                : React.createElement(
                    "div",
                    { className: "empty-state" },
                    React.createElement("h3", null, "No products found"),
                    React.createElement("p", null, "Try a different search or category.")
                )
        ),
        isCartOpen &&
            React.createElement(CartDrawer, {
                cart,
                total,
                closeCart: () => setIsCartOpen(false),
                updateQuantity,
                removeFromCart
            }),
        toast && React.createElement("div", { className: "toast" }, toast),
        React.createElement(Footer)
    );
}

function Header({ query, setQuery, category, setCategory, itemCount, openCart }) {
    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            "header",
            { className: "top-nav" },
            React.createElement(
                "div",
                { className: "brand" },
                React.createElement("div", { className: "brand-mark" }, "a"),
                React.createElement(
                    "div",
                    { className: "brand-text" },
                    React.createElement("strong", null, "amazon"),
                    React.createElement("span", null, "clone.in")
                )
            ),
            React.createElement(
                "form",
                {
                    className: "search-form",
                    onSubmit: (event) => event.preventDefault()
                },
                React.createElement(
                    "select",
                    {
                        value: category,
                        onChange: (event) => setCategory(event.target.value),
                        "aria-label": "Choose category"
                    },
                    categories.map((name) =>
                        React.createElement("option", { key: name, value: name }, name)
                    )
                ),
                React.createElement("input", {
                    value: query,
                    onChange: (event) => setQuery(event.target.value),
                    placeholder: "Search Amazon Clone",
                    "aria-label": "Search products"
                }),
                React.createElement("button", { type: "submit", "aria-label": "Search" }, "Go")
            ),
            React.createElement(
                "nav",
                { className: "nav-actions", "aria-label": "Account and cart" },
                React.createElement(
                    "button",
                    { className: "nav-action", type: "button" },
                    React.createElement("span", null, "Hello, sign in"),
                    React.createElement("strong", null, "Account & Lists")
                ),
                React.createElement(
                    "button",
                    { className: "nav-action", type: "button" },
                    React.createElement("span", null, "Returns"),
                    React.createElement("strong", null, "& Orders")
                ),
                
                React.createElement(
    "button",
    { className: "cart-button", type: "button", onClick: openCart },

    React.createElement(
        "span",
        { className: "cart-icon", "aria-hidden": "true" },

        React.createElement(
            "span",
            { className: "cart-count" },
            itemCount
        )
    ),

    React.createElement(
        "span",
        { className: "cart-label" },
        "Cart"
    )
)
            )
        ),
        React.createElement(
            "div",
            { className: "sub-nav" },
            categories.map((name) =>
                React.createElement(
                    "button",
                    {
                        key: name,
                        className: category === name ? "active" : "",
                        type: "button",
                        onClick: () => setCategory(name)
                    },
                    name
                )
            )
        )
    );
}

function Hero({ scrollToProducts, openCart }) {
    return React.createElement(
        "section",
        { className: "hero" },
        React.createElement(
            "div",
            { className: "hero-content" },
            React.createElement("div", { className: "hero-kicker" }, "Great Indian Storefront"),
            React.createElement("h1", null, "Shop deals across every category"),
            React.createElement(
                "p",
                null,
                "A responsive Amazon-style React clone with live product filtering, category browsing, cart management, and checkout summary."
            ),
            React.createElement(
                "div",
                { className: "hero-actions" },
                React.createElement(
                    "button",
                    { className: "primary-btn", type: "button", onClick: scrollToProducts },
                    "Shop now"
                ),
                React.createElement(
                    "button",
                    { className: "secondary-btn", type: "button", onClick: openCart },
                    "View cart"
                )
            )
        )
    );
}

function ProductCard({ product, addToCart }) {
    return React.createElement(
        "article",
        { className: "product-card" },
        React.createElement(
            "div",
            { className: "product-image-wrap" },
            React.createElement("img", { src: product.image, alt: product.name })
        ),
        React.createElement(
            "div",
            { className: "badge-row" },
            React.createElement("span", { className: "badge" }, product.badge),
            React.createElement(
                "span",
                { className: "rating" },
                `Rating ${product.rating} (${product.reviews.toLocaleString("en-IN")})`
            )
        ),
        React.createElement("h3", null, product.name),
        React.createElement("p", { className: "product-desc" }, product.description),
        React.createElement(
            "div",
            { className: "price-row" },
            React.createElement("span", { className: "price" }, formatPrice(product.price)),
            React.createElement("span", { className: "mrp" }, formatPrice(product.mrp))
        ),
        React.createElement(
            "div",
            { className: "card-actions" },
            React.createElement(
                "button",
                { className: "cart-add-btn", type: "button", onClick: () => addToCart(product) },
                "Add to Cart"
            ),
            React.createElement(
                "button",
                { className: "buy-btn", type: "button", onClick: () => addToCart(product, true) },
                "Buy Now"
            )
        )
    );
}

function CartDrawer({ cart, total, closeCart, updateQuantity, removeFromCart }) {
    return React.createElement(
        "aside",
        { className: "cart-overlay", role: "dialog", "aria-modal": "true", "aria-label": "Shopping cart" },
        React.createElement(
            "div",
            { className: "cart-panel" },
            React.createElement(
                "div",
                { className: "cart-head" },
                React.createElement("h2", null, "Shopping Cart"),
                React.createElement("button", { className: "close-cart", type: "button", onClick: closeCart }, "x")
            ),
            React.createElement(
                "div",
                { className: "cart-items" },
                cart.length
                    ? cart.map((item) =>
                        React.createElement(
                            "div",
                            { className: "cart-line", key: item.id },
                            React.createElement("img", { src: item.image, alt: item.name }),
                            React.createElement(
                                "div",
                                null,
                                React.createElement("h3", null, item.name),
                                React.createElement("p", null, formatPrice(item.price * item.quantity)),
                                React.createElement(
                                    "div",
                                    { className: "qty-row" },
                                    React.createElement("button", { type: "button", onClick: () => updateQuantity(item.id, -1) }, "-"),
                                    React.createElement("span", null, `Qty: ${item.quantity}`),
                                    React.createElement("button", { type: "button", onClick: () => updateQuantity(item.id, 1) }, "+"),
                                    React.createElement("button", { className: "remove-btn", type: "button", onClick: () => removeFromCart(item.id) }, "Remove")
                                )
                            )
                        )
                    )
                    : React.createElement(
                        "div",
                        { className: "empty-state" },
                        React.createElement("h3", null, "Your cart is empty"),
                        React.createElement("p", null, "Add products to see them here.")
                    )
            ),
            React.createElement(
                "div",
                { className: "cart-footer" },
                React.createElement(
                    "div",
                    { className: "total-row" },
                    React.createElement("span", null, "Subtotal"),
                    React.createElement("span", null, formatPrice(total))
                ),
                React.createElement(
                    "button",
                    {
                        className: "checkout-btn",
                        type: "button",
                        disabled: cart.length === 0,
                        onClick: () => alert("Demo checkout complete. Thanks for shopping!")
                    },
                    "Proceed to Buy"
                )
            )
        )
    );
}

function Footer() {
    return React.createElement(
        "footer",
        { className: "footer" },
        React.createElement(
            "button",
            { className: "back-top", type: "button", onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
            "Back to top"
        ),
        React.createElement(
            "div",
            { className: "footer-grid" },
            ["Get to Know Us", "Connect with Us", "Make Money with Us", "Let Us Help You"].map((heading) =>
                React.createElement(
                    "div",
                    { key: heading },
                    React.createElement("h3", null, heading),
                    React.createElement("p", null, "Careers, support, seller tools, delivery, payments, and customer service links.")
                )
            )
        ),
        React.createElement("div", { className: "copyright" }, "(c) 2026 Amazon Clone. Developed By : SHAN USMANI . Class - CSE24.")
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
