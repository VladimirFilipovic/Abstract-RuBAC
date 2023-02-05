import { Expression } from './expression-base.js'

/** Expression defined by keyword **ip_range**
 *  
 *  For example: ip_range($ip_address, '100.100.100.1/28')
 */
export class IpRangeExpression extends Expression {
  
  constructor(value, expected) {
    super(value, expected)
  }

  execute() {
    throw new Error('Method \'execute()\' must be implemented.')
  }
}