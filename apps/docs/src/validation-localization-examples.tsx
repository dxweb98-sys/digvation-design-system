import { useState } from 'react';
import {
  DAlert,
  DButton,
  DCard,
  DCardContent,
  DCardHeader,
  DCheckbox,
  DDatePicker,
  DForm,
  DFormField,
  DInfoNote,
  DInput,
  DLocalizationProvider,
  DSelect,
  DTimePicker,
  DToggle,
  DValidationMessage,
  accepted,
  date,
  email,
  minLength,
  required,
  sameAs,
  time,
} from '@digvation/ui';

const validationCode = `const [values, setValues] = useState({ email: '', role: null });

<DForm validateOn={['blur', 'submit']} onSubmit={(formValues) => save(formValues)}>
  <DFormField
    name="email"
    label="Email"
    value={values.email}
    rules={[required(), email()]}
  >
    {({ error, onBlur }) => (
      <DInput
        label="Email"
        value={values.email}
        error={error}
        onBlur={onBlur}
        onChange={(email) => setValues((v) => ({ ...v, email }))}
      />
    )}
  </DFormField>

  <DButton type="submit">Submit</DButton>
</DForm>`;

const localizationCode = `<DLocalizationProvider
  locale={i18n.language}
  translate={(key, params, fallback) =>
    t(\`designSystem.\${key}\`, { ...params, defaultValue: fallback })
  }
>
  <App />
</DLocalizationProvider>`;

function ValidationDemo() {
  const [emailValue, setEmailValue] = useState('invalid-email');
  const [password, setPassword] = useState('123');
  const [confirmPassword, setConfirmPassword] = useState('12');
  const [role, setRole] = useState<string | number | null>(null);
  const [schedule, setSchedule] = useState('');
  const [startTime, setStartTime] = useState('');
  const [terms, setTerms] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <DForm
      className="stack"
      validateOn={['blur', 'submit']}
      onSubmit={() => setSubmitted(true)}
      onInvalid={() => setSubmitted(false)}
    >
      <div className="preview-grid">
        <DFormField name="email" label="Email" value={emailValue} rules={[required(), email()]}>
          {({ error, onBlur }) => (
            <DInput label="Email" type="email" value={emailValue} error={error} onBlur={onBlur} onChange={setEmailValue} />
          )}
        </DFormField>

        <DFormField name="role" label="Role" value={role} rules={[required()]}>
          {({ error }) => (
            <DSelect
              label="Role"
              value={role}
              error={error}
              onChange={setRole}
              options={[{ label: 'Admin', value: 'admin' }, { label: 'Member', value: 'member' }]}
            />
          )}
        </DFormField>

        <DFormField name="password" label="Password" value={password} rules={[required(), minLength(8)]}>
          {({ error, onBlur }) => (
            <DInput label="Password" type="password" value={password} error={error} onBlur={onBlur} onChange={setPassword} />
          )}
        </DFormField>

        <DFormField name="confirmPassword" label="Konfirmasi password" value={confirmPassword} rules={[required(), sameAs('password', 'Password')]}>
          {({ error, onBlur }) => (
            <DInput label="Konfirmasi password" type="password" value={confirmPassword} error={error} onBlur={onBlur} onChange={setConfirmPassword} />
          )}
        </DFormField>

        <DFormField name="schedule" label="Jadwal" value={schedule} rules={[required(), date()]}>
          {({ error }) => (
            <DDatePicker label="Jadwal" variant="date-time" minuteStep={15} value={schedule} error={error} onChange={setSchedule} />
          )}
        </DFormField>

        <DFormField name="startTime" label="Jam mulai" value={startTime} rules={[required(), time()]}>
          {({ error }) => (
            <DTimePicker label="Jam mulai" minuteStep={15} value={startTime} error={error} onChange={setStartTime} />
          )}
        </DFormField>
      </div>

      <div className="stack">
        <DFormField name="terms" label="Persetujuan syarat" value={terms} rules={[accepted()]}>
          {({ error, onBlur }) => (
            <div>
              <label className="control-label"><DCheckbox checked={terms} onBlur={onBlur} onChange={(event) => setTerms(event.target.checked)} /> Saya menyetujui syarat penggunaan</label>
              <DValidationMessage error={error} />
            </div>
          )}
        </DFormField>

        <DFormField name="notifications" label="Notifikasi wajib" value={notifications} rules={[accepted()]}>
          {({ error }) => (
            <div>
              <DToggle label="Aktifkan notifikasi wajib" checked={notifications} onChange={setNotifications} />
              <DValidationMessage error={error} />
            </div>
          )}
        </DFormField>
      </div>

      <div className="row-wrap">
        <DButton type="submit">Validasi & submit</DButton>
        {submitted ? <DAlert variant="success" title="Valid">Semua field lolos validasi.</DAlert> : null}
      </div>
    </DForm>
  );
}

function LocalizationDemo() {
  const [locale, setLocale] = useState<'id-ID' | 'en-US'>('id-ID');
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [selectValue, setSelectValue] = useState<string | number | null>(null);

  return (
    <div className="stack">
      <div className="row-wrap">
        <DButton size="sm" variant={locale === 'id-ID' ? 'primary' : 'outline'} onClick={() => setLocale('id-ID')}>Indonesia</DButton>
        <DButton size="sm" variant={locale === 'en-US' ? 'primary' : 'outline'} onClick={() => setLocale('en-US')}>English</DButton>
      </div>
      <DLocalizationProvider locale={locale}>
        <div className="preview-grid">
          <DSelect label="Select / Pilihan" value={selectValue} onChange={setSelectValue} searchable options={[{ label: 'Alpha', value: 'alpha' }, { label: 'Beta', value: 'beta' }]} />
          <DDatePicker label="Date / Tanggal" value={dateValue} onChange={setDateValue} />
          <DTimePicker label="Time / Waktu" value={timeValue} onChange={setTimeValue} minuteStep={15} />
        </div>
      </DLocalizationProvider>
    </div>
  );
}

export function ValidationLocalizationExamples() {
  return (
    <>
      <section id="validation" className="guide-section">
        <p className="eyebrow">Guide</p>
        <h2>Form Validation</h2>
        <p className="lead">DForm dan DFormField memberi satu validation engine yang bisa dipakai ke field Digvation maupun custom component project. Error tetap dirender oleh component melalui prop error, atau DValidationMessage untuk control seperti checkbox/toggle.</p>
        <DCard>
          <DCardHeader><strong>Interactive validation</strong></DCardHeader>
          <DCardContent><ValidationDemo /></DCardContent>
        </DCard>
        <h3>Usage</h3>
        <pre><code>{validationCode}</code></pre>
        <DInfoNote variant="info" title="Standard rules">Built-in: required, accepted, email, url, minLength/maxLength, minValue/maxValue, integer, pattern, sameAs, oneOf, date, time, plus customValidation untuk rule sync/async project.</DInfoNote>
      </section>

      <section id="localization" className="guide-section">
        <p className="eyebrow">Guide</p>
        <h2>Localization</h2>
        <p className="lead">Default design-system locale adalah Indonesia. Locale dapat berubah saat runtime dan project bisa memasang adapter ke i18next, next-intl, react-intl, atau translator internal tanpa membuat design system bergantung ke library tersebut.</p>
        <DCard>
          <DCardHeader><strong>Runtime locale switch</strong></DCardHeader>
          <DCardContent><LocalizationDemo /></DCardContent>
        </DCard>
        <h3>Project i18n adapter</h3>
        <pre><code>{localizationCode}</code></pre>
      </section>
    </>
  );
}
