import { useQuery } from '@tanstack/react-query';
import { apisAPI, authAPI } from '../services/api';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip } from 'chart.js';

import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip);

function AdminDashboard() {
  const { data: usersData } = useQuery({ queryKey: ['allUsers'], queryFn: () => authAPI.getAllUsers().then(res => res.data) });
  const { data: apisData } = useQuery({ queryKey: ['allApis'], queryFn: () => apisAPI.getAll().then(res => res.data) });
  const totalUsers = usersData?.users?.length || 0;
  const totalApis = apisData?.apis?.length || 0;

  const lineData = { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets: [{ data: [12000,15000,18000,14000,20000,22000,25000], borderColor: '#4A97B0', backgroundColor: 'rgba(183,216,230,0.15)', fill: true, tension: 0.4 }] };
  const doughData = { labels: ['Active','Inactive','Pending'], datasets: [{ data: [65,25,10], backgroundColor: ['#3DAA7A','#D95252','#E8A642'], borderWidth: 0 }] };

  return (
    <div className="min-h-screen bg-page-bg relative">
      <div className="ambient-blob w-[600px] h-[600px] bg-[#B7D8E6] -top-60 -right-60"></div>

      <main className="flex-1 p-8 relative z-10 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div><h2 className="text-3xl font-bold text-text-primary">Admin Dashboard</h2><p className="text-text-secondary mt-1">Platform overview</p></div>
          <div className="neu-badge flex items-center gap-2 px-4 py-2"><span className="w-2 h-2 bg-success rounded-full animate-pulse"></span><span className="text-success text-sm font-medium">System Healthy</span></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-in">
          {[
            { label: 'Total Requests', value: '125,000', color: 'text-[#4A97B0]', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { label: 'Total Users', value: totalUsers, color: 'text-sky-500', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
            { label: 'Revenue', value: '₹45,000', color: 'text-warning', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: 'Active APIs', value: totalApis, color: 'text-purple-500', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
          ].map((s, i) => (
            <div key={i} className="neu-card p-6">
              <div className="w-12 h-12 neu-icon flex items-center justify-center mb-4"><svg className={`w-6 h-6 ${s.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg></div>
              <p className="text-text-secondary text-sm">{s.label}</p>
              <h3 className="text-3xl font-bold text-text-primary mt-1">{s.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 neu-card-static p-6"><h3 className="text-lg font-semibold text-text-primary mb-4">API Usage Trend</h3><div className="h-64"><Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div></div>
          <div className="neu-card-static p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">API Status</h3>
            <div className="h-48 flex items-center justify-center"><Doughnut data={doughData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
            <div className="flex justify-center gap-4 mt-4">{['Active','Inactive','Pending'].map((l, i) => (<div key={l} className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${['bg-success','bg-error','bg-warning'][i]}`}></span><span className="text-sm text-text-secondary">{l}</span></div>))}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { to: '/admin/users', label: 'Manage Users', sub: 'View and manage users', color: 'text-sky-500', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
            { to: '/admin/apis', label: 'All APIs', sub: 'View registered APIs', color: 'text-[#4A97B0]', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { to: '/admin/billing', label: 'Revenue', sub: 'Billing and revenue', color: 'text-warning', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
          ].map((item, i) => (
            <Link key={i} to={item.to} className="neu-card p-6 group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 neu-icon flex items-center justify-center"><svg className={`w-7 h-7 ${item.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg></div>
                <div><h3 className="text-lg font-semibold text-text-primary group-hover:text-[#4A97B0] transition-colors">{item.label}</h3><p className="text-text-secondary text-sm mt-1">{item.sub}</p></div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;