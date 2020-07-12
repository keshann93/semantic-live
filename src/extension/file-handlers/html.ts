import * as parse5 from 'parse5';
import { EditableBlock, FileHandler, StyleExpressions, SupportedFiletypes } from './types';
import console = require('console');

/**
 * Parse a document for style tags
 *
 * The only two locations that tags are parsed:
 * - At the root of the document, such as Vue SFC
 * - A style tag within the <head> of a document
 * Any other location will be ignored to ensure that the entire tree does not need to be walked
 * @param document
 */
export function getTags(document: parse5.DocumentFragment, tag: string): StyleExpressions[] {
  let results: StyleExpressions[] = [];

  try {
    let styleNodes: parse5.DefaultTreeTextNode[] = (document as any).childNodes
      .filter((node: parse5.DefaultTreeNode) => node.nodeName === tag)
      .map((styleNode: any) => styleNode.childNodes[0]);
    // Get any <style> tags that are within a <head> tag
    if ((document as any).childNodes[0].nodeName === 'html' && (document as any).childNodes[0].childNodes[0].nodeName === 'head') {
      styleNodes = styleNodes.concat(
        (document as any).childNodes[0].childNodes[0].childNodes
          .filter((node: parse5.DefaultTreeNode) => node.nodeName === tag)
          .map((styleNode: any) => styleNode.childNodes[0])
      );
    }

    // Convert format to StyleExpression
    results = styleNodes.map(node => {
      const loc = node.sourceCodeLocation as parse5.Location;
      return {
        name: node.nodeName,
        blockString: node.value,
        location: {
          input: null as any,
          start: {
            column: loc.startCol,
            line: loc.startLine - 1,
          },
          end: {
            column: loc.endCol,
            line: loc.endLine - 1,
          },
        },
      } as StyleExpressions;
    });
  } catch (ex) {
    // TODO: handle errors in some way (maybe just log to output so the user knows we had an error)
    console.log('Error parsing file', ex);
  }

  return results;
}

export function getRootLevelBlocks(document: parse5.DocumentFragment) {
  let results: StyleExpressions[] = [];
  try {
    // Get any root level style tags
    let styleNodes: parse5.DefaultTreeTextNode[] = (document as any).childNodes.map((styleNode: any) => styleNode.childNodes[0]);

    // Convert format to StyleExpression
    results = styleNodes.map(node => {
      const loc = node.sourceCodeLocation as parse5.Location;
      return {
        name: node.nodeName,
        blockString: node.value,
        location: {
          input: null as any,
          start: {
            column: loc.startCol,
            line: loc.startLine - 1,
          },
          end: {
            column: loc.endCol,
            line: loc.endLine - 1,
          },
        },
      } as StyleExpressions;
    });
  } catch (ex) {
    // TODO: handle errors in some way (maybe just log to output so the user knows we had an error)
    console.log('Error parsing file', ex);
  }
  return results;
}

export function getEditableBlocks(content: string) {
  // Parse HTML document as a fragment to ensure extra tags are not added by parse5
  const document: parse5.DocumentFragment = parse5.parseFragment(content, {
    sourceCodeLocationInfo: true,
  }) as parse5.DefaultTreeDocument;
  // Search document for style tags
  const rootBlocks = getRootLevelBlocks(document);
  const javascriptBlocks = getTags(document, 'script');
  const styledBlocks = getTags(document, 'style');

  const totalBlocks = rootBlocks.concat(javascriptBlocks).concat(styledBlocks);

  const results: EditableBlock[] = [];

  // parse the CSS from each style tag and add to EditableBlock[]
  totalBlocks.forEach(({ name, blockString, location }) => {
    results.push({
      selector: name,
      blockString,
      source: content,
      location,
    });
  });
  return results;
}

const HtmlInspector: FileHandler = {
  getEditableBlocks(fileContent: string, languageId?: SupportedFiletypes) {
    return getEditableBlocks(fileContent);
  },
  updateProperty(fileContent: string) {
    return fileContent;
  },
};
export default HtmlInspector;
