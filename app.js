import express from 'express'
import { authMiddleware } from './rubac/index.js'

const app = express()
const port = 3000

app.use(authMiddleware)

app.listen(port, () => console.log('server is running'))
