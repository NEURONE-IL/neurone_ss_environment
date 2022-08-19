// Interface used to gather the key data regarding a behavior model node, to be used when validating the model
export interface Node {
  id: string,
  label: string,
  typeNode: string,
}

// Interface used to gather the key data regarding a behavior model node, to be used when converting it to a simplified JSON
// The minTransitionTime, maxTransitionTime and relevantPage properties only apply to certain types of nodes:
//    Query nodes use minTransitionTime and maxTransitionTime
//    Page (and SERP) nodes use minTransitionTime, maxTransitionTime and relevantPage
// IMPORTANT NOTE: The use of the minTransitionTime, maxTransitionTime and relevantPage properties is disabled at the moment, because it might interfere with the behavior of the student simulator in its present state
export interface NodeConvertToJSON {
  id: string,
  label: string,
  typeNode: string,
  minTransitionTime: number,    // Minimum transition time: If its value is -1, that means the user didn't actually input any value for the minimum transition time
  maxTransitionTime: number,    // Maximum transition time: If its value is -1, that means the user didn't actually input any value for the maximum transition time
  relevantPage: boolean         // Relevant page: Value defaults to false
}

// Interface used to gather the key data regarding a behavior model link, to be used when convert it to a simplified JSON
export interface Link {
  id: string,
  sourceId: string,
  targetId: string,
  probability: string
}