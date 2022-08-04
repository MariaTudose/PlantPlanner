const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    _id: String,
    notify: Boolean,
    isDeleted: Boolean,
    time: String,
    createdBy: String,
    fertilizerTime: String,
    //plantId: { type: String, ref: 'Plant' },
    createdAt: Object,
    fertilizerDaysInterval: Number,
    daysInterval: Number,
    fertilizerNotify: Boolean,
});

scheduleSchema.set('toJSON', {
    transform: (_, schema) => {
        schema.id = schema._id;
        delete schema._id;
    },
});

module.exports = mongoose.model('Schedule', scheduleSchema);
