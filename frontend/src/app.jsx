import React, { useEffect, useState } from 'react';
import axios from 'axios';

import ContractTable from './components/ContractTable';
import FilterBar from './components/FilterBar';
import TopVendorsChart from './components/TopVendorsChart';

function App() {
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [filters, setFilters] = useState({ year: '2023' });

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/contracts');
        setContracts(response.data);
        setFilteredContracts(response.data);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      }
    };
    fetchContracts();
  }, []);

  const handleFilter = ({ year }) => {
    setFilters({ year });
    const filtered = contracts.filter((contract) => contract.fiscal_year === parseInt(year));
    setFilteredContracts(filtered);
  };

  return (
    <div className="min-h-screen bg-[#0e121b] text-white px-6 py-4">
      <h1 className="text-3xl font-bold text-center mb-6">DefenseSpend Dashboard</h1>
      <FilterBar onFilter={handleFilter} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ContractTable data={filteredContracts} />
        </div>
        <div>
          <TopVendorsChart data={filteredContracts} />
        </div>
      </div>
    </div>
  );
}

export default App;
