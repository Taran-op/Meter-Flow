import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apisAPI, usageAPI } from '../services/api';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import TopNav from '../components/TopNav';
import NeuSelect from '../components/NeuSelect';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [selectedApi, setSelectedApi] = useState(null);
  const { data: apisData } = useQuery({ queryKey: ['apis'], queryFn: () => apisAPI.getAll().then(res => res.data) });
  const apis = apisData?.apis || [];
  useEffect(() => { if (apis.length > 0 && !selectedApi) setSelectedApi(apis[0]); }, [apis, selectedApi]);
  const { data: statsData, isLoading } = useQuery({ queryKey: ['stats', selectedApi?._id], queryFn: () => selectedApi ? usageAPI.getStats(selectedApi._id).then(res => res.data) : null, enabled: !!selectedApi });

  const chartData = {
    labels: statsData?.hourlyStats?.map(s => s._id) || [],
    datasets: [{ data: statsData?.hourlyStats?.map(s => s.count) || [], borderColor: '#4A97B0', backgroundColor: 'rgba(183,216,230,0.15)', fill: true, tension: 0.4, pointBackgroundColor: '#4A97B0' }],
  };

  return (
    <div className="min-h-screen bg-page-bg relative">
      <div className="ambient-blob w-[600px] h-[600px] bg-[#B7D8E6] -top-60 -right-60"></div>
      <TopNav role="api_owner" />
      <main className="flex-1 p-8 relative z-10 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div><h2 className="text-3xl font-bold text-text-primary">Dashboard</h2><p className="text-text-secondary mt-1">Monitor your API performance</p></div>
          <div className="neu-badge flex items-center gap-2 px-4 py-2"><span className="w-2 h-2 bg-success rounded-full animate-pulse"></span><span className="text-success text-sm font-medium">Gateway Live</span></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-in">
          {[
            { label: 'Total Requests', value: statsData?.stats?.totalRequests?.toLocaleString() || 0, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'text-[#4A97B0]' },
            { label: 'Active APIs', value: apis.length, icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-sky-500' },
            { label: 'Success Rate', value: statsData?.stats?.totalRequests ? Math.round((statsData.stats.successCount / statsData.stats.totalRequests) * 100) + '%' : '0%', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-warning' },
            { label: 'Avg Response', value: Math.round(statsData?.stats?.avgResponseTime || 0) + 'ms', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'text-purple-500' },
          ].map((stat, i) => (
            <div key={i} className="neu-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 neu-icon flex items-center justify-center`}>
                  <svg className={`w-6 h-6 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
                </div>
              </div>
              <p className="text-text-secondary text-sm">{stat.label}</p>
              <h3 className="text-3xl font-bold text-text-primary mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="neu-card-static p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div><h3 className="text-lg font-semibold text-text-primary">Requests / Hour</h3><p className="text-text-secondary text-sm mt-1">API call volume over time</p></div>
            <NeuSelect
              value={selectedApi?._id || ''}
              onChange={(val) => setSelectedApi(apis.find(a => a._id === val))}
              options={apis.map(api => ({ value: api._id, label: api.name }))}
              className="w-48"
              placeholder="Select API"
            />
          </div>
          <div className="h-64">{isLoading ? (<div className="flex items-center justify-center h-full text-text-secondary"><svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Loading...</div>) : (<Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />)}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { to: '/apis', label: 'Manage APIs', sub: 'Create and manage endpoints', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-[#4A97B0]' },
            { to: '/billing', label: 'Billing', sub: 'Check usage and payments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', color: 'text-sky-500' },
          ].map((item, i) => (
            <Link key={i} to={item.to} className="neu-card p-6 group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 neu-icon flex items-center justify-center group-hover:shadow-neu transition-all">
                  <svg className={`w-7 h-7 ${item.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                </div>
                <div><h3 className="text-lg font-semibold text-text-primary group-hover:text-[#4A97B0] transition-colors">{item.label}</h3><p className="text-text-secondary text-sm mt-1">{item.sub}</p></div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
