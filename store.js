(function () {
    "use strict";

    var USERS_KEY = "techbookhub_users";
    var CURRENT_USER_KEY = "techbookhub_currentUser";
    var CART_KEY = "techbookhub_cart";
    var REDIRECT_KEY = "techbookhub_redirectAfterLogin";

    function safeJsonParse(value, fallback) {
        try {
            return JSON.parse(value);
        } catch (e) {
            return fallback;
        }
    }

    function getUsers() {
        return safeJsonParse(localStorage.getItem(USERS_KEY), []) || [];
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users || []));
    }

    function setCurrentUser(user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }

    function getCurrentUser() {
        return safeJsonParse(localStorage.getItem(CURRENT_USER_KEY), null);
    }

    function clearCurrentUser() {
        localStorage.removeItem(CURRENT_USER_KEY);
    }

    function getCart() {
        return safeJsonParse(localStorage.getItem(CART_KEY), []) || [];
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart || []));
    }

    function formatINR(amount) {
        var value = Number(amount || 0);
        try {
            return "\u20B9" + value.toLocaleString("en-IN");
        } catch (e) {
            return "\u20B9" + value;
        }
    }

    function addToCart(item) {
        if (!item || !item.id) {
            alert("Unable to add item to cart.");
            return;
        }

        var cart = getCart();
        var existing = null;
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].id === item.id) {
                existing = cart[i];
                break;
            }
        }

        if (existing) {
            existing.qty = Number(existing.qty || 0) + Number(item.qty || 1);
        } else {
            cart.push({
                id: String(item.id),
                title: String(item.title || ""),
                dept: String(item.dept || ""),
                priceInr: Number(item.priceInr || 0),
                coverUrl: String(item.coverUrl || ""),
                qty: Number(item.qty || 1)
            });
        }

        saveCart(cart);
        alert("Added to cart: " + (item.title || "Book"));
    }

    function removeFromCart(itemId) {
        var cart = getCart();
        var next = [];
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].id !== itemId) next.push(cart[i]);
        }
        saveCart(next);
        renderCart();
    }

    function updateQty(itemId, qty) {
        var quantity = Number(qty);
        if (!isFinite(quantity) || quantity < 1) quantity = 1;

        var cart = getCart();
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].id === itemId) {
                cart[i].qty = quantity;
                break;
            }
        }
        saveCart(cart);
        renderCart();
    }

    function clearCart() {
        saveCart([]);
        renderCart();
    }

    function addToCartFromButton(buttonEl) {
        var button = buttonEl;
        if (!button || !button.dataset) {
            alert("Unable to add item to cart.");
            return;
        }

        addToCart({
            id: button.dataset.id,
            title: button.dataset.title,
            dept: button.dataset.dept,
            priceInr: Number(button.dataset.priceInr || 0),
            coverUrl: button.dataset.coverUrl,
            qty: 1
        });
    }

    function renderCart() {
        var tableBody = document.getElementById("cartBody");
        var totalEl = document.getElementById("cartTotal");
        var emptyEl = document.getElementById("cartEmpty");

        if (!tableBody || !totalEl) return;

        var cart = getCart();
        var html = "";
        var total = 0;

        if (!cart.length) {
            if (emptyEl) emptyEl.style.display = "block";
            tableBody.innerHTML = "";
            totalEl.textContent = formatINR(0);
            return;
        }

        if (emptyEl) emptyEl.style.display = "none";

        for (var i = 0; i < cart.length; i++) {
            var item = cart[i];
            var qty = Number(item.qty || 1);
            var price = Number(item.priceInr || 0);
            var amount = qty * price;
            total += amount;

            var coverHtml = item.coverUrl
                ? "<img class=\"book-cover\" src=\"" + item.coverUrl + "\" width=\"60\" height=\"80\" alt=\"Cover\" onerror=\"this.onerror=null;this.src='https://placehold.co/60x80/png?text=Cover';\">"
                : "";

            html += "<tr>";
            html += "<td>" + coverHtml + "</td>";
            html += "<td>" + (item.title || "") + (item.dept ? "<br><small>" + item.dept + "</small>" : "") + "</td>";
            html += "<td>" + formatINR(price) + "</td>";
            html += "<td><input type=\"number\" min=\"1\" value=\"" + qty + "\" onchange=\"updateQty('" + item.id + "', this.value)\" style=\"width:90px\"></td>";
            html += "<td>" + formatINR(amount) + "</td>";
            html += "<td><button onclick=\"removeFromCart('" + item.id + "')\">Remove</button></td>";
            html += "</tr>";
        }

        tableBody.innerHTML = html;
        totalEl.textContent = formatINR(total);
    }

    function checkout() {
        var cart = getCart();
        if (!cart.length) {
            alert("Your cart is empty.");
            return;
        }

        var user = getCurrentUser();
        if (!user) {
            localStorage.setItem(REDIRECT_KEY, "cart.html");
            alert("Please login to checkout.");
            window.location.href = "login.html";
            return;
        }

        clearCart();
        alert("Checkout successful! Order placed for " + user.name + ".");
    }

    function getRedirectAfterLogin() {
        return localStorage.getItem(REDIRECT_KEY);
    }

    function clearRedirectAfterLogin() {
        localStorage.removeItem(REDIRECT_KEY);
    }

    // Expose globally for inline HTML handlers
    window.formatINR = formatINR;
    window.addToCartFromButton = addToCartFromButton;
    window.renderCart = renderCart;
    window.removeFromCart = removeFromCart;
    window.updateQty = updateQty;
    window.clearCart = clearCart;
    window.checkout = checkout;
    window.getUsers = getUsers;
    window.saveUsers = saveUsers;
    window.setCurrentUser = setCurrentUser;
    window.getCurrentUser = getCurrentUser;
    window.clearCurrentUser = clearCurrentUser;
    window.getRedirectAfterLogin = getRedirectAfterLogin;
    window.clearRedirectAfterLogin = clearRedirectAfterLogin;
})();
