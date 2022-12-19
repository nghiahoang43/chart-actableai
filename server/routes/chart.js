import express from "express"
import { createChart, getChartData, customizeChart } from '../controllers/chart.js'

const router = express.Router()

router.get('/:id', getChartData)
router.post('/createChart', createChart)
router.post('/customizeChart', customizeChart)

export default router;