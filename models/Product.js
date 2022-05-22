const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: { type: 'string', required: true },
    price: { type: 'Number', required: true, min: 0, default: 0 },
    image: { type: 'string', required: true },
    description: { type: 'string', required: true },
});

module.exports = mongoose.model('Product', ProductSchema);