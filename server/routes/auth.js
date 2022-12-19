import express from "express"
import {plotData, signup, login } from '../controllers/auth.js'

const router = express.Router()

router.post('/plotData', plotData)
router.post('/signup', signup)
router.post('/login', login)

export default router;