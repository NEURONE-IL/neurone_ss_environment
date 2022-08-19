import { Node, Link } from '../nodeLink.interfaces'

// Checks links without likelihood values
export function checkLinksWithoutLikelihoods(nodes: Node[], links: Link[], errorMessageCount: number): string[] {

  let linkSourceNodeLabel, linkTargetNodeLabel: string = '';
  let errorMessages: string[] = [];

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
      let errorMessageString = $localize`:Model validation error message in the New Behavior Model and Behavior Model Edit components:The link connecting nodes '${linkSourceNodeLabel}' and '${linkTargetNodeLabel}' has no likelihood of next state.`;
      errorMessages.push(errorMessageCount.toString() + ". " + errorMessageString);
    }
    linkSourceNodeLabel = '';
    linkTargetNodeLabel = '';
  }
  
  return errorMessages;

}