import express from "express"
import { saveDataSet, getDataSets, deleteDataSet } from '../controllers/user.js'

const router = express.Router()

router.post('/save-dataset', saveDataSet)
router.post('/get-datasets', getDataSets)
router.post('/delete-dataset', deleteDataSet)

export default router;