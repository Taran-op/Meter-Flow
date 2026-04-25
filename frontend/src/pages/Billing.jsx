import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apisAPI, usageAPI } from '../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import NeuSelect from '../components/NeuSelect';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function Billing() {
  const [selectedApi, setSelectedApi] = useState('');
  const { data: apisData } = useQuery({ queryKey: ['apis'], queryFn: () => apisAPI.getAll().then(res => res.data) });
  const apis = apisData?.apis || [];
  const { data: billingData, isLoading: billingLoading } = useQuery({ queryKey: ['billing', selectedApi], queryFn: () => selectedApi ? usageAPI.getBilling(selectedApi).then(res => res.data) : null, enabled: !!selectedApi });
  const chartData = { labels: ['Free','Charged'], datasets: [{ data: billingData ? [billingData.freeRequests, billingData.chargedRequests] : [1000,0], backgroundColor: ['#3DAA7A','#4A97B0'], borderRadius: 8 }] };

  return (
    <div className="min-h-screen bg-page-bg relative">
      <div className="ambient-blob w-[600px] h-[600px] bg-[#B7D8E6] -top-60 -right-60"></div>

      <main className="flex-1 p-8 relative z-10 max-w-[1600px] mx-auto animate-fade-in">
        <div className="mb-8"><h2 className="text-3xl font-bold text-text-primary">Billing & Usage</h2><p className="text-text-secondary mt-1">Monitor usage and payments</p></div>

        <div className="neu-card-static p-6 mb-6">
          <label className="block text-sm font-medium text-text-secondary mb-3">Select API</label>
          <NeuSelect
            value={selectedApi}
            onChange={(val) => setSelectedApi(val)}
            options={[{ value: '', label: 'Select an API' }, ...apis.map(a => ({ value: a._id, label: a.name }))]}
            className="w-full md:w-64"
            placeholder="Select an API"
          />
        </div>

        {!selectedApi ? (
          <div className="neu-card-static p-8 text-center"><div className="w-16 h-16 neu-icon flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></div><p className="text-text-secondary">Select an API to view billing details.</p></div>
        ) : billingLoading ? (
          <div className="flex items-center justify-center h-64 text-text-secondary"><svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[
                { label: 'Billing Period', value: billingData?.billingPeriod, color: 'text-sky-500', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { label: 'Total Requests', value: billingData?.totalRequests?.toLocaleString(), color: 'text-[#4A97B0]', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z' },
                { label: 'Free Requests', value: billingData?.freeRequests?.toLocaleString(), color: 'text-success', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                { label: 'Total Amount', value: '₹' + billingData?.totalAmount, color: 'text-warning', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1' },
              ].map((s, i) => (
                <div key={i} className="neu-card p-6">
                  <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 neu-icon flex items-center justify-center"><svg className={`w-5 h-5 ${s.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg></div><p className="text-text-secondary text-sm">{s.label}</p></div>
                  <p className="text-2xl font-bold text-text-primary">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="neu-card-static p-6 mb-6"><h3 className="text-lg font-semibold text-text-primary mb-4">Request Distribution</h3><div className="h-64"><Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div></div>
            <div className="neu-card-static p-6"><h3 className="text-lg font-semibold text-text-primary mb-4">Pricing Details</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{[{ l: 'Free Tier', v: '1,000 req/month' }, { l: 'Paid Tier', v: '₹0.50 / 100 req' }, { l: 'Charged', v: billingData?.chargedRequests?.toLocaleString() }, { l: 'Status', v: billingData?.status }].map((p, i) => (<div key={i} className="neu-inset p-4"><p className="text-sm text-text-secondary mb-1">{p.l}</p><p className="font-medium text-text-primary capitalize">{p.v}</p></div>))}</div></div>
          </>
        )}
      </main>
    </div>
  );
}

export default Billing;