import mongoose from 'mongoose';

const dataSet = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name: String,
    curDate: Date,
    chartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chart'
    },
})

export const DataSet = mongoose.model('dataSet', dataSet);