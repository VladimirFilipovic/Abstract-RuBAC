import {userRoles} from './user-roles.js'


export class User {
  constructor(id) {
    this.id = id
    this.role = userRoles.find(role => role.userId === id)?.role || ''
  }
    
  getRole() {
    return this.role
  }
}