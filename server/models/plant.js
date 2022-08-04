const mongoose = require('mongoose');
const Schedule = require('./schedule');

const plantSchema = new mongoose.Schema({
    _id: String,
    updatedAt: Object,
    lastWateringDate: Object,
    nextFertilizingDate: Object,
    lastFertilizingDate: Object,
    nextMistingDate: Object,
    scheduleId: { type: String, ref: Schedule },
    createdBy: String,
    notes: String,
    isDeleted: Boolean,
    location: String,
    acquisitionDate: String,
    createdAt: Object,
    name: String,
    pictures: Array,
    plantSpeciesId: String,
    nextWateringDate: Object,
});

plantSchema.set('toJSON', {
    transform: (_, plant) => {
        plant.id = plant._id;
        delete plant._id;
    },
});

module.exports = mongoose.model('Plant', plantSchema);
