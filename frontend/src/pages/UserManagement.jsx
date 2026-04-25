import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI, adminAPI } from '../services/api';
import { useToast } from '../components/Toast';
import TopNav from '../components/TopNav';
import NeuSelect from '../components/NeuSelect';

function UserManagement() {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const { data: usersData, isLoading } = useQuery({ queryKey: ['allUsers'], queryFn: () => authAPI.getAllUsers().then(res => res.data) });
  const updateRoleMutation = useMutation({ mutationFn: ({ userId, role }) => adminAPI.updateUserRole(userId, role), onSuccess: (d) => { addToast(d.data.message || 'Updated', 'success'); queryClient.invalidateQueries(['allUsers']); }, onError: (e) => addToast(e.response?.data?.message || 'Failed', 'error') });
  const deleteUserMutation = useMutation({ mutationFn: (id) => adminAPI.deleteUser(id), onSuccess: () => { addToast('Deleted', 'success'); queryClient.invalidateQueries(['allUsers']); }, onError: (e) => addToast(e.response?.data?.message || 'Failed', 'error') });
  const users = usersData?.users || [];

  if (isLoading) return (<div className="min-h-screen bg-page-bg"><TopNav role="admin" /><div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-[#4A97B0] border-t-transparent rounded-full"></div></div></div>);

  return (
    <div className="min-h-screen bg-page-bg relative">
      <div className="ambient-blob w-[600px] h-[600px] bg-[#B7D8E6] -top-60 -right-60"></div>
      <TopNav role="admin" />
      <main className="flex-1 p-8 relative z-10 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div><h3 className="text-3xl font-bold text-text-primary">User Management</h3><p className="text-text-secondary mt-1">Manage platform users</p></div>
          <div className="neu-badge flex items-center gap-2 px-4 py-2"><span className="text-[#4A97B0] text-sm font-medium">{users.length} Users</span></div>
        </div>
        <div className="neu-card-static overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-page-bg"><tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-text-secondary uppercase">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-border/30">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-3"><div className="w-10 h-10 neu-icon flex items-center justify-center text-[#4A97B0] font-medium">{u.name?.charAt(0).toUpperCase()}</div><span className="text-text-primary font-medium">{u.name}</span></div></td>
                    <td className="px-6 py-4 text-text-secondary">{u.email}</td>
                    <td className="px-6 py-4"><NeuSelect value={u.role} onChange={(val) => updateRoleMutation.mutate({ userId: u._id, role: val })} options={[{ value: 'api_owner', label: 'API Owner' }, { value: 'consumer', label: 'Consumer' }]} className="w-40" /></td>
                    <td className="px-6 py-4 text-text-secondary text-sm">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 text-right"><button onClick={() => { if (window.confirm('Delete user?')) deleteUserMutation.mutate(u._id); }} className="p-2 text-error/70 hover:text-error neu-btn"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserManagement;