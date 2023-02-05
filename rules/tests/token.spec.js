// @ts-nocheck
import {Token, tokenTypes} from '../parsing/token.js'

describe('Token tests',() => {
  it('token type should be InclusionOperator', () => {
    const token = new Token('in', 0)
    expect(token.getType()).toEqual(tokenTypes.InclusionOperator)
  })

  it('token type should be RangeOperator', () => {
    const token = new Token('ip_range', 0)
    expect(token.getType()).toEqual(tokenTypes.RangeOperator)
  })

  it('token type should be ComparisonEqualsOperator', () => {
    const token = new Token('==', 0)
    expect(token.getType()).toEqual(tokenTypes.ComparisonEqualsOperator)
  })

  it('token type should be UserRolePlaceholderValue', () => {
    const token = new Token('$user_role', 0)
    expect(token.getType()).toEqual(tokenTypes.UserRolePlaceholderValue)
  })

  it('token type should be IpAddressPlaceholderValue', () => {
    const token = new Token('$ip_address', 0)
    expect(token.getType()).toEqual(tokenTypes.IpAddressPlaceholderValue)
  })

  it('token type should be IpAddressWithCIDR', () => {
    const token = new Token('100.100.100.100/23', 0)
    expect(token.getType()).toEqual(tokenTypes.IpAddressWithCIDR)
  })

  it('token type should be ExpectedValue', () => {
    const token = new Token('ADMIN', 0)
    expect(token.getType()).toEqual(tokenTypes.ExpectedValue)
  })

  it('token type should be ClosedParenthesis', () => {
    const token = new Token(')', 0)
    expect(token.getType()).toEqual(tokenTypes.ClosedParenthesis)
  })

  it('token type should be OpenParenthesis', () => {
    const token = new Token('(', 0)
    expect(token.getType()).toEqual(tokenTypes.OpenParenthesis)
  })

  it('should throw error for invalid token value', () => {
    expect(() => {
      new Token('!', 0)
    }).toThrow()
  })

})