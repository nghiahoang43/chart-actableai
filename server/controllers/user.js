import { User } from '../models/user.js'
import { DataSet } from '../models/dataSet.js'
import { Chart } from '../models/chart.js';
import { OK, NOT_FOUND, FAIL } from "../shared/response.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const saveDataSet = async (req, res) => {
    const { userId, dataSetName, data, hash_id } = req.body;
    let chartId;
    try {
        let result = await Chart.findOne({ hash_id: hash_id });
        chartId = result._id;
    }
    catch (e) {
        console.log(e)
        return res.json(FAIL([]))
    }
    if (chartId) {
        const newDataSet = {
            userId: userId,
            name: dataSetName,
            data: data,
            curDate: new Date(),
            chartId: chartId,
        }
        try {
            let result = await DataSet.create(newDataSet)
            return res.json(OK([result]));
        } catch (e) {
            console.log(e)
            return res.json(FAIL([]))
        }
    }
    return res.json(FAIL([]));
}

const getDataSets = async (req, res) => {
    const { userId } = req.body
    let dataSets = await DataSet.find({ userId: userId })
    let results = []
    for (let dataSet of dataSets) {
        let result = await Chart.findById({ _id: dataSet.chartId })
        dataSet._doc = { ...dataSet._doc, chart: result }
        results = [...results, dataSet._doc]
    }
    return res.json(OK([results]))
}

const deleteDataSet = async (req, res) => {
    const { userId, dataSetId } = req.body
    try {
        let result = await DataSet.findOneAndDelete({ _id: dataSetId, userId: userId })
        return res.json(OK([result]))
    } catch (e) {
        console.log(e)
        return res.json(FAIL([]))
    }
}

export { saveDataSet, getDataSets, deleteDataSet }