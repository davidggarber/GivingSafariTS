import { expandContents, shouldThrow } from "./_builder";
import { cloneText, complexAttribute, popBuilderContext, pushBuilderContext } from "./_builderContext";
import { ContextError, elementSourceOffset, wrapContextError } from "./_contextError";
import { getTemplate } from "./_templates";

type TemplateArg = {
  attr: string,
  raw: string,
  text: string,
  any: any,
}

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

  if (!tempId) {
    tempId = node.getAttribute('template');
    if (!tempId) {
      throw new ContextError('<use> tag must specify a template attribute');
    }
  }
  let template:HTMLTemplateElement|null = null;
  try {
    template = getTemplate(tempId);
    if (!template.content) {
      throw new ContextError('Invalid template (no content): ' + tempId);
    }
  }
  catch (ex) {
    const ctxerr = wrapContextError(ex, 'useTemplate', elementSourceOffset(node, 'template'));
    if (shouldThrow(ctxerr, node)) { throw ctxerr; }
    template = null;
  }
  
  if (template) {
    // We need to build the values to push onto the context, without changing the current context.
    // Do all the evaluations first, and cache them.
    const passed_args:TemplateArg[] = [];
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i].name;
      const val = node.attributes[i].value;
      const attri = attr.toLowerCase();
      try {
        if (attri != 'template' && attri != 'class') {
          const arg:TemplateArg = {
            attr: attr,
            raw: val,  // Store the context path, so it can also be referenced
            text: cloneText(val),
            any: complexAttribute(val),
          }
          passed_args.push(arg);
        }
      }
      catch (ex) {
        const ctxerr = wrapContextError(ex, 'useTemplate', elementSourceOffset(node, attr));
        if (shouldThrow(ctxerr, node, template)) { throw ctxerr; }
      }
    }

    try {
      // Push a new context for inside the <use>.
      // Each passed arg generates 3 usable context entries:
      //  arg = 'text'          the attribute, evaluated as text
      //  arg! = *any*          the attribute, evaluated as any
      //  arg$ = unevaluated    the raw contents of the argument attribute, unevaluated.
      const inner_context = pushBuilderContext();
      for (let i = 0; i < passed_args.length; i++) {
        const arg = passed_args[i];
        inner_context[arg.attr] = arg.text;
        inner_context[arg.attr + '!'] = arg.any;
        inner_context[arg.attr + '$'] = arg.raw;
      }

      if (!tempId) {
        tempId = node.getAttribute('template');
      }
      if (tempId) {
        const template = getTemplate(tempId);
        if (!template) {
          throw new ContextError('Template not found: ' + tempId, elementSourceOffset(node, 'template'));
        }
        if (!template.content) {
          throw new ContextError('Invalid template (no content): ' + tempId, elementSourceOffset(node, 'template'));
        }
        // The template doesn't have any child nodes. Its content must first be cloned.
        const clone = template.content.cloneNode(true) as HTMLElement;
        dest = expandContents(clone);
      }
      else {
        dest = expandContents(node);
      }
    }
    catch (ex) {
      const ctxerr = wrapContextError(ex, 'useTemplate', elementSourceOffset(node));
      if (shouldThrow(ctxerr, node, template)) { throw ctxerr; }
    }
    popBuilderContext();
  }

  return dest;
}
