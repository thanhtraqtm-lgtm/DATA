import React from "react";
import { DataPreviewTable } from "../common/DataPreviewTable";

interface StandardizeTabProps {
  mainData: any[];
  columns: string[];
  stdCol: string;
  stdMatch: { total: number; valid: number; invalid: number };
  compA: string;
  compB: string;
  compRule: string;
  setStdCol: (col: string) => void;
  setCompA: (col: string) => void;
  setCompB: (col: string) => void;
  setCompRule: (rule: string) => void;
  onStandardize: () => void;
  onCrossCompare: () => void;
}

export const StandardizeTab: React.FC<StandardizeTabProps> = ({
  mainData,
  columns,
  stdCol,
  stdMatch,
  compA,
  compB,
  compRule,
  setStdCol,
  setCompA,
  setCompB,
  setCompRule,
  onStandardize,
  onCrossCompare
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#1f2937] rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4">🧠 CHUẨN HÓA MÃ NGÀNH VSIC (CẤP 5)</h3>
        <p className="text-sm text-gray-400 mb-4">
          Dựa vào danh mục ngành bạn đã nạp, hệ thống sẽ tra cứu mã ngành, thêm cột "Tên ngành chuẩn" và "Trạng thái".
        </p>
        
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-300 mb-1">Chọn cột chứa mã ngành cần chuẩn hóa</label>
          <select
            value={stdCol}
            onChange={(e) => setStdCol(e.target.value)}
            className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">-- Chọn cột --</option>
            {columns.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <button
          onClick={onStandardize}
          disabled={!stdCol || mainData.length === 0}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-xl transition-all"
        >
          🔄 CHUẨN HÓA MÃ NGÀNH
        </button>

        {stdMatch.total > 0 && (
          <div className="mt-3 p-3 bg-[#111827] rounded-lg flex gap-4 text-sm">
            <span>✅ Hợp lệ: <strong className="text-emerald-400">{stdMatch.valid}</strong></span>
            <span>❌ Không có trong danh mục: <strong className="text-red-400">{stdMatch.invalid}</strong></span>
            <span>📊 Tổng: {stdMatch.total}</span>
          </div>
        )}
      </div>

      {/* Công cụ đối chiếu 2 cột */}
      <div className="bg-[#1f2937] rounded-2xl p-6">
        <h4 className="text-md font-bold text-cyan-400 mb-3 flex items-center gap-2">🔄 ĐỐI CHIẾU SONG SONG HAI CỘT BẤT KỲ</h4>
        <p className="text-sm text-gray-400 mb-4">
          So sánh giá trị giữa 2 cột (ví dụ: mã ngành tự nhập vs mã gợi ý, tên ngành khai báo vs tên chuẩn). Hệ thống sẽ thêm cột "Kết quả đối chiếu".
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-400 block">Cột thứ nhất (A)</label>
            <select value={compA} onChange={e=>setCompA(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-sm">
              <option value="">-- Chọn cột A --</option>
              {columns.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 block">Cột thứ hai (B)</label>
            <select value={compB} onChange={e=>setCompB(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-sm">
              <option value="">-- Chọn cột B --</option>
              {columns.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 block">Quy tắc so khớp</label>
            <select value={compRule} onChange={e=>setCompRule(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-sm">
              <option value="exact">So khớp chính xác (phân biệt hoa/thường)</option>
              <option value="normalize">Chuẩn hóa (bỏ dấu, viết thường, gộp khoảng trắng)</option>
              <option value="sector_code">So mã ngành (chỉ lấy số, chấp nhận quan hệ cha-con)</option>
              <option value="substring">Một bên chứa bên kia (substring)</option>
            </select>
          </div>
        </div>

        <button
          onClick={onCrossCompare}
          disabled={!compA || !compB || mainData.length === 0}
          className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-xl transition-all"
        >
          🔍 THỰC HIỆN ĐỐI CHIẾU
        </button>
      </div>

      <DataPreviewTable data={mainData} columns={columns} title="DỮ LIỆU SAU XỬ LÝ" />
    </div>
  );
};