import { useEffect, useState, type ReactNode } from 'react';
import {
  DAccordion,
  DAccordionItem,
  DButton,
  DCombobox,
  DInput,
  DRangeDatePicker,
  DSelect,
  type ButtonSize,
  type ButtonVariant,
  type DateRangeValue,
  type FloatingScrollBehavior,
  type InputFormat,
  type InputSize,
  type InputType,
} from '@digvation/ui';
import { generatedComponentApi } from './component-api.generated';

type ApiProp = { name: string; type: string; required: boolean; description: string };
type ApiInterface = { name: string; source: string; description: string; extends: readonly string[]; props: readonly ApiProp[] };
type ApiFunction = { name: string; source: string; description: string; signature: string };
type DocsTab = 'preview' | 'code' | 'props' | 'functions';
type AccordionDemoVariant = 'default' | 'separator' | 'card' | 'separated';

type InteractivePreviewProps = {
  onCodeChange: (code: string) => void;
  onEvent: (event: string) => void;
};

const api = generatedComponentApi as unknown as {
  interfaces: Record<string, ApiInterface>;
  functions: Record<string, ApiFunction>;
};

function Control({ label, children }: { label: string; children: ReactNode }) {
  return <label className="playground-control"><span>{label}</span>{children}</label>;
}

function useLiveCode(code: string, onCodeChange: (code: string) => void) {
  useEffect(() => onCodeChange(code), [code, onCodeChange]);
}

function PreviewLayout({ controls, children }: { controls?: ReactNode; children: ReactNode }) {
  return (
    <div className="playground-preview">
      {controls ? <div className="playground-controls">{controls}</div> : null}
      <div className="playground-live">{children}</div>
    </div>
  );
}

function ButtonPreview({ onCodeChange, onEvent }: InteractivePreviewProps) {
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [size, setSize] = useState<ButtonSize>('md');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const code = `<DButton\n  variant="${variant}"\n  size="${size}"${loading ? '\n  loading' : ''}${disabled ? '\n  disabled' : ''}${fullWidth ? '\n  fullWidth' : ''}\n  onClick={handleClick}\n>\n  Save\n</DButton>`;
  useLiveCode(code, onCodeChange);

  return (
    <PreviewLayout controls={<>
      <Control label="variant"><select value={variant} onChange={(event) => setVariant(event.target.value as ButtonVariant)}>{['primary','secondary','outline','ghost','soft','info','success','warning','danger','link'].map((item) => <option key={item}>{item}</option>)}</select></Control>
      <Control label="size"><select value={size} onChange={(event) => setSize(event.target.value as ButtonSize)}>{['sm','md','lg','icon'].map((item) => <option key={item}>{item}</option>)}</select></Control>
      <Control label="loading"><input type="checkbox" checked={loading} onChange={(event) => setLoading(event.target.checked)} /></Control>
      <Control label="disabled"><input type="checkbox" checked={disabled} onChange={(event) => setDisabled(event.target.checked)} /></Control>
      <Control label="full width"><input type="checkbox" checked={fullWidth} onChange={(event) => setFullWidth(event.target.checked)} /></Control>
    </>}>
      <DButton variant={variant} size={size} loading={loading} disabled={disabled} fullWidth={fullWidth} onClick={() => onEvent('onClick()')}>{size === 'icon' ? 'D' : 'Save'}</DButton>
    </PreviewLayout>
  );
}

function InputPreview({ onCodeChange, onEvent }: InteractivePreviewProps) {
  const [type, setType] = useState<InputType>('text');
  const [format, setFormat] = useState<InputFormat>('plain');
  const [size, setSize] = useState<InputSize>('md');
  const [value, setValue] = useState('Digvation');
  const [clearable, setClearable] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const effectiveType: InputType = format === 'plain' ? type : 'text';
  const code = `const [value, setValue] = useState('${value}');\n\n<DInput\n  type="${effectiveType}"\n  format="${format}"\n  size="${size}"\n  value={value}\n  onChange={(next) => setValue(next)}\n  clearable={${clearable}}${disabled ? '\n  disabled' : ''}${readOnly ? '\n  readOnly' : ''}\n/>`;
  useLiveCode(code, onCodeChange);

  return (
    <PreviewLayout controls={<>
      <Control label="type"><select value={type} disabled={format !== 'plain'} onChange={(event) => setType(event.target.value as InputType)}>{['text','email','password','number','tel','url','search'].map((item) => <option key={item}>{item}</option>)}</select></Control>
      <Control label="format"><select value={format} onChange={(event) => setFormat(event.target.value as InputFormat)}>{['plain','currency','percentage'].map((item) => <option key={item}>{item}</option>)}</select></Control>
      <Control label="size"><select value={size} onChange={(event) => setSize(event.target.value as InputSize)}>{['sm','md','lg'].map((item) => <option key={item}>{item}</option>)}</select></Control>
      <Control label="clearable"><input type="checkbox" checked={clearable} onChange={(event) => setClearable(event.target.checked)} /></Control>
      <Control label="disabled"><input type="checkbox" checked={disabled} onChange={(event) => setDisabled(event.target.checked)} /></Control>
      <Control label="read only"><input type="checkbox" checked={readOnly} onChange={(event) => setReadOnly(event.target.checked)} /></Control>
    </>}>
      <DInput
        label="Live input"
        type={effectiveType}
        format={format}
        size={size}
        value={value}
        clearable={clearable}
        disabled={disabled}
        readOnly={readOnly}
        onClear={() => onEvent('onClear()')}
        onChange={(next) => {
          setValue(next);
          onEvent(`onChange(${JSON.stringify(next)})`);
        }}
      />
    </PreviewLayout>
  );
}

const demoOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' },
  { label: 'Archived', value: 'archived' },
];

function SelectPreview({ onCodeChange, onEvent }: InteractivePreviewProps) {
  const [value, setValue] = useState<string | number | null>('active');
  const [searchable, setSearchable] = useState(false);
  const [clearable, setClearable] = useState(true);
  const [size, setSize] = useState<InputSize>('md');
  const [scrollBehavior, setScrollBehavior] = useState<FloatingScrollBehavior>('reposition');
  const code = `<DSelect\n  value={value}\n  options={options}\n  searchable={${searchable}}\n  clearable={${clearable}}\n  size="${size}"\n  scrollBehavior="${scrollBehavior}"\n  onChange={setValue}\n/>`;
  useLiveCode(code, onCodeChange);

  return (
    <PreviewLayout controls={<>
      <Control label="searchable"><input type="checkbox" checked={searchable} onChange={(event) => setSearchable(event.target.checked)} /></Control>
      <Control label="clearable"><input type="checkbox" checked={clearable} onChange={(event) => setClearable(event.target.checked)} /></Control>
      <Control label="size"><select value={size} onChange={(event) => setSize(event.target.value as InputSize)}>{['sm','md','lg'].map((item) => <option key={item}>{item}</option>)}</select></Control>
      <Control label="scroll"><select value={scrollBehavior} onChange={(event) => setScrollBehavior(event.target.value as FloatingScrollBehavior)}>{['reposition','close','lock'].map((item) => <option key={item}>{item}</option>)}</select></Control>
    </>}>
      <DSelect label="Status" value={value} options={demoOptions} searchable={searchable} clearable={clearable} size={size} scrollBehavior={scrollBehavior} onChange={(next) => { setValue(next); onEvent(`onChange(${JSON.stringify(next)})`); }} />
    </PreviewLayout>
  );
}

function ComboboxPreview({ onCodeChange, onEvent }: InteractivePreviewProps) {
  const [value, setValue] = useState<string | number | null>('react');
  const [allowCreate, setAllowCreate] = useState(true);
  const [clearable, setClearable] = useState(true);
  const [debounceMs, setDebounceMs] = useState(300);
  const code = `<DCombobox\n  value={value}\n  options={options}\n  allowCreate={${allowCreate}}\n  clearable={${clearable}}\n  debounceMs={${debounceMs}}\n  onChange={setValue}\n  onSearchChange={handleSearch}\n/>`;
  useLiveCode(code, onCodeChange);

  return (
    <PreviewLayout controls={<>
      <Control label="allow create"><input type="checkbox" checked={allowCreate} onChange={(event) => setAllowCreate(event.target.checked)} /></Control>
      <Control label="clearable"><input type="checkbox" checked={clearable} onChange={(event) => setClearable(event.target.checked)} /></Control>
      <Control label="debounce ms"><input type="number" min={0} step={50} value={debounceMs} onChange={(event) => setDebounceMs(Number(event.target.value) || 0)} /></Control>
    </>}>
      <DCombobox
        label="Technology"
        value={value}
        options={[{label:'React',value:'react'},{label:'Next.js',value:'next'},{label:'TypeScript',value:'ts'}]}
        allowCreate={allowCreate}
        clearable={clearable}
        debounceMs={debounceMs}
        onSearchChange={(query) => onEvent(`onSearchChange(${JSON.stringify(query)})`)}
        onCreateOption={(next) => onEvent(`onCreateOption(${JSON.stringify(next)})`)}
        onChange={(next) => { setValue(next); onEvent(`onChange(${JSON.stringify(next)})`); }}
      />
    </PreviewLayout>
  );
}

function RangePreview({ onCodeChange, onEvent }: InteractivePreviewProps) {
  const [value, setValue] = useState<DateRangeValue>({ start: '2026-09-01', end: '2026-09-30' });
  const [clearable, setClearable] = useState(true);
  const [size, setSize] = useState<InputSize>('md');
  const [scrollBehavior, setScrollBehavior] = useState<FloatingScrollBehavior>('close');
  const code = `<DRangeDatePicker\n  value={range}\n  size="${size}"\n  clearable={${clearable}}\n  scrollBehavior="${scrollBehavior}"\n  onChange={setRange}\n/>`;
  useLiveCode(code, onCodeChange);

  return (
    <PreviewLayout controls={<>
      <Control label="clearable"><input type="checkbox" checked={clearable} onChange={(event) => setClearable(event.target.checked)} /></Control>
      <Control label="size"><select value={size} onChange={(event) => setSize(event.target.value as InputSize)}>{['sm','md','lg'].map((item) => <option key={item}>{item}</option>)}</select></Control>
      <Control label="scroll"><select value={scrollBehavior} onChange={(event) => setScrollBehavior(event.target.value as FloatingScrollBehavior)}>{['reposition','close','lock'].map((item) => <option key={item}>{item}</option>)}</select></Control>
    </>}>
      <DRangeDatePicker label="Report period" value={value} size={size} clearable={clearable} scrollBehavior={scrollBehavior} onChange={(next) => { setValue(next); onEvent(`onChange(${JSON.stringify(next)})`); }} />
    </PreviewLayout>
  );
}

function AccordionPreview({ onCodeChange, onEvent }: InteractivePreviewProps) {
  const [variant, setVariant] = useState<AccordionDemoVariant>('default');
  const [type, setType] = useState<'single' | 'multiple'>('single');
  const [openItems, setOpenItems] = useState<string[]>(['one']);
  const code = `<DAccordion\n  type="${type}"\n  variant="${variant}"\n  value={openItems}\n  onValueChange={setOpenItems}\n>\n  <DAccordionItem value="one" title="Project colors">...</DAccordionItem>\n  <DAccordionItem value="two" title="Behavior">...</DAccordionItem>\n</DAccordion>`;
  useLiveCode(code, onCodeChange);

  return (
    <PreviewLayout controls={<>
      <Control label="variant"><select value={variant} onChange={(event) => setVariant(event.target.value as AccordionDemoVariant)}>{['default','separator','card','separated'].map((item) => <option key={item}>{item}</option>)}</select></Control>
      <Control label="type"><select value={type} onChange={(event) => setType(event.target.value as 'single' | 'multiple')}><option value="single">single</option><option value="multiple">multiple</option></select></Control>
    </>}>
      <DAccordion type={type} variant={variant} value={openItems} onValueChange={(next) => { setOpenItems(next); onEvent(`onValueChange(${JSON.stringify(next)})`); }}>
        <DAccordionItem value="one" title="How do I change project colors?">Map semantic project tokens or use DThemeProvider.</DAccordionItem>
        <DAccordionItem value="two" title="Does old behavior stay?">Yes. Behavior remains canonical while visual variants stay optional.</DAccordionItem>
        <DAccordionItem value="three" title="Can several items stay open?">Use type=&quot;multiple&quot; when needed.</DAccordionItem>
      </DAccordion>
    </PreviewLayout>
  );
}

function InteractivePreview({ interfaceName, fallback, onCodeChange, onEvent }: { interfaceName?: string; fallback: ReactNode } & InteractivePreviewProps) {
  if (interfaceName === 'ButtonProps') return <ButtonPreview onCodeChange={onCodeChange} onEvent={onEvent} />;
  if (interfaceName === 'InputProps') return <InputPreview onCodeChange={onCodeChange} onEvent={onEvent} />;
  if (interfaceName === 'SelectProps') return <SelectPreview onCodeChange={onCodeChange} onEvent={onEvent} />;
  if (interfaceName === 'ComboboxProps') return <ComboboxPreview onCodeChange={onCodeChange} onEvent={onEvent} />;
  if (interfaceName === 'RangeDatePickerProps') return <RangePreview onCodeChange={onCodeChange} onEvent={onEvent} />;
  if (interfaceName === 'AccordionProps') return <AccordionPreview onCodeChange={onCodeChange} onEvent={onEvent} />;
  return <>{fallback}</>;
}

function PropsPanel({ selected }: { selected?: ApiInterface }) {
  if (!selected) return <div className="playground-empty"><p>API metadata belum tersedia untuk grouped preview ini.</p></div>;
  return (
    <div className="playground-table-wrap">
      <table className="playground-table">
        <thead><tr><th>Prop</th><th>Type</th><th>Required</th><th>Usage</th></tr></thead>
        <tbody>{selected.props.map((prop) => <tr key={prop.name}><td><code>{prop.name}</code></td><td><code>{prop.type}</code></td><td>{prop.required ? 'Yes' : 'No'}</td><td>{prop.description || 'Gunakan sesuai type. Native inherited props mengikuti underlying element.'}</td></tr>)}</tbody>
      </table>
      {selected.extends.length ? <p className="playground-extends">Extends: <code>{selected.extends.join(', ')}</code></p> : null}
    </div>
  );
}

function FunctionsPanel({ functions, events, onClearEvents }: { functions: ApiFunction[]; events: string[]; onClearEvents: () => void }) {
  return (
    <div className="playground-function-stack">
      <div className="playground-functions">
        {functions.length
          ? functions.map((item) => <article key={item.name}><code>{item.signature}</code><p>{item.description || 'Exported helper/function dari source component yang sama.'}</p></article>)
          : <div className="playground-empty"><p>Tidak ada exported helper function khusus untuk component ini.</p></div>}
      </div>
      <div className="playground-events">
        <div className="playground-subhead"><strong>Callback / event log</strong><button type="button" onClick={onClearEvents}>Clear</button></div>
        {events.length ? <ol>{events.slice(-8).reverse().map((event, index) => <li key={`${event}-${index}`}>{event}</li>)}</ol> : <p>Interaksikan component di tab Preview; callback yang terpanggil akan muncul di sini.</p>}
      </div>
    </div>
  );
}

function CodePanel({ code }: { code?: string }) {
  const [copied, setCopied] = useState(false);
  if (!code) return <div className="playground-empty"><p>Contoh code belum tersedia untuk grouped preview ini.</p></div>;
  return (
    <div className="code-block embedded-code">
      <button className="copy-button" type="button" onClick={() => { void navigator.clipboard?.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1200); }}>{copied ? 'Copied' : 'Copy'}</button>
      <pre><code>{code}</code></pre>
    </div>
  );
}

export function ComponentDocsTabs({ interfaceName, preview, code }: { interfaceName?: string; preview: ReactNode; code?: string }) {
  const [tab, setTab] = useState<DocsTab>('preview');
  const [liveCode, setLiveCode] = useState(code ?? '');
  const [events, setEvents] = useState<string[]>([]);
  const selected = interfaceName ? api.interfaces[interfaceName] : undefined;
  const functions = selected ? Object.values(api.functions).filter((item) => item.source === selected.source) : [];

  useEffect(() => setLiveCode(code ?? ''), [code, interfaceName]);

  return (
    <div className="demo-shell component-docs-shell">
      <div className="demo-tabs component-doc-tabs">
        <button type="button" className={tab === 'preview' ? 'active' : ''} onClick={() => setTab('preview')}>Preview</button>
        <button type="button" className={tab === 'code' ? 'active' : ''} onClick={() => setTab('code')}>Code</button>
        <button type="button" className={tab === 'props' ? 'active' : ''} onClick={() => setTab('props')}>Props{selected ? ` (${selected.props.length})` : ''}</button>
        <button type="button" className={tab === 'functions' ? 'active' : ''} onClick={() => setTab('functions')}>Functions{selected ? ` (${functions.length})` : ''}</button>
      </div>
      {tab === 'preview' ? (
        <div className="demo-preview">
          <InteractivePreview
            interfaceName={interfaceName}
            fallback={preview}
            onCodeChange={setLiveCode}
            onEvent={(event) => setEvents((items) => [...items, event].slice(-30))}
          />
        </div>
      ) : null}
      {tab === 'code' ? <CodePanel code={liveCode || code} /> : null}
      {tab === 'props' ? <div className="demo-api-panel"><PropsPanel selected={selected} /></div> : null}
      {tab === 'functions' ? <div className="demo-api-panel"><FunctionsPanel functions={functions} events={events} onClearEvents={() => setEvents([])} /></div> : null}
    </div>
  );
}
