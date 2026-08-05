import { useState, type FormEvent } from 'react';
import { ArrowRight, Cloud, Eye, EyeOff, LoaderCircle, Sparkles } from 'lucide-react';
import { createAccount, signInAccount } from './firebase';

function authMessage(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
  if (code.includes('email-already-in-use')) return 'That email already has a Lumenwild account.';
  if (code.includes('invalid-credential')) return 'The email or password did not match.';
  if (code.includes('weak-password')) return 'Choose a password with at least 6 characters.';
  if (code.includes('invalid-email')) return 'Enter a valid email address.';
  if (code.includes('operation-not-allowed')) return 'Email/password sign-in needs to be enabled in Firebase Authentication.';
  return 'Lumenwild could not reach Firebase. Please try again.';
}

export function AuthScreen() {
  const [mode, setMode] = useState<'create' | 'signin'>('create');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (mode === 'create') await createAccount(email.trim(), password, name);
      else await signInAccount(email.trim(), password);
    } catch (reason) {
      setError(authMessage(reason));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-story">
        <div className="auth-brand"><Sparkles /> Lumenwild</div>
        <div className="auth-copy">
          <h1>Your little light,<br />wherever you wander.</h1>
          <p>Raise a creature, explore the Bramblewake wilds, and build a persistent world you can return to on any device.</p>
          <div className="cloud-note"><Cloud /><span><b>Saved with Firebase</b>Your creature, collection, and nook follow your account.</span></div>
        </div>
        <img src={`${import.meta.env.BASE_URL}assets/starters.png`} alt="Three Lumenwild creatures" />
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <p>{mode === 'create' ? 'Begin a field journal' : 'Return to Bramblewake'}</p>
          <h2>{mode === 'create' ? 'Create your account' : 'Welcome back'}</h2>
          <div className="auth-switch" role="group" aria-label="Account action">
            <button className={mode === 'create' ? 'active' : ''} onClick={() => { setMode('create'); setError(''); }}>Create account</button>
            <button className={mode === 'signin' ? 'active' : ''} onClick={() => { setMode('signin'); setError(''); }}>Sign in</button>
          </div>
          <form onSubmit={submit}>
            {mode === 'create' ? <label>Display name<input autoComplete="nickname" maxLength={24} value={name} onChange={(e) => setName(e.target.value)} placeholder="Wanderer" /></label> : null}
            <label>Email<input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
            <label>Password<span className="password-field"><input type={showPassword ? 'text' : 'password'} autoComplete={mode === 'create' ? 'new-password' : 'current-password'} minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((shown) => !shown)}>{showPassword ? <EyeOff /> : <Eye />}</button></span></label>
            {error ? <div className="auth-error" role="alert">{error}</div> : null}
            <button className="auth-submit" disabled={busy}>{busy ? <LoaderCircle className="spin" /> : <>{mode === 'create' ? 'Create account' : 'Sign in'}<ArrowRight /></>}</button>
          </form>
          <small>By continuing, you agree to care kindly for the Lumenwild.</small>
        </div>
      </section>
    </main>
  );
}
