import { expandContents } from "./_builder";
import { anyFromContext, cloneText, popBuilderContext, pushBuilderContext } from "./_builderContext";
import { getTemplate } from "./_templates";

/**
 * Replace a <use> tag with the contents of a <template>.
 * Along the way, push any attributes of the <use> tag onto the context.
 * Also push the context paths (as strings) as separate attributes.
 * Afterwards, pop them all back off.
 * Optionally, a <use> tag without a template="" attribute is a way to modify the context for the use's children.
 * @param node a <use> tag, whose attributes are cloned as arguments
 * @param tempId The ID of a template to invoke. If not set, the ID should be in node.template
 * @returns An array of nodes to insert into the document in place of the <use> tag
 */
export function useTemplate(node:HTMLElement, tempId?:string|null):Node[] {
  let dest:Node[] = [];
  
  const inner_context = pushBuilderContext();
  for (var i = 0; i < node.attributes.length; i++) {
    const attr = node.attributes[i].name;
    const val = node.attributes[i].value;
    const attri = attr.toLowerCase();
    if (attri != 'template' && attri != 'class') {
      if (val[0] == '{') {
        inner_context[attr] = anyFromContext(val);
      }
      else {
        inner_context[attr] = cloneText(val);
      }
      inner_context[attr + '$'] = val;  // Store the context path, so it can also be referenced
    }
  }

  if (!tempId) {
    tempId = node.getAttribute('template');
  }
  if (tempId) {
    const template = getTemplate(tempId);
    if (!template) {
      throw new Error('Template not found: ' + tempId);
    }
    if (!template.content) {
      throw new Error('Invalid template: ' + tempId);
    }
    // The template doesn't have any child nodes. Its content must first be cloned.
    const clone = template.content.cloneNode(true) as HTMLElement;
    dest = expandContents(clone);
  }
  else {
    dest = expandContents(node);
  }
  popBuilderContext();

  return dest;
}