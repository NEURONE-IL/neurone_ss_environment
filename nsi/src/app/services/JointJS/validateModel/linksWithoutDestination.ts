import { Node, Link } from '../nodeLink.interfaces'

// Checks links without destination
export function checkLinksWithoutDestination(nodes: Node[], links: Link[], errorMessageCount: number): string[] {

  let disconnectedLinkCount = 0;
  let sourceLabel, targetLabel: string;
  let errorMessages: string[] = [];

  for (let i = 0; i < links.length; i++) {
    if (links[i].sourceId === undefined) {
      if (links[i].targetId === undefined) {
        disconnectedLinkCount = disconnectedLinkCount + 1;
      } else {
        for (let j = 0; j < nodes.length; j++) {
          if (nodes[j].id == links[i].targetId) {
            errorMessageCount = errorMessageCount + 1;
            let errorMessageString1 = $localize`:Model validation error message in the New Behavior Model and Behavior Model Edit components:One or more links are connected on one side to node '${nodes[j].label}', but disconnected on the other side.`;
            errorMessages.push(errorMessageCount.toString() + ". " + errorMessageString1);
          }
        }
      }
    } else {
      if (links[i].targetId === undefined) {
        for (let j = 0; j < nodes.length; j++) {
          if (nodes[j].id == links[i].sourceId) {
            errorMessageCount = errorMessageCount + 1;
            let errorMessageString2 = $localize`:Model validation error message in the New Behavior Model and Behavior Model Edit components:One or more links are connected on one side to node '${nodes[j].label}', but disconnected on the other side.`;
            errorMessages.push(errorMessageCount.toString() + ". " + errorMessageString2);
          }
        }
      }
    }
  }

  if (disconnectedLinkCount > 1) {
    errorMessageCount = errorMessageCount + 1;
    let errorMessageString3 = $localize`:Model validation error message in the New Behavior Model and Behavior Model Edit components:There are ${disconnectedLinkCount.toString()} links not connected to any nodes.`;
    errorMessages.push(errorMessageCount.toString() + ". " + errorMessageString3);
  } else if (disconnectedLinkCount == 1) {
    errorMessageCount = errorMessageCount + 1;
    errorMessages.push(errorMessageCount.toString() + ". There is one link not connected to any nodes.");
  }

  errorMessages = [...new Set(errorMessages)];
  
  return errorMessages;

}