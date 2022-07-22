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

  if (errorMessages.length != 0) {
    return errorMessages;
  }

  // ================

  // CHECKING NODES WHOSE LIKELIHOOD VALUES DONT ADD UP TO 100

  let nodeProbabilitySum: number;
  let nodeOutLinkCount: number;

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
      errorMessages.push(errorMessageCount.toString() + ". The likelihoods for node '" + nodes[i].label + "' do not add up to 100%.");
    }
  }

  if (errorMessages.length != 0) {
    return errorMessages;
  }

  // ================

  // HIGH-LEVEL VALIDATION: GENERATE LINK ARRAY

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

  // CHECKING THAT EVERY QUERY NODE LEADS TO A PAGE/SERP NODE

  let checkedQueryNodes: string[] = [];
  for (let i = 0; i < linkPairs.length; i++) {
    if (linkPairs[i].sourceNode.typeNode === "query") {
      if (!checkedQueryNodes.includes(linkPairs[i].sourceNode.label)) {
        checkedQueryNodes.push(linkPairs[i].sourceNode.label);
        let queryLeadsToPage = false;
        for (let j = 0; j < linkPairs.length; j++) {
          if (linkPairs[j].sourceNode.label === linkPairs[i].sourceNode.label) {
            if (linkPairs[j].targetNode.typeNode === "page") {
              queryLeadsToPage = true;
              break;
            }
          }
        }
        if (queryLeadsToPage == false) {
          errorMessageCount = errorMessageCount + 1;
          errorMessages.push(errorMessageCount.toString() + ". The query node '" + linkPairs[i].sourceNode.label + "' is not linked to a page/SERP node.");
        }
      }
    }

    if (linkPairs[i].targetNode.typeNode === "query") {
      if (!checkedQueryNodes.includes(linkPairs[i].targetNode.label)) {
        checkedQueryNodes.push(linkPairs[i].targetNode.label);
        let queryLeadsToPage = false;
        for (let j = 0; j < linkPairs.length; j++) {
          if (linkPairs[j].sourceNode.label === linkPairs[i].targetNode.label) {
            if (linkPairs[j].targetNode.typeNode === "page") {
              queryLeadsToPage = true;
              break;
            }
          }
        }
        if (queryLeadsToPage == false) {
          errorMessageCount = errorMessageCount + 1;
          errorMessages.push(errorMessageCount.toString() + ". The query node '" + linkPairs[i].targetNode.label + "' is not linked to a page/SERP node.");
        }
      }
    }
  }

  // CHECKING THAT EVERY QUERY NODE LEADS TO AN END NODE

  // checkedQueryNodes.length = 0;
  // for (let i = 0; i < linkPairs.length; i++) {
  //   if (linkPairs[i].sourceNode.typeNode === "query") {
  //     if (!checkedQueryNodes.includes(linkPairs[i].sourceNode.label)) {
  //       checkedQueryNodes.push(linkPairs[i].sourceNode.label);
  //       let queryLeadsToEnd = false;
  //       for (let j = 0; j < linkPairs.length; j++) {
  //         if (linkPairs[j].sourceNode.label === linkPairs[i].sourceNode.label) {
  //           if (linkPairs[j].targetNode.typeNode === "end") {
  //             queryLeadsToEnd = true;
  //             break;
  //           }
  //         }
  //       }
  //       if (queryLeadsToEnd == false) {
  //         errorMessageCount = errorMessageCount + 1;
  //         errorMessages.push(errorMessageCount.toString() + ". The query node '" + linkPairs[i].sourceNode.label + "' is not linked to an end node.");
  //       }
  //     }
  //   }

  //   if (linkPairs[i].targetNode.typeNode === "query") {
  //     if (!checkedQueryNodes.includes(linkPairs[i].targetNode.label)) {
  //       checkedQueryNodes.push(linkPairs[i].targetNode.label);
  //       let queryLeadsToEnd = false;
  //       for (let j = 0; j < linkPairs.length; j++) {
  //         if (linkPairs[j].sourceNode.label === linkPairs[i].targetNode.label) {
  //           if (linkPairs[j].targetNode.typeNode === "end") {
  //             queryLeadsToEnd = true;
  //             break;
  //           }
  //         }
  //       }
  //       if (queryLeadsToEnd == false) {
  //         errorMessageCount = errorMessageCount + 1;
  //         errorMessages.push(errorMessageCount.toString() + ". The query node '" + linkPairs[i].targetNode.label + "' is not linked to an end node.");
  //       }
  //     }
  //   }
  // }

  // CHECKING THAT, IF A QUERY NODE THAT LEADS TO ANOTHER QUERY NODE, THE LATTER NODE DOES NOT LEAD TO THE FORMER (QUERY LOOP)

  checkedQueryNodes.length = 0;
  for (let i = 0; i < linkPairs.length; i++) {
    if ((linkPairs[i].sourceNode.typeNode === "query") && (linkPairs[i].targetNode.typeNode === "query")) {
      let queryNodeCheck = linkPairs[i].sourceNode.label;
      if (!checkedQueryNodes.includes(queryNodeCheck)) {
        checkedQueryNodes.push(queryNodeCheck);
        let queryLoop = false;
        let finishedChecking = false;
        let nextQueryNode = linkPairs[i].targetNode.label;
        while (!finishedChecking) {
          let nextQueryNodeFound = false;
          for (let j = 0; j < linkPairs.length; j++) {
            if ((linkPairs[j].sourceNode.label === nextQueryNode) && (linkPairs[j].targetNode.typeNode === "query")) {
              nextQueryNode = linkPairs[j].targetNode.label;
              nextQueryNodeFound = true;
              break;
            }
          }
          if ((nextQueryNodeFound === true) && (nextQueryNode === queryNodeCheck)) {
            queryLoop = true;
            finishedChecking = true;
          }
          else if (nextQueryNodeFound === false) {
            finishedChecking = true;
          }
        }
        if (queryLoop == true) {
          errorMessageCount = errorMessageCount + 1;
          errorMessages.push(errorMessageCount.toString() + ". The query nodes currently form a loop. A query node must not lead back to a previous query node.");
          return errorMessages;
          break;
        }
      }
    }
  }

  // CHECKING THAT ONLY THE QUERY NODE FURTHEST FROM THE START NODE IN THE QUERY CHAIN LACKS A LINK TO ANOTHER QUERY NODE

  checkedQueryNodes.length = 0;
  let nextNode = '';
  for (let i = 0; i < linkPairs.length; i++) {
    if (linkPairs[i].sourceNode.typeNode === "start") {
      nextNode = linkPairs[i].targetNode.label;
    }
  }
  let lastQueryNodeReached = false;
  let nextQueryNodeReached = false;
  while (!lastQueryNodeReached) {
    checkedQueryNodes.push(nextNode);
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

  let checkedMissingQueryNodes: string[] = [];
  for (let i = 0; i < linkPairs.length; i++) {
    if ((linkPairs[i].sourceNode.typeNode === "query") && (!checkedQueryNodes.includes(linkPairs[i].sourceNode.label))) {
      if (!checkedMissingQueryNodes.includes(linkPairs[i].sourceNode.label)) {
        checkedMissingQueryNodes.push(linkPairs[i].sourceNode.label);
        errorMessageCount = errorMessageCount + 1;
        errorMessages.push(errorMessageCount.toString() + ". The query node '" + linkPairs[i].sourceNode.label +  "' is outside the expected chain of linked query nodes that begins after the start node.");
      }
    }
    if ((linkPairs[i].targetNode.typeNode === "query") && (!checkedQueryNodes.includes(linkPairs[i].targetNode.label))) {
      if (!checkedMissingQueryNodes.includes(linkPairs[i].targetNode.label)) {
        checkedMissingQueryNodes.push(linkPairs[i].targetNode.label);
        errorMessageCount = errorMessageCount + 1;
        errorMessages.push(errorMessageCount.toString() + ". The query node '" + linkPairs[i].targetNode.label +  "' is outside the expected chain of linked query nodes that begins after the start node.");
      }
    }
  }

  // CHECKING THAT WHEN A BOOKMARK NODE GOES TO A PAGE NODE, THAT PAGE IS LINKED TO FROM THE SAME PAGE THAT LINKS TO THE BOOKMARK NODE

  let checkedBookmarkNodes: string[] = [];
  for (let i = 0; i < linkPairs.length; i++) {
    let bookmarkConnectionValid = false;
    if ((linkPairs[i].sourceNode.typeNode === "bookmark") && (!checkedBookmarkNodes.includes(linkPairs[i].sourceNode.label))) {
      let bookmarkLabel = linkPairs[i].sourceNode.label;
      checkedBookmarkNodes.push(bookmarkLabel);
      let destinationPageLabel = '';
      for (let j = 0; j < linkPairs.length; j++) {
        if ((linkPairs[j].targetNode.typeNode === "page") && (linkPairs[j].sourceNode.label === bookmarkLabel)) {
          destinationPageLabel = linkPairs[j].sourceNode.label;
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
          errorMessages.push(errorMessageCount.toString() + ". The bookmark node '" + bookmarkLabel +  "' is not connected to the next page node in the sequence of page nodes of the query.");
        }
      } else {
        bookmarkConnectionValid = true;
      }
    }
  }

  // CHECKING THAT WHEN AN UNBOOKMARK NODE GOES TO A PAGE NODE, THAT PAGE IS LINKED TO FROM THE SAME PAGE THAT LINKS TO THE UNBOOKMARK NODE

  let checkedUnBookmarkNodes: string[] = [];
  for (let i = 0; i < linkPairs.length; i++) {
    let unBookmarkConnectionValid = false;
    if ((linkPairs[i].sourceNode.typeNode === "unBookmark") && (!checkedUnBookmarkNodes.includes(linkPairs[i].sourceNode.label))) {
      let unBookmarkLabel = linkPairs[i].sourceNode.label;
      checkedUnBookmarkNodes.push(unBookmarkLabel);
      let destinationPageLabel = '';
      for (let j = 0; j < linkPairs.length; j++) {
        if ((linkPairs[j].targetNode.typeNode === "page") && (linkPairs[j].sourceNode.label === unBookmarkLabel)) {
          destinationPageLabel = linkPairs[j].sourceNode.label;
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
          if ((linkPairs[j].sourceNode.label === originPageLabel) && (linkPairs[j].targetNode.label === unBookmarkLabel)) {
            unBookmarkConnectionValid = true;
            break;
          }
        }
        if (unBookmarkConnectionValid == false) {
          errorMessageCount = errorMessageCount + 1;
          errorMessages.push(errorMessageCount.toString() + ". The unbookmark node '" + unBookmarkLabel +  "' is not connected to the next page node in the sequence of page nodes of the query.");
        }
      } else {
        unBookmarkConnectionValid = true;
      }
    }
  }

  // CHECK THAT, IF A PAGE LINKS TO A QUERY, THE QUERY IS LATER IN THE SEQUENCE OF QUERIES

  let checkedPages: string[] = [];
  for (let i = 0; i < linkPairs.length; i++) {
    if ((linkPairs[i].sourceNode.typeNode === "page") && (!checkedPages.includes(linkPairs[i].sourceNode.label))) {
      let pageLabel = linkPairs[i].sourceNode.label;
      let originQueryLabel = '';
      let destinationQueryLabel = '';
      let nodeFound = '';
      checkedPages.push(pageLabel);
      for (let j = 0; j < linkPairs.length; j++) {
        if ((linkPairs[j].sourceNode.label === pageLabel) && (linkPairs[j].targetNode.typeNode === "query")) {
          destinationQueryLabel = linkPairs[j].targetNode.label;
          break;
        }
      }

      if (destinationQueryLabel != '') {
        let queryNodeReached = false;
        let nodeFound = pageLabel;
        while (!queryNodeReached) {
          let nextNode = nodeFound;
          nodeFound = '';
          for (let j = 0; j < linkPairs.length; j++) {
            if ((linkPairs[j].sourceNode.typeNode === "page") && (linkPairs[j].targetNode.label === nextNode)) {
              nodeFound = linkPairs[j].sourceNode.label;
              break;
            }
          }
          if (nodeFound == '') {
            for (let j = 0; j < linkPairs.length; j++) {
              if ((linkPairs[j].sourceNode.typeNode === "query") && (linkPairs[j].targetNode.label === nextNode)) {
                nodeFound = linkPairs[j].sourceNode.label;
                queryNodeReached = true;
                break;
              }
            }
          }
        }

        originQueryLabel = nodeFound;
        let firstQueryNode = '';
        nextNode = '';
        let stepsToOriginQuery = 0;
        let stepsToDestinationQuery = 1;

        for (let j = 0; j < linkPairs.length; j++) {
          if ((linkPairs[j].sourceNode.typeNode === "start") && (linkPairs[j].targetNode.typeNode === "query")) {
            firstQueryNode = linkPairs[j].targetNode.label;
            stepsToOriginQuery = stepsToOriginQuery + 1;
            break;
          }
        }

        let originQueryFound = false;
        nextNode = firstQueryNode;

        if (nextNode !== originQueryLabel) {
          while (!originQueryFound) {
            for (let j = 0; j < linkPairs.length; j++) {
              if ((linkPairs[j].sourceNode.label === nextNode) && (linkPairs[j].targetNode.typeNode === "query")) {
                nextNode = linkPairs[j].targetNode.label;
                stepsToOriginQuery = stepsToOriginQuery + 1;
                break;
              }
            }
            if (nextNode === originQueryLabel) {
              originQueryFound = true;
            }
          }
        }

        let destinationQueryFound = false;
        nextNode = firstQueryNode;

        if (nextNode !== destinationQueryLabel) {
          while (!destinationQueryFound) {
            for (let j = 0; j < linkPairs.length; j++) {
              if ((linkPairs[j].sourceNode.label === nextNode) && (linkPairs[j].targetNode.typeNode === "query")) {
                nextNode = linkPairs[j].targetNode.label;
                stepsToDestinationQuery = stepsToDestinationQuery + 1;
                break;
              }
            }
            if (nextNode === destinationQueryLabel) {
              destinationQueryFound = true;
            }
          }
        }

        if (stepsToOriginQuery >= stepsToDestinationQuery) {
          errorMessageCount = errorMessageCount + 1;        
          errorMessages.push(errorMessageCount.toString() + ". The page node '" + pageLabel +  "' links to a query node that comes before in the sequence of queries.");
        }
      }
    }
  }

  // CHECK THAT, IF A BOOKMARK LINKS TO A QUERY, THE QUERY IS LATER IN THE SEQUENCE OF QUERIES

  let checkedBookmarks: string[] = [];
  for (let i = 0; i < linkPairs.length; i++) {
    if ((linkPairs[i].sourceNode.typeNode === "bookmark") && (!checkedBookmarks.includes(linkPairs[i].sourceNode.label))) {
      let bookmarkLabel = linkPairs[i].sourceNode.label;
      let originQueryLabel = '';
      let destinationQueryLabel = '';
      let nodeFound = '';
      checkedBookmarks.push(bookmarkLabel);
      for (let j = 0; j < linkPairs.length; j++) {
        if ((linkPairs[j].sourceNode.label === bookmarkLabel) && (linkPairs[j].targetNode.typeNode === "query")) {
          destinationQueryLabel = linkPairs[j].targetNode.label;
          break;
        }
      }

      if (destinationQueryLabel != '') {
        let queryNodeReached = false;
        let nodeFound = bookmarkLabel;
        while (!queryNodeReached) {
          let nextNode = nodeFound;
          nodeFound = '';
          for (let j = 0; j < linkPairs.length; j++) {
            if ((linkPairs[j].sourceNode.typeNode === "page") && (linkPairs[j].targetNode.label === nextNode)) {
              nodeFound = linkPairs[j].sourceNode.label;
              break;
            }
          }
          if (nodeFound == '') {
            for (let j = 0; j < linkPairs.length; j++) {
              if ((linkPairs[j].sourceNode.typeNode === "query") && (linkPairs[j].targetNode.label === nextNode)) {
                nodeFound = linkPairs[j].sourceNode.label;
                queryNodeReached = true;
                break;
              }
            }
          }
        }

        originQueryLabel = nodeFound;
        let firstQueryNode = '';
        nextNode = '';
        let stepsToOriginQuery = 0;
        let stepsToDestinationQuery = 1;

        for (let j = 0; j < linkPairs.length; j++) {
          if ((linkPairs[j].sourceNode.typeNode === "start") && (linkPairs[j].targetNode.typeNode === "query")) {
            firstQueryNode = linkPairs[j].targetNode.label;
            stepsToOriginQuery = stepsToOriginQuery + 1;
            break;
          }
        }

        let originQueryFound = false;
        nextNode = firstQueryNode;

        if (nextNode !== originQueryLabel) {
          while (!originQueryFound) {
            for (let j = 0; j < linkPairs.length; j++) {
              if ((linkPairs[j].sourceNode.label === nextNode) && (linkPairs[j].targetNode.typeNode === "query")) {
                nextNode = linkPairs[j].targetNode.label;
                stepsToOriginQuery = stepsToOriginQuery + 1;
                break;
              }
            }
            if (nextNode === originQueryLabel) {
              originQueryFound = true;
            }
          }
        }

        let destinationQueryFound = false;
        nextNode = firstQueryNode;

        if (nextNode !== destinationQueryLabel) {
          while (!destinationQueryFound) {
            for (let j = 0; j < linkPairs.length; j++) {
              if ((linkPairs[j].sourceNode.label === nextNode) && (linkPairs[j].targetNode.typeNode === "query")) {
                nextNode = linkPairs[j].targetNode.label;
                stepsToDestinationQuery = stepsToDestinationQuery + 1;
                break;
              }
            }
            if (nextNode === destinationQueryLabel) {
              destinationQueryFound = true;
            }
          }
        }

        if (stepsToOriginQuery >= stepsToDestinationQuery) {
          errorMessageCount = errorMessageCount + 1;        
          errorMessages.push(errorMessageCount.toString() + ". The bookmark node '" + bookmarkLabel +  "' links to a query node that comes before in the sequence of queries.");
        }
      }
    }
  }

  // CHECK THAT, IF AN UNBOOKMARK LINKS TO A QUERY, THE QUERY IS LATER IN THE SEQUENCE OF QUERIES

  let checkedUnBookmarks: string[] = [];
  for (let i = 0; i < linkPairs.length; i++) {
    if ((linkPairs[i].sourceNode.typeNode === "unBookmark") && (!checkedUnBookmarks.includes(linkPairs[i].sourceNode.label))) {
      let unBookmarkLabel = linkPairs[i].sourceNode.label;
      let originQueryLabel = '';
      let destinationQueryLabel = '';
      let nodeFound = '';
      checkedUnBookmarks.push(unBookmarkLabel);
      for (let j = 0; j < linkPairs.length; j++) {
        if ((linkPairs[j].sourceNode.label === unBookmarkLabel) && (linkPairs[j].targetNode.typeNode === "query")) {
          destinationQueryLabel = linkPairs[j].targetNode.label;
          break;
        }
      }

      if (destinationQueryLabel != '') {
        let queryNodeReached = false;
        let nodeFound = unBookmarkLabel;
        while (!queryNodeReached) {
          let nextNode = nodeFound;
          nodeFound = '';
          for (let j = 0; j < linkPairs.length; j++) {
            if ((linkPairs[j].sourceNode.typeNode === "page") && (linkPairs[j].targetNode.label === nextNode)) {
              nodeFound = linkPairs[j].sourceNode.label;
              break;
            }
          }
          if (nodeFound == '') {
            for (let j = 0; j < linkPairs.length; j++) {
              if ((linkPairs[j].sourceNode.typeNode === "query") && (linkPairs[j].targetNode.label === nextNode)) {
                nodeFound = linkPairs[j].sourceNode.label;
                queryNodeReached = true;
                break;
              }
            }
          }
        }

        originQueryLabel = nodeFound;
        let firstQueryNode = '';
        nextNode = '';
        let stepsToOriginQuery = 0;
        let stepsToDestinationQuery = 1;

        for (let j = 0; j < linkPairs.length; j++) {
          if ((linkPairs[j].sourceNode.typeNode === "start") && (linkPairs[j].targetNode.typeNode === "query")) {
            firstQueryNode = linkPairs[j].targetNode.label;
            stepsToOriginQuery = stepsToOriginQuery + 1;
            break;
          }
        }

        let originQueryFound = false;
        nextNode = firstQueryNode;

        if (nextNode !== originQueryLabel) {
          while (!originQueryFound) {
            for (let j = 0; j < linkPairs.length; j++) {
              if ((linkPairs[j].sourceNode.label === nextNode) && (linkPairs[j].targetNode.typeNode === "query")) {
                nextNode = linkPairs[j].targetNode.label;
                stepsToOriginQuery = stepsToOriginQuery + 1;
                break;
              }
            }
            if (nextNode === originQueryLabel) {
              originQueryFound = true;
            }
          }
        }

        let destinationQueryFound = false;
        nextNode = firstQueryNode;

        if (nextNode !== destinationQueryLabel) {
          while (!destinationQueryFound) {
            for (let j = 0; j < linkPairs.length; j++) {
              if ((linkPairs[j].sourceNode.label === nextNode) && (linkPairs[j].targetNode.typeNode === "query")) {
                nextNode = linkPairs[j].targetNode.label;
                stepsToDestinationQuery = stepsToDestinationQuery + 1;
                break;
              }
            }
            if (nextNode === destinationQueryLabel) {
              destinationQueryFound = true;
            }
          }
        }

        if (stepsToOriginQuery >= stepsToDestinationQuery) {
          errorMessageCount = errorMessageCount + 1;        
          errorMessages.push(errorMessageCount.toString() + ". The unbookmark node '" + unBookmarkLabel +  "' links to a query node that comes before in the sequence of queries.");
        }
      }
    }
  }
  
  // CHECKING THAT EVERY PAGE GOES TO THE SAME QUERY AS THE PAGE BEFORE IT AND THE PAGE AFTER IT

  // checkedPages.length = 0;
  // for (let i = 0; i < linkPairs.length; i++) {
  //   if ((linkPairs[i].sourceNode.typeNode === "page") && (!checkedPages.includes(linkPairs[i].sourceNode.label))) {
  //     checkedPages.push(linkPairs[i].sourceNode.label);

  //     let currentPageLabel = linkPairs[i].sourceNode.label;
  //     let previousPageLabel = '';
      
  //     for (let j = 0; j < linkPairs.length; j++) {
  //       if ((linkPairs[j].targetNode.label === currentPageLabel) && (linkPairs[j].sourceNode.typeNode === "page")) {
  //         previousPageLabel = linkPairs[j].sourceNode.label;
  //         break;
  //       }
  //     }

  //     let currentPageQuery = '';
  //     let previousPageQuery = '';

  //     for (let j = 0; j < linkPairs.length; j++) {
  //       if ((linkPairs[j].sourceNode.label === currentPageLabel) && (linkPairs[j].targetNode.typeNode === "query")) {
  //         currentPageQuery = linkPairs[j].targetNode.label;
  //         break;
  //       }
  //     }

  //     if (previousPageLabel != '') {
  //       for (let j = 0; j < linkPairs.length; j++) {
  //         if ((linkPairs[j].sourceNode.label === previousPageLabel) && (linkPairs[j].targetNode.typeNode === "query")) {
  //           previousPageQuery = linkPairs[j].targetNode.label;
  //           break;
  //         }
  //       }
  //     }

  //     if ((currentPageQuery !== "") && (previousPageQuery !== "")) {
  //       if (currentPageQuery !== previousPageQuery) {
  //         errorMessageCount = errorMessageCount + 1;
  //         errorMessages.push(errorMessageCount.toString() + ". The page node '" + currentPageLabel +  "' does not lead to the same query node as the page node that precedes it.");
  //       }
  //     }
  //   }
  // }

  ////

  return errorMessages;

}