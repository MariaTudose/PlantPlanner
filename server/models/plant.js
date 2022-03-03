const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    updatedAt: Object,
    lastWaterignDate: Object,
    nextFertilizingDate: Object,
    scheduleId: String,
    createdBy: String,
    notes: String,
    isDeleted: Boolean,
    location: String,
    acquisitionDate: Date,
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
        delete plant.__v;
    },
});

module.exports = mongoose.model('Plant', plantSchema);
