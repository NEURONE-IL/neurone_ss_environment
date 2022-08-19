import { JSONNode } from './JSONNodeInterface';
import { NodeConvertToJSON } from '../nodeLink.interfaces';

// Determines the order of the query nodes and the names they will have to take, and adds them to the dictionary
export function determineQueryOrderAndRenaming(renameDictionary: JSONNode, linkPairs: any, nodes: NodeConvertToJSON[]): any {

  let checkedQueryNodes: string[] = [];
  let queryCount = 1;

  let nextNode = '';
  for (let i = 0; i < linkPairs.length; i++) {
    if (linkPairs[i].sourceNode.typeNode === "start") {
      nextNode = linkPairs[i].targetNode.label;
      checkedQueryNodes.push(nextNode);
      renameDictionary[nextNode] = 'Q' + queryCount;
      queryCount = queryCount + 1;
    }
  }
  let lastQueryNodeReached = false;
  let nextQueryNodeReached = false;
  while (!lastQueryNodeReached) {
    checkedQueryNodes.push(nextNode);
    nextQueryNodeReached = false;
    for (let i = 0; i < linkPairs.length; i++) {
      if ((linkPairs[i].sourceNode.label === nextNode) && (linkPairs[i].targetNode.typeNode === "query")) {
        nextNode = linkPairs[i].targetNode.label;
        renameDictionary[nextNode] = 'Q' + queryCount;
        queryCount = queryCount + 1;
        nextQueryNodeReached = true;
        break;
      }
    }
    if (nextQueryNodeReached == false) {
      lastQueryNodeReached = true;
    }
  }

  return [renameDictionary, checkedQueryNodes];

}