import { InclusionExpression } from '../inclusion-expression copy.js'
import { Token, tokenTypes } from './token.js'

/**
 * This regular expression ignores white-space, matches either an IP address, 
 * an expression starting with a dollar sign, an identifier, a number, or other symbol.
 */
const tokenRegex = /\b(?:\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3})\b|\$[A-Za-z_]+\b|\b[A-Za-z_]\w*\b|((\d+))|\S/g

const IP_ADDRESS_PLACEHOLDER = '$ip_address'
const USER_ROLE_PLACEHOLDER = '$user_role'

export class RuleParser {
  
    //takes req and user and passed accordingly
  constructor(user,request,text) {
    this.nextTokenIndex = 0
    this.tokenList = []

    this.user = user
    this.request = request

    while (true) {
      const match = tokenRegex.exec(text)
      if (match === null) {
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

    while(currentToken.getType() !== tokenTypes.PlaceholderValue) {
        this.nextTokenIndex++
        if(this.nextTokenIndex == this.tokenList.length) {
            throw new Error('Invalid inclusion expression')
        }
        currentToken = this.#getCurrentToken()
    }

    const value =
      currentToken.getValue() === USER_ROLE_PLACEHOLDER
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

   #parseExpression() {
    //
    if(this.#isInclusionExpression()) {
        return this.#parseInclusionExpression()
    }
  }

  
}