export type SupportedFiletypes = 'html' | '';

export type UpdateActiveBlockType = 'add' | 'remove';

/**
 * File handler is responsible for parsing and extracting EditableBlocks.
 * Also deals with updating CSS properties.
 *
 * We curretnly have two handlers as below
 * - JS File handler - Deals with .js/.jsx/.ts/.tsx files to support styled components editing
 * - CSS File handler - Deals with .css files to support CSS editing
 */
export interface FileHandler {
  getEditableBlocks(fileContent: string, languageId: SupportedFiletypes): EditableBlock[];
  updateProperty(fileContent: string): string;
}

/**
 * An abstract representation of an editable CSS block
 *
 * A block could be either a CSS rule from a .css file like below
 * .header {
 *    font-color: green;
 * }
 *
 * or a styled-component's template literal like below
 * const MyCustomComponent = styled.div`
 *    font-color: green;
 * `
 */
export interface EditableBlock {
  selector: string;
  blockString: string;
  source?: string;
  location: any;
}

export interface StyleExpressions {
  name: string;
  blockString: string;
  location: any;
}

export interface LocationPosition {
  column: 0;
  line: 0;
}
