// Checks that when a bookmark node goes to a page node, if that page node is linked to from another page node, the latter node also links to the aforementioned bookmark node (in other words, all three nodes are part of the same chain of page nodes)
export function checkPageBookmarkLinksA(linkPairs: any[], errorMessageCount: number): string[] {

  let errorMessages: string[] = [];
  let nextNode = '';
  let checkedBookmarkNodes: string[] = [];
  for (let i = 0; i < linkPairs.length; i++) {
    let bookmarkConnectionValid = false;
    if ((linkPairs[i].sourceNode.typeNode === "bookmark") && (!checkedBookmarkNodes.includes(linkPairs[i].sourceNode.label))) {
      let bookmarkLabel = linkPairs[i].sourceNode.label;
      checkedBookmarkNodes.push(bookmarkLabel);
      let destinationPageLabel = '';
      for (let j = 0; j < linkPairs.length; j++) {
        if ((linkPairs[j].targetNode.typeNode === "page") && (linkPairs[j].sourceNode.label === bookmarkLabel)) {
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
          if ((linkPairs[j].sourceNode.label === originPageLabel) && (linkPairs[j].targetNode.label === bookmarkLabel)) {
            bookmarkConnectionValid = true;
            break;
          }
        }
        if (bookmarkConnectionValid == false) {
          errorMessageCount = errorMessageCount + 1;
          let errorMessageString1 = $localize`:Model validation error message in the New Behavior Model and Behavior Model Edit components:The bookmark node '${bookmarkLabel}' is not connected to the next page node in the sequence of page nodes of the query.`;
          errorMessages.push(errorMessageCount.toString() + ". " + errorMessageString1);
        }
      } else {
        bookmarkConnectionValid = true;
      }
    }
  }

  return errorMessages;

}

// Checks that when a bookmark node goes to a page node, and if that page node is not linked to from another page node, then the page node that originally linked to the bookmark does not lead to any page nodes (in other words, the chain of page nodes does not split into two or more flows)
export function checkPageBookmarkLinksB(graph: joint.dia.Graph, errorMessageCount: number): string[] {

  let errorMessages: string[] = [];
  let nodes = graph.getElements();
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].attributes['typeNode'] === "bookmark") {
      let bookmarkOutboundNeighbors = graph.getNeighbors(nodes[i], { outbound: true });
      for (let j = 0; j < bookmarkOutboundNeighbors.length; j++) {
        if (bookmarkOutboundNeighbors[j].attributes['typeNode'] === "page") {
          let page2InboundNeighbors = graph.getNeighbors(bookmarkOutboundNeighbors[j], { inbound: true });
          for (let k = 0; k < page2InboundNeighbors.length; k++) {
            if (page2InboundNeighbors[k].attributes['typeNode'] === "page") {
              return errorMessages;
            }
          }
          let bookmarkInboundNeighbors = graph.getNeighbors(nodes[i], { inbound: true });
          for (let k = 0; k < bookmarkInboundNeighbors.length; k++) {
            if (bookmarkInboundNeighbors[k].attributes['typeNode'] === "page") {
              let page1Node = bookmarkInboundNeighbors[k];       
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