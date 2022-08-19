import { JSONNode } from './JSONNodeInterface';

// Rebuilds the formatted JSON diagram using the rename dictionary
export function rebuildFormattedDiagram(formattedDiagram: any, renameDictionary: JSONNode): any {

  let renamedFormattedDiagram: any = {};
  let renameDictionaryKeys = Object.keys(renameDictionary)
  let formattedDiagramKeys = Object.keys(formattedDiagram);
  for (let i = 0; i < formattedDiagramKeys.length; i++) {
    let numberUnderscores = (formattedDiagramKeys[i].match(/_/g)||[]).length;
    let newKey = '';
    if (numberUnderscores == 2) {
      let splitOriginalKey = formattedDiagramKeys[i].split("_");
      newKey = renameDictionary[splitOriginalKey[0]] + renameDictionary[splitOriginalKey[1]] + splitOriginalKey[2];
    } else if (numberUnderscores == 1) {
      let splitOriginalKey = formattedDiagramKeys[i].split("_");
      newKey = renameDictionary[splitOriginalKey[0]] + renameDictionary[splitOriginalKey[1]];
    } else {
      newKey = renameDictionary[formattedDiagramKeys[i]];
    }
    let singleObjectKeys = Object.keys(formattedDiagram[formattedDiagramKeys[i]]);
    let renamedSingleObject: JSONNode = {};
    let renameKeyFound = false;
    let renameKey = '';
    for (let j = 0; j < singleObjectKeys.length; j++) {
      renameKeyFound = false;
      for (let k = 0; k < renameDictionaryKeys.length; k++) {
        if (singleObjectKeys[j] === renameDictionaryKeys[k]) {
          renameKeyFound = true;
          renameKey = renameDictionary[renameDictionaryKeys[k]];
          break;
        }
      }
      if (renameKeyFound == false) {
        renamedSingleObject[singleObjectKeys[j]] = formattedDiagram[formattedDiagramKeys[i]][singleObjectKeys[j]];
      } else {
        renamedSingleObject[renameKey] = formattedDiagram[formattedDiagramKeys[i]][singleObjectKeys[j]];
      }
    }
    renamedFormattedDiagram[newKey] = renamedSingleObject;
  }

  return renamedFormattedDiagram;

}