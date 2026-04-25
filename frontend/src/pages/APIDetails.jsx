import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apisAPI, usageAPI } from '../services/api';
import TopNav from '../components/TopNav';

function APIDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyForm, setKeyForm] = useState({ name: '', rateLimit: 1000 });
  const { data, isLoading } = useQuery({ queryKey: ['api', id], queryFn: () => apisAPI.getOne(id).then(res => res.data) });
  const { data: logsData } = useQuery({ queryKey: ['logs', id], queryFn: () => usageAPI.getLogs(id, { limit: 10 }).then(res => res.data) });
  const createKeyMutation = useMutation({ mutationFn: (d) => apisAPI.createKey(id, d), onSuccess: () => { queryClient.invalidateQueries(['api', id]); setShowKeyModal(false); } });
  const revokeKeyMutation = useMutation({ mutationFn: (keyId) => apisAPI.revokeKey(id, keyId), onSuccess: () => queryClient.invalidateQueries(['api', id]) });
  const rotateKeyMutation = useMutation({ mutationFn: (keyId) => apisAPI.rotateKey(id, keyId), onSuccess: () => queryClient.invalidateQueries(['api', id]) });
  const api = data?.api;
  if (isLoading) return <div className="min-h-screen bg-page-bg flex items-center justify-center text-text-secondary">Loading...</div>;

  return (
    <div className="min-h-screen bg-page-bg relative">
      <div className="ambient-blob w-[600px] h-[600px] bg-[#B7D8E6] -top-60 -right-60"></div>
      <TopNav role="api_owner" />
      <main className="max-w-[1600px] mx-auto px-4 py-8 relative z-10 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="neu-card-static p-6">
              <div className="flex justify-between items-start mb-4">
                <div><h2 className="text-2xl font-bold text-text-primary">{api?.name}</h2><p className="text-text-secondary mt-1">{api?.description}</p></div>
                <span className={`neu-badge px-3 py-1 text-sm font-medium ${api?.isActive ? 'text-success' : 'text-error'}`}>{api?.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <div><label className="text-sm text-text-secondary">Base URL</label><p className="font-mono text-sm neu-inset p-2 mt-1 text-text-primary">{api?.baseUrl}</p></div>
            </div>
            <div className="neu-card-static p-6 mt-4">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Requests</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border/40"><th className="text-left py-2 text-text-secondary font-medium">Endpoint</th><th className="text-left py-2 text-text-secondary font-medium">Method</th><th className="text-left py-2 text-text-secondary font-medium">Status</th><th className="text-left py-2 text-text-secondary font-medium">Time</th></tr></thead>
                  <tbody>{logsData?.logs?.map(log => (<tr key={log._id} className="border-b border-border/20"><td className="py-2 font-mono text-xs text-text-primary">{log.endpoint}</td><td className="py-2">{log.method}</td><td className="py-2"><span className={`neu-badge px-2 py-1 text-xs font-medium ${log.statusCode < 400 ? 'text-success' : 'text-error'}`}>{log.statusCode}</span></td><td className="py-2 text-text-secondary">{log.responseTime}ms</td></tr>))}</tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="neu-card-static p-6">
            <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-text-primary">API Keys</h3><button onClick={() => setShowKeyModal(true)} className="text-sm text-[#4A97B0] hover:text-[#3A87A0] font-medium">+ Add Key</button></div>
            <div className="space-y-3">
              {api?.apiKeys?.map(key => (
                <div key={key._id} className="neu-inset p-3">
                  <div className="flex justify-between items-start mb-2"><span className="font-medium text-sm text-text-primary">{key.name}</span><span className={`neu-badge px-2 py-1 text-xs font-medium ${key.status === 'active' ? 'text-success' : 'text-error'}`}>{key.status}</span></div>
                  <p className="font-mono text-xs text-text-muted neu-inset p-2 mb-2 break-all">{key.key}</p>
                  <div className="flex gap-2 text-xs"><span className="text-text-muted">Rate: {key.rateLimit}/hr</span></div>
                  <div className="flex gap-2 mt-2"><button onClick={() => rotateKeyMutation.mutate(key._id)} className="text-xs text-[#4A97B0] hover:underline font-medium">Rotate</button>{key.status === 'active' && <button onClick={() => revokeKeyMutation.mutate(key._id)} className="text-xs text-error hover:underline font-medium">Revoke</button>}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="neu-modal p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Create API Key</h3>
            <form onSubmit={(e) => { e.preventDefault(); createKeyMutation.mutate(keyForm); }}>
              <div className="mb-4"><label className="block text-sm font-medium text-text-secondary mb-1">Name</label><input type="text" value={keyForm.name} onChange={(e) => setKeyForm({ ...keyForm, name: e.target.value })} className="w-full px-3 py-2 neu-input text-text-primary" /></div>
              <div className="mb-4"><label className="block text-sm font-medium text-text-secondary mb-1">Rate Limit</label><input type="number" value={keyForm.rateLimit} onChange={(e) => setKeyForm({ ...keyForm, rateLimit: parseInt(e.target.value) })} className="w-full px-3 py-2 neu-input text-text-primary" /></div>
              <div className="flex gap-2"><button type="button" onClick={() => setShowKeyModal(false)} className="flex-1 px-4 py-2 neu-btn text-text-primary font-medium">Cancel</button><button type="submit" className="flex-1 px-4 py-2 neu-btn-primary font-medium">{createKeyMutation.isPending ? 'Creating...' : 'Create'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default APIDetails;