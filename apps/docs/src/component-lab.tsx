import { useState, type ReactNode } from 'react';
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

const api = generatedComponentApi as unknown as {
  interfaces: Record<string, ApiInterface>;
  functions: Record<string, ApiFunction>;
};

function Control({ label, children }: { label: string; children: ReactNode }) {
  return <label className="lab-control"><span>{label}</span>{children}</label>;
}

function EventLog({ events, clear }: { events: string[]; clear: () => void }) {
  return (
    <div className="lab-events">
      <div className="lab-subhead"><strong>Function / event log</strong><button type="button" onClick={clear}>Clear</button></div>
      {events.length
        ? <ol>{events.slice(-6).reverse().map((event, index) => <li key={`${event}-${index}`}>{event}</li>)}</ol>
        : <p>Interaksi callback akan terlihat di sini.</p>}
    </div>
  );
}

function GeneratedUsage({ code }: { code: string }) {
  return <div className="lab-code"><div className="lab-code-label">Generated usage</div><pre><code>{code}</code></pre></div>;
}

function PlaygroundFrame({ controls, preview, code, events }: { controls: ReactNode; preview: ReactNode; code: string; events?: ReactNode }) {
  return (
    <div className="lab-playground">
      <div className="lab-controls">{controls}</div>
      <div className="lab-preview"><p className="lab-kicker">Live preview</p>{preview}</div>
      <GeneratedUsage code={code} />
      {events}
    </div>
  );
}

function ButtonPlayground() {
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [size, setSize] = useState<ButtonSize>('md');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const code = `<DButton\n  variant="${variant}"\n  size="${size}"${loading ? '\n  loading' : ''}${disabled ? '\n  disabled' : ''}${fullWidth ? '\n  fullWidth' : ''}\n  onClick={handleClick}\n>\n  Save\n</DButton>`;
  return <PlaygroundFrame code={code} controls={<><Control label="variant"><select value={variant} onChange={(event) => setVariant(event.target.value as ButtonVariant)}>{['primary','secondary','outline','ghost','soft','info','success','warning','danger','link'].map((item) => <option key={item}>{item}</option>)}</select></Control><Control label="size"><select value={size} onChange={(event) => setSize(event.target.value as ButtonSize)}>{['sm','md','lg','icon'].map((item) => <option key={item}>{item}</option>)}</select></Control><Control label="loading"><input type="checkbox" checked={loading} onChange={(event) => setLoading(event.target.checked)} /></Control><Control label="disabled"><input type="checkbox" checked={disabled} onChange={(event) => setDisabled(event.target.checked)} /></Control><Control label="fullWidth"><input type="checkbox" checked={fullWidth} onChange={(event) => setFullWidth(event.target.checked)} /></Control></>} preview={<DButton variant={variant} size={size} loading={loading} disabled={disabled} fullWidth={fullWidth} onClick={() => setEvents((items) => [...items, 'onClick()'])}>{size === 'icon' ? 'D' : 'Save'}</DButton>} events={<EventLog events={events} clear={() => setEvents([])} />} />;
}

function InputPlayground() {
  const [type, setType] = useState<InputType>('text');
  const [format, setFormat] = useState<InputFormat>('plain');
  const [size, setSize] = useState<InputSize>('md');
  const [value, setValue] = useState('Digvation');
  const [clearable, setClearable] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const effectiveType: InputType = format === 'plain' ? type : 'text';
  const code = `const [value, setValue] = useState('${value}');\n\n<DInput\n  type="${effectiveType}"\n  format="${format}"\n  size="${size}"\n  value={value}\n  onChange={(next) => setValue(next)}\n  clearable={${clearable}}${disabled ? '\n  disabled' : ''}${readOnly ? '\n  readOnly' : ''}\n/>`;
  return <PlaygroundFrame code={code} controls={<><Control label="type"><select value={type} disabled={format !== 'plain'} onChange={(event) => setType(event.target.value as InputType)}>{['text','email','password','number','tel','url','search'].map((item) => <option key={item}>{item}</option>)}</select></Control><Control label="format"><select value={format} onChange={(event) => setFormat(event.target.value as InputFormat)}>{['plain','currency','percentage'].map((item) => <option key={item}>{item}</option>)}</select></Control><Control label="size"><select value={size} onChange={(event) => setSize(event.target.value as InputSize)}>{['sm','md','lg'].map((item) => <option key={item}>{item}</option>)}</select></Control><Control label="clearable"><input type="checkbox" checked={clearable} onChange={(event) => setClearable(event.target.checked)} /></Control><Control label="disabled"><input type="checkbox" checked={disabled} onChange={(event) => setDisabled(event.target.checked)} /></Control><Control label="readOnly"><input type="checkbox" checked={readOnly} onChange={(event) => setReadOnly(event.target.checked)} /></Control></>} preview={<DInput label="Live input" type={effectiveType} format={format} size={size} value={value} clearable={clearable} disabled={disabled} readOnly={readOnly} onClear={() => setEvents((items) => [...items, 'onClear()'])} onChange={(next) => { setValue(next); setEvents((items) => [...items, `onChange("${next}")`]); }} />} events={<EventLog events={events} clear={() => setEvents([])} />} />;
}

const demoOptions = [{ label: 'Active', value: 'active' }, { label: 'Draft', value: 'draft' }, { label: 'Archived', value: 'archived' }];

function SelectPlayground() {
  const [value, setValue] = useState<string | number | null>('active');
  const [searchable, setSearchable] = useState(false);
  const [clearable, setClearable] = useState(true);
  const [size, setSize] = useState<InputSize>('md');
  const [scrollBehavior, setScrollBehavior] = useState<FloatingScrollBehavior>('reposition');
  const [events, setEvents] = useState<string[]>([]);
  const code = `<DSelect\n  value={value}\n  options={options}\n  searchable={${searchable}}\n  clearable={${clearable}}\n  size="${size}"\n  scrollBehavior="${scrollBehavior}"\n  onChange={setValue}\n/>`;
  return <PlaygroundFrame code={code} controls={<><Control label="searchable"><input type="checkbox" checked={searchable} onChange={(event) => setSearchable(event.target.checked)} /></Control><Control label="clearable"><input type="checkbox" checked={clearable} onChange={(event) => setClearable(event.target.checked)} /></Control><Control label="size"><select value={size} onChange={(event) => setSize(event.target.value as InputSize)}>{['sm','md','lg'].map((item) => <option key={item}>{item}</option>)}</select></Control><Control label="scrollBehavior"><select value={scrollBehavior} onChange={(event) => setScrollBehavior(event.target.value as FloatingScrollBehavior)}>{['reposition','close','lock'].map((item) => <option key={item}>{item}</option>)}</select></Control></>} preview={<DSelect label="Status" value={value} options={demoOptions} searchable={searchable} clearable={clearable} size={size} scrollBehavior={scrollBehavior} onChange={(next) => { setValue(next); setEvents((items) => [...items, `onChange(${JSON.stringify(next)})`]); }} />} events={<EventLog events={events} clear={() => setEvents([])} />} />;
}

function ComboboxPlayground() {
  const [value, setValue] = useState<string | number | null>('react');
  const [allowCreate, setAllowCreate] = useState(true);
  const [clearable, setClearable] = useState(true);
  const [debounceMs, setDebounceMs] = useState(300);
  const [events, setEvents] = useState<string[]>([]);
  const code = `<DCombobox\n  value={value}\n  options={options}\n  allowCreate={${allowCreate}}\n  clearable={${clearable}}\n  debounceMs={${debounceMs}}\n  onChange={setValue}\n  onSearchChange={handleSearch}\n/>`;
  return <PlaygroundFrame code={code} controls={<><Control label="allowCreate"><input type="checkbox" checked={allowCreate} onChange={(event) => setAllowCreate(event.target.checked)} /></Control><Control label="clearable"><input type="checkbox" checked={clearable} onChange={(event) => setClearable(event.target.checked)} /></Control><Control label="debounceMs"><input type="number" min={0} step={50} value={debounceMs} onChange={(event) => setDebounceMs(Number(event.target.value) || 0)} /></Control></>} preview={<DCombobox label="Technology" value={value} options={[{label:'React',value:'react'},{label:'Next.js',value:'next'},{label:'TypeScript',value:'ts'}]} allowCreate={allowCreate} clearable={clearable} debounceMs={debounceMs} onSearchChange={(query) => setEvents((items) => [...items, `onSearchChange("${query}")`])} onCreateOption={(next) => setEvents((items) => [...items, `onCreateOption("${next}")`])} onChange={(next) => { setValue(next); setEvents((items) => [...items, `onChange(${JSON.stringify(next)})`]); }} />} events={<EventLog events={events} clear={() => setEvents([])} />} />;
}

function RangePlayground() {
  const [value, setValue] = useState<DateRangeValue>({ start: '2026-09-01', end: '2026-09-30' });
  const [clearable, setClearable] = useState(true);
  const [size, setSize] = useState<InputSize>('md');
  const [scrollBehavior, setScrollBehavior] = useState<FloatingScrollBehavior>('close');
  const [events, setEvents] = useState<string[]>([]);
  const code = `<DRangeDatePicker\n  value={range}\n  size="${size}"\n  clearable={${clearable}}\n  scrollBehavior="${scrollBehavior}"\n  onChange={setRange}\n/>`;
  return <PlaygroundFrame code={code} controls={<><Control label="clearable"><input type="checkbox" checked={clearable} onChange={(event) => setClearable(event.target.checked)} /></Control><Control label="size"><select value={size} onChange={(event) => setSize(event.target.value as InputSize)}>{['sm','md','lg'].map((item) => <option key={item}>{item}</option>)}</select></Control><Control label="scrollBehavior"><select value={scrollBehavior} onChange={(event) => setScrollBehavior(event.target.value as FloatingScrollBehavior)}>{['reposition','close','lock'].map((item) => <option key={item}>{item}</option>)}</select></Control></>} preview={<DRangeDatePicker label="Report period" value={value} size={size} clearable={clearable} scrollBehavior={scrollBehavior} onChange={(next) => { setValue(next); setEvents((items) => [...items, `onChange(${JSON.stringify(next)})`]); }} />} events={<EventLog events={events} clear={() => setEvents([])} />} />;
}

function AccordionPlayground() {
  const [variant, setVariant] = useState<AccordionDemoVariant>('default');
  const [type, setType] = useState<'single' | 'multiple'>('single');
  const [openItems, setOpenItems] = useState<string[]>(['one']);
  const code = `<DAccordion\n  type="${type}"\n  variant="${variant}"\n  value={openItems}\n  onValueChange={setOpenItems}\n>\n  <DAccordionItem value="one" title="Project colors">...</DAccordionItem>\n  <DAccordionItem value="two" title="Behavior">...</DAccordionItem>\n</DAccordion>`;
  return <PlaygroundFrame code={code} controls={<><Control label="variant"><select value={variant} onChange={(event) => setVariant(event.target.value as AccordionDemoVariant)}>{['default','separator','card','separated'].map((item) => <option key={item}>{item}</option>)}</select></Control><Control label="type"><select value={type} onChange={(event) => setType(event.target.value as 'single' | 'multiple')}><option value="single">single</option><option value="multiple">multiple</option></select></Control></>} preview={<DAccordion type={type} variant={variant} value={openItems} onValueChange={setOpenItems}><DAccordionItem value="one" title="How do I change project colors?">Map semantic project tokens or use DThemeProvider. The component structure stays the same.</DAccordionItem><DAccordionItem value="two" title="Does old behavior stay?">Yes. Interaction behavior remains canonical while the visual variant can be changed independently.</DAccordionItem><DAccordionItem value="three" title="Can several items stay open?">Use type=&quot;multiple&quot; when the use-case needs it.</DAccordionItem></DAccordion>} />;
}

function LivePlayground({ interfaceName, fallback }: { interfaceName?: string; fallback: ReactNode }) {
  if (interfaceName === 'ButtonProps') return <ButtonPlayground />;
  if (interfaceName === 'InputProps') return <InputPlayground />;
  if (interfaceName === 'SelectProps') return <SelectPlayground />;
  if (interfaceName === 'ComboboxProps') return <ComboboxPlayground />;
  if (interfaceName === 'RangeDatePickerProps') return <RangePlayground />;
  if (interfaceName === 'AccordionProps') return <AccordionPlayground />;
  return <>{fallback}</>;
}

function PropsPanel({ selected }: { selected?: ApiInterface }) {
  if (!selected) return <div className="lab-empty"><p>API metadata belum tersedia untuk grouped preview ini.</p></div>;
  return <div className="lab-table-wrap"><table className="lab-table"><thead><tr><th>Prop</th><th>Type</th><th>Required</th><th>Usage</th></tr></thead><tbody>{selected.props.map((prop) => <tr key={prop.name}><td><code>{prop.name}</code></td><td><code>{prop.type}</code></td><td>{prop.required ? 'Yes' : 'No'}</td><td>{prop.description || 'Gunakan sesuai type. Native inherited props tetap mengikuti underlying HTML element.'}</td></tr>)}</tbody></table>{selected.extends.length ? <p className="lab-extends">Extends: <code>{selected.extends.join(', ')}</code></p> : null}</div>;
}

function FunctionsPanel({ functions }: { functions: ApiFunction[] }) {
  return <div className="lab-functions">{functions.length ? functions.map((item) => <article key={item.name}><code>{item.signature}</code><p>{item.description || 'Exported helper/function dari source component yang sama.'}</p></article>) : <div className="lab-empty"><p>Tidak ada exported helper function khusus untuk component ini. Callback/event component tetap dapat dites langsung di tab Preview.</p></div>}</div>;
}

function CodePanel({ code }: { code?: string }) {
  const [copied, setCopied] = useState(false);
  if (!code) return <div className="lab-empty"><p>Contoh code belum ditambahkan untuk grouped preview ini.</p></div>;
  return <div className="code-block embedded-code"><button className="copy-button" type="button" onClick={() => { void navigator.clipboard?.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1200); }}>{copied ? 'Copied' : 'Copy'}</button><pre><code>{code}</code></pre></div>;
}

export function ComponentDocsTabs({ interfaceName, preview, code }: { interfaceName?: string; preview: ReactNode; code?: string }) {
  const [tab, setTab] = useState<DocsTab>('preview');
  const selected = interfaceName ? api.interfaces[interfaceName] : undefined;
  const functions = selected ? Object.values(api.functions).filter((item) => item.source === selected.source) : [];
  return (
    <div className="demo-shell component-docs-shell">
      <div className="demo-tabs component-doc-tabs">
        <button className={tab === 'preview' ? 'active' : ''} onClick={() => setTab('preview')}>Preview</button>
        <button className={tab === 'code' ? 'active' : ''} onClick={() => setTab('code')}>Code</button>
        <button className={tab === 'props' ? 'active' : ''} onClick={() => setTab('props')}>Props{selected ? ` (${selected.props.length})` : ''}</button>
        <button className={tab === 'functions' ? 'active' : ''} onClick={() => setTab('functions')}>Functions{selected ? ` (${functions.length})` : ''}</button>
      </div>
      {tab === 'preview' ? <div className="demo-preview"><LivePlayground interfaceName={interfaceName} fallback={preview} /></div> : null}
      {tab === 'code' ? <CodePanel code={code} /> : null}
      {tab === 'props' ? <div className="demo-api-panel"><PropsPanel selected={selected} /></div> : null}
      {tab === 'functions' ? <div className="demo-api-panel"><FunctionsPanel functions={functions} /></div> : null}
    </div>
  );
}
