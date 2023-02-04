class Request {
  constructor(ipAddress, path) {
    this.ipAddress = ipAddress
    this.path = path
  }
    
  getIpAddress() {
    return this.ipAddress
  }
    
  getPath() {
    return this.path
  }
}
  