import { useMemo, useRef, useState, type ReactNode } from 'react';
import {
  DAccordion,
  DAccordionItem,
  DAlert,
  DAvatar,
  DBadge,
  DBreadcrumb,
  DBreadcrumbItem,
  DBreadcrumbLink,
  DBreadcrumbList,
  DBreadcrumbSeparator,
  DButton,
  DCard,
  DCardContent,
  DCardFooter,
  DCardHeader,
  DCheckbox,
  DCombobox,
  DConfirmDialog,
  DConnectionError,
  DDropdown,
  DCurrencyInput,
  DDataTable,
  DDatePicker,
  DDateRangeFilter,
  DDecimalInput,
  DDialog,
  DEmptyState,
  DExportButton,
  DInfoNote,
  DInput,
  DLoadingIndicator,
  DLoadingOverlay,
  DNotificationPanel,
  DPagination,
  DProgress,
  DRadio,
  DRangeDatePicker,
  DSearchInput,
  DSelect,
  DSelectFilter,
  DSeparator,
  DSkeleton,
  DTableSkeleton,
  DCardSkeleton,
  DFormSkeleton,
  DSpinner,
  DSplashScreen,
  DStatusFilter,
  DTabs,
  DTabsContent,
  DTabsList,
  DTabsTrigger,
  DTextarea,
  DThemeProvider,
  DToastProvider,
  DToggle,
  DTooltip,
  defaultThemeTokens,
  type ThemeMode,
  type ThemeRadius,
  type ThemeTokens,
} from '@digvation/ui';

type NavItem = { id: string; label: string; group: string };
const navItems: NavItem[] = [
  { id: 'getting-started', label: 'Getting Started', group: 'Guide' },
  { id: 'theming', label: 'Theming', group: 'Guide' },
  { id: 'button', label: 'DButton', group: 'Actions' },
  { id: 'input', label: 'DInput', group: 'Forms' },
  { id: 'textarea', label: 'DTextarea', group: 'Forms' },
  { id: 'select', label: 'DSelect', group: 'Forms' },
  { id: 'combobox', label: 'DCombobox', group: 'Forms' },
  { id: 'search-input', label: 'DSearchInput', group: 'Forms' },
  { id: 'checkbox-radio-toggle', label: 'DCheckbox / DRadio / DToggle', group: 'Forms' },
  { id: 'date-picker', label: 'DDatePicker', group: 'Forms' },
  { id: 'range-date-picker', label: 'DRangeDatePicker', group: 'Forms' },
  { id: 'filters', label: 'Filters', group: 'Forms' },
  { id: 'badge-alert-note', label: 'DBadge / DAlert / DInfoNote', group: 'Feedback' },
  { id: 'toast', label: 'Toast', group: 'Feedback' },
  { id: 'progress-loading', label: 'DProgress / Loading', group: 'Feedback' },
  { id: 'skeleton', label: 'DSkeleton', group: 'Feedback' },
  { id: 'card', label: 'DCard', group: 'Display' },
  { id: 'avatar', label: 'DAvatar', group: 'Display' },
  { id: 'empty-state', label: 'DEmptyState', group: 'Display' },
  { id: 'data-table', label: 'DDataTable', group: 'Display' },
  { id: 'tabs', label: 'DTabs', group: 'Navigation' },
  { id: 'accordion', label: 'DAccordion', group: 'Navigation' },
  { id: 'breadcrumb', label: 'DBreadcrumb', group: 'Navigation' },
  { id: 'pagination', label: 'DPagination', group: 'Navigation' },
  { id: 'dropdown', label: 'DDropdown', group: 'Overlay' },
  { id: 'tooltip', label: 'DTooltip', group: 'Overlay' },
  { id: 'dialog', label: 'DDialog', group: 'Overlay' },
  { id: 'notification', label: 'DNotificationPanel', group: 'Overlay' },
  { id: 'export', label: 'DExportButton', group: 'Actions' },
  { id: 'utilities', label: 'DSeparator / DSpinner', group: 'Display' },
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
  const colors: Array<[keyof ThemeTokens, string]> = [['brand','Brand'],['brandHover','Brand hover'],['brandActive','Brand active'],['focus','Focus'],['background','Background'],['surface','Surface'],['surfaceMuted','Surface muted'],['text','Text'],['textMuted','Muted text'],['border','Border'],['info','Info'],['success','Success'],['warning','Warning'],['danger','Danger']];
  const css = `:root {\n${Object.entries(tokens).map(([key, value]) => {
    const map: Record<string,string> = { brand:'--color-brand', brandHover:'--color-brand-hover', brandActive:'--color-brand-active', focus:'--color-focus', background:'--color-background', surface:'--color-surface', surfaceMuted:'--color-surface-muted', text:'--color-text', textMuted:'--color-text-muted', border:'--color-border', info:'--color-info', success:'--color-success', warning:'--color-warning', danger:'--color-danger' };
    return map[key] ? `  ${map[key]}: ${value};` : '';
  }).filter(Boolean).join('\n')}\n}`;
  return <div className="theme-grid"><div className="theme-controls"><div className="field-row"><label>Mode<select value={mode} onChange={(e)=>setMode(e.target.value as ThemeMode)}><option value="light">Light</option><option value="dark">Dark</option></select></label><label>Radius<select value={radius} onChange={(e)=>setRadius(e.target.value as ThemeRadius)}><option value="compact">Compact</option><option value="default">Default</option><option value="rounded">Rounded</option></select></label></div><div className="color-grid">{colors.map(([key,label]) => <label key={key}><span>{label}</span><div className="color-control"><input type="color" value={String(tokens[key] ?? defaultThemeTokens[key]).startsWith('#') ? String(tokens[key] ?? defaultThemeTokens[key]) : '#2563eb'} onChange={(e)=>setTokens({...tokens,[key]:e.target.value})}/><input value={String(tokens[key] ?? '')} placeholder={String(defaultThemeTokens[key])} onChange={(e)=>setTokens({...tokens,[key]:e.target.value || undefined})}/></div></label>)}</div><div className="inline-actions"><DButton variant="outline" size="sm" onClick={()=>setTokens({})}>Reset colors</DButton></div></div><div><Code>{css}</Code><p className="tiny-note">Untuk nilai HSL bawaan, color picker hanya dipakai saat Anda memilih warna baru. Input teks menerima format CSS apa pun.</p></div></div>;
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
    <DocSection id="input" title="DInput" description="Canonical input dengan behavior oldUi: label, hint/error, clear, password visibility, number handling, currency/percentage formatting, adornment, dan callback value + event." props={['label','format','clearable','size','onChange(value,event)','onNativeChange','prefix','suffix']} preview={<div className="preview-grid"><DInput label="Project name" value={text} onChange={setText} hint="Value callback tetap compatible dengan oldUi."/><DCurrencyInput label="Budget" value={currency} onValueChange={setCurrency}/><DDecimalInput label="Quantity" value={decimal} onValueChange={setDecimal}/><DInput label="Password" type="password" defaultValue="secret123"/></div>} code={`const [value, setValue] = useState('');\n\n<DInput\n  label="Project name"\n  value={value}\n  clearable\n  onChange={(value, event) => setValue(value)}\n/>\n\n<DCurrencyInput value={budget} onValueChange={setBudget} />`} />
    <DocSection id="textarea" title="DTextarea" description="DTextarea dengan contract value callback, native callback, clear button, error/hint, dan controlled state." props={['label','value','onChange(value,event)','clearable','error','hint']} preview={<DTextarea label="Description" value={area} onChange={setArea} hint="Bisa di-clear tanpa menulis handler tambahan."/>} code={`<DTextarea\n  label="Description"\n  value={description}\n  onChange={(value) => setDescription(value)}\n  clearable\n/>`} />
    <DocSection id="select" title="DSelect" description="DSelect single-source dengan searchable, async fetchOptions, controlled/uncontrolled value, keyboard navigation, loading, clear, dan selected option resolution." props={['options','value','onChange','searchable','fetchOptions','clearable','loading']} preview={<DSelect label="Status" value={select} onChange={setSelect} searchable options={[{label:'Active',value:'active'},{label:'Draft',value:'draft'},{label:'Archived',value:'archived'}]}/>} code={`<DSelect\n  label="Status"\n  value={status}\n  onChange={setStatus}\n  searchable\n  options={[\n    { label: 'Active', value: 'active' },\n    { label: 'Draft', value: 'draft' },\n  ]}\n/>`} />
    <DocSection id="combobox" title="DCombobox" description="Autocomplete lama dalam surface canonical: filtering, debounce async, allow-create, custom render option, clear, dan selected resolution." props={['options','fetchOptions','allowCreate','onCreateOption','renderOption','debounceMs']} preview={<DCombobox label="Technology" value={combo} onChange={setCombo} allowCreate options={[{label:'React',value:'react'},{label:'Next.js',value:'next'},{label:'TypeScript',value:'ts'}]}/>} code={`<DCombobox\n  label="Technology"\n  value={technology}\n  onChange={setTechnology}\n  allowCreate\n  onCreateOption={(name) => createTechnology(name)}\n  options={options}\n/>`} />
    <DocSection id="search-input" title="DSearchInput" description="Search field dengan local state + debounce dan immediate clear seperti BaseSearchInput lama." props={['value','onChange','debounceMs','placeholder','expandable']} preview={<DSearchInput value={search} onChange={setSearch} placeholder="Search components..."/>} code={`<DSearchInput\n  value={query}\n  onChange={setQuery}\n  debounceMs={300}\n  placeholder="Search..."\n/>`} />
    <DocSection id="checkbox-radio-toggle" title="DCheckbox, DRadio & DToggle" description="Primitive pilihan yang tetap controlled-friendly dan memakai semantic brand token." preview={<div className="row-wrap"><label className="control-label"><DCheckbox checked={checked} onChange={(e)=>setChecked(e.target.checked)}/> DCheckbox</label><label className="control-label"><DRadio name="demo" checked={radio==='a'} onChange={()=>setRadio('a')}/> Option A</label><label className="control-label"><DRadio name="demo" checked={radio==='b'} onChange={()=>setRadio('b')}/> Option B</label><DToggle label="Notifications" checked={toggle} onChange={setToggle}/></div>} code={`<DCheckbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />\n<DToggle label="Notifications" checked={enabled} onChange={setEnabled} />`} />
    <DocSection id="date-picker" title="DDatePicker" description="Date picker dengan dropdown shared engine, size, clear, min/max, hint/error, dan controlled string value." props={['value','onChange','minDate','maxDate','clearable','size']} preview={<DDatePicker label="Deployment date" value={date} onChange={setDate}/>} code={`<DDatePicker label="Deployment date" value={date} onChange={setDate} />`} />
    <DocSection id="range-date-picker" title="DRangeDatePicker" description="Range calendar canonical dengan behavior lama dan quick-range selection." props={['value','onChange','clearable','size']} preview={<DRangeDatePicker label="Report period" value={range} onChange={(next)=>setRange({start: next.start ?? '', end: next.end ?? ''})}/>} code={`<DRangeDatePicker\n  label="Report period"\n  value={range}\n  onChange={setRange}\n/>`} />
    <DocSection id="filters" title="Filter helpers" description="Komponen filter reusable untuk toolbar dan data views." preview={<div className="stack"><DSelectFilter label="Category" value={filter} onChange={setFilter} options={[{label:'All',value:'all'},{label:'Product',value:'product'},{label:'Service',value:'service'}]}/><DStatusFilter label="Status" value={status} onChange={setStatus} options={[{label:'Active',value:'active',count:12},{label:'Draft',value:'draft',count:4}]}/><DDateRangeFilter from={from} to={to} onFromChange={setFrom} onToChange={setTo} onClear={()=>{setFrom('');setTo('');}}/></div>} code={`<DSelectFilter label="Category" options={options} value={category} onChange={setCategory} />\n<DStatusFilter options={statusOptions} value={status} onChange={setStatus} />`} />
  </>;
}

function OverlayExamples() {
  const [dialog,setDialog]=useState(false); const [confirm,setConfirm]=useState(false); const [panel,setPanel]=useState(false); const notificationAnchorRef=useRef<HTMLButtonElement>(null); const [overlay,setOverlay]=useState(false); const [error,setError]=useState(false); const [splash,setSplash]=useState(false);
  const [notifications,setNotifications]=useState([{id:'1',title:'Build complete',message:'Design system package is ready.',type:'success' as const,read:false,createdAt:'Just now'},{id:'2',title:'Theme updated',message:'Brand token changed to the current project color.',type:'info' as const,read:true,createdAt:'5m ago'}]);
  return <>
    <DocSection id="dropdown" title="DDropdown" description="Shared positioning engine used by DSelect, DCombobox, DDatePicker, DDataTable action menus and DExportButton. Supports portal positioning, controlled state, placement, matchWidth, Escape/outside close and close-on-item-click." props={['trigger','placement','matchWidth','open','onOpenChange','closeOnItemClick']} preview={<DDropdown closeOnItemClick trigger={({open}) => <DButton variant="outline">Menu {open ? 'Open' : 'Closed'}</DButton>}><div className="menu-demo"><button type="button">Edit project</button><button type="button">Duplicate</button><button type="button" className="danger-item">Delete</button></div></DDropdown>} code={`<DDropdown
  placement="bottom-start"
  closeOnItemClick
  trigger={({ open }) => <DButton variant="outline">Menu</DButton>}
>
  <button>Edit</button>
  <button>Delete</button>
</DDropdown>`}/>
    <DocSection id="tooltip" title="DTooltip" description="Accessible hover/focus helper dengan semantic tooltip color dan empat placement." preview={<div className="row-wrap"><DTooltip content="Helpful contextual information"><DButton variant="outline">Hover or focus me</DButton></DTooltip><DTooltip content="Right placement" placement="right"><DBadge>Info</DBadge></DTooltip></div>} code={`<DTooltip content="Helpful information" placement="top">\n  <DButton variant="outline">Hover me</DButton>\n</DTooltip>`}/>
    <DocSection id="dialog" title="DDialog & DConfirmDialog" description="DDialog mempertahankan oldUi mobile bottom-sheet + desktop modal, body lock, Escape, overlay close, focus containment, footer, dan size." preview={<div className="row-wrap"><DButton onClick={()=>setDialog(true)}>Open dialog</DButton><DButton variant="danger" onClick={()=>setConfirm(true)}>Delete item</DButton><DDialog open={dialog} onClose={()=>setDialog(false)} title="Project settings" description="Example reusable dialog." footer={<div className="row-wrap right"><DButton variant="outline" onClick={()=>setDialog(false)}>Cancel</DButton><DButton onClick={()=>setDialog(false)}>Save</DButton></div>}><div className="stack"><DInput label="Project" value="Digvation" onChange={()=>{}}/><DSelect label="Environment" value="production" onChange={()=>{}} options={[{label:'Production',value:'production'},{label:'Staging',value:'staging'}]}/></div></DDialog><DConfirmDialog open={confirm} onClose={()=>setConfirm(false)} onConfirm={()=>setConfirm(false)} title="Delete component?" message="This preview demonstrates destructive confirmation."/></div>} code={`<DDialog open={open} onClose={() => setOpen(false)} title="Project settings" footer={...}>\n  <YourForm />\n</DDialog>\n\n<DConfirmDialog open={confirm} onClose={...} onConfirm={...} />`} />
    <DocSection id="notification" title="DNotificationPanel" description="DDropdown notification panel dengan unread state, mark-read, mark-all, dismiss, dan custom labels." preview={<div className="notification-demo"><DButton ref={notificationAnchorRef} variant="outline" onClick={()=>setPanel(!panel)}>Notifications ({notifications.filter(n=>!n.read).length})</DButton><DNotificationPanel anchorRef={notificationAnchorRef} open={panel} onClose={()=>setPanel(false)} notifications={notifications} onMarkRead={(id)=>setNotifications((items)=>items.map(x=>x.id===id?{...x,read:true}:x))} onMarkAllRead={()=>setNotifications((items)=>items.map(x=>({...x,read:true})))} onDismiss={(id)=>setNotifications((items)=>items.filter(x=>x.id!==id))}/></div>} code={`<DNotificationPanel\n  anchorRef={notificationButtonRef}\n  open={open}\n  notifications={notifications}\n  onMarkRead={markRead}\n  onMarkAllRead={markAllRead}\n  onDismiss={dismiss}\n  onClose={() => setOpen(false)}\n/>`} />
    <DocSection id="full-screen" title="Full-screen states" description="DConnectionError, DLoadingOverlay dan DSplashScreen tersedia untuk application-level states. Preview dijalankan on-demand karena semuanya menggunakan fixed overlay." preview={<div className="row-wrap"><DButton variant="outline" onClick={()=>setOverlay(true)}>Loading overlay</DButton><DButton variant="outline" onClick={()=>setError(true)}>Connection error</DButton><DButton variant="outline" onClick={()=>setSplash(true)}>Splash screen</DButton>{overlay?<><DLoadingOverlay label="Loading preview..."/><button className="overlay-exit" onClick={()=>setOverlay(false)}>Close preview</button></>:null}{error?<DConnectionError onRetry={()=>setError(false)} title="Preview connection error" message="Press retry to close this preview."/>:null}{splash?<DSplashScreen minDuration={700} title="DIGVATION." subtitle="Design System" mark="D." onFinish={()=>setSplash(false)}/>:null}</div>} />
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
    <DocSection id="badge-alert-note" title="DBadge, DAlert & DInfoNote" description="Semantic feedback components share brand/success/warning/danger tokens." preview={<div className="stack"><div className="row-wrap"><DBadge variant="primary" dot>Primary</DBadge><DBadge variant="secondary">Secondary</DBadge><DBadge variant="info">Info</DBadge><DBadge variant="success">Success</DBadge><DBadge variant="warning">Warning</DBadge><DBadge variant="danger">Danger</DBadge><DBadge variant="outline">Outline</DBadge></div><DAlert variant="neutral" title="Neutral">General application message.</DAlert><DAlert variant="success" title="Saved">Project configuration has been updated.</DAlert><DInfoNote variant="tip" title="Design token">Override semantic variables instead of editing component classes.</DInfoNote></div>} code={`<DBadge variant="success" dot>Active</DBadge>\n<DAlert variant="success" title="Saved">Configuration updated.</DAlert>\n<DInfoNote variant="tip">Use semantic tokens.</DInfoNote>`}/>
    <DocSection id="progress-loading" title="DProgress & Loading" description="Determinate/indeterminate progress plus inline loading indicator." preview={<div className="stack"><DProgress value={68} label="Build progress"/><DProgress label="Indeterminate"/><DLoadingIndicator label="Loading data..."/></div>} code={`<DProgress value={68} />\n<DProgress />\n<DLoadingIndicator label="Loading data..." />`}/>
    <DocSection id="skeleton" title="DSkeleton" description="Composable skeleton primitive untuk loading layouts." preview={<div className="stack"><DSkeleton width="45%" height={16}/><DSkeleton width="75%" height={12}/><DCardSkeleton/><DTableSkeleton rows={2} cols={3}/><DFormSkeleton fields={2}/></div>} code={`<DSkeleton width="45%" height={16} />\n<DCardSkeleton />\n<DTableSkeleton rows={5} cols={4} />\n<DFormSkeleton fields={4} />`}/>
    <DocSection id="card" title="DCard" description="DCard primitive dengan Header, Content dan Footer; radius dan border mengikuti theme tokens." preview={<DCard className="demo-card"><DCardHeader><strong>Project overview</strong></DCardHeader><DCardContent><p className="muted">Canonical surface for grouped content.</p><div className="metric">24 <span>components ready</span></div></DCardContent><DCardFooter><DButton variant="outline" size="sm">View details</DButton></DCardFooter></DCard>} code={`<DCard>\n  <DCardHeader>Project overview</DCardHeader>\n  <DCardContent>...</DCardContent>\n  <DCardFooter>...</DCardFooter>\n</DCard>`}/>
    <DocSection id="avatar" title="DAvatar" description="DAvatar baru untuk user/team surfaces, dengan initials fallback, image, size, dan presence status." props={['src','name','fallback','size','status']} preview={<div className="row-wrap"><DAvatar name="Dimas Pratama" status="online"/><DAvatar name="UI Team" size="lg" status="busy"/><DAvatar fallback="DS" size="xl" status="away"/></div>} code={`<DAvatar name="Dimas Pratama" status="online" />\n<DAvatar fallback="DS" size="xl" />`}/>
    <DocSection id="empty-state" title="DEmptyState" description="Consistent no-data/no-result state dengan optional icon dan action." preview={<DEmptyState title="No components found" description="Try changing your search or create a new component." action={<DButton size="sm">Create component</DButton>}/>} code={`<DEmptyState\n  title="No data"\n  description="There is nothing here yet."\n  action={<DButton>Create</DButton>}\n/>`}/>
    <DocSection id="data-table" title="DDataTable" description="Behavior oldUi tetap hidup: search, filters, sorting, responsive mobile cards, formatting, action menu, pagination/page-size, row click, loading dan legacy transform alias." props={['columns','data','searchable','onSearchChange','onSort','pagination','actions','filters']} preview={<DDataTable<DemoRow> data={rows.filter(r=>r.name.toLowerCase().includes(query.toLowerCase()))} columns={[{key:'name',label:'Project',sortable:true},{key:'status',label:'Status',render:(row)=> <DBadge variant={row.status==='Active'?'success':'default'}>{row.status}</DBadge>},{key:'amount',label:'Budget',type:'currency',align:'right'},{key:'createdAt',label:'Created',type:'date'}]} searchable searchValue={query} onSearchChange={setQuery} sortBy={sortBy} sortDirection={dir} onSort={(key,next)=>{setSortBy(key);setDir(next);}} pagination={{page:1,pageSize:10,total:3}} onPageChange={()=>{}} actions={[{label:'Open',onClick:()=>{}},{label:'Delete',variant:'danger',onClick:()=>{}}]}/>} code={`<DDataTable\n  columns={columns}\n  data={rows}\n  searchable\n  searchValue={query}\n  onSearchChange={setQuery}\n  onSort={(key, direction) => ...}\n  pagination={{ page, pageSize, total }}\n  actions={actions}\n/>`}/>
    <DocSection id="tabs" title="DTabs" description="DTabs baru untuk section navigation, controlled/uncontrolled state, dan accessible tab roles." preview={<DTabs defaultValue="preview"><DTabsList><DTabsTrigger value="preview">Preview</DTabsTrigger><DTabsTrigger value="usage">Usage</DTabsTrigger><DTabsTrigger value="api">API</DTabsTrigger></DTabsList><DTabsContent value="preview" className="tab-panel">Live component preview.</DTabsContent><DTabsContent value="usage" className="tab-panel">Copy-paste usage examples.</DTabsContent><DTabsContent value="api" className="tab-panel">Props and behavior.</DTabsContent></DTabs>} code={`<DTabs defaultValue="overview">\n  <DTabsList>\n    <DTabsTrigger value="overview">Overview</DTabsTrigger>\n    <DTabsTrigger value="settings">Settings</DTabsTrigger>\n  </DTabsList>\n  <DTabsContent value="overview">...</DTabsContent>\n</DTabs>`}/>
    <DocSection id="accordion" title="DAccordion" description="Single/multiple accordion untuk FAQ, details dan compact documentation." preview={<DAccordion><DAccordionItem value="one" title="Does the oldUi behavior stay?">Yes. Canonical components keep the relevant oldUi behavior and remove duplicate implementations.</DAccordionItem><DAccordionItem value="two" title="How do I change project colors?">Override semantic CSS variables or use DThemeProvider.</DAccordionItem></DAccordion>} code={`<DAccordion type="single">\n  <DAccordionItem value="one" title="Question">Answer</DAccordionItem>\n</DAccordion>`}/>
    <DocSection id="breadcrumb" title="DBreadcrumb" description="Composable breadcrumb primitives for application hierarchy." preview={<DBreadcrumb><DBreadcrumbList><DBreadcrumbItem><DBreadcrumbLink href="#">Projects</DBreadcrumbLink><DBreadcrumbSeparator/></DBreadcrumbItem><DBreadcrumbItem><DBreadcrumbLink href="#">Digvation</DBreadcrumbLink><DBreadcrumbSeparator/></DBreadcrumbItem><DBreadcrumbItem><DBreadcrumbLink href="#" active>Design System</DBreadcrumbLink></DBreadcrumbItem></DBreadcrumbList></DBreadcrumb>} code={`<DBreadcrumb>\n  <DBreadcrumbList>\n    <DBreadcrumbItem><DBreadcrumbLink href="/">Home</DBreadcrumbLink><DBreadcrumbSeparator /></DBreadcrumbItem>\n    <DBreadcrumbItem><DBreadcrumbLink active>Settings</DBreadcrumbLink></DBreadcrumbItem>\n  </DBreadcrumbList>\n</DBreadcrumb>`}/>
    <DocSection id="pagination" title="DPagination" description="Standalone pagination baru untuk views di luar DDataTable." preview={<DPagination page={page} totalPages={12} onChange={setPage}/>} code={`<DPagination page={page} totalPages={12} onChange={setPage} />`}/>
    <DocSection id="utilities" title="DSeparator & DSpinner" description="Small primitives untuk consistency pada layouts dan loading states." preview={<div className="stack"><div className="row-wrap"><span>Left</span><DSeparator orientation="vertical" className="h-6"/><span>Right</span></div><DSeparator/><div className="row-wrap"><DSpinner size="sm"/><DSpinner/><DSpinner size="lg"/></div></div>} code={`<DSeparator />\n<DSeparator orientation="vertical" />\n<DSpinner size="md" />`}/>
  </>;
}

function ActionExamples() {
  const [loading,setLoading]=useState(false);
  return <>
    <DocSection id="button" title="DButton" description="Action primitive dengan variants, sizes, loading, icons, disabled state dan fullWidth." props={['variant','size','loading','leftIcon','rightIcon','fullWidth']} preview={<div className="row-wrap"><DButton>Primary</DButton><DButton variant="secondary">Secondary</DButton><DButton variant="outline">Outline</DButton><DButton variant="ghost">Ghost</DButton><DButton variant="soft">Soft</DButton><DButton variant="info">Info</DButton><DButton variant="success">Success</DButton><DButton variant="warning">Warning</DButton><DButton variant="danger">Danger</DButton><DButton variant="link">Link</DButton><DButton loading={loading} onClick={()=>{setLoading(true);window.setTimeout(()=>setLoading(false),900);}}>Test loading</DButton></div>} code={`<DButton variant="primary">Save</DButton>\n<DButton variant="outline">Cancel</DButton>\n<DButton loading={saving}>Saving</DButton>`}/>
    <DocSection id="export" title="DExportButton" description="Shared dropdown export behavior. onExport boleh menghasilkan Blob, Promise<Blob>, atau hanya memulai server-side processing." preview={<DExportButton filename="design-system-demo" onExport={()=>{}} onProcessing={()=>alert('Preview: export processing callback called.')}/>} code={`<DExportButton\n  filename="report"\n  onExport={(format) => api.export(format)}\n  onSuccess={(format) => toast(format + ' ready')}\n/>`}/>
  </>;
}

function ToastExample() {
  // Provider API is documented with static visual examples to avoid coupling the docs shell to internal state.
  return <DocSection id="toast" title="Toast" description="App-scoped DToastProvider + useToast queue. Toast visual memakai semantic status colors dan tidak bergantung pada app store lama." props={['DToastProvider','useToast','showToast','dismissToast','limit','defaultDuration']} preview={<div className="stack"><DAlert variant="info" title="Usage">Wrap application root with DToastProvider, then call useToast() inside feature code.</DAlert><div className="toast-mock"><span className="toast-dot success"/><div><strong>Saved successfully</strong><p>Example of the toast visual language.</p></div></div></div>} code={`function SaveButton() {\n  const { showToast } = useToast();\n  return <DButton onClick={() => showToast({ title: 'Saved', variant: 'success' })}>Save</DButton>;\n}\n\n<DToastProvider>\n  <App />\n</DToastProvider>`}/>;
}

export function App() {
  const [query,setQuery]=useState('');
  const [mode,setMode]=useState<ThemeMode>('light');
  const [radius,setRadius]=useState<ThemeRadius>('default');
  const [tokens,setTokens]=useState<ThemeTokens>({});
  const filtered=useMemo(()=>navItems.filter(item=>item.label.toLowerCase().includes(query.toLowerCase())||item.group.toLowerCase().includes(query.toLowerCase())),[query]);
  const groups=useMemo(()=>Array.from(new Set(filtered.map(item=>item.group))),[filtered]);
  return <DThemeProvider tokens={tokens} mode={mode} radius={radius}><DToastProvider><div className="docs-app"><aside className="sidebar"><a className="brand" href="#top"><span>D.</span><div><strong>Digvation</strong><small>Design System</small></div></a><input className="nav-search" placeholder="Search docs..." value={query} onChange={e=>setQuery(e.target.value)}/><nav>{groups.map(group=><div className="nav-group" key={group}><p>{group}</p>{filtered.filter(item=>item.group===group).map(item=><a key={item.id} href={`#${item.id}`}>{item.label}</a>)}</div>)}</nav><div className="sidebar-footer"><DBadge variant="success" dot>v0.2.0</DBadge><span>{navItems.length - 2} documented surfaces</span></div></aside><main><header id="top" className="hero"><div><DBadge variant="primary">Reusable React UI</DBadge><h1>One design system.<br/><span>Different project identities.</span></h1><p>Old Digvation UI behavior, cleaned into one canonical implementation per component, packaged for reuse with semantic theme tokens and a local documentation playground.</p><div className="hero-actions"><a className="hero-button" href="#getting-started">Get started</a><a className="hero-link" href="#theming">Customize theme →</a></div></div><div className="hero-card"><div className="hero-card-top"><span/><span/><span/></div><div className="hero-card-body"><DInput label="Project" value="New Product" onChange={()=>{}}/><DSelect label="Status" value="active" onChange={()=>{}} options={[{label:'Active',value:'active'}]}/><DButton fullWidth>Create project</DButton></div></div></header>
        <section id="getting-started" className="guide-section"><p className="eyebrow">Guide</p><h2>Getting Started</h2><p className="lead">The repository is an npm workspace: the component package lives in <code>packages/ui</code>, while this documentation app lives in <code>apps/docs</code>.</p><div className="guide-grid"><DCard><DCardHeader><strong>Run documentation</strong></DCardHeader><DCardContent><Code>{`npm install\nnpm run dev`}</Code><p className="tiny-note">Open the Vite URL shown in the terminal (default port 4173).</p></DCardContent></DCard><DCard><DCardHeader><strong>Use in another project</strong></DCardHeader><DCardContent><Code>{`npm run pack:ui\n# then inside another project\nnpm install ../digvation-design-system/release/digvation-ui-0.2.0.tgz`}</Code></DCardContent></DCard></div><h3>Application setup</h3><Code>{`// main.tsx / app entry\nimport '@digvation/ui/styles.css';\nimport { DButton, DInput, DSelect } from '@digvation/ui';\n\nexport function Page() {\n  return <DButton>Save</DButton>;\n}`}</Code><DAlert title="React requirement">The package treats React and React DOM as peer dependencies, so it uses the React version from your application.</DAlert></section>
        <section id="theming" className="guide-section"><p className="eyebrow">Guide</p><h2>Theming</h2><p className="lead">Component classes use semantic variables. Change the project identity once—brand, surfaces, status colors, radius—and all components follow it.</p><ThemePlayground tokens={tokens} setTokens={setTokens} mode={mode} setMode={setMode} radius={radius} setRadius={setRadius}/><h3>DThemeProvider option</h3><Code>{`<DThemeProvider\n  mode="light"\n  radius="rounded"\n  tokens={{\n    brand: '#7c3aed',\n    focus: '#7c3aed',\n    background: '#faf8ff',\n    surface: '#ffffff',\n  }}\n>\n  <App />\n</DThemeProvider>`}</Code><DInfoNote variant="info" title="Portal-safe theming">DThemeProvider applies variables to the document root so DDialog and DDropdown portals inherit the same project theme.</DInfoNote></section>
        <ActionExamples/><FormExamples/><DisplayExamples/><ToastExample/><OverlayExamples/>
        <footer className="docs-footer"><strong>Digvation Design System</strong><span>Canonical components · themeable tokens · reusable package</span></footer>
      </main></div></DToastProvider></DThemeProvider>;
}
