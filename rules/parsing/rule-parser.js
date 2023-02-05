import { ComparisonExpression } from '../Comparison-expression.js'
import { InclusionExpression } from '../inclusion-expression copy.js'
import { RangeExpression } from '../range-expression.js'
import { Token, tokenTypes } from './token.js'

/**
 * This regular expression ignores white-space and single quotes, matches CIDR notations, IPv4 addresses, 
 * variable names(${name}), comparison operator, numbers or other symbols
 */
const tokenRegex = 
/==|\b(([2]([0-4][0-9]|[5][0-5])|[0-1]?[0-9]?[0-9])[.]){3}(([2]([0-4][0-9]|[5][0-5])|[0-1]?[0-9]?[0-9]))\b\/\b([0-9]|[12][0-9]|3[0-2])\b|\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b|\$[A-Za-z_]+\b|\b[A-Za-z_][\w']*\b|((\d+))|\S/g
export class RuleParser {
  
  constructor(user,request,text) {
    this.nextTokenIndex = 0
    this.tokenList = []

    this.user = user
    this.request = request

    this.text = text.replace(/,/g, '')
    this.text = this.text.replace(/["']/g, '')

    while (true) {
      const match = tokenRegex.exec(this.text)
      if (!match) {
        break
      }
      this.tokenList.push(new Token(match[0], match.index))
    }
  }

  parse() {
    const expr = this.#parseExpression()
    //TODO: why - 1 
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

    while(currentToken.getType() !== tokenTypes.IpAddressPlaceholderValue && currentToken.getType() !== tokenTypes.UserRolePlaceholderValue) {
        this.nextTokenIndex++
        if(this.nextTokenIndex == this.tokenList.length) {
            throw new Error('Invalid inclusion expression')
        }
        currentToken = this.#getCurrentToken()
    }

    const value =
      currentToken.getType() === tokenTypes.UserRolePlaceholderValue
        ? this.user.getRoles()
        : this.request.getIpAddress();

    while(currentToken.getType() !== tokenTypes.ClosedParenthesis) {
        
        if(currentToken.getType() === tokenTypes.ExpectedValue) {
            expectedValues.push(currentToken.getValue())
        }

        this.nextTokenIndex++

        if(this.nextTokenIndex === this.tokenList.length) {
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
    const value = this.request.getIpAddress();

    let expectedValue
    let currentToken = this.#getCurrentToken()

    while(!this.#isEndOfExpression()) {
        if(currentToken.getType() !== tokenTypes.IpAddressWithCIDR) {
            expectedValue = currentToken.getValue() 
        }
        currentToken.getType() !== tokenTypes.IpAddressWithCIDR

        this.nextTokenIndex++


        if(this.nextTokenIndex === this.tokenList.length) {
            throw new Error('Invalid inclusion expression')
        }

        currentToken = this.#getCurrentToken()
    }

    return new RangeExpression(value, expectedValue)
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
      currentToken.getType() === tokenTypes.UserRolePlaceholderValue
        ? this.user.getRoles()
        : this.request.getIpAddress();

    

    while(currentToken.getType() !== tokenTypes.ExpectedValue) {
        this.nextTokenIndex++

        if(this.nextTokenIndex === this.tokenList.length) {
            throw new Error('Invalid inclusion expression')
        }

        currentToken = this.#getCurrentToken()
    }

    const expectedValue = currentToken.getValue()

    return new ComparisonExpression(value, expectedValue)
  }

   #parseExpression() {
    if(this.#isInclusionExpression()) {
        return this.#parseInclusionExpression()
    }
    if(this.#isIpRangeExpression()) {
        return this.#parseIpRangeExpression()
    }
    if(this.#isComparisonExpression()){
        return this.#parseComparisonExpression()
    }
    throw Error('Unknown expression type')
  }

  #isEndOfExpression() {
    const currentToken = this.#getCurrentToken()
    return currentToken.getType() === tokenTypes.ClosedParenthesis
  }

  
}