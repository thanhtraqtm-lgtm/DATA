import React, { useState, useEffect } from "react";
import { vsicRawData } from "../data/vsic";

const VsicCatalogExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<[string, string][]>([]);

  useEffect(() => {
    const entries = Object.entries(vsicRawData);
    if (!searchTerm.trim()) {
      setFilteredData(entries);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredData(entries.filter(([code, name]) => 
        code.toLowerCase().includes(term) || name.toLowerCase().includes(term)
      ));
    }
  }, [searchTerm, vsicRawData]);

  return (
    <div className="bg-[#1f2937] rounded-2xl p-6">
      <h3 className="text-lg font-bold mb-4">🗂️ DANH MỤC HỆ THỐNG PHÂN CẤP NGÀNH (ĐÃ HỢP NHẤT)</h3>
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Nhập mã ngành hoặc từ khóa (ví dụ: 56101, cà phê, sản xuất)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#111827] border border-gray-700 rounded-lg px-4 py-2 text-sm"
        />
      </div>
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-sm">
          <thead className="bg-[#0f172a] sticky top-0">
            <tr><th className="p-2 text-left">Mã ngành</th><th className="p-2 text-left">Tên ngành</th></tr>
          </thead>
          <tbody>
            {filteredData.map(([code, name]) => (
              <tr key={code} className="border-t border-gray-800">
                <td className="p-2 font-mono">{code}</td>
                <td className="p-2">{name}</td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr><td colSpan={2} className="p-4 text-center text-gray-500">Không tìm thấy mã ngành nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VsicCatalogExplorer;