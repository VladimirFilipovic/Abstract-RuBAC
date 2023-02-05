import { Expression } from './expression-base.js'

/** Expression defined by **equals operator**
 *  
 *  For example: $ip_address == '100.100.100.100'
 */
export class ComparisonExpression extends Expression {
  
  constructor(value, expected) {
    super(value, expected)
  }

  evaluate() {
    return this.value.toLowerCase() === this.expected.toLowerCase()
  }
}