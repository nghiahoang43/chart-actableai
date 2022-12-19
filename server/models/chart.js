import mongoose from 'mongoose';

const chartSchema = new mongoose.Schema({
    hash_id: String,
    dataObj: {
        x: [],
        y: [[]]
    },
    type: String,
    colors: [String],
    labels: [String],
})

export const Chart = mongoose.model('chart', chartSchema);