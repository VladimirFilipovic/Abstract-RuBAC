import express from 'express'
import { authMiddleware } from './rubac/index.js'

const app = express()
const port = 3000

/** We call middleware 
 * before each request handler 
 * to check whether user can access the resource
 * */
app.use(authMiddleware)

app.listen(port, () => console.log('server is running'))
