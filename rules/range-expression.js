import { Expression } from './expression.js'

export class RangeExpression extends Expression {
  
  constructor(value, expected) {
    super(value, expected)
  }

  execute() {
    throw new Error('Method \'execute()\' must be implemented.')
  }
}