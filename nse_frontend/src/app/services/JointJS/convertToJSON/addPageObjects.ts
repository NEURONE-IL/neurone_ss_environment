import { NodeConvertToJSON } from '../nodeLink.interfaces';
import { JSONNode } from './JSONNodeInterface';

// Adds page objects with their likelihoods (probabilities) to the JSON
// IMPORTANT NOTE: The commented lines below add the minTransitionTime, maxTransitionTime and relevantPage properties to the page/SERP nodes of the simplified JSON, a feature which is disabled at the moment, because it might interfere with the behavior of the student simulator in its present state
export function addPageObjects(checkedQueryNodes: string[], formattedDiagram: any, nodes: NodeConvertToJSON[], linkPairs: any): any {

  let nextNode = '';
  for (let i = 0; i < checkedQueryNodes.length; i++) {
    nextNode = '';
    for (let j = 0; j < linkPairs.length; j++) {
      if ((linkPairs[j].sourceNode.label === checkedQueryNodes[i]) && (linkPairs[j].targetNode.typeNode === "page")) {
        nextNode = linkPairs[j].targetNode.label;
        let nodeObject: JSONNode = {}
        for (let k = 0; k < linkPairs.length; k++) {
          if (linkPairs[k].sourceNode.label === linkPairs[j].targetNode.label) {
            if (linkPairs[k].targetNode.typeNode === "query") {
              nodeObject[linkPairs[k].targetNode.label] = parseInt(linkPairs[k].probability)/100;
            } else if (linkPairs[k].targetNode.typeNode === "page") {
              nodeObject[linkPairs[k].targetNode.label] = parseInt(linkPairs[k].probability)/100;
            } else if (linkPairs[k].targetNode.typeNode === "bookmark") {
              nodeObject["B"] = parseInt(linkPairs[k].probability)/100;
            } else if (linkPairs[k].targetNode.typeNode === "unbookmark") {
              nodeObject["U"] = parseInt(linkPairs[k].probability)/100;
            } else if (linkPairs[k].targetNode.typeNode === "end") {
              nodeObject["T"] = parseInt(linkPairs[k].probability)/100;
            }
            if (nodeObject["T"] === undefined) {
             nodeObject["T"] = 0.0; 
            }
            // for (let m = 0; m < nodes.length; m++) {
            //   if (nodes[m].label === nextNode) {
            //     nodeObject["minTransitionTime"] = nodes[m].minTransitionTime;
            //     nodeObject["maxTransitionTime"] = nodes[m].maxTransitionTime;
            //     nodeObject["relevantPage"] = nodes[m].relevantPage;
            //     break;
            //   }
            // }
            formattedDiagram[checkedQueryNodes[i] + "_" + linkPairs[k].sourceNode.label] = nodeObject;
          }
        }
      }
    }
    let lastPageNodeReached = false;
    let nextPageNodeReached = false;
    let bookmarkUnbookmarkNodeFound = false;
    
    while (!lastPageNodeReached) {
      nextPageNodeReached = false;
      for (let k = 0; k < linkPairs.length; k++) {
        if ((linkPairs[k].sourceNode.label === nextNode) && (linkPairs[k].targetNode.typeNode === "page")) {
          nextNode = linkPairs[k].targetNode.label;
          nextPageNodeReached = true;
          bookmarkUnbookmarkNodeFound = false;
          break;
        }
      }

      // In case two pages are not connected directly, but through a bookmark or unbookmark node
      if (nextPageNodeReached == false) {
        for (let k = 0; k < linkPairs.length; k++) {
          if ((linkPairs[k].sourceNode.label === nextNode) && ((linkPairs[k].targetNode.typeNode === "bookmark") || (linkPairs[k].targetNode.typeNode === "unbookmark"))) {
            let bookmarkUnbookmarkNode = linkPairs[k].targetNode.label;
            for (let m = 0; m < linkPairs.length; m++) {
              if ((linkPairs[m].sourceNode.label === bookmarkUnbookmarkNode) && (linkPairs[m].targetNode.typeNode === "page")) {
                nextNode = linkPairs[m].targetNode.label;
                nextPageNodeReached = true;
                bookmarkUnbookmarkNodeFound = true;
                break;
              }
            }
            break;
          }
        }
      }

      if (nextPageNodeReached == false) {
        lastPageNodeReached = true;
      } else {
        let nodeObject: JSONNode = {}
        for (let k = 0; k < linkPairs.length; k++) {
          if (linkPairs[k].sourceNode.label === nextNode) {
            if (linkPairs[k].targetNode.typeNode === "query") {
              nodeObject[linkPairs[k].targetNode.label] = parseInt(linkPairs[k].probability)/100;
            } else if (linkPairs[k].targetNode.typeNode === "page") {
              nodeObject[linkPairs[k].targetNode.label] = parseInt(linkPairs[k].probability)/100;
            } else if (linkPairs[k].targetNode.typeNode === "bookmark") {
              nodeObject["B"] = parseInt(linkPairs[k].probability)/100;
            } else if (linkPairs[k].targetNode.typeNode === "unbookmark") {
              nodeObject["U"] = parseInt(linkPairs[k].probability)/100;
            } else if (linkPairs[k].targetNode.typeNode === "end") {
              nodeObject["T"] = parseInt(linkPairs[k].probability)/100;
            }
            if (nodeObject["T"] === undefined) {
             nodeObject["T"] = 0.0; 
            }
            // for (let m = 0; m < nodes.length; m++) {
            //   if (nodes[m].label === nextNode) {
            //     nodeObject["minTransitionTime"] = nodes[m].minTransitionTime;
            //     nodeObject["maxTransitionTime"] = nodes[m].maxTransitionTime;
            //     nodeObject["relevantPage"] = nodes[m].relevantPage;
            //     break;
            //   }
            // }

            formattedDiagram[checkedQueryNodes[i] + "_" + linkPairs[k].sourceNode.label] = nodeObject;
          }
        }
      }
    }
  }

  return formattedDiagram;

}