import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

import { NodeConvertToJSON, Link } from '../nodeLink.interfaces';
import { JSONNode } from './JSONNodeInterface';

import { addQueryObjects } from './addQueryObjects';
import { addQueryPageLikelihoods } from './addQueryPageLikelihoods';
import { addPageObjects } from './addPageObjects';
import { addBookmarkUnbookmarkObjects } from './addBookmarkUnbookmarkObjects';
import { determineQueryOrderAndRenaming } from './determineQueryOrderAndRenaming';
import { determinePageRenaming } from './determinePageRenaming';
import { rebuildFormattedDiagram } from './rebuildFormattedDiagram';

// Converts a behavior model to simplified JSON format (to be provided to the student simulator) -- This must be used only after making sure the behavior model has no errors
// IMPORTANT NOTE: The use of the minTransitionTime, maxTransitionTime and relevantPage properties of the behavior models is disabled at the moment, because it might interfere with the behavior of the student simulator in its present state
export function convertToJSON(graph: joint.dia.Graph): any {

  let origDiagram = graph.toJSON();

  let formattedDiagram: any = {};
  let checkedQueryNodes: string[] = [];

  // Getting nodes and links
  let nodes: NodeConvertToJSON[] = [];
  let links: Link[] = [];
  for (let i = 0; i < origDiagram.cells.length; i++) { // For simplicity, the minTransitionTime, maxTransitionTime and relevantPage properties are added to all nodes in the nodes array, but they only apply to certain types of nodes (see the comments on the '../nodeLink.interfaces.ts' file)
    if (origDiagram.cells[i].type == "standard.BorderedImage") {
      if (origDiagram.cells[i].typeNode == "query") {
        nodes.push({id: origDiagram.cells[i].id, label: origDiagram.cells[i].attrs.label.text, typeNode: origDiagram.cells[i].typeNode, minTransitionTime: origDiagram.cells[i].minTransitionTime, maxTransitionTime: origDiagram.cells[i].maxTransitionTime, relevantPage: false});
      } else if (origDiagram.cells[i].typeNode == "page") {
        nodes.push({id: origDiagram.cells[i].id, label: origDiagram.cells[i].attrs.label.text, typeNode: origDiagram.cells[i].typeNode, minTransitionTime: origDiagram.cells[i].minTransitionTime, maxTransitionTime: origDiagram.cells[i].maxTransitionTime, relevantPage: origDiagram.cells[i].relevantPage});
      } else {
        nodes.push({id: origDiagram.cells[i].id, label: origDiagram.cells[i].attrs.label.text, typeNode: origDiagram.cells[i].typeNode, minTransitionTime: -1, maxTransitionTime: -1, relevantPage: false});
      }
    } else if (origDiagram.cells[i].type == "link") {
      links.push({id: origDiagram.cells[i].id, sourceId: origDiagram.cells[i].source.id, targetId: origDiagram.cells[i].target.id, probability: origDiagram.cells[i].labels[0].attrs.text.text});
    }
  }

  // Generating link array
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

  // Adding query objects
  let queryObjectsAdded = addQueryObjects(formattedDiagram, nodes, linkPairs);
  formattedDiagram = queryObjectsAdded[0];
  for (let i = 0; i < queryObjectsAdded[1].length; i++) {
    checkedQueryNodes.push(queryObjectsAdded[1][i]);
  }

  // Adding query-query and query-page likelihoods (probabilities)
  formattedDiagram = addQueryPageLikelihoods(checkedQueryNodes, formattedDiagram, linkPairs);

  // Adding page objects with their likelihoods (probabilities)
  formattedDiagram = addPageObjects(checkedQueryNodes, formattedDiagram, nodes, linkPairs);

  // Adding bookmark and unbookmark objects with their likelihoods (probabilities)
  formattedDiagram = addBookmarkUnbookmarkObjects(formattedDiagram, nodes, linkPairs);

  // Rebuilding formatted diagram with renamed nodes
  let renameDictionary: JSONNode = {};

  // Determining query order and query renaming
  let queryOrderAndRenamingDetermined = determineQueryOrderAndRenaming(renameDictionary, linkPairs, nodes);
  renameDictionary = queryOrderAndRenamingDetermined[0];
  checkedQueryNodes = queryOrderAndRenamingDetermined[1];

  // Determining page renaming for each query
  renameDictionary = determinePageRenaming(renameDictionary, linkPairs, checkedQueryNodes);

  // Rebuilding formatted diagram
  let renamedFormattedDiagram = rebuildFormattedDiagram(formattedDiagram, renameDictionary);

  return renamedFormattedDiagram;

}