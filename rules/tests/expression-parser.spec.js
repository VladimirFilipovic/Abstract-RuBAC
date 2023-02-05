// @ts-nocheck
import { User, Request } from '../../rubac/index.js'
import { ComparisonExpression, InclusionExpression, IpRangeExpression} from '../expressions/index.js'
import { ExpressionParser } from '../parsing/expression-parser.js'


describe('Expression parser tests', () => {

  it('should return inclusion expression', () => {
    const request = new Request('100.100.100.100', '/random/')
    const user = new User('1')

    const ruleParser = new ExpressionParser(user, request , 'in($user_role, \'ADMIN\', \'SUPER_ADMIN\')')
    const expression = ruleParser.parse()

    expect(expression).toBeInstanceOf(InclusionExpression)
  })

  it('should return ip range expression', () => {
    const request = new Request('100.100.100.100', '/random/')
    const user = new User('1')

    const ruleParser = new ExpressionParser(user, request , 'ip_range($ip_address, \'100.100.100.1/28\')')
    const expression = ruleParser.parse()

    expect(expression).toBeInstanceOf(IpRangeExpression)
  })

  it('should return comparison expression - user role', () => {
    const request = new Request('100.100.100.100', '/random/')
    const user = new User('1')

    const ruleParser = new ExpressionParser(user, request , '$user_role == \'ADMIN\'')
    const expression = ruleParser.parse()

    expect(expression).toBeInstanceOf(ComparisonExpression)
  })

  it('should return comparison expression - ip address', () => {
    const request = new Request('100.100.100.100', '/random/')
    const user = new User('1')

    const ruleParser = new ExpressionParser(user, request , '$ip_address == \'100.100.100.100\'')
    const expression = ruleParser.parse()

    expect(expression).toBeInstanceOf(ComparisonExpression)
  })

  it('should throw error for invalid expression',() => {
    const request = new Request('100.100.100.100', '/random/')
    const user = new User('1')
    
    const ruleParser = new ExpressionParser(user, request , '$ip_address == \'100.100.100.100\'()')

    expect(() => ruleParser.parse()).toThrow()
  })
  
})