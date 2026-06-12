import React from "react";
import { BeautifulReportTable } from "../../BeautifulReportTable";
import SectorRevenueChart from "../../sectorRevenueChart";
import { DataPreviewTable } from "../common/DataPreviewTable";

interface ReportTabProps {
  mainData: any[];
  columns: string[];
  mapping: any;
  qrManganh: string;
  qrXa: string;
  qrDoanhthu: string;
  qrLaodong: string;
  reportType: "flat" | "pivot";
  quickRows: any[];
  quickCols: string[];
  quickLevel: number;
  setQrManganh: (v: string) => void;
  setQrXa: (v: string) => void;
  setQrDoanhthu: (v: string) => void;
  setQrLaodong: (v: string) => void;
  setReportType: (t: "flat" | "pivot") => void;
  onQuickReport: (level: number) => void;
  onAppendLevels: () => void;
  onExportQuickReport: () => void;
}

export const ReportTab: React.FC<ReportTabProps> = ({
  mainData, columns, mapping,
  qrManganh, qrXa, qrDoanhthu, qrLaodong, reportType,
  quickRows, quickCols, quickLevel,
  setQrManganh, setQrXa, setQrDoanhthu, setQrLaodong, setReportType,
  onQuickReport, onAppendLevels, onExportQuickReport
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#1f2937] rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4">📊 TỔNG HỢP BÁO CÁO THEO NGÀNH VÀ XÃ</h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-400 block">Cột mã ngành (VSIC)</label>
            <select value={qrManganh} onChange={e=>setQrManganh(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-sm">
              <option value="">-- Chọn cột --</option>
              {columns.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 block">Cột địa bàn (Xã/Phường)</label>
            <select value={qrXa} onChange={e=>setQrXa(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-sm">
              <option value="">-- Chọn cột --</option>
              {columns.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 block">Cột Doanh thu (tùy chọn)</label>
            <select value={qrDoanhthu} onChange={e=>setQrDoanhthu(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-sm">
              <option value="">-- Không sử dụng --</option>
              {columns.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 block">Cột Lao động (tùy chọn)</label>
            <select value={qrLaodong} onChange={e=>setQrLaodong(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-sm">
              <option value="">-- Không sử dụng --</option>
              {columns.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center mb-4">
          <span className="text-sm text-gray-400">Định dạng báo cáo:</span>
          <label className="flex items-center gap-1 text-sm"><input type="radio" name="reportType" checked={reportType==="pivot"} onChange={()=>setReportType("pivot")}/> Bảng xoay (Pivot)</label>
          <label className="flex items-center gap-1 text-sm"><input type="radio" name="reportType" checked={reportType==="flat"} onChange={()=>setReportType("flat")}/> Bảng phẳng</label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={()=>onQuickReport(1)} className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold">📈 Báo cáo cấp 1 (Lĩnh vực)</button>
          <button onClick={()=>onQuickReport(2)} className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold">📈 Báo cáo cấp 2 (Ngành chi tiết)</button>
          <button onClick={onAppendLevels} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">🏷️ Thêm cấp 1 & 2 vào bảng chính</button>
        </div>
      </div>

      {/* Hiển thị kết quả báo cáo */}
      {quickRows.length > 0 && (
        <BeautifulReportTable 
          rows={quickRows} 
          cols={quickCols} 
          level={quickLevel} 
          reportType={reportType} 
          onExport={onExportQuickReport} 
        />
      )}

      {/* Biểu đồ doanh thu theo ngành cấp 1 (tích hợp cùng trang) */}
      <div className="bg-[#1f2937] rounded-2xl p-6">
        <h4 className="text-md font-bold text-amber-400 mb-3 flex items-center gap-2">📊 BIỂU ĐỒ DOANH THU THEO NGÀNH CẤP 1</h4>
        <SectorRevenueChart mainData={mainData} columns={columns} mapping={mapping} />
      </div>

      {/* Bảng dữ liệu chính để xem */}
      <DataPreviewTable data={mainData} columns={columns} title="DỮ LIỆU HIỆN TẠI" />
    </div>
  );
};