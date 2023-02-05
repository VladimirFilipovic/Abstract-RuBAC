export const tokenTypes = {
  InclusionOperator: 'InclusionOperator',
  PlaceholderValue: 'PlaceholderValue',
  ExpectedValue: 'ExpectedValue',
  ClosedParenthesis: 'ClosedParenthesis',
  OpenParenthesis: 'ClosedParenthesis',
}

const tokenRegex = {
  InclusionOperator: /\bin\b/,
  PlaceholderValue: /\$[A-Za-z_]+\b/,
  ExpectedValue: /\b[A-Za-z_]\w*\b/,
  ClosedParenthesis: /\)/,
  OpenParenthesis: /\(/,
}

export class Token {
  constructor(text, index) {
    this.text = text
    this.index = index 

    for (const tokenType in tokenTypes) {
      if (tokenRegex[tokenType].test(this.text)) {
        this.type = tokenType
        break
      }
    }
  }

  getType() {
    return this.type
  }

  getValue() {
    return this.text
  }
}
