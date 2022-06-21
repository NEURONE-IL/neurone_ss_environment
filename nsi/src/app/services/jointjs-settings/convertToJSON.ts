import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

// This function is executed once the diagram has been validated (in another method)
export function convertToJSON(graph: joint.dia.Graph): any {

  let origDiagram = graph.toJSON();

  interface JSONNode {
      [key: string]: any
  }

  let formattedDiagram: any = {};

  // GETTING NODES AND LINKS

  let nodes: Node[] = [];
  let links: Link[] = [];

  for (let i = 0; i < origDiagram.cells.length; i++) {
    if (origDiagram.cells[i].type == "standard.BorderedImage") {
      nodes.push({id: origDiagram.cells[i].id, label: origDiagram.cells[i].attrs.label.text, typeNode: origDiagram.cells[i].typeNode});
    } else if (origDiagram.cells[i].type == "link") {
      links.push({id: origDiagram.cells[i].id, sourceId: origDiagram.cells[i].source.id, targetId: origDiagram.cells[i].target.id, probability: origDiagram.cells[i].labels[0].attrs.text.text});
    }
  }

  // ================

  // GENERATE LINK ARRAY

  let linkPairs = [];

  for (let i = 0; i < links.length; i++) {
    let sourceId = links[i].sourceId;
    let sourceNode = {"label": "", "typeNode": ""};
    for (let j = 0; j < nodes.length; j++) {
      if (nodes[j].id == sourceId) {
        sourceNode.label = nodes[j].label;
        sourceNode.typeNode = nodes[j].typeNode;
        break;
      }
    }
    let targetId = links[i].targetId;
    let targetNode = {"label": "", "typeNode": ""};
    for (let j = 0; j < nodes.length; j++) {
      if (nodes[j].id == targetId) {
        targetNode.label = nodes[j].label;
        targetNode.typeNode = nodes[j].typeNode;
        break;
      }
    }
    let probability = links[i].probability;
    linkPairs.push({"sourceNode": sourceNode, "targetNode": targetNode, "probability": probability});
  }

  // ================

  // CREATION OF QUERY OBJECTS

  let checkedQueryNodes: string[] = [];
  let nextNode = '';
  let endProbability = 0.0;
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
      let nodeObject: JSONNode = {
        "T": endProbability
      }
      formattedDiagram[nextNode] = nodeObject;

    }
  }
  let lastQueryNodeReached = false;
  let nextQueryNodeReached = false;
  while (!lastQueryNodeReached) {
    checkedQueryNodes.push(nextNode);
    endProbability = 0.0;
    for (let k = 0; k < linkPairs.length; k++) {
      if ((linkPairs[k].sourceNode.label === nextNode) && (linkPairs[k].targetNode.typeNode === "end")) {
        endProbability = parseInt(linkPairs[k].probability)/100;
        break;
      }
    }
    let nodeObject: JSONNode = {
      "T": endProbability
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

  // ================

  // ADDING QUERY-QUERY PROBABILITIES

  nextNode = '';
  for (let i = 0; i < checkedQueryNodes.length; i++) {
    for (let j = 0; j < linkPairs.length; j++) {
      if ((linkPairs[j].sourceNode.label === checkedQueryNodes[i]) && (linkPairs[j].targetNode.typeNode === "query")) {
        formattedDiagram[linkPairs[j].sourceNode.label][linkPairs[j].targetNode.label] = parseInt(linkPairs[j].probability)/100;
      }
    }
  }

  // ================

  // ADDING QUERY-PAGE PROBABILITIES

  nextNode = '';
  for (let i = 0; i < checkedQueryNodes.length; i++) {
    for (let j = 0; j < linkPairs.length; j++) {
      if ((linkPairs[j].sourceNode.label === checkedQueryNodes[i]) && (linkPairs[j].targetNode.typeNode === "page")) {
        formattedDiagram[linkPairs[j].sourceNode.label][linkPairs[j].targetNode.label] = parseInt(linkPairs[j].probability)/100;
      }
    }
  }

  // ================

  // ADDING PAGE OBJECTS WITH THEIR PROBABILITIES

  nextNode = '';
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
            } else if (linkPairs[k].targetNode.typeNode === "unBookmark") {
              nodeObject["U"] = parseInt(linkPairs[k].probability)/100;
            } else if (linkPairs[k].targetNode.typeNode === "end") {
              nodeObject["T"] = parseInt(linkPairs[k].probability)/100;
            }
            if (nodeObject["T"] === undefined) {
             nodeObject["T"] = 0.0; 
            }
            formattedDiagram[checkedQueryNodes[i] + "_" + linkPairs[k].sourceNode.label] = nodeObject;
          }
        }
      }
    }
    let lastPageNodeReached = false;
    let nextPageNodeReached = false;
    
    while (!lastPageNodeReached) {
      nextPageNodeReached = false;
      for (let k = 0; k < linkPairs.length; k++) {
        if ((linkPairs[k].sourceNode.label === nextNode) && (linkPairs[k].targetNode.typeNode === "page")) {
          nextNode = linkPairs[k].targetNode.label;
          nextPageNodeReached = true;
          break;
        }
      }
      let nodeObject: JSONNode = {}
      for (let k = 0; k < linkPairs.length; k++) {
        if (linkPairs[k].sourceNode.label === nextNode) {
          if (linkPairs[k].targetNode.typeNode === "query") {
            nodeObject[linkPairs[k].targetNode.label] = parseInt(linkPairs[k].probability)/100;
          } else if (linkPairs[k].targetNode.typeNode === "page") {
            nodeObject[linkPairs[k].targetNode.label] = parseInt(linkPairs[k].probability)/100;
          } else if (linkPairs[k].targetNode.typeNode === "bookmark") {
            nodeObject["B"] = parseInt(linkPairs[k].probability)/100;
          } else if (linkPairs[k].targetNode.typeNode === "unBookmark") {
            nodeObject["U"] = parseInt(linkPairs[k].probability)/100;
          } else if (linkPairs[k].targetNode.typeNode === "end") {
            nodeObject["T"] = parseInt(linkPairs[k].probability)/100;
          }
          if (nodeObject["T"] === undefined) {
           nodeObject["T"] = 0.0; 
          }
          formattedDiagram[checkedQueryNodes[i] + "_" + linkPairs[k].sourceNode.label] = nodeObject;
        }
      }
      if (nextPageNodeReached == false) {
        lastPageNodeReached = true;
      }
    }
  }

  // ================

  // ADDING BOOKMARK AND UNBOOKMARK OBJECTS WITH THEIR PROBABILITIES

  for (let i = 0; i < nodes.length; i++) {
    if ((nodes[i].typeNode === "bookmark") || (nodes[i].typeNode === "unBookmark")) {
      let nodeObject: JSONNode = {}
      let bookmarkUnBookmarkPage = '';
      for (let j = 0; j < linkPairs.length; j++) {
        if ((linkPairs[j].targetNode.label === nodes[i].label) && (linkPairs[j].sourceNode.typeNode === "page")) {
          bookmarkUnBookmarkPage = linkPairs[j].sourceNode.label;
          break;
        }
      }
      let bookmarkUnBookmarkQuery = '';
      let diagramKeys = Object.keys(formattedDiagram);
      for (let j = 0; j < diagramKeys.length; j++) {
        if (diagramKeys[j].includes("_" + bookmarkUnBookmarkPage)) {
          bookmarkUnBookmarkQuery = diagramKeys[j].split('_')[0];
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
          } else if (linkPairs[j].targetNode.typeNode === "unBookmark") {
            nodeObject["U"] = parseInt(linkPairs[j].probability)/100;
          } else if (linkPairs[j].targetNode.typeNode === "end") {
            nodeObject["T"] = parseInt(linkPairs[j].probability)/100;
          }
          if (nodeObject["T"] === undefined) {
           nodeObject["T"] = 0.0; 
          }
          if (nodes[i].typeNode === "bookmark") {
            formattedDiagram[bookmarkUnBookmarkQuery + "_" + bookmarkUnBookmarkPage + "_B"] = nodeObject;
          } else if (nodes[i].typeNode === "unBookmark") {
            formattedDiagram[bookmarkUnBookmarkQuery + "_" + bookmarkUnBookmarkPage + "_U"] = nodeObject;
          }
        }
      }
    }
  }

  // ================

  // REBUILD FORMATTED DIAGRAM WITH RENAMED NODES

  let renameDictionary: JSONNode = {};

  // ================

  // DETERMINE QUERY ORDER AND QUERY RENAMING

  checkedQueryNodes.length = 0;
  let queryCount = 1;

  nextNode = '';
  for (let i = 0; i < linkPairs.length; i++) {
    if (linkPairs[i].sourceNode.typeNode === "start") {
      nextNode = linkPairs[i].targetNode.label;
      checkedQueryNodes.push(nextNode);
      renameDictionary[nextNode] = 'Q' + queryCount;
      queryCount = queryCount + 1;
    }
  }
  lastQueryNodeReached = false;
  nextQueryNodeReached = false;
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

  // ================

  // DETERMINE PAGE RENAMING FOR EACH QUERY

  let checkedPageNodes: string[] = [];
  let pageCount: number;
  let lastPageNodeReached: boolean;
  let nextPageNodeReached: boolean;

  for (let i = 0; i < checkedQueryNodes.length; i++) {
    checkedPageNodes.length = 0;
    pageCount = 1;
    nextNode = '';
    for (let j = 0; j < linkPairs.length; j++) {
      if ((linkPairs[j].sourceNode.label === checkedQueryNodes[i]) && (linkPairs[j].targetNode.typeNode === "page")) {
        nextNode = linkPairs[j].targetNode.label;
        renameDictionary[nextNode] = 'P' + pageCount;
        pageCount = pageCount + 1;
      }
    }
    lastPageNodeReached = false;
    nextPageNodeReached = false;
    while (!lastPageNodeReached) {
      checkedPageNodes.push(nextNode);
      nextPageNodeReached = false;
      for (let j = 0; j < linkPairs.length; j++) {
        if ((linkPairs[j].sourceNode.label === nextNode) && (linkPairs[j].targetNode.typeNode === "page")) {
          nextNode = linkPairs[j].targetNode.label;
          renameDictionary[nextNode] = 'P' + pageCount;
          pageCount = pageCount + 1;
          nextPageNodeReached = true;
          break;
        }
      }
      if (nextPageNodeReached == false) {
        lastPageNodeReached = true;
      }
    }
  }

  // ================

  // REBUILD FORMATTED DIAGRAM

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

  // ================

  return renamedFormattedDiagram;

}

interface Node {
  id: string,
  label: string,
  typeNode: string
}

interface Link {
  id: string,
  sourceId: string,
  targetId: string,
  probability: string
}