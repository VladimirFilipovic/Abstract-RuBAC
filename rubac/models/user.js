import {userRoles} from './user-roles.js'


export class User {
  constructor(id) {
    this.id = id
    this.roles = userRoles.find(role => role.userId === id)?.roles || []
  }
    
  getRoles() {
    return this.roles
  }
}