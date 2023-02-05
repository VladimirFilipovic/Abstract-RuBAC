export class Expression {
  
  constructor(value, expected) {
    this.value = value
    this.expected = expected
  }

  execute() {
    throw new Error('Method \'execute()\' must be implemented.')
  }
}