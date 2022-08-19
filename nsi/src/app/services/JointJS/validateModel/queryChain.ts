import { Node, Link } from '../nodeLink.interfaces'

// Checks that every query node links to another query node, except for the last one in the chain of query nodes (in other words, no isolated query nodes are allowed)
export function checkQueryChain(linkPairs: any[], errorMessageCount: number): string[] {

  let errorMessages: string[] = [];
  let checkedQueryNodes: string[] = [];

  let nextNode = '';
  for (let i = 0; i < linkPairs.length; i++) {
    if (linkPairs[i].sourceNode.typeNode === "start") {
      nextNode = linkPairs[i].targetNode.label;
    }
  }
  let lastQueryNodeReached = false;
  let nextQueryNodeReached = false;
  while (!lastQueryNodeReached) {
    checkedQueryNodes.push(nextNode);
    nextQueryNodeReached = false;
    for (let j = 0; j < linkPairs.length; j++) {
      if ((linkPairs[j].sourceNode.label === nextNode) && (linkPairs[j].targetNode.typeNode === "query")) {
        nextNode = linkPairs[j].targetNode.label;
        nextQueryNodeReached = true;
        break;
      }
    }
    if (nextQueryNodeReached == false) {
      lastQueryNodeReached = true;
    }
  }

  let checkedMissingQueryNodes: string[] = [];
  for (let i = 0; i < linkPairs.length; i++) {
    if ((linkPairs[i].sourceNode.typeNode === "query") && (!checkedQueryNodes.includes(linkPairs[i].sourceNode.label))) {
      if (!checkedMissingQueryNodes.includes(linkPairs[i].sourceNode.label)) {
        checkedMissingQueryNodes.push(linkPairs[i].sourceNode.label);
        errorMessageCount = errorMessageCount + 1;
        let errorMessageString1 = $localize`:Model validation error message in the New Behavior Model and Behavior Model Edit components:The query node '${linkPairs[i].sourceNode.label}' is outside the expected chain of linked query nodes that begins after the start node.`;
        errorMessages.push(errorMessageCount.toString() + ". " + errorMessageString1);
      }
    }
    if ((linkPairs[i].targetNode.typeNode === "query") && (!checkedQueryNodes.includes(linkPairs[i].targetNode.label))) {
      if (!checkedMissingQueryNodes.includes(linkPairs[i].targetNode.label)) {
        checkedMissingQueryNodes.push(linkPairs[i].targetNode.label);
        errorMessageCount = errorMessageCount + 1;
        let errorMessageString2 = $localize`:Model validation error message in the New Behavior Model and Behavior Model Edit components:The query node '${linkPairs[i].targetNode.label}' is outside the expected chain of linked query nodes that begins after the start node.`;
        errorMessages.push(errorMessageCount.toString() + ". " + errorMessageString2);
      }
    }
  }

  return errorMessages;

}