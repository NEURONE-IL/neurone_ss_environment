import { JSONNode } from './JSONNodeInterface';

// Adds the query-query and query-page likelihoods (probabilities) to the JSON
export function addQueryPageLikelihoods(checkedQueryNodes: string[], formattedDiagram: any, linkPairs: any): any {

  // Adding query-query likelihoods (probabilities)
  let nextNode = '';
  for (let i = 0; i < checkedQueryNodes.length; i++) {
    for (let j = 0; j < linkPairs.length; j++) {
      if ((linkPairs[j].sourceNode.label === checkedQueryNodes[i]) && (linkPairs[j].targetNode.typeNode === "query")) {
        formattedDiagram[linkPairs[j].sourceNode.label][linkPairs[j].targetNode.label] = parseInt(linkPairs[j].probability)/100;
      }
    }
  }

  // Adding query-page likelihoods (probabilities)
  nextNode = '';
  for (let i = 0; i < checkedQueryNodes.length; i++) {
    for (let j = 0; j < linkPairs.length; j++) {
      if ((linkPairs[j].sourceNode.label === checkedQueryNodes[i]) && (linkPairs[j].targetNode.typeNode === "page")) {
        formattedDiagram[linkPairs[j].sourceNode.label][linkPairs[j].targetNode.label] = parseInt(linkPairs[j].probability)/100;
      }
    }
  }

  return formattedDiagram;

}