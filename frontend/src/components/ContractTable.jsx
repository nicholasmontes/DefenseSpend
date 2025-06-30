function ContractTable({ data }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Contracts ({data.length})</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default ContractTable;
