import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

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

export function validateModel(originalGraph: joint.dia.Graph): string[] {

  let errorMessageCount = 0;
  let graph = originalGraph.toJSON();
  let nodes: Node[] = [];
  let links: Link[] = [];
  let connectedNodes: Node[] = [];
  let errorMessages: string[] = [];

  // ================

  // GETTING NODES AND LINKS

  for (let i = 0; i < graph.cells.length; i++) {
    if (graph.cells[i].type == "standard.BorderedImage") {
      nodes.push({id: graph.cells[i].id, label: graph.cells[i].attrs.label.text, typeNode: graph.cells[i].typeNode});
    } else if (graph.cells[i].type == "link") {
      links.push({id: graph.cells[i].id, sourceId: graph.cells[i].source.id, targetId: graph.cells[i].target.id, probability: graph.cells[i].labels[0].attrs.text.text});
    }
  }

  // ================

  // CHECKING LINKS WITHOUT DESTINATION

  let disconnectedLinkCount = 0;
  let sourceLabel, targetLabel: string;

  for (let i = 0; i < links.length; i++) {
    if (links[i].sourceId === undefined) {
      if (links[i].targetId === undefined) {
        disconnectedLinkCount = disconnectedLinkCount + 1;
      } else {
        for (let j = 0; j < nodes.length; j++) {
          if (nodes[j].id == links[i].targetId) {
            errorMessageCount = errorMessageCount + 1;
            errorMessages.push(errorMessageCount.toString() + ". One or more links are connected on one side to node '" + nodes[j].label + "', but disconnected on the other side.")
          }
        }
      }
    } else {
      if (links[i].targetId === undefined) {
        for (let j = 0; j < nodes.length; j++) {
          if (nodes[j].id == links[i].sourceId) {
            errorMessageCount = errorMessageCount + 1;
            errorMessages.push(errorMessageCount.toString() + ". One or more links are connected on one side to node '" + nodes[j].label + "', but disconnected on the other side.")
          }
        }
      }
    }
  }

  if (disconnectedLinkCount > 1) {
    errorMessageCount = errorMessageCount + 1;
    errorMessages.push(errorMessageCount.toString() + ". There are " + disconnectedLinkCount.toString() + " links not connected to any nodes.");
  } else if (disconnectedLinkCount == 1) {
    errorMessageCount = errorMessageCount + 1;
    errorMessages.push(errorMessageCount.toString() + ". There is one link not connected to any nodes.");
  }

  errorMessages = [...new Set(errorMessages)];
  
  if (errorMessages.length != 0) {
    return errorMessages;
  }

  // ================

  // CHECKING CONNECTED NODES

  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < links.length; j++) {
      if ((links[j].sourceId == nodes[i].id) ||
          (links[j].targetId == nodes[i].id)) {
        connectedNodes.push(nodes[i]);
      }
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    const nodeIsConnected = connectedNodes.find((obj) => {
      return obj.id === nodes[i].id;
    });
    if (nodeIsConnected == null) {
      errorMessageCount = errorMessageCount + 1;
      errorMessages.push(errorMessageCount.toString() + ". The node '" + nodes[i].label + "' is not connected to any other node.")
    }
  }

  // ================

  // CHECKING NODES WITHOUT OUTPUT

  let nonEndNodes: Node[] = [];

  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].typeNode !== "end") {
      nonEndNodes.push(nodes[i]);
    }
  }

  let nonEndNodeHasLink = false;

  for (let i = 0; i < nonEndNodes.length; i++) {
    for (let j = 0; j < links.length; j++) {
      if (links[j].sourceId == nonEndNodes[i].id) {
        nonEndNodeHasLink = true;
        break;
      }
    }
    if (nonEndNodeHasLink == false) {
      errorMessageCount = errorMessageCount + 1;
      errorMessages.push(errorMessageCount.toString() + ". The node '" + nonEndNodes[i].label + "' has no output connections. Only end nodes may lack output connections.")
    }
    nonEndNodeHasLink = false;
  }

  // ================

  // CHECKING LINKS WITHOUT LIKELIHOOD VALUES

  let linkSourceNodeLabel, linkTargetNodeLabel: string = '';

  for (let i = 0; i < links.length; i++) {
    if (links[i].probability == "(no value)") {
      for (let j = 0; j < nodes.length; j++) {
        if (nodes[j].id == links[i].sourceId) {
          linkSourceNodeLabel = nodes[j].label;
        } else if (nodes[j].id == links[i].targetId) {
          linkTargetNodeLabel = nodes[j].label;
        }
      }
      errorMessageCount = errorMessageCount + 1;
      errorMessages.push(errorMessageCount.toString() + ". The link connecting nodes '" + linkSourceNodeLabel + "' and '" + linkTargetNodeLabel + "' has no likelihood of next state.");
    }
    linkSourceNodeLabel = '';
    linkTargetNodeLabel = '';
  }

  return errorMessages;

}