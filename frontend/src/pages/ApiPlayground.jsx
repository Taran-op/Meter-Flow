import { useState } from 'react';
import TopNav from '../components/TopNav';
import NeuSelect from '../components/NeuSelect';

const sampleAPIs = [
  { id: '1', name: 'Weather API', baseUrl: 'https://api.weather.com/v1', endpoints: ['/current', '/forecast', '/history'] },
  { id: '2', name: 'Payment Gateway', baseUrl: 'https://api.payment.com/v1', endpoints: ['/charge', '/refund', '/verify'] },
];

function ApiPlayground() {
  const [selectedApi, setSelectedApi] = useState(sampleAPIs[0]);
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('/current');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState('{\n  "param1": "value1"\n}');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('headers');

  const handleSend = () => {
    setLoading(true); setResponse(null);
    setTimeout(() => {
      setResponse({ status: 200, time: Math.floor(Math.random() * 500) + 50, data: { success: true, data: { id: '12345', temperature: 24, condition: 'Partly Cloudy' } } });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-page-bg relative">
      <div className="ambient-blob w-[600px] h-[600px] bg-[#B7D8E6] -top-60 -right-60"></div>
      <TopNav role="consumer" />
      <main className="flex-1 p-8 relative z-10 max-w-[1600px] mx-auto animate-fade-in">
        <div className="mb-8"><h2 className="text-3xl font-bold text-text-primary">API Playground</h2><p className="text-text-secondary mt-1">Test APIs in real-time</p></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="neu-card-static p-6">
              <div className="flex gap-3 mb-4">
                <NeuSelect
                  value={selectedApi.id}
                  onChange={(val) => setSelectedApi(sampleAPIs.find(a => a.id === val))}
                  options={sampleAPIs.map(a => ({ value: a.id, label: a.name }))}
                  className="flex-1"
                />
                <NeuSelect
                  value={method}
                  onChange={(val) => setMethod(val)}
                  options={['GET','POST','PUT','DELETE','PATCH'].map(m => ({ value: m, label: m }))}
                  className="w-36"
                />
              </div>
              <div className="flex gap-3">
                <input type="text" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="flex-1 px-4 py-3 neu-input text-text-primary font-mono text-sm" placeholder="/endpoint" />
                <button onClick={handleSend} disabled={loading} className="px-8 py-3 neu-btn-primary font-medium disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>

            <div className="neu-card-static overflow-hidden">
              <div className="flex border-b border-border/40">
                {['headers','body'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 text-sm font-medium transition-all ${activeTab === tab ? 'text-[#4A97B0] shadow-neu-inset-sm bg-page-bg' : 'text-text-secondary hover:text-text-primary'}`}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="p-4">
                {activeTab === 'headers' && (<textarea value={headers} onChange={(e) => setHeaders(e.target.value)} className="w-full h-40 neu-input text-text-primary font-mono text-sm p-4" />)}
                {activeTab === 'body' && (<textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full h-40 neu-input text-text-primary font-mono text-sm p-4" />)}
              </div>
            </div>

            {response && (
              <div className="neu-card-static p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">Response</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="neu-badge px-3 py-1 text-success font-medium">Status: {response.status}</span>
                    <span className="text-text-secondary">{response.time}ms</span>
                  </div>
                </div>
                <pre className="neu-inset p-4 text-[#4A97B0] font-mono text-sm overflow-x-auto max-h-96">{JSON.stringify(response.data, null, 2)}</pre>
              </div>
            )}
          </div>

          <div className="neu-card-static p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Endpoints</h3>
            <div className="space-y-2">
              {selectedApi.endpoints.map(ep => (
                <button key={ep} onClick={() => setEndpoint(ep)} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${endpoint === ep ? 'neu-inset text-[#4A97B0]' : 'neu-flat text-text-secondary hover:text-text-primary'}`}>
                  <span className="font-mono text-sm">{ep}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ApiPlayground;