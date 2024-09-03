import { isTrace } from "./_boilerplate";
import { expandContents, initElementStack, shouldThrow } from "./_builder";
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
    tempId = cloneText(tempId);
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
    const passed_args = parseUseNodeArgs(node, template);

    try {
      const inner_context = pushTemplateContext(passed_args);

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

/**
 * Parse a <use> node to get the template arguments
 * @param node The <use> node
 * @param template The targeted <template> node
 */
function parseUseNodeArgs(node:Element, template?:Element):TemplateArg[] {
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
      const ctxerr = wrapContextError(ex, 'parseUseNodeArgs', elementSourceOffset(node, attr));
      if (shouldThrow(ctxerr, node, template)) { throw ctxerr; }
    }
  }
  return passed_args;
}

/**
 * Parse an object's top-level keys as if they were the attributes of a <use> node
 * @param arg A dictionary of keys (attribute names) to values (attribute contents)
 * @returns A list of template arguments.
 */
function parseObjectAsUseArgs(args?:object):TemplateArg[] {
  if (!args) {
    return [];
  }
  const passed_args:TemplateArg[] = [];
  const keys = Object.keys(args);
  for (let i = 0; i < keys.length; i++) {
    const attr = keys[i];
    const val = args[attr];
    const attri = attr.toLowerCase();
    try {
      // Names that are invalid on a <use> node are invalid here too
      if (attri != 'template' && attri != 'class') {
        const arg:TemplateArg = {
          attr: attr,
          raw: '',  // Nothing is raw
          text: JSON.stringify(val),
          any: val,
        }
        passed_args.push(arg);
      }
    }
    catch (ex) {
      throw wrapContextError(ex, 'parseObjectAsUseArgs');
    }
  }
  return passed_args;
}

/**
 * Build a template-ready context from a set of template arguments
 * @param passed_args Arguments, as created from a <use> node
 * @returns The inner context. Caller MUST POP CONTEXT AFTERWARDS.
 */
function pushTemplateContext(passed_args:TemplateArg[]):object {
  // Push a new context for inside the <use>.
  // Each passed arg generates 3 usable context entries:
  //  arg = 'text'          the attribute, evaluated as text
  //  arg! = *any*          the attribute, evaluated as any
  //  arg$ = unevaluated    the raw contents of the argument attribute, unevaluated.
  const inner_context = pushBuilderContext();
  for (let i = 0; i < passed_args.length; i++) {
    const arg = passed_args[i];
    inner_context[arg.attr] = arg.any;
    inner_context[arg.attr + '!'] = arg.text;
    inner_context[arg.attr + '$'] = arg.raw;

    if (isTrace()) {
      console.log('Use template arg #' + i + ': ' + arg.attr + ' = ' + JSON.stringify(arg.any));
      console.log('Use template arg #' + i + ': ' + arg.attr + '! = ' + arg.text);
      console.log('Use template arg #' + i + ': ' + arg.attr + '$ = ' + arg.raw);
    }
  }  
  return inner_context;
}

/**
 * Replace the current contents of a parent element with 
 * the contents of a template.
 * @param parent Parent element to refill. Existing contents will be cleared.
 * @param tempId ID of a <template> element
 * @param arg an object whose keys and values will become the arguments to the template.
 */
export function refillFromTemplate(parent:Element, tempId:string, args?:object) {
  if (!tempId) {
    throw new ContextError('Template ID not specified');
  }
  const template = getTemplate(tempId);
  if (!template) {
    throw new ContextError('Template not found: ' + tempId);
  }
  if (!template.content) {
    throw new ContextError('Invalid template (no content): ' + tempId);
  }

  // Make sure we know the stack of our destination
  initElementStack(parent);

  let inner_context:any = null;
  try {
    const passed_args = parseObjectAsUseArgs(args);
    inner_context = pushTemplateContext(passed_args);

    // The template doesn't have any child nodes. Its content must first be cloned.
    const clone = template.content.cloneNode(true) as HTMLElement;
    const dest = expandContents(clone);

    refillFromNodes(parent, dest);
  }
  catch (ex) {
    const ctxerr = wrapContextError(ex, 'refillFromTemplate', elementSourceOffset(template));
    if (inner_context) {
      popBuilderContext();
    }
    if (shouldThrow(ctxerr, template)) { throw ctxerr; }
  }
}

/**
 * Wipe the current contents of a container element, and replace with a new list of nodes.
 * @param parent The container
 * @param dest The new list of contents
 */
function refillFromNodes(parent:Element, dest:Node[]) {
  while (parent.childNodes.length > 0) {
    parent.removeChild(parent.childNodes[0]);
  }
  for (let i = 0; i < dest.length; i++) {
    parent.appendChild(dest[i]);
  }
}