const Product = require('../models/Product');
const multiparty = require('multiparty');
const fs = require("fs");
const path = require("path");
const { check, validationResult } = require("express-validator");

const validatorProduct = [
  check("name")
    .exists()
    .withMessage("Please enter product's name before submit !")
    .notEmpty()
    .withMessage("Product's name can't be empty !")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product's name length should be between 3 and 100 characters !"),

  check("price")
    .exists()
    .withMessage("Please enter product's price before submit !")
    .notEmpty()
    .withMessage("Product's price can't be empty !")
    .isFloat({ min: 0 })
    .withMessage("Product's price must be greater than 0 !"),

  check("image")
    .exists()
    .withMessage("Please choose product's image before submit !")
    .notEmpty()
    .withMessage("Product's image can't be empty !")
    .isLength({ min: 0, max: 200 })
    .withMessage("Product's image length should be between 6 and 100 characters !"),

  check("description")
    .exists()
    .withMessage("Please enter product's description before submit !")
    .notEmpty()
    .withMessage("Product's description can't be empty !")
    .isLength({ min: 0, max: 1000 })
    .withMessage("Product's description length should be between 0 and 1000 characters !")
];

async function getAllProducts(req, res, next) {
  try {
    const productList = await Product.find({}).lean().exec();

    return res.status(200).json({
      status: true,
      status_code: 200,
      message: "Get product list successfully !",
      data: productList,
    });
  } catch (error) {
    return res.status(404).json({
      status: false,
      status_code: 404,
      message: err.message,
    });
  }
}

async function getProductDetail(req, res, next) {
  try {
    const _id = req.params.id;

    if (!_id) {
      return res.status(404).json({
        status: false,
        status_code: 404,
        message: "Missing Product ID Can't Get Detail Information !!!",
      });
    }

    const detailProduct = await Product.findOne({ _id: _id }).lean().exec();

    if (!detailProduct) {
      return res.status(403).json({
        status: false,
        status_code: 403,
        message: "Can't find any product with id " + _id
      });
    }

    return res.status(200).json({
      status: true,
      status_code: 200,
      message: "Get product detail successfully !",
      data: detailProduct,
    });
  } catch (error) {
    return res.status(404).json({
      status: false,
      status_code: 404,
      message: err.message,
    });
  }
}

async function addNewProduct(req, res, next) {
  const form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(404).json({
        status: false,
        status_code: 404,
        message: "Failed to upload images !",
      });
    }

    const name = fields.name[0];
    const price = fields.price[0];
    const description = fields.description[0];

    if (!name || !price || !description) {
      return res.status(404).json({
        status: false,
        status_code: 404,
        message: "Missing params !",
      });
    }

    if (name.trim() === "" || price.trim() === "" || description.trim() === "") {
      return res.status(404).json({
        status: false,
        status_code: 404,
        message: "Empty params !",
      });
    }

    console.log(files);

    files = files.image[0];

    const path_file_name = path.parse(files.originalFilename);

    if (!isFileImage(path_file_name.ext)) {
      return res.status(404).json({
        status: false,
        status_code: 404,
        message: "Failed to upload images ! Unsupported file extension found !",
      });
    }

    const new_img_name = 'image_' + new Date().getTime() + path_file_name.ext;
    const new_img_path = './public/images/' + new_img_name;

    fs.copyFile(files.path, new_img_path, err => {
      if (err) {
        console.log(err);
      } else {
        fs.unlink(files.path, () => {
          return;
        });
        console.log("Rename and move image to folder successfully !!");
      }
    });

    const product = new Product({
      name: fields.name[0],
      price: fields.price[0],
      image: new_img_name,
      description: fields.description[0]
    });

    product.save()
      .then((result) => {
        return res.status(201).json({
          status: true,
          status_code: 201,
          message: "Add product successfully !",
          data: result,
        });
      })
      .catch((err) => {
        return res.status(404).json({
          status: false,
          status_code: 404,
          message: err.message,
        });
      });
  });
}

async function updateProduct(req, res, next) {

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(404).json({
        status: false,
        status_code: 404,
        message: "Failed to upload images !",
      });
    }

    const _id = req.params.id;

    if (!_id) {
      return res.status(404).json({
        status: false,
        status_code: 404,
        message: "Missing Product ID Can't Update Information !!!",
      });
    }

    const name = fields.name[0];
    const price = fields.price[0];
    const description = fields.description[0];

    if (!name || !price || !description) {
      return res.status(404).json({
        status: false,
        status_code: 404,
        message: "Missing params !",
      });
    }

    if (name.trim() === "" || price.trim() === "" || description.trim() === "") {
      return res.status(404).json({
        status: false,
        status_code: 404,
        message: "Empty params !",
      });
    }

    let new_img_name;

    const detailProduct = await Product.findOne({ _id: _id }).lean().exec();

    if (!detailProduct) {
      return res.status(403).json({
        status: false,
        status_code: 403,
        message: "Can't find any product with id " + _id
      });
    }

    new_img_name = detailProduct.image;

    if (files.image) {
      files = files.image[0];

      const path_file_name = path.parse(files.originalFilename);

      if (!isFileImage(path_file_name.ext)) {
        return res.status(404).json({
          status: false,
          status_code: 404,
          message: "Failed to upload images ! Unsupported file extension found !",
        });
      }

      new_img_name = 'image_' + new Date().getTime() + path_file_name.ext;
      const new_img_path = './public/images/' + new_img_name;

      fs.unlinkSync("./public/images/" + detailProduct.image); // Delete old picture
      fs.copyFileSync(files.path, new_img_path);
      fs.unlinkSync(files.path);
    }

    const product = {
      name: fields.name[0],
      price: fields.price[0],
      image: new_img_name,
      description: fields.description[0]
    };

    try {
      const updatedProduct = await Product.findByIdAndUpdate({ _id: _id }, product).lean().exec();

      if (!updatedProduct) {
        return res.status(403).json({
          status: false,
          status_code: 403,
          message: "Can't find update product with id " + _id
        });
      }

      return res.status(201).json({
        status: true,
        status_code: 201,
        message: "Update product successfully !",
        data: product,
      });
    } catch (error) {
      return res.status(404).json({
        status: false,
        status_code: 404,
        message: error.message,
      });
    }
  });
}

async function deleteProduct(req, res, next) {
  try {
    const _id = req.params.id;

    if (!_id) {
      return res.status(404).json({
        status: false,
        status_code: 404,
        message: "Missing Product ID Can't Get Detail Information !!!",
      });
    }

    const detailProduct = await Product.findOne({ _id: _id }).lean().exec();

    if (!detailProduct) {
      return res.status(403).json({
        status: false,
        status_code: 403,
        message: "Can't find any product with id " + _id
      });
    }

    fs.unlinkSync("./public/images/" + detailProduct.image);

    const deletedProduct = await Product.deleteOne({ _id: _id }).lean().exec();

    return res.status(200).json({
      status: true,
      status_code: 201,
      message: "Delete product successfully !",
      data: deletedProduct,
    });
  } catch (error) {
    return res.status(404).json({
      status: false,
      status_code: 404,
      message: error.message,
    });
  }
}

module.exports = { validatorProduct, getAllProducts, getProductDetail, addNewProduct, updateProduct, deleteProduct }

function isFileImage(file) {
  const acceptedImageTypes = [".gif", ".jpg", ".png", ".bmp", ".jpeg"];

  return acceptedImageTypes.includes(file);
}
