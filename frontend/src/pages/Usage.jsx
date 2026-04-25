import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip);

function Usage() {
  const [stats, setStats] = useState({ calls: 0, limit: 0, percent: 0 });
  useEffect(() => {
    const target = 2140, limit = 5000, steps = 60; let cur = 0;
    const t = setInterval(() => { cur += target / steps; if (cur >= target) { setStats({ calls: target, limit, percent: Math.round((target / limit) * 100) }); clearInterval(t); } else { setStats({ calls: Math.floor(cur), limit, percent: Math.floor((cur / limit) * 100) }); } }, 25);
    return () => clearInterval(t);
  }, []);

  const daily = { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets: [{ data: [320,450,380,520,490,280,200], borderColor: '#4A97B0', backgroundColor: 'rgba(183,216,230,0.15)', fill: true, tension: 0.4 }] };
  const byEndpoint = { labels: ['/weather','/payment','/analytics','/geo','/email'], datasets: [{ data: [850,620,450,320,200], backgroundColor: ['#4A97B0','#7BB8CC','#E8A642','#9b87f5','#D95252'], borderRadius: 8 }] };

  return (
    <div className="min-h-screen bg-page-bg relative">
      <div className="ambient-blob w-[600px] h-[600px] bg-[#B7D8E6] -top-60 -right-60"></div>

      <main className="flex-1 p-8 relative z-10 max-w-[1600px] mx-auto animate-fade-in">
        <div className="mb-8"><h2 className="text-3xl font-bold text-text-primary">My Usage</h2><p className="text-text-secondary mt-1">Track API consumption</p></div>

        <div className="neu-card-static p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div><h3 className="text-xl font-semibold text-text-primary">Monthly API Calls</h3><p className="text-text-secondary text-sm mt-1">April 1 - April 30</p></div>
            <div className="text-right"><p className="text-4xl font-bold text-text-primary">{stats.calls.toLocaleString()}</p><p className="text-text-secondary">of {stats.limit.toLocaleString()}</p></div>
          </div>
          <div className="neu-progress-well h-4 mb-4"><div className={`h-4 rounded-full transition-all duration-500 ${stats.percent > 80 ? 'bg-gradient-to-r from-warning to-error' : 'bg-gradient-to-r from-[#4A97B0] to-[#7BB8CC]'}`} style={{ width: `${stats.percent}%` }}></div></div>
          <div className="flex justify-between text-sm text-text-secondary"><span>{stats.percent}% used</span><span>{(stats.limit - stats.calls).toLocaleString()} remaining</span></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 stagger-in">
          {[{ l: 'Success Rate', v: '98.5%' }, { l: 'Avg Response', v: '45ms' }, { l: 'Peak Time', v: '2:00 PM' }, { l: 'Uptime', v: '99.9%' }].map((s, i) => (
            <div key={i} className="neu-card p-6"><p className="text-text-secondary text-sm mb-1">{s.l}</p><p className="text-2xl font-bold text-text-primary">{s.v}</p></div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="neu-card-static p-6"><h3 className="text-lg font-semibold text-text-primary mb-4">Daily Usage</h3><div className="h-64"><Line data={daily} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div></div>
          <div className="neu-card-static p-6"><h3 className="text-lg font-semibold text-text-primary mb-4">By Endpoint</h3><div className="h-64"><Bar data={byEndpoint} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } } }} /></div></div>
        </div>
      </main>
    </div>
  );
}

export default Usage;