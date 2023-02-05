export const tokenTypes = {
  InclusionOperator: 'InclusionOperator',
  RangeOperator: 'RangeOperator',
  ComparisonEqualsOperator: 'ComparisonEqualsOperator',
  UserRolePlaceholderValue: 'UserRolePlaceholderValue',
  IpAddressPlaceholderValue: 'IpAddressPlaceholderValue',
  IpAddressWithCIDR: 'IpAddressWithCIDR',
  ExpectedValue: 'ExpectedValue',
  ClosedParenthesis: 'ClosedParenthesis',
  OpenParenthesis: 'OpenParenthesis',
}

const tokenRegex = {
  InclusionOperator: /\bin\b/,
  RangeOperator: /\bip_range\b/,
  ComparisonEqualsOperator: /==/,
  UserRolePlaceholderValue: /\$user_role\b/,
  IpAddressPlaceholderValue: /\$ip_address\b/,
  IpAddressWithCIDR: /\b(([2]([0-4][0-9]|[5][0-5])|[0-1]?[0-9]?[0-9])[.]){3}(([2]([0-4][0-9]|[5][0-5])|[0-1]?[0-9]?[0-9]))\b\/\b([0-9]|[12][0-9]|3[0-2])\b/,
  //Role name or Ip address value
  ExpectedValue: /\b[A-Za-z_]\w*\b|\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/ ,
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

    if (!this.type) {
      throw new Error(
        `Invalid token value: ${this.text} at index: ${this.index}`
      )
    }
  }

  getType() {
    return this.type
  }

  getValue() {
    return this.text
  }
}
