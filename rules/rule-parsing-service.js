import {readFile} from 'fs/promises'
import * as path from 'path'

const FILE_LOCATION = path.join(__dirname, './rules.json')

export class RuleParserService {
  constructor() {
        
  }

  async getRulesFor(request, user) {
    const ruleData = await readFile(FILE_LOCATION)
    const rules = JSON.parse(ruleData.toString())

    const pathWithRules = rules.find(({Path}) => Path.includes(request.getPath()))

    if (pathWithRules) {
      return pathWithRules.Rules
    } else {
      return []
    }
  }


}