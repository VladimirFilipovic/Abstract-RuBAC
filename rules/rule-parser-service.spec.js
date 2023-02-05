import { RuleParserService } from './rule-parsing-service.js'
import {Request, User } from '../rubac/index.js'
import {RuleParser} from './parsing/rule-parser.js'
import {InclusionExpression} from './inclusion-expression copy.js'
import { RangeExpression } from './range-expression.js'
import { ComparisonExpression } from './Comparison-expression.js'

describe('Rule parser test', () => {
  let ruleParser

  beforeEach(() => {
    ruleParser = new RuleParserService()
  })

  it('should return set of rules  if they are defined for a given path', async() => {
    const request = new Request('100.100.100.100', '/admin/')
    const user = new User('1')

    const rules = await ruleParser.getRulesFor(request, user)

    expect(rules).toBeTruthy()
    expect(rules?.length).toBeGreaterThan(0)
  })

  it('should return empty array if there are no rules for a given path', async() => {
    const request = new Request('100.100.100.100', '/random/')
    const user = new User('1')

    const rules = await ruleParser.getRulesFor(request, user)
    
    expect(rules).toBeTruthy()
    expect(rules?.length).toEqual(0)
  })

  it('should return inclusion expression', () => {
    const request = new Request('100.100.100.100', '/random/')
    const user = new User('1')

    const ruleParser = new RuleParser(user, request , `in($user_role, 'ADMIN', 'SUPER_ADMIN')`)
    const expression = ruleParser.parse()

    // const isInclussion = expression instanceof InclusionExpression
    expect(expression).toBeInstanceOf(InclusionExpression)
  })

  it('should return ip range expression', () => {
    const request = new Request('100.100.100.100', '/random/')
    const user = new User('1')

    const ruleParser = new RuleParser(user, request , `ip_range($ip_address, '100.100.100.1/28')`)
    const expression = ruleParser.parse()

    expect(expression).toBeInstanceOf(RangeExpression)
  })

  it('should return comparison expression - user role', () => {
    const request = new Request('100.100.100.100', '/random/')
    const user = new User('1')

    const ruleParser = new RuleParser(user, request , `$user_role == 'ADMIN'`)
    const expression = ruleParser.parse()

    expect(expression).toBeInstanceOf(ComparisonExpression)
  })
  it('should return comparison expression - ip address', () => {
    const request = new Request('100.100.100.100', '/random/')
    const user = new User('1')

    const ruleParser = new RuleParser(user, request , `$ip_address == '100.100.100.100'`)
    const expression = ruleParser.parse()

    expect(expression).toBeInstanceOf(ComparisonExpression)
  })


})