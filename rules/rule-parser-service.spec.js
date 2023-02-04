import { RuleParserService } from './rule-parsing-service.js'
import {Request, User } from '../rubac/index.js'

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
})