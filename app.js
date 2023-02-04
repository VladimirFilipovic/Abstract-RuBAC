import express from 'express'
import {RuBACService} from './rubac/rubac-service.js'

const app = express()
const port = 3000

const rubacMiddleware = (req, res, next) => {
  const rubacService = new RuBACService()
}

app.use(rubacMiddleware)

app.listen(port, () => console.log('server is running'))
