import { Link } from 'react-router-dom';


const mockSubs = [
  { id: '1', name: 'Weather API', description: 'Real-time weather data', status: 'active', calls: 1250, limit: 5000, price: 'Free', apiKey: 'mf_live_xxxxxxxxxxxx' },
  { id: '2', name: 'Payment Gateway', description: 'Secure payment processing', status: 'active', calls: 890, limit: 2000, price: '₹0.50/100', apiKey: 'mf_live_yyyyyyyyyyyy' },
  { id: '3', name: 'Analytics Pro', description: 'Advanced analytics', status: 'paused', calls: 0, limit: 1000, price: '₹0.30/100', apiKey: 'mf_live_zzzzzzzzzzzz' },
];

function Subscriptions() {
  return (
    <div className="min-h-screen bg-page-bg relative">
      <div className="ambient-blob w-[600px] h-[600px] bg-[#B7D8E6] -top-60 -right-60"></div>

      <main className="flex-1 p-8 relative z-10 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div><h2 className="text-3xl font-bold text-text-primary">My Subscriptions</h2><p className="text-text-secondary mt-1">Manage API subscriptions and keys</p></div>
          <Link to="/marketplace" className="flex items-center gap-2 px-4 py-2 neu-btn-primary font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add API
          </Link>
        </div>

        <div className="space-y-4">
          {mockSubs.map(sub => (
            <div key={sub.id} className="neu-card-static p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 neu-icon flex items-center justify-center"><svg className="w-6 h-6 text-[#4A97B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                  <div><h3 className="text-lg font-semibold text-text-primary">{sub.name}</h3><p className="text-text-secondary text-sm">{sub.description}</p></div>
                </div>
                <span className={`neu-badge px-3 py-1 text-xs font-medium ${sub.status === 'active' ? 'text-success' : 'text-warning'}`}>{sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}</span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2"><span className="text-text-secondary">API Calls</span><span className="text-text-primary font-medium">{sub.calls.toLocaleString()} / {sub.limit.toLocaleString()}</span></div>
                <div className="neu-progress-well h-2"><div className="bg-[#4A97B0] h-2 rounded-full" style={{ width: `${(sub.calls / sub.limit) * 100}%` }}></div></div>
              </div>
              <div className="neu-inset p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs text-text-muted mb-1">API Key</p><p className="font-mono text-sm text-[#4A97B0]">{sub.apiKey}</p></div>
                  <button onClick={() => navigator.clipboard.writeText(sub.apiKey)} className="p-2 neu-btn"><svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">{sub.price}</span>
                <div className="flex gap-2">
                  <button className="px-4 py-2 neu-btn text-text-primary text-sm font-medium">Settings</button>
                  <button className="px-4 py-2 neu-btn text-[#4A97B0] text-sm font-medium">Docs</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Subscriptions;