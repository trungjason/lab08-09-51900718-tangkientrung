$(document).ready(async function () {
    const listProducts = await getListProducts();
    generateTableBodyHTML(listProducts);
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
        listFile += `<div onclick="detailProduct('${product._id}')" data-toggle="modal"
        data-target="#detailProduct" class="col-lg-4 col-md-3 col-sm-6 mb-3">
            <div class="card bg-light text-center">
              <img class="card-img-top" src="/images/${product.image}" alt="Card image cap" />
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <button class="btn btn-primary">${product.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</button>
              </div>
              <div class="card-footer p-0">
                <button onclick="addProductToCart('${product._id}')" class="btn btn-info w-100">Add to cart</button>
              </div>
            </div>
          </div>`;
    });

    // Update Table Body
    $("#product-body").html(listFile);
}

async function detailProduct(product_id){
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
        document.querySelector("#detail-product-name").textContent = productDetail.name;
        document.querySelector("#detail-product-price").textContent = productDetail.price;
        document.querySelector("#detail-product-description").textContent = productDetail.description;

        document.querySelector("#detail-product-image").setAttribute("src", "/images/" + productDetail.image);
    }
}

function addProductToCart(product_id){

}