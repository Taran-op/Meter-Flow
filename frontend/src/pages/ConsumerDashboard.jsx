import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apisAPI } from '../services/api';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import TopNav from '../components/TopNav';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

function ConsumerDashboard() {
  const { data: apisData } = useQuery({ queryKey: ['availableApis'], queryFn: () => apisAPI.getAll().then(res => res.data) });
  const apis = apisData?.apis || [];
  const subscriptions = [{ name: 'Weather API', status: 'active', calls: 1250, limit: 5000 }, { name: 'Payment Gateway', status: 'active', calls: 890, limit: 2000 }];
  const totalCalls = subscriptions.reduce((a, s) => a + s.calls, 0);
  const totalLimit = subscriptions.reduce((a, s) => a + s.limit, 0);
  const usagePercent = Math.round((totalCalls / totalLimit) * 100);
  const chartData = { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets: [{ data: [450,520,480,610,550,320,280], borderColor: '#4A97B0', backgroundColor: 'rgba(183,216,230,0.15)', fill: true, tension: 0.4 }] };

  return (
    <div className="min-h-screen bg-page-bg relative">
      <div className="ambient-blob w-[600px] h-[600px] bg-[#B7D8E6] -top-60 -right-60"></div>
      <TopNav role="consumer" />
      <main className="flex-1 p-8 relative z-10 max-w-[1600px] mx-auto animate-fade-in">
        <div className="mb-8"><h2 className="text-3xl font-bold text-text-primary">Consumer Dashboard</h2><p className="text-text-secondary mt-1">Discover and manage API subscriptions</p></div>

        <div className="neu-card-static p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="text-lg font-semibold text-text-primary">Monthly Usage</h3><p className="text-text-secondary text-sm mt-1">{totalCalls.toLocaleString()} / {totalLimit.toLocaleString()} calls</p></div>
            <span className="text-2xl font-bold text-[#4A97B0]">{usagePercent}%</span>
          </div>
          <div className="neu-progress-well h-3"><div className="bg-gradient-to-r from-[#4A97B0] to-[#7BB8CC] h-3 rounded-full transition-all duration-500" style={{ width: `${usagePercent}%` }}></div></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Active Subscriptions', value: subscriptions.length, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'text-sky-500' },
            { label: 'Total API Calls', value: totalCalls.toLocaleString(), icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'text-[#4A97B0]' },
            { label: 'Available APIs', value: apis.length, icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'text-purple-500' },
          ].map((s, i) => (
            <div key={i} className="neu-card p-6">
              <div className="w-12 h-12 neu-icon flex items-center justify-center mb-4"><svg className={`w-6 h-6 ${s.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg></div>
              <p className="text-text-secondary text-sm">{s.label}</p><h3 className="text-3xl font-bold text-text-primary mt-1">{s.value}</h3>
            </div>
          ))}
        </div>

        <div className="neu-card-static p-6 mb-8"><h3 className="text-lg font-semibold text-text-primary mb-4">Usage Trend</h3><div className="h-64"><Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div></div>

        <div className="neu-card-static p-6">
          <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-semibold text-text-primary">My Subscriptions</h3><Link to="/my-subscriptions" className="text-sm text-[#4A97B0] hover:text-[#3A87A0] font-medium">View All →</Link></div>
          <div className="space-y-4">
            {subscriptions.map((sub, i) => (
              <div key={i} className="flex items-center justify-between p-4 neu-inset">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 neu-icon flex items-center justify-center"><svg className="w-5 h-5 text-[#4A97B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                  <div><h4 className="font-medium text-text-primary">{sub.name}</h4><p className="text-sm text-text-secondary">{sub.calls} / {sub.limit} calls</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 neu-progress-well h-2"><div className="bg-[#4A97B0] h-2 rounded-full" style={{ width: `${(sub.calls / sub.limit) * 100}%` }}></div></div>
                  <span className="neu-badge px-3 py-1 text-xs text-success font-medium">{sub.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ConsumerDashboard;