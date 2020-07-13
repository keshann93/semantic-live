import * as parse5 from 'parse5';

export function getNodes(childNodes: Array<any>, d: number = 1): any {
  return d > 0
    ? childNodes.reduce((acc, val) => acc.concat(Array.isArray(val.childNodes) ? getNodes(val.childNodes, d - 1) : val), [])
    : childNodes.slice();
  // return childNodes.map((styleNode: any) => styleNode.childNodes ? getNodes(styleNode.childNodes) : styleNode);
}
