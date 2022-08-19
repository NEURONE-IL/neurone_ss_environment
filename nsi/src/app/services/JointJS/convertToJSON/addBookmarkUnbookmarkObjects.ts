import { NodeConvertToJSON } from '../nodeLink.interfaces';
import { JSONNode } from './JSONNodeInterface';

// Adds bookmark and unbookmark objects with their likelihoods (probabilities) to the JSON
export function addBookmarkUnbookmarkObjects(formattedDiagram: any, nodes: NodeConvertToJSON[], linkPairs: any): any {

  let nextNode = '';
  for (let i = 0; i < nodes.length; i++) {
    if ((nodes[i].typeNode === "bookmark") || (nodes[i].typeNode === "unbookmark")) {
      let nodeObject: JSONNode = {}
      let bookmarkUnbookmarkPage = '';
      for (let j = 0; j < linkPairs.length; j++) {
        if ((linkPairs[j].targetNode.label === nodes[i].label) && (linkPairs[j].sourceNode.typeNode === "page")) {
          bookmarkUnbookmarkPage = linkPairs[j].sourceNode.label;
          break;
        }
      }
      let bookmarkUnbookmarkQuery = '';
      let diagramKeys = Object.keys(formattedDiagram);
      for (let j = 0; j < diagramKeys.length; j++) {
        if (diagramKeys[j].includes("_" + bookmarkUnbookmarkPage)) {
          bookmarkUnbookmarkQuery = diagramKeys[j].split('_')[0];
          break;
        }
      }
      for (let j = 0; j < linkPairs.length; j++) {
        if (linkPairs[j].sourceNode.label === nodes[i].label) {
          if (linkPairs[j].targetNode.typeNode === "query") {
            nodeObject[linkPairs[j].targetNode.label] = parseInt(linkPairs[j].probability)/100;
          } else if (linkPairs[j].targetNode.typeNode === "page") {
            nodeObject[linkPairs[j].targetNode.label] = parseInt(linkPairs[j].probability)/100;
          } else if (linkPairs[j].targetNode.typeNode === "bookmark") {
            nodeObject["B"] = parseInt(linkPairs[j].probability)/100;
          } else if (linkPairs[j].targetNode.typeNode === "unbookmark") {
            nodeObject["U"] = parseInt(linkPairs[j].probability)/100;
          } else if (linkPairs[j].targetNode.typeNode === "end") {
            nodeObject["T"] = parseInt(linkPairs[j].probability)/100;
          }
          if (nodeObject["T"] === undefined) {
           nodeObject["T"] = 0.0; 
          }
          if (nodes[i].typeNode === "bookmark") {
            formattedDiagram[bookmarkUnbookmarkQuery + "_" + bookmarkUnbookmarkPage + "_B"] = nodeObject;
          } else if (nodes[i].typeNode === "unbookmark") {
            formattedDiagram[bookmarkUnbookmarkQuery + "_" + bookmarkUnbookmarkPage + "_U"] = nodeObject;
          }
        }
      }
    }
  }

  return formattedDiagram;

}