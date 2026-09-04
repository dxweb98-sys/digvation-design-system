import { useMemo, useState, type ReactNode } from 'react';
import {
  Accordion,
  AccordionItem,
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Checkbox,
  Combobox,
  ConfirmDialog,
  ConnectionError,
  Dropdown,
  CurrencyInput,
  DataTable,
  DatePicker,
  DateRangeFilter,
  DecimalInput,
  Dialog,
  EmptyState,
  ExportButton,
  InfoNote,
  Input,
  LoadingIndicator,
  LoadingOverlay,
  NotificationPanel,
  Pagination,
  Progress,
  Radio,
  RangeDatePicker,
  SearchInput,
  Select,
  SelectFilter,
  Separator,
  Skeleton,
  TableSkeleton,
  CardSkeleton,
  FormSkeleton,
  Spinner,
  SplashScreen,
  StatusFilter,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ThemeProvider,
  ToastProvider,
  Toggle,
  Tooltip,
  defaultThemeTokens,
  type ThemeMode,
  type ThemeRadius,
  type ThemeTokens,
} from '@digvation/ui';

type NavItem = { id: string; label: string; group: string };
const navItems: NavItem[] = [
  { id: 'getting-started', label: 'Getting Started', group: 'Guide' },
  { id: 'theming', label: 'Theming', group: 'Guide' },
  { id: 'button', label: 'Button', group: 'Actions' },
  { id: 'input', label: 'Input', group: 'Forms' },
  { id: 'textarea', label: 'Textarea', group: 'Forms' },
  { id: 'select', label: 'Select', group: 'Forms' },
  { id: 'combobox', label: 'Combobox', group: 'Forms' },
  { id: 'search-input', label: 'SearchInput', group: 'Forms' },
  { id: 'checkbox-radio-toggle', label: 'Checkbox / Radio / Toggle', group: 'Forms' },
  { id: 'date-picker', label: 'DatePicker', group: 'Forms' },
  { id: 'range-date-picker', label: 'RangeDatePicker', group: 'Forms' },
  { id: 'filters', label: 'Filters', group: 'Forms' },
  { id: 'badge-alert-note', label: 'Badge / Alert / InfoNote', group: 'Feedback' },
  { id: 'toast', label: 'Toast', group: 'Feedback' },
  { id: 'progress-loading', label: 'Progress / Loading', group: 'Feedback' },
  { id: 'skeleton', label: 'Skeleton', group: 'Feedback' },
  { id: 'card', label: 'Card', group: 'Display' },
  { id: 'avatar', label: 'Avatar', group: 'Display' },
  { id: 'empty-state', label: 'EmptyState', group: 'Display' },
  { id: 'data-table', label: 'DataTable', group: 'Display' },
  { id: 'tabs', label: 'Tabs', group: 'Navigation' },
  { id: 'accordion', label: 'Accordion', group: 'Navigation' },
  { id: 'breadcrumb', label: 'Breadcrumb', group: 'Navigation' },
  { id: 'pagination', label: 'Pagination', group: 'Navigation' },
  { id: 'dropdown', label: 'Dropdown', group: 'Overlay' },
  { id: 'tooltip', label: 'Tooltip', group: 'Overlay' },
  { id: 'dialog', label: 'Dialog', group: 'Overlay' },
  { id: 'notification', label: 'NotificationPanel', group: 'Overlay' },
  { id: 'export', label: 'ExportButton', group: 'Actions' },
  { id: 'utilities', label: 'Separator / Spinner', group: 'Display' },
  { id: 'full-screen', label: 'Full-screen states', group: 'Feedback' },
];

function Code({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="code-block">
      <button className="copy-button" onClick={() => { void navigator.clipboard?.writeText(children); setCopied(true); window.setTimeout(() => setCopied(false), 1200); }}>{copied ? 'Copied' : 'Copy'}</button>
      <pre><code>{children}</code></pre>
    </div>
  );
}

function DocSection({ id, title, description, preview, code, props }: { id: string; title: string; description: string; preview: ReactNode; code?: string; props?: string[] }) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  return (
    <section id={id} className="doc-section">
      <div className="section-heading">
        <div><p className="eyebrow">Component</p><h2>{title}</h2><p>{description}</p></div>
        {props?.length ? <div className="prop-chips">{props.map((prop) => <span key={prop}>{prop}</span>)}</div> : null}
      </div>
      <div className="demo-shell">
        <div className="demo-tabs"><button className={tab === 'preview' ? 'active' : ''} onClick={() => setTab('preview')}>Preview</button>{code ? <button className={tab === 'code' ? 'active' : ''} onClick={() => setTab('code')}>Code</button> : null}</div>
        {tab === 'preview' ? <div className="demo-preview">{preview}</div> : <Code>{code ?? ''}</Code>}
      </div>
    </section>
  );
}

function ThemePlayground({ tokens, setTokens, mode, setMode, radius, setRadius }: { tokens: ThemeTokens; setTokens: (next: ThemeTokens) => void; mode: ThemeMode; setMode: (next: ThemeMode) => void; radius: ThemeRadius; setRadius: (next: ThemeRadius) => void }) {
  const colors: Array<[keyof ThemeTokens, string]> = [['brand','Brand'],['background','Background'],['surface','Surface'],['text','Text'],['textMuted','Muted text'],['border','Border'],['success','Success'],['warning','Warning'],['danger','Danger']];
  const css = `:root {\n${Object.entries(tokens).map(([key, value]) => {
    const map: Record<string,string> = { brand:'--color-brand', background:'--color-background', surface:'--color-surface', text:'--color-text', textMuted:'--color-text-muted', border:'--color-border', success:'--color-success', warning:'--color-warning', danger:'--color-danger' };
    return map[key] ? `  ${map[key]}: ${value};` : '';
  }).filter(Boolean).join('\n')}\n}`;
  return <div className="theme-grid"><div className="theme-controls"><div className="field-row"><label>Mode<select value={mode} onChange={(e)=>setMode(e.target.value as ThemeMode)}><option value="light">Light</option><option value="dark">Dark</option></select></label><label>Radius<select value={radius} onChange={(e)=>setRadius(e.target.value as ThemeRadius)}><option value="compact">Compact</option><option value="default">Default</option><option value="rounded">Rounded</option></select></label></div><div className="color-grid">{colors.map(([key,label]) => <label key={key}><span>{label}</span><div className="color-control"><input type="color" value={String(tokens[key] ?? defaultThemeTokens[key]).startsWith('#') ? String(tokens[key] ?? defaultThemeTokens[key]) : '#2563eb'} onChange={(e)=>setTokens({...tokens,[key]:e.target.value})}/><input value={String(tokens[key] ?? '')} placeholder={String(defaultThemeTokens[key])} onChange={(e)=>setTokens({...tokens,[key]:e.target.value || undefined})}/></div></label>)}</div><div className="inline-actions"><Button variant="outline" size="sm" onClick={()=>setTokens({})}>Reset colors</Button></div></div><div><Code>{css}</Code><p className="tiny-note">Untuk nilai HSL bawaan, color picker hanya dipakai saat Anda memilih warna baru. Input teks menerima format CSS apa pun.</p></div></div>;
}

function FormExamples() {
  const [text,setText]=useState('Digvation');
  const [currency,setCurrency]=useState('1250000');
  const [decimal,setDecimal]=useState('12.5');
  const [area,setArea]=useState('Catatan project...');
  const [select,setSelect]=useState<string|number|null>('active');
  const [combo,setCombo]=useState<string|number|null>('react');
  const [search,setSearch]=useState('');
  const [toggle,setToggle]=useState(true);
  const [checked,setChecked]=useState(true);
  const [radio,setRadio]=useState('a');
  const [date,setDate]=useState('2026-09-04');
  const [range,setRange]=useState({start:'2026-09-01',end:'2026-09-30'});
  const [status,setStatus]=useState('active');
  const [filter,setFilter]=useState<string|number|null>('all');
  const [from,setFrom]=useState('2026-09-01'); const [to,setTo]=useState('2026-09-30');
  return <>
    <DocSection id="input" title="Input" description="Canonical input dengan behavior oldUi: label, hint/error, clear, password visibility, number handling, currency/percentage formatting, adornment, dan callback value + event." props={['label','format','clearable','size','onChange(value,event)','onNativeChange','prefix','suffix']} preview={<div className="preview-grid"><Input label="Project name" value={text} onChange={setText} hint="Value callback tetap compatible dengan oldUi."/><CurrencyInput label="Budget" value={currency} onValueChange={setCurrency}/><DecimalInput label="Quantity" value={decimal} onValueChange={setDecimal}/><Input label="Password" type="password" value="secret123" onChange={()=>{}}/></div>} code={`const [value, setValue] = useState('');\n\n<Input\n  label="Project name"\n  value={value}\n  clearable\n  onChange={(value, event) => setValue(value)}\n/>\n\n<CurrencyInput value={budget} onValueChange={setBudget} />`} />
    <DocSection id="textarea" title="Textarea" description="Textarea dengan contract value callback, native callback, clear button, error/hint, dan controlled state." props={['label','value','onChange(value,event)','clearable','error','hint']} preview={<Textarea label="Description" value={area} onChange={setArea} hint="Bisa di-clear tanpa menulis handler tambahan."/>} code={`<Textarea\n  label="Description"\n  value={description}\n  onChange={(value) => setDescription(value)}\n  clearable\n/>`} />
    <DocSection id="select" title="Select" description="Select single-source dengan searchable, async fetchOptions, controlled/uncontrolled value, keyboard navigation, loading, clear, dan selected option resolution." props={['options','value','onChange','searchable','fetchOptions','clearable','loading']} preview={<Select label="Status" value={select} onChange={setSelect} searchable options={[{label:'Active',value:'active'},{label:'Draft',value:'draft'},{label:'Archived',value:'archived'}]}/>} code={`<Select\n  label="Status"\n  value={status}\n  onChange={setStatus}\n  searchable\n  options={[\n    { label: 'Active', value: 'active' },\n    { label: 'Draft', value: 'draft' },\n  ]}\n/>`} />
    <DocSection id="combobox" title="Combobox" description="Autocomplete lama dalam surface canonical: filtering, debounce async, allow-create, custom render option, clear, dan selected resolution." props={['options','fetchOptions','allowCreate','onCreateOption','renderOption','debounceMs']} preview={<Combobox label="Technology" value={combo} onChange={setCombo} allowCreate options={[{label:'React',value:'react'},{label:'Next.js',value:'next'},{label:'TypeScript',value:'ts'}]}/>} code={`<Combobox\n  label="Technology"\n  value={technology}\n  onChange={setTechnology}\n  allowCreate\n  onCreateOption={(name) => createTechnology(name)}\n  options={options}\n/>`} />
    <DocSection id="search-input" title="SearchInput" description="Search field dengan local state + debounce dan immediate clear seperti BaseSearchInput lama." props={['value','onChange','debounceMs','placeholder','expandable']} preview={<SearchInput value={search} onChange={setSearch} placeholder="Search components..."/>} code={`<SearchInput\n  value={query}\n  onChange={setQuery}\n  debounceMs={300}\n  placeholder="Search..."\n/>`} />
    <DocSection id="checkbox-radio-toggle" title="Checkbox, Radio & Toggle" description="Primitive pilihan yang tetap controlled-friendly dan memakai semantic brand token." preview={<div className="row-wrap"><label className="control-label"><Checkbox checked={checked} onChange={(e)=>setChecked(e.target.checked)}/> Checkbox</label><label className="control-label"><Radio name="demo" checked={radio==='a'} onChange={()=>setRadio('a')}/> Option A</label><label className="control-label"><Radio name="demo" checked={radio==='b'} onChange={()=>setRadio('b')}/> Option B</label><Toggle label="Notifications" checked={toggle} onChange={setToggle}/></div>} code={`<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />\n<Toggle label="Notifications" checked={enabled} onChange={setEnabled} />`} />
    <DocSection id="date-picker" title="DatePicker" description="Date picker dengan dropdown shared engine, size, clear, min/max, hint/error, dan controlled string value." props={['value','onChange','minDate','maxDate','clearable','size']} preview={<DatePicker label="Deployment date" value={date} onChange={setDate}/>} code={`<DatePicker label="Deployment date" value={date} onChange={setDate} />`} />
    <DocSection id="range-date-picker" title="RangeDatePicker" description="Range calendar canonical dengan behavior lama dan quick-range selection." props={['value','onChange','clearable','size']} preview={<RangeDatePicker label="Report period" value={range} onChange={(next)=>setRange({start: next.start ?? '', end: next.end ?? ''})}/>} code={`<RangeDatePicker\n  label="Report period"\n  value={range}\n  onChange={setRange}\n/>`} />
    <DocSection id="filters" title="Filter helpers" description="Komponen filter reusable untuk toolbar dan data views." preview={<div className="stack"><SelectFilter label="Category" value={filter} onChange={setFilter} options={[{label:'All',value:'all'},{label:'Product',value:'product'},{label:'Service',value:'service'}]}/><StatusFilter label="Status" value={status} onChange={setStatus} options={[{label:'Active',value:'active',count:12},{label:'Draft',value:'draft',count:4}]}/><DateRangeFilter from={from} to={to} onFromChange={setFrom} onToChange={setTo} onClear={()=>{setFrom('');setTo('');}}/></div>} code={`<SelectFilter label="Category" options={options} value={category} onChange={setCategory} />\n<StatusFilter options={statusOptions} value={status} onChange={setStatus} />`} />
  </>;
}

function OverlayExamples() {
  const [dialog,setDialog]=useState(false); const [confirm,setConfirm]=useState(false); const [panel,setPanel]=useState(false); const [overlay,setOverlay]=useState(false); const [error,setError]=useState(false); const [splash,setSplash]=useState(false);
  const [notifications,setNotifications]=useState([{id:'1',title:'Build complete',message:'Design system package is ready.',type:'success' as const,read:false,createdAt:'Just now'},{id:'2',title:'Theme updated',message:'Brand token changed to the current project color.',type:'info' as const,read:true,createdAt:'5m ago'}]);
  return <>
    <DocSection id="dropdown" title="Dropdown" description="Shared positioning engine used by Select, Combobox, DatePicker, DataTable action menus and ExportButton. Supports portal positioning, controlled state, placement, matchWidth, Escape/outside close and close-on-item-click." props={['trigger','placement','matchWidth','open','onOpenChange','closeOnItemClick']} preview={<Dropdown closeOnItemClick trigger={({open}) => <Button variant="outline">Menu {open ? '↑' : '↓'}</Button>}><div className="menu-demo"><button type="button">Edit project</button><button type="button">Duplicate</button><button type="button" className="danger-item">Delete</button></div></Dropdown>} code={`<Dropdown
  placement="bottom-start"
  closeOnItemClick
  trigger={({ open }) => <Button variant="outline">Menu</Button>}
>
  <button>Edit</button>
  <button>Delete</button>
</Dropdown>`}/>
    <DocSection id="tooltip" title="Tooltip" description="Accessible hover/focus helper dengan semantic tooltip color dan empat placement." preview={<div className="row-wrap"><Tooltip content="Helpful contextual information"><Button variant="outline">Hover or focus me</Button></Tooltip><Tooltip content="Right placement" placement="right"><Badge>Info</Badge></Tooltip></div>} code={`<Tooltip content="Helpful information" placement="top">\n  <Button variant="outline">Hover me</Button>\n</Tooltip>`}/>
    <DocSection id="dialog" title="Dialog & ConfirmDialog" description="Dialog mempertahankan oldUi mobile bottom-sheet + desktop modal, body lock, Escape, overlay close, focus containment, footer, dan size." preview={<div className="row-wrap"><Button onClick={()=>setDialog(true)}>Open dialog</Button><Button variant="danger" onClick={()=>setConfirm(true)}>Delete item</Button><Dialog open={dialog} onClose={()=>setDialog(false)} title="Project settings" description="Example reusable dialog." footer={<div className="row-wrap right"><Button variant="outline" onClick={()=>setDialog(false)}>Cancel</Button><Button onClick={()=>setDialog(false)}>Save</Button></div>}><div className="stack"><Input label="Project" value="Digvation" onChange={()=>{}}/><Select label="Environment" value="production" onChange={()=>{}} options={[{label:'Production',value:'production'},{label:'Staging',value:'staging'}]}/></div></Dialog><ConfirmDialog open={confirm} onClose={()=>setConfirm(false)} onConfirm={()=>setConfirm(false)} title="Delete component?" message="This preview demonstrates destructive confirmation."/></div>} code={`<Dialog open={open} onClose={() => setOpen(false)} title="Project settings" footer={...}>\n  <YourForm />\n</Dialog>\n\n<ConfirmDialog open={confirm} onClose={...} onConfirm={...} />`} />
    <DocSection id="notification" title="NotificationPanel" description="Dropdown notification panel dengan unread state, mark-read, mark-all, dismiss, dan custom labels." preview={<div className="notification-demo"><Button variant="outline" onClick={()=>setPanel(!panel)}>Notifications ({notifications.filter(n=>!n.read).length})</Button><NotificationPanel open={panel} onClose={()=>setPanel(false)} notifications={notifications} onMarkRead={(id)=>setNotifications((items)=>items.map(x=>x.id===id?{...x,read:true}:x))} onMarkAllRead={()=>setNotifications((items)=>items.map(x=>({...x,read:true})))} onDismiss={(id)=>setNotifications((items)=>items.filter(x=>x.id!==id))}/></div>} code={`<NotificationPanel\n  open={open}\n  notifications={notifications}\n  onMarkRead={markRead}\n  onMarkAllRead={markAllRead}\n  onDismiss={dismiss}\n  onClose={() => setOpen(false)}\n/>`} />
    <DocSection id="full-screen" title="Full-screen states" description="ConnectionError, LoadingOverlay dan SplashScreen tersedia untuk application-level states. Preview dijalankan on-demand karena semuanya menggunakan fixed overlay." preview={<div className="row-wrap"><Button variant="outline" onClick={()=>setOverlay(true)}>Loading overlay</Button><Button variant="outline" onClick={()=>setError(true)}>Connection error</Button><Button variant="outline" onClick={()=>setSplash(true)}>Splash screen</Button>{overlay?<><LoadingOverlay label="Loading preview..."/><button className="overlay-exit" onClick={()=>setOverlay(false)}>Close preview</button></>:null}{error?<ConnectionError onRetry={()=>setError(false)} title="Preview connection error" message="Press retry to close this preview."/>:null}{splash?<SplashScreen minDuration={700} title="DIGVATION." subtitle="Design System" mark="D." onFinish={()=>setSplash(false)}/>:null}</div>} />
  </>;
}

type DemoRow = { id: number; name: string; status: string; amount: number; createdAt: string };
const rows: DemoRow[] = [
  { id: 1, name: 'Website Revamp', status: 'Active', amount: 12500000, createdAt: '2026-09-01' },
  { id: 2, name: 'Inventory App', status: 'Draft', amount: 8400000, createdAt: '2026-08-24' },
  { id: 3, name: 'Design System', status: 'Active', amount: 15600000, createdAt: '2026-09-04' },
];

function DisplayExamples() {
  const [page,setPage]=useState(3); const [sortBy,setSortBy]=useState('name'); const [dir,setDir]=useState<'asc'|'desc'>('asc'); const [query,setQuery]=useState('');
  return <>
    <DocSection id="badge-alert-note" title="Badge, Alert & InfoNote" description="Semantic feedback components share brand/success/warning/danger tokens." preview={<div className="stack"><div className="row-wrap"><Badge variant="primary" dot>Primary</Badge><Badge variant="success">Success</Badge><Badge variant="warning">Warning</Badge><Badge variant="danger">Danger</Badge><Badge variant="outline">Outline</Badge></div><Alert variant="success" title="Saved">Project configuration has been updated.</Alert><InfoNote variant="tip" title="Design token">Override semantic variables instead of editing component classes.</InfoNote></div>} code={`<Badge variant="success" dot>Active</Badge>\n<Alert variant="success" title="Saved">Configuration updated.</Alert>\n<InfoNote variant="tip">Use semantic tokens.</InfoNote>`}/>
    <DocSection id="progress-loading" title="Progress & Loading" description="Determinate/indeterminate progress plus inline loading indicator." preview={<div className="stack"><Progress value={68} label="Build progress"/><Progress label="Indeterminate"/><LoadingIndicator label="Loading data..."/></div>} code={`<Progress value={68} />\n<Progress />\n<LoadingIndicator label="Loading data..." />`}/>
    <DocSection id="skeleton" title="Skeleton" description="Composable skeleton primitive untuk loading layouts." preview={<div className="stack"><Skeleton width="45%" height={16}/><Skeleton width="75%" height={12}/><CardSkeleton/><TableSkeleton rows={2} cols={3}/><FormSkeleton fields={2}/></div>} code={`<Skeleton width="45%" height={16} />\n<CardSkeleton />\n<TableSkeleton rows={5} cols={4} />\n<FormSkeleton fields={4} />`}/>
    <DocSection id="card" title="Card" description="Card primitive dengan Header, Content dan Footer; radius dan border mengikuti theme tokens." preview={<Card className="demo-card"><CardHeader><strong>Project overview</strong></CardHeader><CardContent><p className="muted">Canonical surface for grouped content.</p><div className="metric">24 <span>components ready</span></div></CardContent><CardFooter><Button variant="outline" size="sm">View details</Button></CardFooter></Card>} code={`<Card>\n  <CardHeader>Project overview</CardHeader>\n  <CardContent>...</CardContent>\n  <CardFooter>...</CardFooter>\n</Card>`}/>
    <DocSection id="avatar" title="Avatar" description="Avatar baru untuk user/team surfaces, dengan initials fallback, image, size, dan presence status." props={['src','name','fallback','size','status']} preview={<div className="row-wrap"><Avatar name="Dimas Pratama" status="online"/><Avatar name="UI Team" size="lg" status="busy"/><Avatar fallback="DS" size="xl" status="away"/></div>} code={`<Avatar name="Dimas Pratama" status="online" />\n<Avatar fallback="DS" size="xl" />`}/>
    <DocSection id="empty-state" title="EmptyState" description="Consistent no-data/no-result state dengan optional icon dan action." preview={<EmptyState title="No components found" description="Try changing your search or create a new component." action={<Button size="sm">Create component</Button>}/>} code={`<EmptyState\n  title="No data"\n  description="There is nothing here yet."\n  action={<Button>Create</Button>}\n/>`}/>
    <DocSection id="data-table" title="DataTable" description="Behavior oldUi tetap hidup: search, filters, sorting, responsive mobile cards, formatting, action menu, pagination/page-size, row click, loading dan legacy transform alias." props={['columns','data','searchable','onSearchChange','onSort','pagination','actions','filters']} preview={<DataTable<DemoRow> data={rows.filter(r=>r.name.toLowerCase().includes(query.toLowerCase()))} columns={[{key:'name',label:'Project',sortable:true},{key:'status',label:'Status',render:(row)=> <Badge variant={row.status==='Active'?'success':'default'}>{row.status}</Badge>},{key:'amount',label:'Budget',type:'currency',align:'right'},{key:'createdAt',label:'Created',type:'date'}]} searchable searchValue={query} onSearchChange={setQuery} sortBy={sortBy} sortDirection={dir} onSort={(key,next)=>{setSortBy(key);setDir(next);}} pagination={{page:1,pageSize:10,total:3}} onPageChange={()=>{}} actions={[{label:'Open',onClick:()=>{}},{label:'Delete',variant:'danger',onClick:()=>{}}]}/>} code={`<DataTable\n  columns={columns}\n  data={rows}\n  searchable\n  searchValue={query}\n  onSearchChange={setQuery}\n  onSort={(key, direction) => ...}\n  pagination={{ page, pageSize, total }}\n  actions={actions}\n/>`}/>
    <DocSection id="tabs" title="Tabs" description="Tabs baru untuk section navigation, controlled/uncontrolled state, dan accessible tab roles." preview={<Tabs defaultValue="preview"><TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="usage">Usage</TabsTrigger><TabsTrigger value="api">API</TabsTrigger></TabsList><TabsContent value="preview" className="tab-panel">Live component preview.</TabsContent><TabsContent value="usage" className="tab-panel">Copy-paste usage examples.</TabsContent><TabsContent value="api" className="tab-panel">Props and behavior.</TabsContent></Tabs>} code={`<Tabs defaultValue="overview">\n  <TabsList>\n    <TabsTrigger value="overview">Overview</TabsTrigger>\n    <TabsTrigger value="settings">Settings</TabsTrigger>\n  </TabsList>\n  <TabsContent value="overview">...</TabsContent>\n</Tabs>`}/>
    <DocSection id="accordion" title="Accordion" description="Single/multiple accordion untuk FAQ, details dan compact documentation." preview={<Accordion><AccordionItem value="one" title="Does the oldUi behavior stay?">Yes. Canonical components keep the relevant oldUi behavior and remove duplicate implementations.</AccordionItem><AccordionItem value="two" title="How do I change project colors?">Override semantic CSS variables or use ThemeProvider.</AccordionItem></Accordion>} code={`<Accordion type="single">\n  <AccordionItem value="one" title="Question">Answer</AccordionItem>\n</Accordion>`}/>
    <DocSection id="breadcrumb" title="Breadcrumb" description="Composable breadcrumb primitives for application hierarchy." preview={<Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#">Projects</BreadcrumbLink><BreadcrumbSeparator/></BreadcrumbItem><BreadcrumbItem><BreadcrumbLink href="#">Digvation</BreadcrumbLink><BreadcrumbSeparator/></BreadcrumbItem><BreadcrumbItem><BreadcrumbLink href="#" active>Design System</BreadcrumbLink></BreadcrumbItem></BreadcrumbList></Breadcrumb>} code={`<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink><BreadcrumbSeparator /></BreadcrumbItem>\n    <BreadcrumbItem><BreadcrumbLink active>Settings</BreadcrumbLink></BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>`}/>
    <DocSection id="pagination" title="Pagination" description="Standalone pagination baru untuk views di luar DataTable." preview={<Pagination page={page} totalPages={12} onChange={setPage}/>} code={`<Pagination page={page} totalPages={12} onChange={setPage} />`}/>
    <DocSection id="utilities" title="Separator & Spinner" description="Small primitives untuk consistency pada layouts dan loading states." preview={<div className="stack"><div className="row-wrap"><span>Left</span><Separator orientation="vertical" className="h-6"/><span>Right</span></div><Separator/><div className="row-wrap"><Spinner size="sm"/><Spinner/><Spinner size="lg"/></div></div>} code={`<Separator />\n<Separator orientation="vertical" />\n<Spinner size="md" />`}/>
  </>;
}

function ActionExamples() {
  const [loading,setLoading]=useState(false);
  return <>
    <DocSection id="button" title="Button" description="Action primitive dengan variants, sizes, loading, icons, disabled state dan fullWidth." props={['variant','size','loading','leftIcon','rightIcon','fullWidth']} preview={<div className="row-wrap"><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="success">Success</Button><Button variant="danger">Danger</Button><Button loading={loading} onClick={()=>{setLoading(true);window.setTimeout(()=>setLoading(false),900);}}>Test loading</Button></div>} code={`<Button variant="primary">Save</Button>\n<Button variant="outline">Cancel</Button>\n<Button loading={saving}>Saving</Button>`}/>
    <DocSection id="export" title="ExportButton" description="Shared dropdown export behavior. onExport boleh menghasilkan Blob, Promise<Blob>, atau hanya memulai server-side processing." preview={<ExportButton filename="design-system-demo" onExport={()=>{}} onProcessing={()=>alert('Preview: export processing callback called.')}/>} code={`<ExportButton\n  filename="report"\n  onExport={(format) => api.export(format)}\n  onSuccess={(format) => toast(format + ' ready')}\n/>`}/>
  </>;
}

function ToastExample() {
  // Provider API is documented with static visual examples to avoid coupling the docs shell to internal state.
  return <DocSection id="toast" title="Toast" description="App-scoped ToastProvider + useToast queue. Toast visual memakai semantic status colors dan tidak bergantung pada app store lama." props={['ToastProvider','useToast','showToast','dismissToast','limit','defaultDuration']} preview={<div className="stack"><Alert variant="info" title="Usage">Wrap application root with ToastProvider, then call useToast() inside feature code.</Alert><div className="toast-mock"><span className="toast-dot success"/><div><strong>Saved successfully</strong><p>Example of the toast visual language.</p></div></div></div>} code={`function SaveButton() {\n  const { showToast } = useToast();\n  return <Button onClick={() => showToast({ title: 'Saved', variant: 'success' })}>Save</Button>;\n}\n\n<ToastProvider>\n  <App />\n</ToastProvider>`}/>;
}

export function App() {
  const [query,setQuery]=useState('');
  const [mode,setMode]=useState<ThemeMode>('light');
  const [radius,setRadius]=useState<ThemeRadius>('default');
  const [tokens,setTokens]=useState<ThemeTokens>({});
  const filtered=useMemo(()=>navItems.filter(item=>item.label.toLowerCase().includes(query.toLowerCase())||item.group.toLowerCase().includes(query.toLowerCase())),[query]);
  const groups=useMemo(()=>Array.from(new Set(filtered.map(item=>item.group))),[filtered]);
  return <ThemeProvider tokens={tokens} mode={mode} radius={radius}><ToastProvider><div className="docs-app"><aside className="sidebar"><a className="brand" href="#top"><span>D.</span><div><strong>Digvation</strong><small>Design System</small></div></a><input className="nav-search" placeholder="Search docs..." value={query} onChange={e=>setQuery(e.target.value)}/><nav>{groups.map(group=><div className="nav-group" key={group}><p>{group}</p>{filtered.filter(item=>item.group===group).map(item=><a key={item.id} href={`#${item.id}`}>{item.label}</a>)}</div>)}</nav><div className="sidebar-footer"><Badge variant="success" dot>v0.1.1</Badge><span>{navItems.length - 2} documented surfaces</span></div></aside><main><header id="top" className="hero"><div><Badge variant="primary">Reusable React UI</Badge><h1>One design system.<br/><span>Different project identities.</span></h1><p>Old Digvation UI behavior, cleaned into one canonical implementation per component, packaged for reuse with semantic theme tokens and a local documentation playground.</p><div className="hero-actions"><a className="hero-button" href="#getting-started">Get started</a><a className="hero-link" href="#theming">Customize theme →</a></div></div><div className="hero-card"><div className="hero-card-top"><span/><span/><span/></div><div className="hero-card-body"><Input label="Project" value="New Product" onChange={()=>{}}/><Select label="Status" value="active" onChange={()=>{}} options={[{label:'Active',value:'active'}]}/><Button fullWidth>Create project</Button></div></div></header>
        <section id="getting-started" className="guide-section"><p className="eyebrow">Guide</p><h2>Getting Started</h2><p className="lead">The repository is an npm workspace: the component package lives in <code>packages/ui</code>, while this documentation app lives in <code>apps/docs</code>.</p><div className="guide-grid"><Card><CardHeader><strong>Run documentation</strong></CardHeader><CardContent><Code>{`npm install\nnpm run dev`}</Code><p className="tiny-note">Open the Vite URL shown in the terminal (default port 4173).</p></CardContent></Card><Card><CardHeader><strong>Use in another project</strong></CardHeader><CardContent><Code>{`npm run pack:ui\n# then inside another project\nnpm install ../digvation-design-system/release/digvation-ui-0.1.1.tgz`}</Code></CardContent></Card></div><h3>Application setup</h3><Code>{`// main.tsx / app entry\nimport '@digvation/ui/styles.css';\nimport { Button, Input, Select } from '@digvation/ui';\n\nexport function Page() {\n  return <Button>Save</Button>;\n}`}</Code><Alert title="React requirement">The package treats React and React DOM as peer dependencies, so it uses the React version from your application.</Alert></section>
        <section id="theming" className="guide-section"><p className="eyebrow">Guide</p><h2>Theming</h2><p className="lead">Component classes use semantic variables. Change the project identity once—brand, surfaces, status colors, radius—and all components follow it.</p><ThemePlayground tokens={tokens} setTokens={setTokens} mode={mode} setMode={setMode} radius={radius} setRadius={setRadius}/><h3>ThemeProvider option</h3><Code>{`<ThemeProvider\n  mode="light"\n  radius="rounded"\n  tokens={{\n    brand: '#7c3aed',\n    focus: '#7c3aed',\n    background: '#faf8ff',\n    surface: '#ffffff',\n  }}\n>\n  <App />\n</ThemeProvider>`}</Code><InfoNote variant="info" title="Portal-safe theming">ThemeProvider applies variables to the document root so Dialog and Dropdown portals inherit the same project theme.</InfoNote></section>
        <ActionExamples/><FormExamples/><DisplayExamples/><ToastExample/><OverlayExamples/>
        <footer className="docs-footer"><strong>Digvation Design System</strong><span>Canonical components · themeable tokens · reusable package</span></footer>
      </main></div></ToastProvider></ThemeProvider>;
}
