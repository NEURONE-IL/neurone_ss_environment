import { JSONNode } from './JSONNodeInterface';

// Determines the names the page nodes will have to take, and adds them to the dictionary
export function determinePageRenaming(renameDictionary: JSONNode, linkPairs: any, checkedQueryNodes: string[]): any {

  let checkedPageNodes: string[] = [];
  let pageCount: number;
  let lastPageNodeReached: boolean;
  let nextPageNodeReached: boolean;
  let nextNode = '';

  for (let i = 0; i < checkedQueryNodes.length; i++) {
    checkedPageNodes.length = 0;
    pageCount = 1;
    nextNode = '';
    for (let j = 0; j < linkPairs.length; j++) {
      if ((linkPairs[j].sourceNode.label === checkedQueryNodes[i]) && (linkPairs[j].targetNode.typeNode === "page")) {
        nextNode = linkPairs[j].targetNode.label;
        renameDictionary[nextNode] = 'P' + pageCount;
        pageCount = pageCount + 1;
      }
    }
    lastPageNodeReached = false;
    nextPageNodeReached = false;
    while (!lastPageNodeReached) {
      checkedPageNodes.push(nextNode);
      nextPageNodeReached = false;
      for (let j = 0; j < linkPairs.length; j++) {
        if ((linkPairs[j].sourceNode.label === nextNode) && (linkPairs[j].targetNode.typeNode === "page")) {
          nextNode = linkPairs[j].targetNode.label;
          renameDictionary[nextNode] = 'P' + pageCount;
          pageCount = pageCount + 1;
          nextPageNodeReached = true;
          break;
        }
      }

      // In case two pages are not connected directly, but through a bookmark or unbookmark node
      if (nextPageNodeReached == false) {
        for (let j = 0; j < linkPairs.length; j++) {
          if ((linkPairs[j].sourceNode.label === nextNode) && ((linkPairs[j].targetNode.typeNode === "bookmark") || (linkPairs[j].targetNode.typeNode === "unbookmark"))) {
            let bookmarkUnbookmarkNode = linkPairs[j].targetNode.label;
            for (let k = 0; k < linkPairs.length; k++) {
              if ((linkPairs[k].sourceNode.label === bookmarkUnbookmarkNode) && (linkPairs[k].targetNode.typeNode === "page")) {
                nextNode = linkPairs[k].targetNode.label;
                renameDictionary[nextNode] = 'P' + pageCount;
                pageCount = pageCount + 1;
                nextPageNodeReached = true;
                break;
              }
            }
            break;
          }
        }
      }

      if (nextPageNodeReached == false) {
        lastPageNodeReached = true;
      }
    }
  }

  return renameDictionary;

}