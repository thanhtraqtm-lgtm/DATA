import React from "react";
import { DataPreviewTable } from "../common/DataPreviewTable";

interface MergeTabProps {
  leftData: any[];
  leftFileName: string;
  rightData: any[];
  rightFileName: string;
  leftKey: string;
  rightKey: string;
  mainData: any[];
  columns: string[];
  setLeftKey: (key: string) => void;
  setRightKey: (key: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: "left" | "right") => void;
  onMerge: () => void;
}

export const MergeTab: React.FC<MergeTabProps> = ({
  leftData, leftFileName, rightData, rightFileName,
  leftKey, rightKey, mainData, columns,
  setLeftKey, setRightKey, onFileUpload, onMerge
}) => {
  const getColumns = (data: any[]) => data.length ? Object.keys(data[0]) : [];

  return (
    <div className="space-y-6">
      <div className="bg-[#1f2937] rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4">🌿 GHÉP NỐI HAI BẢNG (LEFT JOIN)</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Bảng trái */}
          <div className="bg-[#111827] p-4 rounded-xl">
            <h4 className="font-bold text-blue-400">BẢNG TRÁI (Dữ liệu chính)</h4>
            <label className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded cursor-pointer inline-block mt-2">
              Chọn file
              <input type="file" onChange={(e) => onFileUpload(e, "left")} className="hidden" />
            </label>
            <div className="text-xs text-gray-400 mt-2">{leftFileName || "Chưa có dữ liệu"}</div>
            {leftData.length > 0 && (
              <select
                value={leftKey}
                onChange={(e) => setLeftKey(e.target.value)}
                className="mt-3 w-full bg-[#111827] border border-gray-700 rounded px-2 py-1 text-sm"
              >
                <option value="">-- Chọn cột khóa trái --</option>
                {getColumns(leftData).map(c => <option key={c}>{c}</option>)}
              </select>
            )}
          </div>

          {/* Bảng phải */}
          <div className="bg-[#111827] p-4 rounded-xl">
            <h4 className="font-bold text-teal-400">BẢNG PHẢI (Thông tin bổ sung)</h4>
            <label className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded cursor-pointer inline-block mt-2">
              Chọn file
              <input type="file" onChange={(e) => onFileUpload(e, "right")} className="hidden" />
            </label>
            <div className="text-xs text-gray-400 mt-2">{rightFileName || "Chưa có dữ liệu"}</div>
            {rightData.length > 0 && (
              <select
                value={rightKey}
                onChange={(e) => setRightKey(e.target.value)}
                className="mt-3 w-full bg-[#111827] border border-gray-700 rounded px-2 py-1 text-sm"
              >
                <option value="">-- Chọn cột khóa phải --</option>
                {getColumns(rightData).map(c => <option key={c}>{c}</option>)}
              </select>
            )}
          </div>
        </div>

        <button
          onClick={onMerge}
          disabled={!leftData.length || !rightData.length || !leftKey || !rightKey}
          className="mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-xl transition-all"
        >
          🔗 THỰC HIỆN GHÉP NỐI
        </button>
      </div>

      <DataPreviewTable data={mainData} columns={columns} title="KẾT QUẢ GHÉP NỐI" />
    </div>
  );
};