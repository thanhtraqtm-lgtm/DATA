import React from "react";

interface SplitTabProps {
  columns: string[];
  splitCol: string;
  setSplitCol: (col: string) => void;
  onSplit: () => void;
  mainDataLength: number;
}

export const SplitTab: React.FC<SplitTabProps> = ({
  columns,
  splitCol,
  setSplitCol,
  onSplit,
  mainDataLength
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#1f2937] rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4">✂️ TÁCH FILE HÀNG LOẠT THEO CỘT</h3>
        <p className="text-sm text-gray-400 mb-4">
          Chọn một cột, hệ thống sẽ tự động tách mỗi giá trị duy nhất trong cột đó thành một file Excel riêng,
          sau đó đóng gói thành file ZIP để tải về.
        </p>

        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-300 mb-1">Chọn cột để tách</label>
          <select
            value={splitCol}
            onChange={(e) => setSplitCol(e.target.value)}
            className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-sm"
            disabled={mainDataLength === 0}
          >
            <option value="">-- Chọn cột --</option>
            {columns.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <button
          onClick={onSplit}
          disabled={!splitCol || mainDataLength === 0}
          className="mt-5 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-xl transition-all"
        >
          📦 TÁCH & TẢI ZIP
        </button>

        {mainDataLength === 0 && (
          <p className="text-amber-400 text-sm mt-3">⚠️ Chưa có dữ liệu. Vui lòng tải file dữ liệu chính trước.</p>
        )}
      </div>
    </div>
  );
};