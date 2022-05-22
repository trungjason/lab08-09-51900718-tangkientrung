const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    total_price: { type: 'Number', required: true, min: 0, default: 0 },
    product_list: [{
        product_id: { type: mongoose.Types.ObjectId, ref: 'Product' , required: true },
        amount: { type: 'Number', required: true, min: 0, default: 0 }
    }]
});

module.exports = mongoose.model('Order', OrderSchema);