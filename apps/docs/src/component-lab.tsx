import { useMemo, useState, type ReactNode } from 'react';
import {
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
type LabTab = 'playground' | 'props' | 'functions';

function componentName(interfaceName: string) {
  return interfaceName.endsWith('Props') ? `D${interfaceName.slice(0, -5)}` : interfaceName;
}

function Control({ label, children }: { label: string; children: ReactNode }) {
  return <label className="lab-control"><span>{label}</span>{children}</label>;
}

function EventLog({ events, clear }: { events: string[]; clear: () => void }) {
  return <div className="lab-events"><div className="lab-subhead"><strong>Function / event log</strong><button type="button" onClick={clear}>Clear</button></div>{events.length ? <ol>{events.slice(-6).reverse().map((event, index) => <li key={`${event}-${index}`}>{event}</li>)}</ol> : <p>Interaksi callback akan terlihat di sini.</p>}</div>;
}

function PlaygroundFrame({ controls, preview, code, events }: { controls: ReactNode; preview: ReactNode; code: string; events: ReactNode }) {
  return <div className="lab-playground"><div className="lab-controls">{controls}</div><div className="lab-preview"><p className="lab-kicker">Live preview</p>{preview}</div><div className="lab-code"><pre><code>{code}</code></pre></div>{events}</div>;
}

function ButtonPlayground() {
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [size, setSize] = useState<ButtonSize>('md');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  return <PlaygroundFrame code={`<DButton variant="${variant}" size="${size}"${loading ? ' loading' : ''}${disabled ? ' disabled' : ''}${fullWidth ? ' fullWidth' : ''} onClick={handleClick}>Save</DButton>`} controls={<><Control label="variant"><select value={variant} onChange={(event) => setVariant(event.target.value as ButtonVariant)}>{['primary','secondary','outline','ghost','soft','info','success','warning','danger','link'].map((item) => <option key={item}>{item}</option>)}</select></Control><Control label="size"><select value={size} onChange={(event) => setSize(event.target.value as ButtonSize)}>{['sm','md','lg','icon'].map((item) => <option key={item}>{item}</option>)}</select></Control><Control label="loading"><input type="checkbox" checked={loading} onChange={(event) => setLoading(event.target.checked)} /></Control><Control label="disabled"><input type="checkbox" checked={disabled} onChange={(event) => setDisabled(event.target.checked)} /></Control><Control label="fullWidth"><input type="checkbox" checked={fullWidth} onChange={(event) => setFullWidth(event.target.checked)} /></Control></>} preview={<DButton variant={variant} size={size} loading={loading} disabled={disabled} fullWidth={fullWidth} onClick={() => setEvents((items) => [...items, 'onClick()'])}>{size === 'icon' ? 'D' : 'Save'}</DButton>} events={<EventLog events={events} clear={() => setEvents([])} />} />;
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
  return <PlaygroundFrame code={`const [value, setValue] = useState('${value}');\n\n<DInput\n  type="${effectiveType}"\n  format="${format}"\n  size="${size}"\n  value={value}\n  onChange={(next) => setValue(next)}\n  ${clearable ? 'clearable' : 'clearable={false}'}\n/>`} controls={<><Control label="type"><select value={type} disabled={format !== 'plain'} onChange={(event) => setType(event.target.value as InputType)}>{['text','email','password','number','tel','url','search'].map((item) => <option key={item}>{item}</option>)}</select></Control><Control label="format"><select value={format} onChange={(event) => setFormat(event.target.value as InputFormat)}>{['plain','currency','percentage'].map((item) => <option key={item}>{item}</option>)}</select></Control><Control label="size"><select value={size} onChange={(event) => setSize(event.target.value as InputSize)}>{['sm','md','lg'].map((item) => <option key={item}>{item}</option>)}</select></Control><Control label="clearable"><input type="checkbox" checked={clearable} onChange={(event) => setClearable(event.target.checked)} /></Control><Control label="disabled"><input type="checkbox" checked={disabled} onChange={(event) => setDisabled(event.target.checked)} /></Control><Control label="readOnly"><input type="checkbox" checked={readOnly} onChange={(event) => setReadOnly(event.target.checked)} /></Control></>} preview={<DInput label="Live input" type={effectiveType} format={format} size={size} value={value} clearable={clearable} disabled={disabled} readOnly={readOnly} onClear={() => setEvents((items) => [...items, 'onClear()'])} onChange={(next) => { setValue(next); setEvents((items) => [...items, `onChange("${next}")`]); }} />} events={<EventLog events={events} clear={() => setEvents([])} />} />;
}

const demoOptions = [{ label: 'Active', value: 'active' }, { label: 'Draft', value: 'draft' }, { label: 'Archived', value: 'archived' }];

function SelectPlayground() {
  const [value, setValue] = useState<string | number | null>('active');
  const [searchable, setSearchable] = useState(false);
  const [clearable, setClearable] = useState(true);
  const [size, setSize] = useState<InputSize>('md');
  const [scrollBehavior, setScrollBehavior] = useState<FloatingScrollBehavior>('reposition');
  const [events, setEvents] = useState<string[]>([]);
  return <PlaygroundFrame code={`<DSelect\n  value={value}\n  options={options}\n  searchable={${searchable}}\n  clearable={${clearable}}\n  size="${size}"\n  scrollBehavior="${scrollBehavior}"\n  onChange={setValue}\n/>`} controls={<><Control label="searchable"><input type="checkbox" checked={searchable} onChange={(event) => setSearchable(event.target.checked)} /></Control><Control label="clearable"><input type="checkbox" checked={clearable} onChange={(event) => setClearable(event.target.checked)} /></Control><Control label="size"><select value={size} onChange={(event) => setSize(event.target.value as InputSize)}>{['sm','md','lg'].map((item) => <option key={item}>{item}</option>)}</select></Control><Control label="scrollBehavior"><select value={scrollBehavior} onChange={(event) => setScrollBehavior(event.target.value as FloatingScrollBehavior)}>{['reposition','close','lock'].map((item) => <option key={item}>{item}</option>)}</select></Control></>} preview={<DSelect label="Status" value={value} options={demoOptions} searchable={searchable} clearable={clearable} size={size} scrollBehavior={scrollBehavior} onChange={(next) => { setValue(next); setEvents((items) => [...items, `onChange(${JSON.stringify(next)})`]); }} />} events={<EventLog events={events} clear={() => setEvents([])} />} />;
}

function ComboboxPlayground() {
  const [value, setValue] = useState<string | number | null>('react');
  const [allowCreate, setAllowCreate] = useState(true);
  const [clearable, setClearable] = useState(true);
  const [debounceMs, setDebounceMs] = useState(300);
  const [events, setEvents] = useState<string[]>([]);
  return <PlaygroundFrame code={`<DCombobox\n  value={value}\n  options={options}\n  allowCreate={${allowCreate}}\n  clearable={${clearable}}\n  debounceMs={${debounceMs}}\n  onChange={setValue}\n  onSearchChange={handleSearch}\n/>`} controls={<><Control label="allowCreate"><input type="checkbox" checked={allowCreate} onChange={(event) => setAllowCreate(event.target.checked)} /></Control><Control label="clearable"><input type="checkbox" checked={clearable} onChange={(event) => setClearable(event.target.checked)} /></Control><Control label="debounceMs"><input type="number" min={0} step={50} value={debounceMs} onChange={(event) => setDebounceMs(Number(event.target.value) || 0)} /></Control></>} preview={<DCombobox label="Technology" value={value} options={[{label:'React',value:'react'},{label:'Next.js',value:'next'},{label:'TypeScript',value:'ts'}]} allowCreate={allowCreate} clearable={clearable} debounceMs={debounceMs} onSearchChange={(query) => setEvents((items) => [...items, `onSearchChange("${query}")`])} onCreateOption={(next) => setEvents((items) => [...items, `onCreateOption("${next}")`])} onChange={(next) => { setValue(next); setEvents((items) => [...items, `onChange(${JSON.stringify(next)})`]); }} />} events={<EventLog events={events} clear={() => setEvents([])} />} />;
}

function RangePlayground() {
  const [value, setValue] = useState<DateRangeValue>({ start: '2026-09-01', end: '2026-09-30' });
  const [clearable, setClearable] = useState(true);
  const [size, setSize] = useState<InputSize>('md');
  const [scrollBehavior, setScrollBehavior] = useState<FloatingScrollBehavior>('close');
  const [events, setEvents] = useState<string[]>([]);
  return <PlaygroundFrame code={`<DRangeDatePicker\n  value={range}\n  size="${size}"\n  clearable={${clearable}}\n  scrollBehavior="${scrollBehavior}"\n  onChange={setRange}\n/>`} controls={<><Control label="clearable"><input type="checkbox" checked={clearable} onChange={(event) => setClearable(event.target.checked)} /></Control><Control label="size"><select value={size} onChange={(event) => setSize(event.target.value as InputSize)}>{['sm','md','lg'].map((item) => <option key={item}>{item}</option>)}</select></Control><Control label="scrollBehavior"><select value={scrollBehavior} onChange={(event) => setScrollBehavior(event.target.value as FloatingScrollBehavior)}>{['reposition','close','lock'].map((item) => <option key={item}>{item}</option>)}</select></Control></>} preview={<DRangeDatePicker label="Report period" value={value} size={size} clearable={clearable} scrollBehavior={scrollBehavior} onChange={(next) => { setValue(next); setEvents((items) => [...items, `onChange(${JSON.stringify(next)})`]); }} />} events={<EventLog events={events} clear={() => setEvents([])} />} />;
}

function LivePlayground({ interfaceName }: { interfaceName: string }) {
  if (interfaceName === 'ButtonProps') return <ButtonPlayground />;
  if (interfaceName === 'InputProps') return <InputPlayground />;
  if (interfaceName === 'SelectProps') return <SelectPlayground />;
  if (interfaceName === 'ComboboxProps') return <ComboboxPlayground />;
  if (interfaceName === 'RangeDatePickerProps') return <RangePlayground />;
  return <div className="lab-empty"><strong>API lengkap tersedia.</strong><p>Live control khusus ditampilkan untuk props yang mengubah behavior secara bermakna. Semua exported props tetap terlihat di tab Props API.</p></div>;
}

export function ComponentLab() {
  const api = generatedComponentApi as unknown as { interfaces: Record<string, ApiInterface>; functions: Record<string, ApiFunction> };
  const interfaces = useMemo(() => Object.values(api.interfaces).filter((item) => item.name.endsWith('Props')).sort((a, b) => componentName(a.name).localeCompare(componentName(b.name))), [api.interfaces]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedName, setSelectedName] = useState('InputProps');
  const [tab, setTab] = useState<LabTab>('playground');
  const selected = api.interfaces[selectedName] ?? interfaces[0];
  const filtered = interfaces.filter((item) => `${componentName(item.name)} ${item.name} ${item.props.map((prop) => prop.name).join(' ')}`.toLowerCase().includes(query.toLowerCase()));
  const relatedFunctions = selected ? Object.values(api.functions).filter((item) => item.source === selected.source) : [];

  return <>
    <button type="button" className="component-lab-launcher" onClick={() => setOpen(true)}>Component Lab</button>
    {open ? <div className="component-lab-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><aside className="component-lab-panel" role="dialog" aria-modal="true" aria-label="Component documentation lab"><header className="lab-header"><div><span>Documentation</span><strong>Component Lab</strong></div><button type="button" aria-label="Close component lab" onClick={() => setOpen(false)}>×</button></header><div className="lab-body"><div className="lab-sidebar"><input placeholder="Cari component / prop..." value={query} onChange={(event) => setQuery(event.target.value)} /><nav>{filtered.map((item) => <button type="button" className={selected?.name === item.name ? 'active' : ''} key={item.name} onClick={() => { setSelectedName(item.name); setTab('playground'); }}>{componentName(item.name)}<small>{item.props.length} props</small></button>)}</nav></div><section className="lab-content">{selected ? <><div className="lab-title"><p>{selected.source}</p><h2>{componentName(selected.name)}</h2>{selected.description ? <span>{selected.description}</span> : null}</div><div className="lab-tabs"><button className={tab === 'playground' ? 'active' : ''} onClick={() => setTab('playground')}>Live props</button><button className={tab === 'props' ? 'active' : ''} onClick={() => setTab('props')}>Props API ({selected.props.length})</button><button className={tab === 'functions' ? 'active' : ''} onClick={() => setTab('functions')}>Functions ({relatedFunctions.length})</button></div>{tab === 'playground' ? <LivePlayground interfaceName={selected.name} /> : null}{tab === 'props' ? <div className="lab-table-wrap"><table className="lab-table"><thead><tr><th>Prop</th><th>Type</th><th>Required</th><th>Usage</th></tr></thead><tbody>{selected.props.map((prop) => <tr key={prop.name}><td><code>{prop.name}</code></td><td><code>{prop.type}</code></td><td>{prop.required ? 'Yes' : 'No'}</td><td>{prop.description || 'See the type and live playground. Native inherited props follow the underlying HTML element.'}</td></tr>)}</tbody></table>{selected.extends.length ? <p className="lab-extends">Extends: <code>{selected.extends.join(', ')}</code></p> : null}</div> : null}{tab === 'functions' ? <div className="lab-functions">{relatedFunctions.length ? relatedFunctions.map((item) => <article key={item.name}><code>{item.signature}</code><p>{item.description || 'Exported utility/function from the same component source.'}</p></article>) : <div className="lab-empty"><p>Tidak ada exported helper function khusus pada file component ini.</p></div>}</div> : null}</> : <div className="lab-empty"><p>Jalankan docs melalui script workspace agar metadata TypeScript digenerate otomatis.</p></div>}</section></div></aside></div> : null}
  </>;
}
