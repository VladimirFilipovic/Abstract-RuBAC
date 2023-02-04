import * as userRoles from './user-roles.json'


export class User {
  constructor(id) {
    this.id = id
    this.roles = userRoles.find(role => role.userId === id)?.roles || []
  }
    
  getRoles() {
    return this.roles
  }
}