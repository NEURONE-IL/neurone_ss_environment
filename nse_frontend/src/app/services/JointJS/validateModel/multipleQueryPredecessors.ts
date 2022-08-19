// Checks that any nodes that are not of the start, query or end types do not lead back to more than one query node
export function checkMultipleQueryPredecessors(originalGraph: joint.dia.Graph, errorMessageCount: number): string[] {

  let errorMessages: string[] = [];
  let allElementsObj = originalGraph.getElements();

  for (let i = 0; i < allElementsObj.length; i++) {

    let currentElementObj = allElementsObj[i];
    let queue: string[] = [];
    let explored: string[] = [];
    let queryNodesFound: string[] = [];
    let typeNode = allElementsObj[i].attributes['typeNode'];

    if ((typeNode !== "query") && (typeNode != "start") && (typeNode != "end")) {

      explored.push(currentElementObj.id.toString());
      queue.push(currentElementObj.id.toString());

      while (queue.length != 0) {
        let currentElementId = queue.pop();
        currentElementObj = getElementFromId(currentElementId!, allElementsObj);
        let nextToExploreObj: any = [];
        if (currentElementObj.attributes['typeNode'] === "query") {
          queryNodesFound.push(currentElementId!);
        } else {
          nextToExploreObj = originalGraph.getNeighbors(currentElementObj, { inbound: true });
        }
        for (let j = 0; j < nextToExploreObj.length; j++) {
          let nextToExploreId = nextToExploreObj[j].id.toString();
          if (explored.includes(nextToExploreId) == false) {
            explored.push(nextToExploreId);
            queue.push(nextToExploreId);
          }
        }
      }

      if (new Set(queryNodesFound).size > 1) {
        errorMessageCount = errorMessageCount + 1;
        errorMessages.push(errorMessageCount.toString() + ". More than one query node leads to the same page, bookmark or unbookmark node.")
        break;
      }

    }
    
  }

  return errorMessages;

}

// Auxiliary method to retrieve an Element object of a behavior model by its id
function getElementFromId(id: string, allElementsObj: any): any {
  for (let i = 0; i < allElementsObj.length; i++) {
    if (allElementsObj[i].id === id) {
      return allElementsObj[i];
    }
  }
  return null;
}