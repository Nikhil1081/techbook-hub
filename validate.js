function validateRegister() {

    var name = document.getElementById("name").value;
    var pass = document.getElementById("pass").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;

    var namePattern = /^[A-Za-z]{6,}$/;
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
    var phonePattern = /^[0-9]{10}$/;

    if (!namePattern.test(name)) {
        alert("Invalid Name");
        return false;
    }

    if (pass.length < 6) {
        alert("Password must be 6 characters");
        return false;
    }

    if (!emailPattern.test(email)) {
        alert("Invalid Email");
        return false;
    }

    if (!phonePattern.test(phone)) {
        alert("Invalid Phone Number");
        return false;
    }

    // Store registration details (demo purpose: stored in LocalStorage)
    try {
        if (typeof getUsers !== "function" || typeof saveUsers !== "function") {
            alert("Storage module not loaded.");
            return false;
        }

        var users = getUsers();
        for (var i = 0; i < users.length; i++) {
            if (users[i].email && users[i].email.toLowerCase() === email.toLowerCase()) {
                alert("Email already registered. Please login.");
                window.location.href = "login.html";
                return false;
            }
        }

        users.push({
            name: name,
            email: email,
            phone: phone,
            password: pass,
            createdAt: new Date().toISOString()
        });
        saveUsers(users);

        alert("Registration successful! Please login.");
        window.location.href = "login.html";
        return false;
    } catch (e) {
        alert("Unable to save registration details.");
        return false;
    }
}

function validateLogin() {
    var name = document.getElementById("loginName").value;
    var pass = document.getElementById("loginPass").value;

    if (name.length < 3 || pass.length < 6) {
        alert("Invalid Login Details");
        return false;
    }

    try {
        if (typeof getUsers !== "function" || typeof setCurrentUser !== "function") {
            alert("Storage module not loaded.");
            return false;
        }

        var users = getUsers();
        var found = null;
        var loginValue = name.toLowerCase();

        for (var i = 0; i < users.length; i++) {
            var u = users[i];
            var emailMatch = (u.email || "").toLowerCase() === loginValue;
            var nameMatch = (u.name || "").toLowerCase() === loginValue;
            if ((emailMatch || nameMatch) && u.password === pass) {
                found = u;
                break;
            }
        }

        if (!found) {
            alert("Login failed. Check username/email and password.");
            return false;
        }

        setCurrentUser({ name: found.name, email: found.email });

        var redirect = (typeof getRedirectAfterLogin === "function") ? getRedirectAfterLogin() : null;
        if (redirect) {
            if (typeof clearRedirectAfterLogin === "function") clearRedirectAfterLogin();
            window.location.href = redirect;
        } else {
            window.location.href = "home.html";
        }

        return false;
    } catch (e) {
        alert("Unable to login.");
        return false;
    }
}
