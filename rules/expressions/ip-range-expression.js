import { Expression } from './expression-base.js'
import ipRangeCheck from 'ip-range-check'

/** Expression defined by keyword **ip_range**
 *  
 *  For example: ip_range($ip_address, '100.100.100.1/28')
 */
export class IpRangeExpression extends Expression {
  
  constructor(value, expected) {
    super(value, expected)
  }

  evaluate() {
    return ipRangeCheck(this.value, this.expected)
  }
}