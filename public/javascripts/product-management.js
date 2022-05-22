$(document).ready(async function () {
    $("#add-product-alert").hide();
    $("#update-product-alert").hide();

    const listProducts = await getListProducts();
    generateTableBodyHTML(listProducts);

    $('#product-image').change(function () {
        var i = $(this).prev('label').clone();
        var file = $('#product-image')[0].files[0].name;
        $(this).next('label').text(file);
    });

    $("#form-add-product").on("submit", async (e) => {
        e.preventDefault();

        const submitValue = $("#form-add-product").serializeArray();

        if (submitValue.length != 3) {
            // Alert message
            showAddProductErrorMessage("Missing params");
        }

        if (submitValue[0].name !== "product-name" || submitValue[1].name !== "product-price" || submitValue[2].name !== "product-description") {
            showAddProductErrorMessage("Missing params");
        }

        const name = submitValue[0].value.trim();
        const price = submitValue[1].value.trim();
        const description = submitValue[2].value.trim();

        if (name === "" || price === "" || description === "") {
            showAddProductErrorMessage("Found empty value");
        }

        const image = $('#product-image')[0].files[0];

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", parseFloat(price));
        formData.append("description", description);
        formData.append("image", image);

        // AJAX LOAD FOLDER - UPDATE Breadcrumb
        const url = "http://localhost:3000/api/products";
        const options = {
            method: "POST",
            mode: "cors",
            headers: {
                Accept: "application/json",
                "Authorization": "Bearer " + getCookie("accessToken"),
            },
            body: formData,
        };

        const result = await advancedFetchRequest(url, options);

        console.log(result);
        if (result.status && result.status_code === 201) {
            $("#addProduct").modal("hide");
            showMessageDialog(
                "Thêm sản phẩm",
                "Thao tác thêm sản phẩm đã được thực hiện thành công !"
            );

            const listProducts = await getListProducts();
            generateTableBodyHTML(listProducts);
        } else {
            // Error
            showAddProductErrorMessage(result.message);
        }
    });

    $("#form-update-product").on("submit", async (e) => {
        e.preventDefault();

        const submitValue = $("#form-update-product").serializeArray();

        if (submitValue.length != 4) {
            // Alert message
            showUpdateProductErrorMessage("Missing params");
        }

        if (submitValue[0].name !== "product-name" || submitValue[1].name !== "product-price" || submitValue[2].name !== "product-description" || submitValue[3].name !== "product-id") {
            showUpdateProductErrorMessage("Missing params");
        }

        const name = submitValue[0].value.trim();
        const price = submitValue[1].value.trim();
        const description = submitValue[2].value.trim();
        const id = submitValue[3].value.trim();

        if (name === "" || price === "" || description === "" || id === "") {
            showUpdateProductErrorMessage("Found empty value");
        }

        const image = $("#form-update-product input[name='product-image']")[0].files;


        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", parseFloat(price));
        formData.append("description", description);
        
        if (image.length > 0 ){
            formData.append("image", image[0]);
        }

        // AJAX LOAD FOLDER - UPDATE Breadcrumb
        const url = "http://localhost:3000/api/products/" + id;
        const options = {
            method: "PUT",
            mode: "cors",
            headers: {
                Accept: "application/json",
                "Authorization": "Bearer " + getCookie("accessToken"),
            },
            body: formData,
        };

        const result = await advancedFetchRequest(url, options);
        if (result.status && result.status_code === 201) {
            $("#updateProduct").modal("hide");
            showMessageDialog(
                "Sửa thông tin sản phẩm",
                "Thao tác sửa thông tin sản phẩm đã được thực hiện thành công !"
            );

            const listProducts = await getListProducts();
            generateTableBodyHTML(listProducts);

        } else {
            // Error
            showUpdateProductErrorMessage(result.message);
        }
    });

    $("#form-delete-product").on("submit", async (e) => {
        e.preventDefault();

        const submitValue = $("#form-delete-product").serializeArray();

        if (submitValue.length != 1) {
            $("#deleteProduct").modal("hide");
            showMessageDialog(
                "Thông báo lỗi",
                "Missing params"
            );
        }

        if (submitValue[0].name !== "deleted-product-id" ) {
            $("#deleteProduct").modal("hide");
            showMessageDialog(
                "Thông báo lỗi",
                "Missing params"
            );
        }

        const product_id = submitValue[0].value.trim();

        if (product_id === "") {
            $("#deleteProduct").modal("hide");
            showMessageDialog(
                "Thông báo lỗi",
                "Missing params"
            );
        }

        // AJAX LOAD FOLDER - UPDATE Breadcrumb
        const url = "http://localhost:3000/api/products/" + product_id ;
        const options = {
            method: "DELETE",
            mode: "cors",
            headers: {
                Accept: "application/json",
                "Authorization": "Bearer " + getCookie("accessToken"),
            }
        };

        const result = await advancedFetchRequest(url, options);

        if (result.status && result.status_code === 201) {
            $("#deleteProduct").modal("hide");
            showMessageDialog(
                "Xóa sản phẩm",
                "Thao tác xóa sản phẩm đã được thực hiện thành công !"
            );

            const listProducts = await getListProducts();
            generateTableBodyHTML(listProducts);

        } else {
            // Error
            $("#deleteProduct").modal("hide");
            showMessageDialog(
                "Thông báo lỗi",
                result.message
            );
        }
    });
});

const advancedFetchRequest = async function (url, options) {
    return (await fetch(url, options)).json();
}

async function getListProducts() {
    // AJAX LOAD FOLDER - UPDATE Breadcrumb
    const url = "http://localhost:3000/api/products";
    const options = {
        method: "GET",
        mode: "cors",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        }
    };

    const result = await advancedFetchRequest(url, options);

    if (!result.status || !result.status_code === 200) {
        return;
    }

    return result.data;
}

// Tạo html cho các row trong table
function generateTableBodyHTML(listProduct) {
    let listFile = ``;

    listProduct.forEach((product, index) => {
        listFile += `<tr id="${product._id}">
        <td>${product.name}</td>
        <td>${product.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
        <td>${product.description}</td>
        <td><img src="/images/${product.image}" style="
        max-width: 100px;
        max-height: 100px;
        object-fit: cover;
    " /></td>
        <td>
          <span onclick="updateProduct('${product._id}')" data-toggle="modal" data-target="#updateProduct"><i class="fa fa-edit action"></i></span>
          <span onclick="confirmDelete('${product._id}','${product.name}')" data-toggle="modal" data-target="#deleteProduct"><i class="fa fa-trash action"></i></span>
        </td>
      </tr>`;
    });

    // Update Table Body
    $("tbody").html(listFile);
}


async function updateProduct(product_id){
    if ( product_id.trim() === '' ){
        return;
    }

    const url = "http://localhost:3000/api/products/" + product_id;
    const options = {
        method: "GET",
        mode: "cors",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        }
    };

    const result = await advancedFetchRequest(url, options);

    if ( result.status && result.status_code === 200){
        const productDetail = result.data;

        document.querySelector("#updateProduct input[name='product-id']").value = productDetail._id;
        document.querySelector("#updateProduct input[name='product-name']").value = productDetail.name;
        document.querySelector("#updateProduct input[name='product-price']").value = productDetail.price;
        document.querySelector("#updateProduct textarea[name='product-description']").value = productDetail.description;
        document.querySelector("#updateProduct label.custom-file-label").textContent = productDetail.image;
    }
}

function confirmDelete(product_id, product_name) {
    const delete_Modal = $("#deleteProduct");
    delete_Modal.find("#delete-product-name").html(product_name);
    delete_Modal.find("input[name='deleted-product-id']").val(product_id);
}

// Hiện thông báo bằng modal dialog, truyền tiêu đề và nội dung thông báo
function showMessageDialog(title, bodyMessage) {
    const message_Modal = $("#message-dialog");
    const message_Modal_Title = message_Modal.find(".modal-title");
    const message_Modal_Body = message_Modal.find(".modal-body");

    message_Modal_Title.html(title);
    message_Modal_Body.html(bodyMessage);

    message_Modal.modal("show");
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function showAddProductErrorMessage(message){
    $("#add-product-alert").html(message);
    $("#add-product-alert").hide().fadeIn(1500).fadeOut(3000);
}

function showUpdateProductErrorMessage(message){
    $("#update-product-alert").html(message);
    $("#update-product-alert").hide().fadeIn(1500).fadeOut(3000);
}