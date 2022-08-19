// Checks that when an unbookmark node goes to a page node, if that page node is linked to from another page node, the latter node also links to the aforementioned unbookmark node (in other words, all three nodes are part of the same chain of page nodes)
export function checkPageUnbookmarkLinksA(linkPairs: any[], errorMessageCount: number): string[] {

  let errorMessages: string[] = [];
  let nextNode = '';
  let checkedUnbookmarkNodes: string[] = [];
  for (let i = 0; i < linkPairs.length; i++) {
    let unbookmarkConnectionValid = false;
    if ((linkPairs[i].sourceNode.typeNode === "unbookmark") && (!checkedUnbookmarkNodes.includes(linkPairs[i].sourceNode.label))) {
      let unbookmarkLabel = linkPairs[i].sourceNode.label;
      checkedUnbookmarkNodes.push(unbookmarkLabel);
      let destinationPageLabel = '';
      for (let j = 0; j < linkPairs.length; j++) {
        if ((linkPairs[j].targetNode.typeNode === "page") && (linkPairs[j].sourceNode.label === unbookmarkLabel)) {
          destinationPageLabel = linkPairs[j].targetNode.label;
          break;
        }
      }
      let originPageLabel = '';
      for (let j = 0; j < linkPairs.length; j++) {
        if ((linkPairs[j].targetNode.label === destinationPageLabel) && (linkPairs[j].sourceNode.typeNode === "page")) {
          originPageLabel = linkPairs[j].sourceNode.label;
          break;
        }
      }
      if ((originPageLabel !== '') && (destinationPageLabel !== '')) {
        for (let j = 0; j < linkPairs.length; j++) {
          if ((linkPairs[j].sourceNode.label === originPageLabel) && (linkPairs[j].targetNode.label === unbookmarkLabel)) {
            unbookmarkConnectionValid = true;
            break;
          }
        }
        if (unbookmarkConnectionValid == false) {
          errorMessageCount = errorMessageCount + 1;
          let errorMessageString1 = $localize`:Model validation error message in the New Behavior Model and Behavior Model Edit components:The unbookmark node '${unbookmarkLabel}' is not connected to the next page node in the sequence of page nodes of the query.`;
          errorMessages.push(errorMessageCount.toString() + ". " + errorMessageString1);
        }
      } else {
        unbookmarkConnectionValid = true;
      }
    }
  }

  return errorMessages;

}

// Checks that when an unbookmark node goes to a page node, and if that page node is not linked to from another page node, then the page node that originally linked to the unbookmark does not lead to any page nodes (in other words, the chain of page nodes does not split into two or more flows)
export function checkPageUnbookmarkLinksB(graph: joint.dia.Graph, errorMessageCount: number): string[] {

  let errorMessages: string[] = [];
  let nodes = graph.getElements();
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].attributes['typeNode'] === "unbookmark") {
      let unbookmarkOutboundNeighbors = graph.getNeighbors(nodes[i], { outbound: true });
      for (let j = 0; j < unbookmarkOutboundNeighbors.length; j++) {
        if (unbookmarkOutboundNeighbors[j].attributes['typeNode'] === "page") {
          let page2InboundNeighbors = graph.getNeighbors(unbookmarkOutboundNeighbors[j], { inbound: true });
          for (let k = 0; k < page2InboundNeighbors.length; k++) {
            if (page2InboundNeighbors[k].attributes['typeNode'] === "page") {
              return errorMessages;
            }
          }
          let unbookmarkInboundNeighbors = graph.getNeighbors(nodes[i], { inbound: true });
          for (let k = 0; k < unbookmarkInboundNeighbors.length; k++) {
            if (unbookmarkInboundNeighbors[k].attributes['typeNode'] === "page") {
              let page1Node = unbookmarkInboundNeighbors[k];       
              let page1OutboundNeighbors = graph.getNeighbors(page1Node, { outbound: true });
              for (let k = 0; k < page1OutboundNeighbors.length; k++) {
                if (page1OutboundNeighbors[k].attributes['typeNode'] === "page") {
                  let cell = graph.getCell(page1Node!.id);
                  errorMessageCount = errorMessageCount + 1;
                  let errorMessageString2 = $localize`:Model validation error message in the New Behavior Model and Behavior Model Edit components:After the page node '${cell.attributes.attrs!['label']!.text}', the chain of page nodes splits into two or more flows.`;
                  errorMessages.push(errorMessageCount.toString() + ". " + errorMessageString2);
                }
              }
            }
          }
        }
      }
    }
  }

  return errorMessages;

}