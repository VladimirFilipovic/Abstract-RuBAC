import { Expression } from './expression-base.js'

/** Expression defined by **equals operator**
 *  
 *  For example: $ip_address == '100.100.100.100'
 */
export class ComparisonExpression extends Expression {
  
  constructor(value, expected) {
    super(value, expected)
  }

  execute() {
    throw new Error('Method \'execute()\' must be implemented.')
  }
}