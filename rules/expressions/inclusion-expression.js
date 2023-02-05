import { Expression } from './expression-base.js'

/** Expression defined by keyword **in**
 *  
 *  For example: in($user_role, 'ADMIN', 'SUPER_ADMIN')
 */
export class InclusionExpression extends Expression {
  
  constructor(value, expected) {
    super(value, expected)
  }

  execute() {
    throw new Error('Method \'execute()\' must be implemented.')
  }
}