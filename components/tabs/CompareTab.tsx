import React from "react";
import { DataPreviewTable } from "../common/DataPreviewTable";

interface CompareTabProps {
  oldData: any[];
  oldFileName: string;
  newData: any[];
  newFileName: string;
  diffKey: string;
  mainData: any[];
  columns: string[];
  setDiffKey: (key: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: "old" | "new") => void;
  onCompare: () => void;
}

export const CompareTab: React.FC<CompareTabProps> = ({
  oldData, oldFileName, newData, newFileName,
  diffKey, mainData, columns, setDiffKey, onFileUpload, onCompare
}) => {
  const getOldColumns = () => oldData.length ? Object.keys(oldData[0]) : [];
  const getNewColumns = () => newData.length ? Object.keys(newData[0]) : [];

  // Tìm các cột chung giữa hai bảng để làm khóa
  const commonColumns = () => {
    const oldCols = getOldColumns();
    const newCols = getNewColumns();
    return oldCols.filter(c => newCols.includes(c));
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1f2937] rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4">🔍 SO SÁNH HAI FILE DỮ LIỆU (CŨ - MỚI)</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* File cũ */}
          <div className="bg-[#111827] p-4 rounded-xl">
            <h4 className="font-bold text-gray-400">FILE CŨ (Bản gốc)</h4>
            <label className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded cursor-pointer inline-block mt-2">
              Chọn file
              <input type="file" onChange={(e) => onFileUpload(e, "old")} className="hidden" />
            </label>
            <div className="text-xs text-gray-400 mt-2">{oldFileName || "Chưa có dữ liệu"}</div>
          </div>

          {/* File mới */}
          <div className="bg-[#111827] p-4 rounded-xl">
            <h4 className="font-bold text-cyan-400">FILE MỚI (Bản cập nhật)</h4>
            <label className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded cursor-pointer inline-block mt-2">
              Chọn file
              <input type="file" onChange={(e) => onFileUpload(e, "new")} className="hidden" />
            </label>
            <div className="text-xs text-gray-400 mt-2">{newFileName || "Chưa có dữ liệu"}</div>
          </div>
        </div>

        {oldData.length > 0 && newData.length > 0 && (
          <div className="mt-5">
            <label className="text-sm font-medium text-gray-300">🔑 Chọn cột khóa chung (Unique ID)</label>
            <select
              value={diffKey}
              onChange={(e) => setDiffKey(e.target.value)}
              className="mt-1 w-full md:w-80 bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">-- Chọn cột làm khóa --</option>
              {commonColumns().map(c => <option key={c}>{c}</option>)}
            </select>
            <p className="text-xs text-gray-500 mt-1">Cột này phải có giá trị duy nhất cho mỗi dòng (ví dụ: Mã số thuế, ID doanh nghiệp).</p>
          </div>
        )}

        <button
          onClick={onCompare}
          disabled={!oldData.length || !newData.length || !diffKey}
          className="mt-6 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-xl transition-all"
        >
          🔁 BẮT ĐẦU SO SÁNH
        </button>
      </div>

      <DataPreviewTable data={mainData} columns={columns} title="KẾT QUẢ SO SÁNH" />
    </div>
  );
};