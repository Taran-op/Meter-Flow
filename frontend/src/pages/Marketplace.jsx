import { useState } from 'react';
import TopNav from '../components/TopNav';

const categories = [
  { id: 'all', name: 'All APIs' }, { id: 'weather', name: 'Weather' }, { id: 'payment', name: 'Payment' },
  { id: 'analytics', name: 'Analytics' }, { id: 'ai', name: 'AI/ML' }, { id: 'storage', name: 'Storage' },
];

const mockAPIs = [
  { _id: '1', name: 'Weather API', description: 'Real-time weather data with 7-day forecast', category: 'weather', price: 0, rating: 4.8, users: 1250 },
  { _id: '2', name: 'Payment Gateway', description: 'Secure payment processing', category: 'payment', price: 0.5, rating: 4.9, users: 3400 },
  { _id: '3', name: 'Analytics Pro', description: 'Advanced analytics and reporting', category: 'analytics', price: 0.3, rating: 4.6, users: 890 },
  { _id: '4', name: 'AI Text Generator', description: 'Generate human-like text with GPT', category: 'ai', price: 1.0, rating: 4.7, users: 2100 },
  { _id: '5', name: 'Image Storage', description: 'Cloud storage for images and media', category: 'storage', price: 0.2, rating: 4.5, users: 560 },
  { _id: '6', name: 'Geo Location', description: 'IP-based geolocation data', category: 'analytics', price: 0.1, rating: 4.4, users: 1800 },
  { _id: '7', name: 'Email Service', description: 'Transactional email delivery', category: 'payment', price: 0.05, rating: 4.3, users: 920 },
  { _id: '8', name: 'Sentiment Analysis', description: 'Analyze text sentiment with NLP', category: 'ai', price: 0.8, rating: 4.6, users: 670 },
];

function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const filtered = mockAPIs.filter(api => (selectedCategory === 'all' || api.category === selectedCategory) && (api.name.toLowerCase().includes(searchQuery.toLowerCase()) || api.description.toLowerCase().includes(searchQuery.toLowerCase())));

  return (
    <div className="min-h-screen bg-page-bg relative">
      <div className="ambient-blob w-[600px] h-[600px] bg-[#B7D8E6] -top-60 -right-60"></div>
      <TopNav role="consumer" />
      <main className="flex-1 p-8 relative z-10 max-w-[1600px] mx-auto animate-fade-in">
        <div className="mb-8"><h2 className="text-3xl font-bold text-text-primary">API Marketplace</h2><p className="text-text-secondary mt-1">Discover and integrate powerful APIs</p></div>

        <div className="neu-card-static p-4 mb-6">
          <div className="relative">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search APIs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 neu-input text-text-primary placeholder-text-muted" />
          </div>
        </div>

        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all ${selectedCategory === cat.id ? 'neu-inset text-[#4A97B0]' : 'neu-flat text-text-secondary hover:text-text-primary'}`}>{cat.name}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(api => (
            <div key={api._id} className="neu-card p-6 group">
              <div className="flex items-center justify-between mb-4">
                <span className="neu-badge px-3 py-1 text-xs text-success font-medium">Active</span>
                <div className="flex items-center gap-1 text-amber-500"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg><span className="text-sm font-medium">{api.rating}</span></div>
              </div>
              <h3 className="text-lg font-semibold text-text-primary group-hover:text-[#4A97B0] transition-colors mb-2">{api.name}</h3>
              <p className="text-text-secondary text-sm mb-4">{api.description}</p>
              <div className="flex items-center justify-between text-sm text-text-muted mb-4">
                <span>{api.users.toLocaleString()} users</span>
                <span className="text-[#4A97B0] font-medium">{api.price === 0 ? 'Free' : `₹${api.price}/100`}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 neu-btn text-[#4A97B0] text-sm font-medium">Details</button>
                <button className="px-4 py-2 neu-btn text-text-secondary text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (<div className="text-center py-12"><div className="w-16 h-16 neu-icon flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><p className="text-text-secondary">No APIs found</p></div>)}
      </main>
    </div>
  );
}

export default Marketplace;