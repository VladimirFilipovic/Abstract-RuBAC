import { RuBACService } from '../rubac-service.js'
import {Request, User} from '../models/index.js'

describe('RuBAC service tests', () => {
  let rubacService

  beforeEach(() => {
    rubacService = new RuBACService()
  })

  it('Should allow access to the path with no rules', async() => {
    const request = new Request('244.244.244.244', 'https://localhost:3000/some-random-page/test')
    const user = new User('6de24728-e4a5-4944-aea9-a4c0d35ba1a7')

    const isAccessGranted = await rubacService.checkIfUserHasAccess(
      request,
      user
    )
    
    expect(isAccessGranted).toBe(true)
  })

  describe('WORKFLOW 1 - /platform tests', () => {
   
    it('Should allow access to /platform for ip: 100.100.100.100 and user:admin', async() => {
      const request = new Request('100.100.100.100', 'https://localhost:3000/platform/test')
      const user = new User('0911376c-3f15-4aac-ac94-2acf3d2e85d0')
  
      const isAccessGranted = await rubacService.checkIfUserHasAccess(
        request,
        user
      )
      
      expect(isAccessGranted).toBe(true)
    })
  
    it('Should not allow access to /platform for wrong ip', async() => {
      const request = new Request('255.100.100.100', 'https://localhost:3000/platform/test')
      const user = new User('0911376c-3f15-4aac-ac94-2acf3d2e85d0')
  
      const isAccessGranted = await rubacService.checkIfUserHasAccess(
        request,
        user
      )
      
      expect(isAccessGranted).toBe(false)
    })
  
    it('Should not allow access to /platform for user in role visitor', async() => {
      const request = new Request('100.100.100.100', 'https://localhost:3000/platform/test')
      const user = new User('6de24728-e4a5-4944-aea9-a4c0d35ba1a7')
  
      const isAccessGranted = await rubacService.checkIfUserHasAccess(
        request,
        user
      )
      
      expect(isAccessGranted).toBe(false)
    })
  })
  describe('WORKFLOW 2 - /admin tests', () => {
  
    it('Should allow access to /admin for ip: 100.100.100.0 and user:super-admin', async() => {
      const request = new Request('100.100.100.0', 'https://localhost:3000/admin/test')
      const user = new User('a608e82a-bc82-4bc9-8c38-ffa9f0ed24c4')
  
      const isAccessGranted = await rubacService.checkIfUserHasAccess(
        request,
        user
      )
      
      expect(isAccessGranted).toBe(true)
    })
  
    it('Should not allow access to /admin for wrong ip', async() => {
      const request = new Request('255.100.100.100', 'https://localhost:3000/admin/test')
      const user = new User('a608e82a-bc82-4bc9-8c38-ffa9f0ed24c4')
  
      const isAccessGranted = await rubacService.checkIfUserHasAccess(
        request,
        user
      )
      
      expect(isAccessGranted).toBe(false)
    })
  
    it('Should not allow access to /admin for user in role visitor', async() => {
      const request = new Request('100.100.100.100', 'https://localhost:3000/admin/test')
      const user = new User('6de24728-e4a5-4944-aea9-a4c0d35ba1a7')
  
      const isAccessGranted = await rubacService.checkIfUserHasAccess(
        request,
        user
      )
      
      expect(isAccessGranted).toBe(false)
    })
  })

  /** the test expects that path platform/admin
   *  will have 4 different rules, that are mutually
   *  colliding ( ip range asks for address from 100.100.100.1/28 but 
   *  there is other rule that requires ip to be exactly 100.100.100.100 ) 
   *  so we will basically never give access to this path
   * 
   * */
  it('Should not allow access to the path that contains multiple rules /platform/admin', async() => {
    const request = new Request('100.100.100.0', 'https://localhost:3000/platform/admin')
    const user = new User('0911376c-3f15-4aac-ac94-2acf3d2e85d0')

    const isAccessGranted = await rubacService.checkIfUserHasAccess(
      request,
      user
    )
    
    expect(isAccessGranted).toBe(false)
  })
  
})