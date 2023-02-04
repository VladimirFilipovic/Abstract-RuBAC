import {RuBACService} from './rubac-service'
import { User, Request } from './models'

const ACCESS_GRANTED_MESSAGE = { message: 'Access granted' }
const ACCESS_DENIED_MESSAGE = { message: 'You shall not pass' }

export const authMiddleware = (req, res, next) => {
  const {ip, headers, path} = req
  const userId = headers['user-id']
  
  const request = new Request(ip, path)
  const user = new User(userId)
  
  const rubacService = new RuBACService()
  const userHasAccess = rubacService.userHasAccess(request, user)
    
  if (userHasAccess) {
    return res.status(200).json(ACCESS_GRANTED_MESSAGE)
  } else {
    return res.status(403).json(ACCESS_DENIED_MESSAGE)
  }
}