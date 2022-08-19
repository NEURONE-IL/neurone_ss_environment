import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// Checks that all nodes are connected, and that the only root note (that has no predecessors) is the start node
export class ConnectedNodes {

  static connectedNodes: Element[] = [];

  // Checks the node connections and returns the errors that were detected
  static checkConnectedNodes(graph: joint.dia.Graph, errorMessageCount: number): string[] {
    let errorMessages: string[] = [];
    let graphSources = graph.getSources();
    let numberRoots = graphSources.length;
    if (numberRoots > 1) {
      let totalNumberNodes = graph.getElements().length;
      let elements = graph.getElements();
      for (let i = 0; i < graphSources.length; i++) {
        if (graphSources[i].attributes['typeNode'] !== "start") {
          for (let j = 0; j < elements.length; j++) {
            if (elements[j].id === graphSources[i].id) {
              let element = elements[i];
              ConnectedNodes.connectedNodes.length = 0;
              graph.dfs(element, ConnectedNodes.dfsIteratee);
              if (ConnectedNodes.connectedNodes.length < totalNumberNodes) {
                errorMessageCount = errorMessageCount + 1;
                let errorMessageString1 = $localize`:Model validation error message in the New Behavior Model and Behavior Model Edit components:Some nodes (or groups of nodes) in the behavior model are not connected to each other.`;
                errorMessages.push(errorMessageCount.toString() + ". " + errorMessageString1)
                return errorMessages;
              }
            }
          }
        }
      }
      for (let i = 0; i < graphSources.length; i++) {
        if (graphSources[i].attributes['typeNode'] !== "start") {
          let cell = graph.getCell(graphSources[i].id);
          errorMessageCount = errorMessageCount + 1;
          let errorMessageString2 = $localize`:Model validation error message in the New Behavior Model and Behavior Model Edit components:The node '${cell.attributes.attrs!['label']!.text}' must be connected to another node before it.`;
          errorMessages.push(errorMessageCount.toString() + ". " + errorMessageString2)
        }
      }
    }

    return errorMessages;
  }

  // Auxiliary method needed to run a DFS node search, which is used to check if all the nodes in the model are connected
  static dfsIteratee(element: any, distance: number) {
    ConnectedNodes.connectedNodes.push(element);
    return true;
  }

}