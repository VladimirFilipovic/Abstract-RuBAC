import {readFile} from 'fs/promises'
import * as path from 'path'
import { ExpressionParser } from '../rules/index.js'

const FILE_LOCATION = path.join('./rules/rules.json')

export class RuBACService {
  
  constructor() {
  }

  async checkIfUserHasAccess(request, user) {
    const pathRules = await this.#getRulesFor(request.getPath())

    if (!pathRules?.length) {
      return true
    }

    return this.#getPathRulesEvaluation({
      pathRules,
      request,
      user
    })
  }

  async #getRulesFor(requestPath) {
    const rulesData = await readFile(FILE_LOCATION)
    const rules = JSON.parse(rulesData.toString())

    const pathsWithRules = rules.filter(({ Path }) => {
      const pathName = Path.split('/*')[0]
      return requestPath.includes(pathName)
    })

    if (pathsWithRules) {
      return pathsWithRules.reduce((rules, currRules) => {
        rules.push(...currRules.Rules)
        return rules
      }, [])
    } else {
      return []
    }
  }

  #getPathRulesEvaluation({pathRules, user, request}) {
    let evaluationResult 

    const ruleExpressions = pathRules.map((pathRule) => {
      const expressionParser = new ExpressionParser(user, request, pathRule.Expression)
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