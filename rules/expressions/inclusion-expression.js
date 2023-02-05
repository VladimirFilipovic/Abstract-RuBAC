import { Expression } from './expression-base.js'

/** Expression defined by keyword **in**
 *  
 *  For example: in($user_role, 'ADMIN', 'SUPER_ADMIN')
 */
export class InclusionExpression extends Expression {
  
  constructor(value, expected) {
    super(value, expected)
  }

  evaluate() {
    return !!this.expected.find(
      (expectedValue) =>
        expectedValue.toLowerCase() === this.value.toLowerCase()
    )
  }
}