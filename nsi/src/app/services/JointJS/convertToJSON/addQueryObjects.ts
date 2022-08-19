import { NodeConvertToJSON } from '../nodeLink.interfaces';
import { JSONNode } from './JSONNodeInterface';

// Creates query objects of the JSON
// IMPORTANT NOTE: The commented lines below add the minTransitionTime and maxTransitionTime properties to the query nodes of the simplified JSON, a feature which is disabled at the moment, because it might interfere with the behavior of the student simulator in its present state
export function addQueryObjects(formattedDiagram: any, nodes: NodeConvertToJSON[], linkPairs: any): any {

  let checkedQueryNodes: string[] = [];
  let nextNode = '';
  let endProbability = 0.0;
  // let minTransitionTime = -1;
  // let maxTransitionTime = -1;
  for (let i = 0; i < linkPairs.length; i++) {
    if (linkPairs[i].sourceNode.typeNode === "start") {
      nextNode = linkPairs[i].targetNode.label;
      endProbability = 0.0;
      for (let j = 0; j < linkPairs.length; j++) {
        if ((linkPairs[j].sourceNode.label === nextNode) && (linkPairs[j].targetNode.typeNode === "end")) {
          endProbability = parseInt(linkPairs[j].probability)/100;
          break;
        }
      }
      // for (let k = 0; k < nodes.length; k++) {
      //   if (nodes[k].label === nextNode) {
      //     minTransitionTime = nodes[k].minTransitionTime;
      //     maxTransitionTime = nodes[k].maxTransitionTime;
      //     break;
      //   }
      // }
      let nodeObject: JSONNode = {
        "T": endProbability,
        // "minTransitionTime": minTransitionTime,
        // "maxTransitionTime": maxTransitionTime
      }
      formattedDiagram[nextNode] = nodeObject;

    }
  }
  let lastQueryNodeReached = false;
  let nextQueryNodeReached = false;
  while (!lastQueryNodeReached) {
    checkedQueryNodes.push(nextNode);
    endProbability = 0.0;
    for (let m = 0; m < linkPairs.length; m++) {
      if ((linkPairs[m].sourceNode.label === nextNode) && (linkPairs[m].targetNode.typeNode === "end")) {
        endProbability = parseInt(linkPairs[m].probability)/100;
        break;
      }
    }
    // for (let n = 0; n < nodes.length; n++) {
    //   if (nodes[n].label === nextNode) {
    //     minTransitionTime = nodes[n].minTransitionTime;
    //     maxTransitionTime = nodes[n].maxTransitionTime;
    //     break;
    //   }
    // }
    let nodeObject: JSONNode = {
      "T": endProbability,
      // "minTransitionTime": minTransitionTime,
      // "maxTransitionTime": maxTransitionTime
    }
    formattedDiagram[nextNode] = nodeObject;
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

  return [formattedDiagram, checkedQueryNodes];

}