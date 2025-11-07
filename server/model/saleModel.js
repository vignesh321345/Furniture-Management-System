const mongoose = require('mongoose');

const saleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    cal: {
        type: Number,
        required: true
    },
    image: {
        type: String, // The file path to the image
        required: false
    },
    tag: {
        type: String, // Tag associated with the product
        required: true
    },
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to the user who posted the product
    }
});

const Operations = mongoose.model('Operations', saleSchema);

module.exports = Operations;
