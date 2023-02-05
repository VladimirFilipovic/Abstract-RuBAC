import {RuBACService} from './rubac-service.js'
import { User, Request } from './models/index.js'

const ACCESS_GRANTED_MESSAGE = { message: 'Access granted' }
const ACCESS_DENIED_MESSAGE = { message: 'You shall not pass' }

export const authMiddleware = async(req, res, next) => {
  const {ip, headers, path} = req
  const userId = headers['user-id']
  
  const request = new Request(ip, path)
  const user = new User(userId)
  
  const rubacService = new RuBACService()

  try {
    const userHasAccess = await rubacService.checkIfUserHasAccess(request, user)
    if (userHasAccess) {
      return res.status(200).json(ACCESS_GRANTED_MESSAGE)
    } else {
      return res.status(403).json(ACCESS_DENIED_MESSAGE)
    }
  } catch (error) {
    return res.status(500)
  }
  
}