import React, { useState } from 'react';

function FilterBar({ onFilter }) {
  const [year, setYear] = useState('2023');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ year });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4 mb-6">
      <div>
        <label className="block text-sm">Fiscal Year</label>
        <select
          className="bg-[#1c2333] text-white border border-gray-600 px-2 py-1 rounded"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
      >
        Apply Filters
      </button>
    </form>
  );
}

export default FilterBar;
