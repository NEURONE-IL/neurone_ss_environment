import { Node, Link } from '../nodeLink.interfaces'

// Checks nodes that are missing outputs
export function checkNodesWithoutOutput(nodes: Node[], links: Link[], errorMessageCount: number): string[] {

  let nonEndNodes: Node[] = [];
  let errorMessages: string[] = [];

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
      let errorMessageString = $localize`:Model validation error message in the New Behavior Model and Behavior Model Edit components:The node '${nonEndNodes[i].label}' has no output connections. Only end nodes may lack output connections.`;
      errorMessages.push(errorMessageCount.toString() + ". " + errorMessageString)
    }
    nonEndNodeHasLink = false;
  }
  
  return errorMessages;

}