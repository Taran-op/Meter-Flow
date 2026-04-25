import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apisAPI } from '../services/api';
import { useToast } from '../components/Toast';
import TopNav from '../components/TopNav';

function ApiDocs() {
  const { id } = useParams();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [docContent, setDocContent] = useState('');
  const { data, isLoading } = useQuery({ queryKey: ['api', id], queryFn: () => apisAPI.getOne(id).then(res => res.data) });
  const updateMutation = useMutation({ mutationFn: (doc) => apisAPI.update(id, { documentation: doc }), onSuccess: () => { addToast('Saved', 'success'); queryClient.invalidateQueries(['api', id]); setIsEditing(false); }, onError: () => addToast('Failed', 'error') });
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const api = data?.api;
  const isOwner = api?.userId === user.id;
  const defaultDocs = `# API Documentation\n\n## Overview\n${api?.description || 'Description'}\n\n## Authentication\nAuthorization: Bearer YOUR_API_KEY\n\n## Endpoints\n\n### GET /api/v1/data\n\n## Rate Limits\n- Free: 100 req/hr\n- Pro: 1000 req/hr`;
  if (isLoading) return <div className="min-h-screen bg-page-bg flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[#4A97B0] border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-page-bg relative">
      <div className="ambient-blob w-[600px] h-[600px] bg-[#B7D8E6] -top-60 -right-60"></div>
      <TopNav role="api_owner" />
      <main className="flex-1 p-8 relative z-10 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex items-center gap-4 mb-6"><Link to={`/apis/${id}`} className="flex items-center gap-2 text-[#4A97B0] hover:text-[#3A87A0] font-medium"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Back to {api?.name}</Link></div>
        <div className="flex justify-between items-center mb-8">
          <div><h2 className="text-3xl font-bold text-text-primary">Documentation</h2><p className="text-text-secondary mt-1">API reference</p></div>
          {isOwner && (<button onClick={() => { if (isEditing) updateMutation.mutate(docContent || defaultDocs); else { setDocContent(api?.documentation || defaultDocs); setIsEditing(true); } }} className="px-4 py-2 neu-btn text-[#4A97B0] font-medium">{isEditing ? 'Save' : 'Edit'}</button>)}
        </div>
        <div className="neu-card-static p-8">
          {isEditing ? (<textarea value={docContent} onChange={(e) => setDocContent(e.target.value)} className="w-full h-[600px] neu-input text-text-primary p-4 font-mono text-sm" />) : (<div className="whitespace-pre-wrap font-mono text-sm text-text-secondary">{api?.documentation || defaultDocs}</div>)}
        </div>
      </main>
    </div>
  );
}

export default ApiDocs;