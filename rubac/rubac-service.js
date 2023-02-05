import { text } from 'express'
import {readFile} from 'fs/promises'
import * as path from 'path'
import { ExpressionParser } from '../rules/index.js'


export class RuBACService {
  
  constructor() {
  }

  async checkIfUserHasAccess(request, user) {
    const pathRules = await this.#getRulesFor(request.getPath())

    const pathHasNoRules = pathRules?.length === 0
    
    if (pathHasNoRules) {
      return true
    }

    
    return this.#getPathRulesEvaluation({
      pathRules,
      request,
      user
    })
  }

  async #getRulesFor(requestPath) {
    const FILE_LOCATION = path.join(__dirname, '../rules/rules.json')
  
    const rulesData = await readFile(FILE_LOCATION)
    const rules = JSON.parse(rulesData.toString())

    const pathWithRules = rules.find(({Path}) => Path.includes(requestPath))

    if (pathWithRules) {
      return pathWithRules.Rules
    } else {
      return []
    }
  }

  #getPathRulesEvaluation({pathRules, user, request}) {
    let evaluationResult 

    const ruleExpressions = pathRules.map(({Expression: expression}) => {
      const expressionParser = new ExpressionParser(user, request, expression)
      return expressionParser.parse()
    })

    for (const ruleExpression of ruleExpressions) {
      evaluationResult = ruleExpression.evaluate()
      if (evaluationResult === false) {
        break
      }
    }
    return evaluationResult
  }

}