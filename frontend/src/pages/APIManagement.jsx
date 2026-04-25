import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apisAPI } from '../services/api';
import { useToast } from '../components/Toast';


function APIManagement() {
  const { addToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', baseUrl: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['apis'], queryFn: () => apisAPI.getAll().then(res => res.data) });
  const createMutation = useMutation({ mutationFn: (d) => apisAPI.create(d), onSuccess: () => { addToast('API created', 'success'); queryClient.invalidateQueries(['apis']); setShowModal(false); setFormData({ name: '', description: '', baseUrl: '' }); }, onError: (err) => { addToast(err.response?.data?.message || 'Failed', 'error'); setError(err.response?.data?.message || 'Failed'); } });
  const deleteMutation = useMutation({ mutationFn: (id) => apisAPI.delete(id), onSuccess: () => { addToast('API deleted', 'success'); queryClient.invalidateQueries(['apis']); }, onError: (err) => addToast(err.response?.data?.message || 'Failed', 'error') });

  return (
    <div className="min-h-screen bg-page-bg relative">
      <div className="ambient-blob w-[600px] h-[600px] bg-[#B7D8E6] -top-60 -right-60"></div>

      <main className="flex-1 p-8 relative z-10 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div><h2 className="text-3xl font-bold text-text-primary">My APIs</h2><p className="text-text-secondary mt-1">Create and manage your API endpoints</p></div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 neu-btn-primary font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Create API
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-text-secondary"><svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Loading...</div>
        ) : data?.apis?.length === 0 ? (
          <div className="neu-card-static p-12 text-center">
            <div className="w-20 h-20 neu-icon flex items-center justify-center mx-auto mb-4"><svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
            <p className="text-text-secondary mb-6">No APIs yet. Create your first API!</p>
            <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-6 py-3 neu-btn-primary font-medium"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Create API</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.apis?.map(api => (
              <div key={api._id} className="neu-card p-6 group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-text-primary group-hover:text-[#4A97B0] transition-colors">{api.name}</h3>
                  <span className={`neu-badge px-3 py-1 text-xs font-medium ${api.isActive ? 'text-success' : 'text-error'}`}>{api.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <p className="text-text-secondary text-sm mb-4">{api.description || 'No description'}</p>
                <p className="text-xs text-text-muted mb-4 font-mono neu-inset p-2">{api.baseUrl}</p>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/apis/${api._id}`)} className="flex-1 px-4 py-2 neu-btn text-text-primary text-sm font-medium">View</button>
                  <button onClick={() => deleteMutation.mutate(api._id)} className="px-4 py-2 neu-btn text-error text-sm font-medium">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="neu-modal p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-semibold text-text-primary">Create New API</h3><button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div>
            {error && (<div className="mb-4 p-4 neu-inset text-error text-sm">{error}</div>)}
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="space-y-4">
              <div><label className="block text-sm font-medium text-text-secondary mb-2">Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 neu-input text-text-primary placeholder-text-muted" placeholder="My API" required /></div>
              <div><label className="block text-sm font-medium text-text-secondary mb-2">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 neu-input text-text-primary placeholder-text-muted" rows={2} placeholder="API description..." /></div>
              <div><label className="block text-sm font-medium text-text-secondary mb-2">Base URL</label><input type="url" value={formData.baseUrl} onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })} className="w-full px-4 py-3 neu-input text-text-primary placeholder-text-muted" placeholder="https://api.example.com" required /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 neu-btn text-text-primary font-medium">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="flex-1 px-4 py-3 neu-btn-primary font-medium disabled:opacity-50">{createMutation.isPending ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default APIManagement;