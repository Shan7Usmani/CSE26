// SELECT ELEMENTS
const searchInput = document.querySelector(".search-bar input");
const searchBtn = document.querySelector(".search-bar button");
const products = document.querySelectorAll(".product-card");

// CREATE CART COUNT UI
let cartCount = 0;
const cartDisplay = document.getElementById("cart-count");


// 🔍 SEARCH FUNCTION (REAL FILTER)
function filterProducts() {
    const query = searchInput.value.toLowerCase();

    products.forEach(product => {
        const text = product.innerText.toLowerCase();

        if (text.includes(query)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

// BUTTON CLICK
searchBtn.addEventListener("click", filterProducts);

// ENTER KEY
searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        filterProducts();
    }
});


// 🛒 ADD TO CART FUNCTION
products.forEach((product) => {

    // CREATE BUTTON
    const btn = document.createElement("button");
    btn.innerText = "Add to Cart";
    btn.style.marginTop = "10px";
    btn.style.padding = "5px 10px";
    btn.style.backgroundColor = "#febd69";
    btn.style.border = "none";
    btn.style.cursor = "pointer";

    product.appendChild(btn);

    // BUTTON CLICK
    btn.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent card click

        cartCount++;
        cartDisplay.innerText = "Cart: " + cartCount;

        btn.innerText = "Added ✔";
        btn.style.backgroundColor = "green";

        setTimeout(() => {
            btn.innerText = "Add to Cart";
            btn.style.backgroundColor = "#febd69";
        }, 1000);
    });

});


// OPTIONAL: PRODUCT CLICK (DETAIL PREVIEW)
products.forEach((product, index) => {
    product.addEventListener("click", () => {
        alert("Opening Product " + (index + 1));
    });
});