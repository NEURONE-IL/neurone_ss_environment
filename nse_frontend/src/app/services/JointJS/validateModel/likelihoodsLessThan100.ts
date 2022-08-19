import { Node, Link } from '../nodeLink.interfaces'

// Checks nodes whose likelihood values (probabilities) don't add up to 100%
export function checkLikelihoodsLessThan100(nodes: Node[], links: Link[], errorMessageCount: number): string[] {

  let nodeProbabilitySum: number;
  let nodeOutLinkCount: number;
  let errorMessages: string[] = [];

  for (let i = 0; i < nodes.length; i++) {
    nodeProbabilitySum = 0;
    nodeOutLinkCount = 0;
    for (let j = 0; j < links.length; j++) {
      if (links[j].sourceId == nodes[i].id) {
        nodeOutLinkCount = nodeOutLinkCount + 1;
        nodeProbabilitySum = nodeProbabilitySum + parseInt(links[j].probability);
      }
    }
    if (nodeProbabilitySum != 100 && nodeOutLinkCount > 0) {
      errorMessageCount = errorMessageCount + 1;
      let errorMessageString = $localize`:Model validation error message in the New Behavior Model and Behavior Model Edit components:The output likelihoods for node '${nodes[i].label}' do not add up to 100%.`;
      errorMessages.push(errorMessageCount.toString() + ". " + errorMessageString);
    }
  }
  
  return errorMessages;

}