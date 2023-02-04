import express from 'express'
import { accessCheckMiddleware } from './rubac'

const app = express()
const port = 3000

app.use(accessCheckMiddleware)

app.listen(port, () => console.log('server is running'))
