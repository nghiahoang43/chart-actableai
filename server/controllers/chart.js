import { Chart } from '../models/chart.js'
import { OK, NOT_FOUND, FAIL } from "../shared/response.js";
import mongoose from "mongoose";
import crypto from 'crypto'

const createChart = async (req, res) => {
    const bodyData = req.body;
    const dataObj = bodyData.dataObj;
    const type = bodyData.type;
    const colors = bodyData.colors;
    const labels = bodyData.labels;
    const newChart = new Chart({
        hash_id: "",
        dataObj: dataObj,
        type: type,
        colors: colors,
        labels: labels
    })

    try {
        const chart = await Chart.create(newChart)
        const hash_id = crypto.createHash("sha256").update(chart._id.toString()).digest().toString('hex');
        const result = await Chart.findOneAndUpdate({ _id: chart._id.toString() }, 
            { hash_id: hash_id }, {returnOriginal: false}); 
        return res.json(OK([result]));
    } catch (e) {
        console.log(e)
        return res.json(FAIL([]))
    }
}

const getChartData = async (req, res) => {
    const bodyData = req.params;
    const hash_id = bodyData.id;
    const chart = await Chart.findOne({ hash_id: hash_id });
    if (!chart) {
        return res.json(FAIL([]))
    }
    const dataObj = chart.dataObj;
    const type = chart.type;
    const colors = chart.colors;
    const labels = chart.labels;

    return res.json(OK([dataObj, type, colors, labels]));
}

const customizeChart = async (req, res) => {
    const bodyData = req.body;
    const hash_id = bodyData.chartId;
    const colors = bodyData.colors;
    const labels = bodyData.labels;
    try {
        const result = await Chart.findOneAndUpdate({ hash_id: hash_id }, 
            { colors: colors, labels: labels });
        return res.json(OK([result]));
    } catch (e) {
        console.log(e)
        return res.json(FAIL([]))
    }
}

export { createChart, getChartData, customizeChart }