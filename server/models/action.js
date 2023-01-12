const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
    _id: String,
    createdAt: String,
    plantId: String, //{ type: String, ref: 'Plant' },
    action: String,
    date: String,
});

actionSchema.set('toJSON', {
    transform: (_, schema) => {
        schema.id = schema._id;
        delete schema._id;
    },
});

module.exports = mongoose.model('Action', actionSchema);
