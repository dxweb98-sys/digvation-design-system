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
  DCurrencyInput,
  DDataTable,
  DDatePicker,
  DDateRangeFilter,
  DDecimalInput,
  DDialog,
  DDropdown,
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
  DTimePicker,
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
import { ComponentDocsTabs } from './component-lab';
import { ValidationLocalizationExamples } from './validation-localization-examples';

type NavItem = { id: string; label: string; group: string };

const navItems: NavItem[] = [
  { id: 'getting-started', label: 'Getting Started', group: 'Guide' },
  { id: 'theming', label: 'Theming', group: 'Guide' },
  { id: 'validation', label: 'Form Validation', group: 'Guide' },
  { id: 'localization', label: 'Localization', group: 'Guide' },
  { id: 'button', label: 'DButton', group: 'Actions' },
  { id: 'input', label: 'DInput', group: 'Forms' },
  { id: 'textarea', label: 'DTextarea', group: 'Forms' },
  { id: 'select', label: 'DSelect', group: 'Forms' },
  { id: 'combobox', label: 'DCombobox', group: 'Forms' },
  { id: 'search-input', label: 'DSearchInput', group: 'Forms' },
  { id: 'checkbox-radio-toggle', label: 'DCheckbox / DRadio / DToggle', group: 'Forms' },
  { id: 'date-picker', label: 'DDatePicker', group: 'Forms' },
  { id: 'time-picker', label: 'DTimePicker', group: 'Forms' },
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
      <DButton
        className="copy-button"
        variant="ghost"
        size="sm"
        onClick={() => {
          void navigator.clipboard?.writeText(children);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        }}
      >
        {copied ? 'Copied' : 'Copy'}
      </DButton>
      <pre><code>{children}</code></pre>
    </div>
  );
}

function inferApiName(title: string) {
  const match = title.match(/^D([A-Za-z0-9]+)/);
  return match ? `${match[1]}Props` : undefined;
}

function DocSection({
  id,
  title,
  description,
  preview,
  code,
  props,
  apiName,
}: {
  id: string;
  title: string;
  description: string;
  preview: ReactNode;
  code?: string;
  props?: string[];
  apiName?: string;
}) {
  return (
    <section id={id} className="doc-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Component</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {props?.length ? <div className="prop-chips">{props.map((prop) => <span key={prop}>{prop}</span>)}</div> : null}
      </div>
      <ComponentDocsTabs interfaceName={apiName ?? inferApiName(title)} preview={preview} code={code} />
    </section>
  );
}

function ThemePlayground({ tokens, setTokens, mode, setMode, radius, setRadius }: { tokens: ThemeTokens; setTokens: (next: ThemeTokens) => void; mode: ThemeMode; setMode: (next: ThemeMode) => void; radius: ThemeRadius; setRadius: (next: ThemeRadius) => void }) {
  const colors: Array<[keyof ThemeTokens, string]> = [
    ['brand','Brand'],['brandHover','Brand hover'],['brandActive','Brand active'],['focus','Focus'],
    ['background','Background'],['surface','Surface'],['surfaceMuted','Surface muted'],['text','Text'],
    ['textMuted','Muted text'],['border','Border'],['info','Info'],['success','Success'],['warning','Warning'],['danger','Danger'],
  ];
  const css = `:root {\n${Object.entries(tokens).map(([key, value]) => {
    const map: Record<string,string> = { brand:'--color-brand', brandHover:'--color-brand-hover', brandActive:'--color-brand-active', focus:'--color-focus', background:'--color-background', surface:'--color-surface', surfaceMuted:'--color-surface-muted', text:'--color-text', textMuted:'--color-text-muted', border:'--color-border', info:'--color-info', success:'--color-success', warning:'--color-warning', danger:'--color-danger' };
    return map[key] ? `  ${map[key]}: ${value};` : '';
  }).filter(Boolean).join('\n')}\n}`;

  return (
    <div className="theme-grid">
      <div className="theme-controls">
        <div className="field-row">
          <DSelect
            label="Mode"
            value={mode}
            clearable={false}
            options={[{ label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }]}
            onChange={(value) => setMode((value ?? 'light') as ThemeMode)}
          />
          <DSelect
            label="Radius"
            value={radius}
            clearable={false}
            options={[{ label: 'Compact', value: 'compact' }, { label: 'Default', value: 'default' }, { label: 'Rounded', value: 'rounded' }]}
            onChange={(value) => setRadius((value ?? 'default') as ThemeRadius)}
          />
        </div>
        <div className="color-grid">
          {colors.map(([key,label]) => {
            const resolved = String(tokens[key] ?? defaultThemeTokens[key] ?? '');
            const pickerValue = resolved.startsWith('#') ? resolved : '#2563eb';
            return (
              <div className="theme-token-field" key={key}>
                <span className="theme-token-label">{label}</span>
                <div className="color-control">
                  <input
                    className="native-color-picker"
                    aria-label={`${label} color picker`}
                    type="color"
                    value={pickerValue}
                    onChange={(event)=>setTokens({...tokens,[key]:event.target.value})}
                  />
                  <DInput
                    size="sm"
                    clearable={false}
                    value={String(tokens[key] ?? '')}
                    placeholder={String(defaultThemeTokens[key])}
                    containerClassName="theme-token-input"
                    onChange={(value)=>setTokens({...tokens,[key]:value || undefined})}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="inline-actions"><DButton variant="outline" size="sm" onClick={()=>setTokens({})}>Reset colors</DButton></div>
      </div>
      <div><Code>{css}</Code><p className="tiny-note">Documentation dogfoods @digvation/ui. Native color input tetap dipakai hanya karena belum ada DColorPicker.</p></div>
    </div>
  );
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
  const [dateHour,setDateHour]=useState('2026-09-04T09:00');
  const [dateTime,setDateTime]=useState('2026-09-04T09:15');
  const [time,setTime]=useState('09:15');
  const [range,setRange]=useState({start:'2026-09-01',end:'2026-09-30'});
  const [status,setStatus]=useState('active');
  const [filter,setFilter]=useState<string|number|null>('all');
  const [from,setFrom]=useState('2026-09-01');
  const [to,setTo]=useState('2026-09-30');
  return <>
    <DocSection id="input" title="DInput" description="Canonical input dengan label, hint/error, clear, password visibility, number handling, currency/percentage formatting, adornment, dan callback value + event." props={['label','format','clearable','size','onChange(value,event)','onNativeChange','prefix','suffix']} preview={<div className="preview-grid"><DInput label="Project name" value={text} onChange={setText}/><DCurrencyInput label="Budget" value={currency} onValueChange={setCurrency}/><DDecimalInput label="Quantity" value={decimal} onValueChange={setDecimal}/><DInput label="Password" type="password" defaultValue="secret123"/></div>} code={`const [value, setValue] = useState('');\n\n<DInput\n  label="Project name"\n  value={value}\n  clearable\n  onChange={(value) => setValue(value)}\n/>`} />
    <DocSection id="textarea" title="DTextarea" description="Textarea dengan value callback, native callback, clear button, error/hint, dan controlled state." props={['label','value','onChange(value,event)','clearable','error','hint']} preview={<DTextarea label="Description" value={area} onChange={setArea} hint="Bisa di-clear tanpa handler tambahan."/>} code={`<DTextarea label="Description" value={description} onChange={setDescription} clearable />`} />
    <DocSection id="select" title="DSelect" description="Static/simple select dengan optional search, async compatibility, keyboard navigation, loading, clear, dan selected option resolution." props={['options','value','onChange','searchable','fetchOptions','clearable','loading']} preview={<DSelect label="Status" value={select} onChange={setSelect} searchable options={[{label:'Active',value:'active'},{label:'Draft',value:'draft'},{label:'Archived',value:'archived'}]}/>} code={`<DSelect label="Status" value={status} onChange={setStatus} options={options} />`} />
    <DocSection id="combobox" title="DCombobox" description="Autocomplete/searchable choice dengan debounce async, allow-create, custom render option, clear, selected resolution dan refetch capability." props={['options','fetchOptions','allowCreate','onCreateOption','renderOption','debounceMs','refetchKey']} preview={<DCombobox label="Technology" value={combo} onChange={setCombo} allowCreate options={[{label:'React',value:'react'},{label:'Next.js',value:'next'},{label:'TypeScript',value:'ts'}]}/>} code={`<DCombobox value={technology} onChange={setTechnology} fetchOptions={fetchTechnology} refetchKey={projectId} />`} />
    <DocSection id="search-input" title="DSearchInput" description="Search field dengan local state + debounce, desktop expand/collapse, dan immediate clear." props={['value','onChange','debounceMs','placeholder','align','expandedWidth']} preview={<DSearchInput value={search} onChange={setSearch} placeholder="Search components..."/>} code={`<DSearchInput value={query} onChange={setQuery} debounceMs={300} placeholder="Search..." />`} />
    <DocSection id="checkbox-radio-toggle" title="DCheckbox, DRadio & DToggle" apiName="CheckboxProps" description="Primitive pilihan yang controlled-friendly dan memakai semantic brand token." preview={<div className="row-wrap"><label className="control-label"><DCheckbox checked={checked} onChange={(event)=>setChecked(event.target.checked)}/> DCheckbox</label><label className="control-label"><DRadio name="demo" checked={radio==='a'} onChange={()=>setRadio('a')}/> Option A</label><label className="control-label"><DRadio name="demo" checked={radio==='b'} onChange={()=>setRadio('b')}/> Option B</label><DToggle label="Notifications" checked={toggle} onChange={setToggle}/></div>} code={`<DCheckbox checked={checked} onChange={handleCheck} />\n<DRadio name="status" checked={selected} onChange={handleRadio} />\n<DToggle checked={enabled} onChange={setEnabled} />`} />
    <DocSection id="date-picker" title="DDatePicker" description="Date picker dengan date-only default, date-hour, dan date-time. Ketiga variant tetap memakai controlled string value dan shared floating engine." props={['value','onChange','variant','minuteStep','minDate','maxDate','clearable','size','scrollBehavior']} preview={<div className="preview-grid"><DDatePicker label="Date only" value={date} onChange={setDate}/><DDatePicker label="Date + hour" variant="date-hour" value={dateHour} onChange={setDateHour}/><DDatePicker label="Date + time" variant="date-time" minuteStep={15} value={dateTime} onChange={setDateTime}/></div>} code={`<DDatePicker value={date} onChange={setDate} />\n<DDatePicker variant="date-hour" value={dateHour} onChange={setDateHour} />\n<DDatePicker variant="date-time" minuteStep={15} value={dateTime} onChange={setDateTime} />`} />
    <DocSection id="time-picker" title="DTimePicker" description="Standalone time picker untuk jam saja atau jam + menit dengan canonical HH:mm value." props={['value','onChange','variant','minuteStep','clearable','size','scrollBehavior']} preview={<div className="preview-grid"><DTimePicker label="Start time" value={time} onChange={setTime} minuteStep={15}/><DTimePicker label="Start hour" value={time} onChange={setTime} variant="hour"/></div>} code={`<DTimePicker label="Start time" value={time} onChange={setTime} minuteStep={15} />\n<DTimePicker label="Start hour" variant="hour" value={time} onChange={setTime} />`} />
    <DocSection id="range-date-picker" title="DRangeDatePicker" description="Range calendar dengan quick-range selection, compact popup, apply/cancel dan close-on-scroll default." props={['value','onChange','clearable','size','scrollBehavior']} preview={<DRangeDatePicker label="Report period" value={range} onChange={(next)=>setRange({start: next.start ?? '', end: next.end ?? ''})}/>} code={`<DRangeDatePicker label="Report period" value={range} onChange={setRange} />`} />
    <DocSection id="filters" title="Filter helpers" apiName="SelectFilterProps" description="Komponen filter reusable untuk toolbar dan data views." preview={<div className="stack"><DSelectFilter label="Category" value={filter} onChange={setFilter} options={[{label:'All',value:'all'},{label:'Product',value:'product'},{label:'Service',value:'service'}]}/><DStatusFilter label="Status" value={status} onChange={setStatus} options={[{label:'Active',value:'active',count:12},{label:'Draft',value:'draft',count:4}]}/><DDateRangeFilter from={from} to={to} onFromChange={setFrom} onToChange={setTo} onClear={()=>{setFrom('');setTo('');}}/></div>} code={`<DSelectFilter label="Category" options={options} value={category} onChange={setCategory} />`} />
  </>;
}

function OverlayExamples() {
  const [dialog,setDialog]=useState(false);
  const [confirm,setConfirm]=useState(false);
  const [panel,setPanel]=useState(false);
  const notificationAnchorRef=useRef<HTMLButtonElement>(null);
  const [overlay,setOverlay]=useState(false);
  const [error,setError]=useState(false);
  const [splash,setSplash]=useState(false);
  const [notifications,setNotifications]=useState([
    {id:'1',title:'Build complete',message:'Design system package is ready.',type:'success' as const,read:false,createdAt:'Just now'},
    {id:'2',title:'Theme updated',message:'Brand token changed to the current project color.',type:'info' as const,read:true,createdAt:'5m ago'},
  ]);
  return <>
    <DocSection id="dropdown" title="DDropdown" description="Shared positioning engine untuk menus dan floating surfaces, termasuk placement, matchWidth, Escape/outside close dan scroll behavior." props={['trigger','placement','matchWidth','open','onOpenChange','closeOnItemClick','scrollBehavior']} preview={<DDropdown closeOnItemClick trigger={({open}) => <DButton variant="outline">Menu {open ? 'Open' : 'Closed'}</DButton>}><div className="menu-demo"><DButton variant="ghost" fullWidth>Edit project</DButton><DButton variant="ghost" fullWidth>Duplicate</DButton><DButton variant="ghost" fullWidth className="danger-item">Delete</DButton></div></DDropdown>} code={`<DDropdown placement="bottom-start" closeOnItemClick trigger={() => <DButton>Menu</DButton>}>...</DDropdown>`}/>
    <DocSection id="tooltip" title="DTooltip" description="Accessible hover/focus helper dengan semantic tooltip color dan placement." preview={<div className="row-wrap"><DTooltip content="Helpful contextual information"><DButton variant="outline">Hover or focus me</DButton></DTooltip><DTooltip content="Right placement" placement="right"><DBadge>Info</DBadge></DTooltip></div>} code={`<DTooltip content="Helpful information" placement="top"><DButton>Hover me</DButton></DTooltip>`}/>
    <DocSection id="dialog" title="DDialog & DConfirmDialog" apiName="DialogProps" description="Desktop modal + mobile bottom-sheet dengan body lock, Escape, overlay close, focus containment, footer dan size." preview={<div className="row-wrap"><DButton onClick={()=>setDialog(true)}>Open dialog</DButton><DButton variant="danger" onClick={()=>setConfirm(true)}>Delete item</DButton><DDialog open={dialog} onClose={()=>setDialog(false)} title="Project settings" description="Example reusable dialog." footer={<div className="row-wrap right"><DButton variant="outline" onClick={()=>setDialog(false)}>Cancel</DButton><DButton onClick={()=>setDialog(false)}>Save</DButton></div>}><DInput label="Project" value="Digvation" onChange={()=>{}}/></DDialog><DConfirmDialog open={confirm} onClose={()=>setConfirm(false)} onConfirm={()=>setConfirm(false)} title="Delete component?" message="This preview demonstrates destructive confirmation."/></div>} code={`<DDialog open={open} onClose={() => setOpen(false)} title="Project settings">...</DDialog>`} />
    <DocSection id="notification" title="DNotificationPanel" description="Anchored notification panel dengan unread state, mark-read, mark-all, dismiss, compact rows dan configurable scroll behavior." props={['anchorRef','notifications','open','onClose','onMarkRead','onMarkAllRead','onDismiss','scrollBehavior']} preview={<div className="notification-demo"><DButton ref={notificationAnchorRef} variant="outline" onClick={()=>setPanel(!panel)}>Notifications ({notifications.filter((item)=>!item.read).length})</DButton><DNotificationPanel anchorRef={notificationAnchorRef} open={panel} onClose={()=>setPanel(false)} notifications={notifications} onMarkRead={(id)=>setNotifications((items)=>items.map((item)=>item.id===id?{...item,read:true}:item))} onMarkAllRead={()=>setNotifications((items)=>items.map((item)=>({...item,read:true})))} onDismiss={(id)=>setNotifications((items)=>items.filter((item)=>item.id!==id))}/></div>} code={`<DNotificationPanel anchorRef={notificationButtonRef} open={open} notifications={notifications} onMarkRead={markRead} onMarkAllRead={markAllRead} onDismiss={dismiss} onClose={() => setOpen(false)} />`} />
    <DocSection id="full-screen" title="Full-screen states" apiName="LoadingOverlayProps" description="DConnectionError, DLoadingOverlay dan DSplashScreen untuk application-level states." preview={<div className="row-wrap"><DButton variant="outline" onClick={()=>setOverlay(true)}>Loading overlay</DButton><DButton variant="outline" onClick={()=>setError(true)}>Connection error</DButton><DButton variant="outline" onClick={()=>setSplash(true)}>Splash screen</DButton>{overlay?<><DLoadingOverlay label="Loading preview..."/><DButton className="overlay-exit" variant="danger" onClick={()=>setOverlay(false)}>Close preview</DButton></>:null}{error?<DConnectionError onRetry={()=>setError(false)} title="Preview connection error" message="Press retry to close this preview."/>:null}{splash?<DSplashScreen minDuration={700} title="DIGVATION." subtitle="Design System" mark="D." onFinish={()=>setSplash(false)}/>:null}</div>} />
  </>;
}

type DemoRow = { id: number; name: string; status: string; amount: number; createdAt: string };
const rows: DemoRow[] = [
  { id: 1, name: 'Website Revamp', status: 'Active', amount: 12500000, createdAt: '2026-09-01' },
  { id: 2, name: 'Inventory App', status: 'Draft', amount: 8400000, createdAt: '2026-08-24' },
  { id: 3, name: 'Design System', status: 'Active', amount: 15600000, createdAt: '2026-09-04' },
];

function DisplayExamples() {
  const [page,setPage]=useState(3);
  const [sortBy,setSortBy]=useState('name');
  const [dir,setDir]=useState<'asc'|'desc'>('asc');
  const [query,setQuery]=useState('');
  return <>
    <DocSection id="badge-alert-note" title="DBadge, DAlert & DInfoNote" apiName="BadgeProps" description="Semantic feedback components share primary/success/warning/danger tokens." preview={<div className="stack"><div className="row-wrap"><DBadge variant="primary" dot>Primary</DBadge><DBadge variant="secondary">Secondary</DBadge><DBadge variant="info">Info</DBadge><DBadge variant="success">Success</DBadge><DBadge variant="warning">Warning</DBadge><DBadge variant="danger">Danger</DBadge><DBadge variant="outline">Outline</DBadge></div><DAlert variant="success" title="Saved">Project configuration has been updated.</DAlert><DInfoNote variant="tip" title="Design token">Override semantic variables instead of editing component classes.</DInfoNote></div>} code={`<DBadge variant="success" dot>Active</DBadge>\n<DAlert variant="success" title="Saved">Updated.</DAlert>`}/>
    <DocSection id="progress-loading" title="DProgress & Loading" apiName="ProgressProps" description="Determinate/indeterminate progress plus inline loading indicator." preview={<div className="stack"><DProgress value={68} label="Build progress"/><DProgress label="Indeterminate"/><DLoadingIndicator label="Loading data..."/></div>} code={`<DProgress value={68} />\n<DLoadingIndicator label="Loading data..." />`}/>
    <DocSection id="skeleton" title="DSkeleton" description="Composable skeleton primitive untuk loading layouts." preview={<div className="stack"><DSkeleton width="45%" height={16}/><DSkeleton width="75%" height={12}/><DCardSkeleton/><DTableSkeleton rows={2} cols={3}/><DFormSkeleton fields={2}/></div>} code={`<DSkeleton width="45%" height={16} />\n<DCardSkeleton />`}/>
    <DocSection id="card" title="DCard" description="Card surface dengan Header, Content dan Footer; radius dan border mengikuti theme tokens." preview={<DCard className="demo-card"><DCardHeader><strong>Project overview</strong></DCardHeader><DCardContent><p className="muted">Canonical surface for grouped content.</p><div className="metric">24 <span>components ready</span></div></DCardContent><DCardFooter><DButton variant="outline" size="sm">View details</DButton></DCardFooter></DCard>} code={`<DCard><DCardHeader>Project overview</DCardHeader><DCardContent>...</DCardContent></DCard>`}/>
    <DocSection id="avatar" title="DAvatar" description="User/team avatar dengan initials fallback, image, size, dan presence status." props={['src','name','fallback','size','status']} preview={<div className="row-wrap"><DAvatar name="Dimas Pratama" status="online"/><DAvatar name="UI Team" size="lg" status="busy"/><DAvatar fallback="DS" size="xl" status="away"/></div>} code={`<DAvatar name="Dimas Pratama" status="online" />`} />
    <DocSection id="empty-state" title="DEmptyState" description="Consistent no-data/no-result state dengan optional icon dan action." preview={<DEmptyState title="No components found" description="Try changing your search or create a new component." action={<DButton size="sm">Create component</DButton>}/>} code={`<DEmptyState title="No data" description="There is nothing here yet." action={<DButton>Create</DButton>} />`}/>
    <DocSection id="data-table" title="DDataTable" description="Search, filters, sorting, responsive cards, formatting, action menu, pagination/page-size, row click dan loading." props={['columns','data','searchable','onSearchChange','onSort','pagination','actions','filters']} preview={<DDataTable<DemoRow> data={rows.filter((row)=>row.name.toLowerCase().includes(query.toLowerCase()))} columns={[{key:'name',label:'Project',sortable:true},{key:'status',label:'Status',render:(row)=> <DBadge variant={row.status==='Active'?'success':'default'}>{row.status}</DBadge>},{key:'amount',label:'Budget',type:'currency',align:'right'},{key:'createdAt',label:'Created',type:'date'}]} searchable searchValue={query} onSearchChange={setQuery} sortBy={sortBy} sortDirection={dir} onSort={(key,next)=>{setSortBy(key);setDir(next);}} pagination={{page:1,pageSize:10,total:3}} onPageChange={()=>{}} actions={[{label:'Open',onClick:()=>{}},{label:'Delete',variant:'danger',onClick:()=>{}}]}/>} code={`<DDataTable columns={columns} data={rows} searchable onSearchChange={setQuery} pagination={{ page, pageSize, total }} actions={actions} />`}/>
    <DocSection id="tabs" title="DTabs" description="Section navigation dengan controlled/uncontrolled state dan accessible tab roles." preview={<DTabs defaultValue="preview"><DTabsList><DTabsTrigger value="preview">Preview</DTabsTrigger><DTabsTrigger value="usage">Usage</DTabsTrigger><DTabsTrigger value="api">API</DTabsTrigger></DTabsList><DTabsContent value="preview" className="tab-panel">Live component preview.</DTabsContent><DTabsContent value="usage" className="tab-panel">Copy-paste usage examples.</DTabsContent><DTabsContent value="api" className="tab-panel">Props and behavior.</DTabsContent></DTabs>} code={`<DTabs defaultValue="overview"><DTabsList><DTabsTrigger value="overview">Overview</DTabsTrigger></DTabsList><DTabsContent value="overview">...</DTabsContent></DTabs>`}/>
    <DocSection id="accordion" title="DAccordion" description="Disclosure component dengan empat visual variants: borderless, separator, card dan separated bordered items." props={['type','value','defaultValue','onValueChange','variant']} preview={<div className="preview-grid"><DAccordion variant="separator" defaultValue={['one']}><DAccordionItem value="one" title="Separator variant">Item memakai separator tipis tanpa outer card.</DAccordionItem><DAccordionItem value="two" title="Another item">Tetap clean dan compact.</DAccordionItem></DAccordion><DAccordion variant="card"><DAccordionItem value="one" title="Card variant">Satu outer border dengan divider internal.</DAccordionItem><DAccordionItem value="two" title="Second item">Cocok untuk grouped settings.</DAccordionItem></DAccordion></div>} code={`<DAccordion variant="separator">...</DAccordion>\n<DAccordion variant="card">...</DAccordion>\n<DAccordion variant="separated">...</DAccordion>`}/>
    <DocSection id="breadcrumb" title="DBreadcrumb" description="Composable breadcrumb primitives for application hierarchy." preview={<DBreadcrumb><DBreadcrumbList><DBreadcrumbItem><DBreadcrumbLink href="#">Projects</DBreadcrumbLink><DBreadcrumbSeparator/></DBreadcrumbItem><DBreadcrumbItem><DBreadcrumbLink href="#">Digvation</DBreadcrumbLink><DBreadcrumbSeparator/></DBreadcrumbItem><DBreadcrumbItem><DBreadcrumbLink href="#" active>Design System</DBreadcrumbLink></DBreadcrumbItem></DBreadcrumbList></DBreadcrumb>} code={`<DBreadcrumb><DBreadcrumbList>...</DBreadcrumbList></DBreadcrumb>`}/>
    <DocSection id="pagination" title="DPagination" description="Standalone pagination untuk views di luar DDataTable." preview={<DPagination page={page} totalPages={12} onChange={setPage}/>} code={`<DPagination page={page} totalPages={12} onChange={setPage} />`}/>
    <DocSection id="utilities" title="DSeparator & DSpinner" apiName="SeparatorProps" description="Small primitives untuk consistency pada layouts dan loading states." preview={<div className="stack"><div className="row-wrap"><span>Left</span><DSeparator orientation="vertical" className="h-6"/><span>Right</span></div><DSeparator/><div className="row-wrap"><DSpinner size="sm"/><DSpinner/><DSpinner size="lg"/></div></div>} code={`<DSeparator />\n<DSpinner size="md" />`}/>
  </>;
}

function ActionExamples() {
  return <>
    <DocSection id="button" title="DButton" description="Action primitive dengan semantic variants, sizes, loading, icons, disabled state dan fullWidth." props={['variant','size','loading','leftIcon','rightIcon','fullWidth']} preview={<div className="row-wrap"><DButton>Primary</DButton><DButton variant="secondary">Secondary</DButton><DButton variant="outline">Outline</DButton><DButton variant="ghost">Ghost</DButton><DButton variant="danger">Danger</DButton></div>} code={`<DButton variant="primary">Save</DButton>\n<DButton variant="outline">Cancel</DButton>`}/>
    <DocSection id="export" title="DExportButton" description="Shared export dropdown. onExport boleh menghasilkan Blob, Promise<Blob>, atau memulai server-side processing." preview={<DExportButton filename="design-system-demo" onExport={()=>{}} onProcessing={()=>alert('Preview: export processing callback called.')}/>} code={`<DExportButton filename="report" onExport={(format) => api.export(format)} />`}/>
  </>;
}

function ToastExample() {
  return <DocSection id="toast" title="Toast" apiName="ToastProviderProps" description="App-scoped DToastProvider + useToast queue dengan semantic status colors." props={['DToastProvider','useToast','showToast','dismissToast','limit','defaultDuration']} preview={<div className="stack"><DAlert variant="info" title="Usage">Wrap application root with DToastProvider, then call useToast() inside feature code.</DAlert><div className="toast-mock"><span className="toast-dot success"/><div><strong>Saved successfully</strong><p>Example of the toast visual language.</p></div></div></div>} code={`const { showToast } = useToast();\nshowToast({ title: 'Saved', variant: 'success' });`}/>;
}

export function App() {
  const [query,setQuery]=useState('');
  const [mode,setMode]=useState<ThemeMode>('light');
  const [radius,setRadius]=useState<ThemeRadius>('default');
  const [tokens,setTokens]=useState<ThemeTokens>({});
  const filtered=useMemo(()=>navItems.filter((item)=>item.label.toLowerCase().includes(query.toLowerCase())||item.group.toLowerCase().includes(query.toLowerCase())),[query]);
  const groups=useMemo(()=>Array.from(new Set(filtered.map((item)=>item.group))),[filtered]);

  return <DThemeProvider tokens={tokens} mode={mode} radius={radius}><DToastProvider><div className="docs-app"><aside className="sidebar"><a className="brand" href="#top"><span>D.</span><div><strong>Digvation</strong><small>Design System</small></div></a><DInput containerClassName="nav-search-field" type="search" size="sm" clearable value={query} onChange={setQuery} placeholder="Search docs..."/><nav>{groups.map((group)=><div className="nav-group" key={group}><p>{group}</p>{filtered.filter((item)=>item.group===group).map((item)=><a key={item.id} href={`#${item.id}`}>{item.label}</a>)}</div>)}</nav><div className="sidebar-footer"><DBadge variant="success" dot>v1.0.0</DBadge><span>{navItems.length - 2} documented surfaces</span></div></aside><main><header id="top" className="hero"><div><DBadge variant="primary">Reusable React UI</DBadge><h1>One design system.<br/><span>Different project identities.</span></h1><p>Canonical reusable components with Digvation defaults, project-owned semantic theming, and documentation where Preview, Code, Props and Functions live in the same playground.</p><div className="hero-actions"><a className="hero-button" href="#getting-started">Get started</a><a className="hero-link" href="#theming">Customize theme →</a></div></div><div className="hero-card"><div className="hero-card-top"><span/><span/><span/></div><div className="hero-card-body"><DInput label="Project" value="New Product" onChange={()=>{}}/><DSelect label="Status" value="active" onChange={()=>{}} options={[{label:'Active',value:'active'}]}/><DButton fullWidth>Create project</DButton></div></div></header>
        <section id="getting-started" className="guide-section"><p className="eyebrow">Guide</p><h2>Getting Started</h2><p className="lead">The repository is an npm workspace: the component package lives in <code>packages/ui</code>, while this documentation app lives in <code>apps/docs</code>.</p><div className="guide-grid"><DCard><DCardHeader><strong>Run documentation</strong></DCardHeader><DCardContent><Code>{`npm install\nnpm run dev`}</Code></DCardContent></DCard><DCard><DCardHeader><strong>Use in another project</strong></DCardHeader><DCardContent><Code>{`npm run pack:ui\nnpm install ../digvation-design-system/release/digvation-ui-1.0.0.tgz`}</Code></DCardContent></DCard></div><h3>Application setup</h3><Code>{`import '@digvation/ui/styles.css';\nimport { DButton } from '@digvation/ui';`}</Code><DAlert title="React requirement">React and React DOM remain peer dependencies.</DAlert></section>
        <section id="theming" className="guide-section"><p className="eyebrow">Guide</p><h2>Theming</h2><p className="lead">Digvation defaults are always present. Projects only override semantic identity tokens such as primary, secondary, surfaces and status colors.</p><ThemePlayground tokens={tokens} setTokens={setTokens} mode={mode} setMode={setMode} radius={radius} setRadius={setRadius}/><DInfoNote variant="info" title="Portal-safe theming">DThemeProvider applies variables to the document root so portal surfaces inherit the same project theme.</DInfoNote></section>
        <ValidationLocalizationExamples/>
        <ActionExamples/><FormExamples/><DisplayExamples/><ToastExample/><OverlayExamples/>
        <footer className="docs-footer"><strong>Digvation Design System</strong><span>Canonical components · themeable tokens · reusable package</span></footer>
      </main></div></DToastProvider></DThemeProvider>;
}
