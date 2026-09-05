import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const docsRoot = process.cwd();
const uiRoot = path.resolve(docsRoot, '../../packages/ui/src');
const outputFile = path.resolve(docsRoot, 'src/component-api.generated.ts');

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(full);
    if (!/\.(ts|tsx)$/.test(entry.name) || /\.(test|spec)\.(ts|tsx)$/.test(entry.name)) return [];
    return [full];
  });
}

function cleanDoc(node) {
  const docs = ts.getJSDocCommentsAndTags(node);
  return docs
    .map((doc) => doc.getText())
    .join('\n')
    .replace(/^\/\*\*|\*\/$/g, '')
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
    .filter((line) => line && !line.startsWith('@'))
    .join(' ');
}

function inferPropUsage(name, type) {
  const explicit = {
    value: 'Controlled value. Keep this in application state and update it from the matching change callback.',
    defaultValue: 'Initial value for uncontrolled usage. Use this when the component should own later state changes.',
    label: 'Visible field/component label.',
    labelInfo: 'Optional contextual information rendered beside the label.',
    hint: 'Supporting text shown when there is no error.',
    error: 'Error content. When present it also drives the component error visual state.',
    placeholder: 'Text shown while no value or selection is present.',
    variant: 'Visual/semantic variant. Use variants to express hierarchy or status, not project-specific colors.',
    size: 'Component size preset. Keep the same size across controls in one form row.',
    loading: 'Shows a loading/busy state and prevents conflicting interaction where appropriate.',
    disabled: 'Disables user interaction and applies the disabled visual state.',
    readOnly: 'Keeps the current value visible but prevents editing.',
    required: 'Marks the underlying field as required where the native element supports it.',
    clearable: 'Shows a clear affordance when a value exists.',
    options: 'Available selection options.',
    searchable: 'Enables local search/filtering. Prefer DCombobox for dedicated autocomplete flows.',
    fetchOptions: 'Async option loader. Receives the current search query and returns options.',
    refetchKey: 'Change this value when external dependencies change to request fresh async options.',
    debounceMs: 'Delay in milliseconds before search/async work is triggered.',
    scrollBehavior: 'Controls anchored popup behavior while the page or a scroll ancestor moves: reposition, close, or lock.',
    open: 'Controlled open state for popups/dialog-like components.',
    placement: 'Preferred floating placement. Collision handling may flip it when space is insufficient.',
    matchWidth: 'Makes floating content match the trigger width.',
    className: 'Additional class names for the component root/primary element.',
    containerClassName: 'Additional class names for the outer field/container wrapper.',
    children: 'Nested React content rendered by the component.',
    renderOption: 'Custom renderer for an option while preserving component selection behavior.',
    renderEmpty: 'Custom empty-state renderer.',
    allowCreate: 'Allows creating a value that does not already exist in the option list.',
    onCreateOption: 'Called when the user confirms creation of a new option.',
    onSearchChange: 'Called when the search query changes.',
    onFetchError: 'Called when async option loading fails.',
    onClear: 'Called when the clear affordance is used.',
    onClose: 'Called when an open popup/dialog closes.',
    onOpenChange: 'Called whenever the controlled open state should change.',
    onValueChange: 'Called with the next semantic value. Use this for controlled state updates.',
    onChange: 'Primary change callback. Check the declared type for the exact value/event contract.',
    fullWidth: 'Makes the component fill the available horizontal width.',
  };
  if (explicit[name]) return explicit[name];
  if (name.startsWith('on') && type.includes('=>')) return `Callback invoked for ${name.slice(2)} behavior. Keep side effects in the consumer and use the declared arguments as the contract.`;
  if (name.startsWith('render')) return 'Render callback for customizing presentation while keeping behavior owned by the design-system component.';
  if (type.includes('boolean')) return 'Boolean feature/state toggle. See the live playground when available.';
  return 'Configure this prop according to its declared type. Native inherited props keep the semantics of the underlying HTML element.';
}

function inferFunctionUsage(name) {
  if (name.startsWith('use')) return 'React hook exported by the design system. Call it only inside React components/hooks and follow its returned contract.';
  if (name.startsWith('format')) return 'Formatting helper. Pass the canonical value and use the returned presentation value for display.';
  if (name.startsWith('parse')) return 'Parsing helper. Converts a presentation/input value back into the canonical value expected by application state.';
  if (name.startsWith('normalize')) return 'Normalization helper for sanitizing or canonicalizing user input.';
  if (name.startsWith('create')) return 'Factory/helper that creates a reusable configuration object for the design system.';
  if (name.startsWith('get')) return 'Pure helper that computes a derived value from its arguments.';
  return 'Exported helper from the same component module. Use the signature shown below as the public contract.';
}

const interfaces = {};
const functions = {};

for (const fileName of walk(uiRoot)) {
  const sourceText = fs.readFileSync(fileName, 'utf8');
  const sourceFile = ts.createSourceFile(
    fileName,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const source = path.relative(uiRoot, fileName).replaceAll('\\', '/');

  for (const node of sourceFile.statements) {
    const exported = node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
    if (!exported) continue;

    if (ts.isInterfaceDeclaration(node)) {
      const props = node.members.flatMap((member) => {
        if (!ts.isPropertySignature(member) || !member.name) return [];
        const name = member.name.getText(sourceFile).replace(/["']/g, '');
        const type = member.type?.getText(sourceFile) ?? 'unknown';
        return [{
          name,
          type,
          required: !member.questionToken,
          description: cleanDoc(member) || inferPropUsage(name, type),
        }];
      });
      interfaces[node.name.text] = {
        name: node.name.text,
        source,
        description: cleanDoc(node),
        extends: node.heritageClauses?.map((clause) => clause.getText(sourceFile)) ?? [],
        props,
      };
      continue;
    }

    if (ts.isFunctionDeclaration(node) && node.name) {
      functions[node.name.text] = {
        name: node.name.text,
        source,
        description: cleanDoc(node) || inferFunctionUsage(node.name.text),
        signature: `${node.name.text}(${node.parameters.map((param) => `${param.name.getText(sourceFile)}${param.questionToken ? '?' : ''}: ${param.type?.getText(sourceFile) ?? 'unknown'}`).join(', ')}): ${node.type?.getText(sourceFile) ?? 'inferred'}`,
      };
      continue;
    }

    if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) continue;
        const initializer = declaration.initializer;
        if (!initializer || (!ts.isArrowFunction(initializer) && !ts.isFunctionExpression(initializer))) continue;
        functions[declaration.name.text] = {
          name: declaration.name.text,
          source,
          description: cleanDoc(node) || inferFunctionUsage(declaration.name.text),
          signature: `${declaration.name.text}(${initializer.parameters.map((param) => `${param.name.getText(sourceFile)}${param.questionToken ? '?' : ''}: ${param.type?.getText(sourceFile) ?? 'unknown'}`).join(', ')}): ${initializer.type?.getText(sourceFile) ?? 'inferred'}`,
        };
      }
    }
  }
}

const output = `/* AUTO-GENERATED by scripts/generate-component-api.mjs. Do not edit manually. */\nexport const generatedComponentApi = ${JSON.stringify({ interfaces, functions }, null, 2)} as const;\n`;
fs.writeFileSync(outputFile, output);
console.log(`Generated ${Object.keys(interfaces).length} interfaces and ${Object.keys(functions).length} functions -> ${path.relative(docsRoot, outputFile)}`);
