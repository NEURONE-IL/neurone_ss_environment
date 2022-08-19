import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

import { ConnectedNodes } from './connectedNodes';

import { checkLinksWithoutDestination } from './linksWithoutDestination';
import { checkNodesWithoutOutput } from './nodesWithoutOutput';
import { checkLinksWithoutLikelihoods } from './linksWithoutLikelihoods';
import { checkLikelihoodsLessThan100 } from './likelihoodsLessThan100';
import { checkMultipleQueryPredecessors } from './multipleQueryPredecessors';
import { checkQueryChain } from './queryChain';
import { checkPageBookmarkLinksA, checkPageBookmarkLinksB } from './pageBookmarkLinks';
import { checkPageUnbookmarkLinksA, checkPageUnbookmarkLinksB } from './pageUnbookmarkLinks';

import { Node, Link } from '../nodeLink.interfaces'

// Checks a behavior model for errors
export function validateModel(graph: joint.dia.Graph): string[] {

  let errorMessageCount = 0;
  let JSONGraph = graph.toJSON();
  let nodes: Node[] = [];
  let links: Link[] = [];
  let errorMessages: string[] = [];

  // Getting nodes and links
  for (let i = 0; i < JSONGraph.cells.length; i++) {
    if (JSONGraph.cells[i].type == "standard.BorderedImage") {
      nodes.push({id: JSONGraph.cells[i].id, label: JSONGraph.cells[i].attrs.label.text, typeNode: JSONGraph.cells[i].typeNode});
    } else if (JSONGraph.cells[i].type == "link") {
      links.push({id: JSONGraph.cells[i].id, sourceId: JSONGraph.cells[i].source.id, targetId: JSONGraph.cells[i].target.id, probability: JSONGraph.cells[i].labels[0].attrs.text.text});
    }
  }

  // Checking that all nodes are connected
  let errorMessagesConnectedNodes = ConnectedNodes.checkConnectedNodes(graph, errorMessageCount);
  for (let i = 0; i < errorMessagesConnectedNodes.length; i++) {
    errorMessages.push(errorMessagesConnectedNodes[i])
    errorMessageCount = errorMessageCount + 1;
    return errorMessages;
  }

  // Checking links without destination
  let errorMessagesLinksWithoutDestination = checkLinksWithoutDestination(nodes, links, errorMessageCount)
  for (let i = 0; i < errorMessagesLinksWithoutDestination.length; i++) {
    errorMessages.push(errorMessagesLinksWithoutDestination[i])
    errorMessageCount = errorMessageCount + 1;
  }
  if (errorMessages.length != 0) {
    return errorMessages;
  }

  // Checking nodes that are missing outputs
  let errorMessagesNodesWithoutOutput = checkNodesWithoutOutput(nodes, links, errorMessageCount);
  for (let i = 0; i < errorMessagesNodesWithoutOutput.length; i++) {
    errorMessages.push(errorMessagesNodesWithoutOutput[i])
    errorMessageCount = errorMessageCount + 1;
  }

  // Checking links without likelihood values
  let errorMessagesLinksWithoutLikelihoods = checkLinksWithoutLikelihoods(nodes, links, errorMessageCount);
  for (let i = 0; i < errorMessagesLinksWithoutLikelihoods.length; i++) {
    errorMessages.push(errorMessagesLinksWithoutLikelihoods[i])
    errorMessageCount = errorMessageCount + 1;
  }
  if (errorMessages.length != 0) {
    return errorMessages;
  }

  // Checking nodes whose likelihood values don't add up to 100%
  let errorMessagesLikelihoodsLessThan100 = checkLikelihoodsLessThan100(nodes, links, errorMessageCount);
  for (let i = 0; i < errorMessagesLikelihoodsLessThan100.length; i++) {
    errorMessages.push(errorMessagesLikelihoodsLessThan100[i])
    errorMessageCount = errorMessageCount + 1;
  }
  if (errorMessages.length != 0) {
    return errorMessages;
  }

  // Checking page, bookmark and unbookmark nodes that have more than one predecessor of the query type
  let errorMessagesMultipleQueryPredecessors = checkMultipleQueryPredecessors(graph, errorMessageCount);
  for (let i = 0; i < errorMessagesMultipleQueryPredecessors.length; i++) {
    errorMessages.push(errorMessagesMultipleQueryPredecessors[i])
    errorMessageCount = errorMessageCount + 1;
  }
  if (errorMessages.length != 0) {
    return errorMessages;
  }

  // Generating link array for the next validations
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
    linkPairs.push({"sourceNode": sourceNode, "targetNode": targetNode});
  }
  
  // Checking that only the query node furthest from the start node in the query chain lacks a link to another query node
  let errorMessagesQueryChain = checkQueryChain(linkPairs, errorMessageCount);
  for (let i = 0; i < errorMessagesQueryChain.length; i++) {
    errorMessages.push(errorMessagesQueryChain[i])
    errorMessageCount = errorMessageCount + 1;
    return errorMessages;
  }

  // Checking that when a bookmark node goes to a page node, if that page node is linked to from another page node, the latter node also links to the aforementioned bookmark node
  let errorMessagesPageBookmarkLinksA = checkPageBookmarkLinksA(linkPairs, errorMessageCount);
  for (let i = 0; i < errorMessagesPageBookmarkLinksA.length; i++) {
    errorMessages.push(errorMessagesPageBookmarkLinksA[i])
    errorMessageCount = errorMessageCount + 1;
  }

  // Checking that when a bookmark node goes to a page node, if that page node is linked to from another page node, the latter node also links to the aforementioned bookmark node
  let errorMessagesPageBookmarkLinksB = checkPageBookmarkLinksB(graph, errorMessageCount);
  for (let i = 0; i < errorMessagesPageBookmarkLinksB.length; i++) {
    errorMessages.push(errorMessagesPageBookmarkLinksB[i])
    errorMessageCount = errorMessageCount + 1;
  }

  // Checking that when an unbookmark node goes to a page node, if that page node is linked to from another page node, the latter node also links to the aforementioned unbookmark node
  let errorMessagesPageUnbookmarkLinksA = checkPageUnbookmarkLinksA(linkPairs, errorMessageCount);
  for (let i = 0; i < errorMessagesPageUnbookmarkLinksA.length; i++) {
    errorMessages.push(errorMessagesPageUnbookmarkLinksA[i])
    errorMessageCount = errorMessageCount + 1;
  }

  // Checking that when an unbookmark node goes to a page node, if that page node is linked to from another page node, the latter node also links to the aforementioned unbookmark node
  let errorMessagesPageUnbookmarkLinksB = checkPageUnbookmarkLinksB(graph, errorMessageCount);
  for (let i = 0; i < errorMessagesPageUnbookmarkLinksB.length; i++) {
    errorMessages.push(errorMessagesPageUnbookmarkLinksB[i])
    errorMessageCount = errorMessageCount + 1;
  }

  return errorMessages;

}