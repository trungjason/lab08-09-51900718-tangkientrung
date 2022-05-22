$(document).ready(function () {
    $("#responseMessage").hide(); // hide it initially

    const form_login = $("form");

    form_login.on("submit", (e) => {
        e.preventDefault();

        const form_data = form_login.serializeArray();

        // Validate to make sure form data that is going to be submited will have email and password field
        if (form_data.length != 3) {
            fadeError("Missing values can't perform login !!!");
            return;
        }

        if (form_data[0].name !== "username") {
            fadeError("Missing values can't perform login !!!");
            return;
        }

        if (form_data[1].name !== "password") {
            fadeError("Missing values can't perform login !!!");
            return;
        }

        if (form_data[2].name !== "_csrf") {
            fadeError("Missing values can't perform login !!!");
            return;
        }

        const username = form_data[0].value;
        const password = form_data[1].value;
        const csrfToken = form_data[2].value;

        if (!username || !password || username.trim() === "" || password.trim() === "") {
            fadeError("Please enter all required fields ! Can't let any field is empty !");
            return;
        }

        if (password.length < 6) {
            fadeError("Your password must be at least 6 characters !!!");
            return;
        }

        const url = 'http://localhost:3000/api/account/login';
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
                password: password
            })
        };

        fetch(url, options)
            .then(json_result => {
                return json_result.json();
            })
            .then(result => {
                console.log(result);
                if (!result.status && result.status_code === 400) {
                    fadeError(result.message);
                } else if (result.status && result.status_code === 200) {
                    fadeResult(result.message);
                    window.location.href = "http://localhost:3000";
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
