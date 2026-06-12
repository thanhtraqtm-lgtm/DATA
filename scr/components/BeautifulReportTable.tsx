import React from "react";
import { Download } from "lucide-react";

interface BeautifulReportTableProps {
  rows: any[];
  cols: string[];
  level: number;
  reportType: "flat" | "pivot";
  onExport: () => void;
}

export const BeautifulReportTable: React.FC<BeautifulReportTableProps> = ({ rows, cols, level, reportType, onExport }) => {
  if (!rows.length) return null;
  return (
    <div className="bg-[#1f2937] rounded-2xl p-6 border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-md font-bold text-amber-400">📋 BÁO CÁO TỔNG HỢP (Cấp {level})</h4>
        <button onClick={onExport} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-xl flex items-center gap-1">
          <Download className="w-3.5 h-3.5" /> Xuất Excel
        </button>
      </div>
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-xs border-collapse">
          <thead className="bg-[#0f172a] sticky top-0 z-10">
            <tr>
              {cols.map((col, idx) => (
                <th key={idx} className="p-3 text-center font-semibold border-b border-gray-700">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-gray-800 hover:bg-white/5">
                {cols.map((col, j) => (
                  <td key={j} className="p-2 text-center">{row[col] ?? ""}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};