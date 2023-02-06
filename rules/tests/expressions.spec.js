// @ts-nocheck
import {ComparisonExpression, InclusionExpression, IpRangeExpression} from '../expressions/index.js'

describe('Expression evaluation tests', () => {

  describe('[comparison-expression] tests', () => {
    it('should return true for equal ip adresses', () => {
      const expression = new ComparisonExpression('100.100.100.100', '100.100.100.100')
      expect(expression.evaluate()).toBe(true)
    })

    it('should return true for equal user roles', () => {
      const expression = new ComparisonExpression('ADMIN', 'admin')
      expect(expression.evaluate()).toBe(true)
    })

    it('should return false for different ip adresses', () => {
      const expression = new ComparisonExpression('100.100.100.100', '100.100.100.101')
      expect(expression.evaluate()).toBe(false)
    })
    it('should return false for different user roles', () => {
      const expression = new ComparisonExpression('ADMIN', 'SOME_ROLE')
      expect(expression.evaluate()).toBe(false)
    })
    
  })

  describe('[inclusion-expression] tests', () => {
    it('should return true if provided role is included', () => {
      const expression = new InclusionExpression('admin', ['admin','super_admin'])
      expect(expression.evaluate()).toBe(true)
    })

    it('should return false if provided role is not included', () => {
      const expression = new InclusionExpression('random', ['admin','super_admin'])
      expect(expression.evaluate()).toBe(false)
    })
  })

  describe('[ip-range-expression] tests', () => {
    it('should return true if provided ip is in range', () => {
      const expression = new IpRangeExpression('100.100.100.100', '100.100.100.100/23')
      expect(expression.evaluate()).toBe(true)
    })

    it('should return false if provided ip is not in range', () => {
      const expression = new IpRangeExpression('255.100.100.100', '100.100.100.100/23')
      expect(expression.evaluate()).toBe(false)
    }) 
  })
})