/* eslint-disable max-len */
import { ComparisonExpression, InclusionExpression, IpRangeExpression} from '../expressions/index.js'
import { Token, tokenTypes } from './token.js'

/**
 * This regular expression ignores white-space and single quotes, matches CIDR notations, IPv4 addresses, 
 * variable names(${name}), comparison operator, numbers or other symbols
 */
const tokenRegex = /==|\b(([2]([0-4][0-9]|[5][0-5])|[0-1]?[0-9]?[0-9])[.]){3}(([2]([0-4][0-9]|[5][0-5])|[0-1]?[0-9]?[0-9]))\b\/\b([0-9]|[12][0-9]|3[0-2])\b|\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b|\$[A-Za-z_]+\b|\b[A-Za-z_][\w']*\b|((\d+))|\S/g

export class ExpressionParser {
  
  constructor(user, request, text) {
    this.user = user
    this.request = request

    this.nextTokenIndex = 0
    this.tokenList = []
    this.tokenList = this.#extractTokens(text)
  }

  parse() {
    let expr

    if (this.#isInclusionExpression()) {
      expr =  this.#parseInclusionExpression()
    }
    if (this.#isIpRangeExpression()) {
      expr = this.#parseIpRangeExpression()
    }
    if (this.#isComparisonExpression()) {
      expr = this.#parseComparisonExpression()
    }
    if (!expr) {
      throw Error('Unknown expression type')
    }
    
    const thereAreUnusedTokens = this.nextTokenIndex < this.tokenList.length - 1

    if (thereAreUnusedTokens) {
      throw {
        name: 'SyntaxError',
        message: 'Syntax error',
        token: this.tokenList[this.nextTokenIndex]
      }
    }

    return expr
  }

  #extractTokens(text) {
    const tokenList = []

    // get rid of colons
    text = text.replace(/,/g, '')
    // get rid of quotation marks
    text = text.replace(/["']/g, '')

    while (true) {
      const match = tokenRegex.exec(text)
      if (!match) {
        break
      }
      tokenList.push(new Token(match[0], match.index))
    }

    return tokenList
  }

  #getCurrentToken() {
    return this.tokenList[this.nextTokenIndex]
  }

  #isInclusionExpression() {
    const currentToken = this.#getCurrentToken()
    const currentTokenIsInclusionOperator = currentToken.getType() === tokenTypes.InclusionOperator
    const currentTokenIsFirst =  this.nextTokenIndex === 0

    return currentTokenIsInclusionOperator && currentTokenIsFirst
  }

  #parseInclusionExpression() {
    const expectedValues = []
    let currentToken = this.#getCurrentToken()

    while (currentToken.getType() !== tokenTypes.IpAddressPlaceholderValue && currentToken.getType() !== tokenTypes.UserRolePlaceholderValue) {
      this.nextTokenIndex++
      if (this.nextTokenIndex === this.tokenList.length) {
        throw new Error('Invalid inclusion expression')
      }
      currentToken = this.#getCurrentToken()
    }

    const value =
      currentToken.getType() === tokenTypes.UserRolePlaceholderValue ? this.user.getRoles() : this.request.getIpAddress()

    while (currentToken.getType() !== tokenTypes.ClosedParenthesis) {
        
      if (currentToken.getType() === tokenTypes.ExpectedValue) {
        expectedValues.push(currentToken.getValue())
      }

      this.nextTokenIndex++

      if (this.nextTokenIndex === this.tokenList.length) {
        throw new Error('Invalid inclusion expression')
      }

      currentToken = this.#getCurrentToken()
    }

    return new InclusionExpression(value, expectedValues)
  }

  #isIpRangeExpression() {
    const currentToken = this.#getCurrentToken()
    const currentTokenIsInclusionOperator = currentToken.getType() === tokenTypes.RangeOperator
    const currentTokenIsFirst =  this.nextTokenIndex === 0

    return currentTokenIsInclusionOperator && currentTokenIsFirst
  }

  #parseIpRangeExpression() {
    const value = this.request.getIpAddress()

    let expectedValue
    let currentToken = this.#getCurrentToken()

    while (!this.#isEndOfExpression()) {
     
      if (currentToken.getType() !== tokenTypes.IpAddressWithCIDR) {
        expectedValue = currentToken.getValue() 
      }

      this.nextTokenIndex++

      if (this.nextTokenIndex === this.tokenList.length) {
        throw new Error('Invalid inclusion expression')
      }

      currentToken = this.#getCurrentToken()
    }

    return new IpRangeExpression(value, expectedValue)
  }

  #isComparisonExpression() {
    //Example of valid expression: [index=0]$user_role [index=1]== [index=2]'some_value'
    const secondToken = this.tokenList[1]
    const secondTokenIsComparisonOperator = secondToken.getType() === tokenTypes.ComparisonEqualsOperator
    
    return secondTokenIsComparisonOperator
  }

  #parseComparisonExpression() {
    let currentToken = this.#getCurrentToken()

    const value =
      currentToken.getType() === tokenTypes.UserRolePlaceholderValue ? this.user.getRoles() : this.request.getIpAddress()
    

    while (currentToken.getType() !== tokenTypes.ExpectedValue) {
      this.nextTokenIndex++

      if (this.nextTokenIndex === this.tokenList.length) {
        throw new Error('Invalid inclusion expression')
      }

      currentToken = this.#getCurrentToken()
    }

    const expectedValue = currentToken.getValue()

    return new ComparisonExpression(value, expectedValue)
  }

  #isEndOfExpression() {
    const currentToken = this.#getCurrentToken()
    return currentToken.getType() === tokenTypes.ClosedParenthesis
  }
}