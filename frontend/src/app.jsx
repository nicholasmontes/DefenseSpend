import React, { useEffect, useState, useMemo } from 'react';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Download, 
  Calendar, 
  ArrowUpDown, 
  ChevronUp, 
  ChevronDown, 
  Eye,
  AlertCircle,
  Loader,
  BarChart3
} from 'lucide-react';

function ContractTable({ data = [], loading = false, error = null, year, onYearChange }) {
  const [sortConfig, setSortConfig] = useState({ key: 'Award Amount', direction: 'desc' });
  const [selectedContract, setSelectedContract] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(null);

  // Sort data
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    let sorted = [...data];
    
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'Award Amount') {
          aValue = Number(aValue) || 0;
          bValue = Number(bValue) || 0;
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return sorted;
  }, [data, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const totalValue = sortedData.reduce((sum, contract) => sum + (Number(contract['Award Amount']) || 0), 0);

  // Format date properly
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  // Generate analytics data for a contract
  const generateAnalyticsData = (contract) => {
    const amount = Number(contract['Award Amount']) || 0;
    const baseAmount = amount / 12; // Simulate monthly data
    return Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      value: Math.floor(baseAmount * (0.8 + Math.random() * 0.4)) // Add some variation
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-full flex items-center justify-center mb-6">
            <Loader className="w-16 h-16 text-blue-400 animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Loading Contracts</h3>
          <p className="text-blue-300 text-center max-w-md">
            Fetching defense contract data from USASpending.gov...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="w-32 h-32 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-16 h-16 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Error Loading Contracts</h3>
          <p className="text-blue-300 text-center max-w-md mb-4">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-900 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-full flex items-center justify-center mb-6">
            <Building2 className="w-16 h-16 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No Contracts Found</h3>
          <p className="text-blue-300 text-center max-w-md">
            No defense contracts found for {year}. Try selecting a different year.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent mb-2">
              Defense Contract Dashboard
            </h1>
            <p className="text-blue-300 text-lg">Defense spending analytics for {year}</p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <select
              value={year}
              onChange={(e) => onYearChange(parseInt(e.target.value))}
              className="px-4 py-2 bg-slate-800/80 border border-blue-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              {[2024, 2023, 2022, 2021, 2020].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-900 transition-all duration-300 shadow-lg">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-800/30 to-blue-900/20 border border-blue-600/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Contracts</p>
                <p className="text-3xl font-bold text-white">{sortedData.length.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-700/30 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-300" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-800/30 to-emerald-900/20 border border-emerald-600/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm font-medium">Total Value</p>
                <p className="text-3xl font-bold text-white">
                  ${sortedData.length > 0 ? (totalValue / 1000000).toFixed(1) : '0'}M
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-700/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-300" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-800/30 to-purple-900/20 border border-purple-600/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Avg Contract</p>
                <p className="text-3xl font-bold text-white">
                  ${sortedData.length > 0 ? (totalValue / sortedData.length / 1000000).toFixed(1) : '0'}M
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-700/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-blue-600/20 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 border-b border-blue-600/30">
                {[
                  { key: 'Award ID', label: 'Award ID', icon: null },
                  { key: 'Recipient Name', label: 'Recipient', icon: Building2 },
                  { key: 'Award Amount', label: 'Amount', icon: DollarSign },
                  { key: 'Action Date', label: 'Date', icon: Calendar }
                ].map(({ key, label, icon: Icon }) => (
                  <th
                    key={key}
                    className="px-6 py-4 text-left cursor-pointer hover:bg-slate-700/50 transition-colors duration-200 group"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-200 uppercase tracking-wider">
                      {Icon && <Icon className="w-4 h-4 text-blue-300" />}
                      {label}
                      <ArrowUpDown className="w-4 h-4 text-blue-400 group-hover:text-blue-200 transition-colors" />
                      {sortConfig.key === key && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="w-4 h-4 text-blue-300" />
                          : <ChevronDown className="w-4 h-4 text-blue-300" />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 text-right text-sm font-semibold text-blue-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-800/20">
              {sortedData.map((contract, idx) => (
                <tr
                  key={contract['Award ID'] || idx}
                  className={`
                    group transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-800/20 hover:to-slate-800/20
                    ${idx % 2 === 0 ? 'bg-slate-800/10' : 'bg-slate-900/10'}
                  `}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <span className="text-sm font-mono text-blue-300 font-semibold">
                        {contract['Award ID'] || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-700/30 to-blue-800/30 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-300" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{contract['Recipient Name'] || 'Unknown Recipient'}</p>
                        <p className="text-blue-300 text-sm">Defense Contractor</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-emerald-300 font-bold text-lg">
                        ${Number(contract['Award Amount'] || 0).toLocaleString(undefined, {maximumFractionDigits: 0})}
                      </span>
                      <span className="text-blue-400 text-sm">
                        ${(Number(contract['Award Amount'] || 0) / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-blue-200">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      {formatDate(contract['Action Date'])}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => setShowAnalytics(contract)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-purple-700/30 to-purple-800/30 text-purple-300 rounded-lg hover:from-purple-700/50 hover:to-purple-800/50 transition-all duration-300"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Analytics
                      </button>
                      <button
                        onClick={() => setSelectedContract(contract)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-blue-700/30 to-blue-800/30 text-blue-300 rounded-lg hover:from-blue-700/50 hover:to-blue-800/50 transition-all duration-300"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-600/30 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Contract Analytics</h2>
                <p className="text-blue-300">{showAnalytics['Recipient Name']}</p>
              </div>
              <button
                onClick={() => setShowAnalytics(null)}
                className="text-blue-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-300">Total Contract Value</span>
                  <span className="text-2xl font-bold text-emerald-300">
                    ${Number(showAnalytics['Award Amount'] || 0).toLocaleString()}
                  </span>
                </div>
              </div>
              
              {/* Simple Bar Chart */}
              <div className="bg-slate-800/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Monthly Distribution Simulation</h3>
                <div className="flex items-end gap-2 h-40">
                  {generateAnalyticsData(showAnalytics).map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm min-h-[4px]"
                        style={{ 
                          height: `${(item.value / Math.max(...generateAnalyticsData(showAnalytics).map(d => d.value))) * 100}%` 
                        }}
                      ></div>
                      <span className="text-xs text-blue-300 mt-2">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contract Detail Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-600/30 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Contract Details</h2>
              <button
                onClick={() => setSelectedContract(null)}
                className="text-blue-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-blue-300 text-sm">Award ID</label>
                  <p className="text-white font-mono text-lg">{selectedContract['Award ID'] || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-blue-300 text-sm">Award Amount</label>
                  <p className="text-emerald-300 font-bold text-xl">
                    ${Number(selectedContract['Award Amount'] || 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-blue-300 text-sm">Recipient</label>
                <p className="text-white text-lg font-semibold">{selectedContract['Recipient Name'] || 'Unknown Recipient'}</p>
              </div>
              <div>
                <label className="text-blue-300 text-sm">Action Date</label>
                <p className="text-white">{formatDate(selectedContract['Action Date'])}</p>
              </div>
              {selectedContract['Description'] && (
                <div>
                  <label className="text-blue-300 text-sm">Description</label>
                  <p className="text-blue-100 leading-relaxed">{selectedContract['Description']}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(2023);

  const fetchContracts = async (selectedYear) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8000/contracts?year=${selectedYear}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched contracts count:', data.results?.length || 0);
      console.log('Fetched contracts data:', data.results);
      
      setContracts(data.results || []);
    } catch (err) {
      console.error('Error fetching contracts:', err);
      setError(err.message || 'Failed to fetch contracts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts(year);
  }, [year]);

  const handleYearChange = (newYear) => {
    setYear(newYear);
  };

  return <ContractTable data={contracts} loading={loading} error={error} year={year} onYearChange={handleYearChange} />;
}

export default App;