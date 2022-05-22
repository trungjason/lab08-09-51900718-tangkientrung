$(document).ready(function() {
    $("#responseMessage").hide(); // hide it initially

    const form_register = $("form");

    form_register.on("submit", (e) => {
        e.preventDefault();

        const form_data = form_register.serializeArray();

        // Validate to make sure form data that is going to be submited will have email and password field
        if (form_data.length != 5) {
            fadeError("Missing values can't perform register operation !!!");
            return;
        }

        if (form_data[0].name !== "username" || form_data[1].name !== "email" || form_data[2].name !== "password" || form_data[3].name !== "password-confirm" || form_data[4].name !== "_csrf") {
            fadeError("Missing values can't perform register operation !!!");
            return;
        }

        const username = form_data[0].value;
        const email = form_data[1].value;
        const password = form_data[2].value;
        const password_confirm = form_data[3].value;
        const csrfToken = form_data[4].value;

        if (!username || !email || !password || !password_confirm ||
            username.trim() === "" || email.trim() === "" || password.trim() === "" || password_confirm.trim() === "") {
            fadeError("Please enter all required fields ! Can't let any field is empty !");
            return;
        }

        if (!email.includes("@")) {
            fadeError("Email format invalid! Please enter again !!!");
            return;
        }

        if (username.length < 3) {
            fadeError("Your username must be at least 3 characters !!!");
            return;
        }

        if (password.length < 6) {
            fadeError("Your password must be at least 6 characters !!!");
            return;
        }

        if (password !== password_confirm) {
            fadeError("Your password and password confirm does not match. Please try again !!!");
            return;
        }

        const url = 'http://localhost:3000/api/account/register';
        const options = {
            credentials: 'same-origin',
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'CSRF-Token': csrfToken,
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                password_confirm: password_confirm
            })
        };

        fetch(url, options)
            .then(json_result => {
                return json_result.json();
            })
            .then(result => {
                if (!result.status && result.status_code === 400) {
                    fadeError(result.message);
                } else if (result.status && result.status_code === 201) {
                    fadeResult(result.message);
                    window.location.href = "http://localhost:3000/login";
                } else {
                    fadeError(result.message);
                }
            })
            .catch(error => {
                fadeError(error);
            })
    });
});

// Utilities function
function fadeError(errorMessage) {
    let errorDiv = $("#responseMessage");

    if (errorDiv.hasClass("alert-success")) {
        errorDiv.removeClass("alert-success").addClass("alert-danger");
    } else {
        errorDiv.addClass("alert-danger");
    }

    errorDiv.find("#detailMessage").html(errorMessage);
    errorDiv.hide().fadeIn(1500).fadeOut(3000);
}

function fadeResult(resultMessage) {
    let resultDiv = $("#responseMessage");

    if (resultDiv.hasClass("alert-danger")) {
        resultDiv.removeClass("alert-danger").addClass("alert-success");
    } else {
        resultDiv.addClass("alert-success");
    }

    resultDiv
        .find("#detailMessage")
        .html(resultMessage);
    resultDiv.hide().fadeIn(1500).fadeOut(3000);
}