import React from "react";
import { FileUp, CheckCircle2 } from "lucide-react";
import VsicCatalogExplorer from "../vsicCatalogExplorer"; // lên 1 cấp vì từ tabs ra components

interface CatalogTabProps {
  userSectorFile: string;
  userSectorMap: Map<string, string>;
  onUploadCatalog: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearCatalog: () => void;
}

export const CatalogTab: React.FC<CatalogTabProps> = ({
  userSectorFile,
  userSectorMap,
  onUploadCatalog,
  onClearCatalog
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#1f2937] rounded-2xl p-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-bold">📚 NẠP DANH MỤC NGÀNH CỦA BẠN (Excel/CSV)</h3>
            <p className="text-sm text-gray-400">
              File cần có ít nhất 2 cột: Mã ngành và Tên ngành. Hệ thống sẽ tự động phát hiện tên cột.
            </p>
          </div>
          <div className="flex gap-3">
            <label className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 text-sm font-semibold">
              <FileUp className="w-4 h-4" /> TẢI FILE
              <input type="file" accept=".xlsx,.xls,.csv" onChange={onUploadCatalog} className="hidden" />
            </label>
            <button onClick={onClearCatalog} className="bg-red-800/60 hover:bg-red-700/80 px-4 py-2 rounded-xl text-sm font-semibold">
              XÓA SẠCH BỘ NHỚ
            </button>
          </div>
        </div>
        {userSectorFile && (
          <div className="mt-4 bg-green-900/30 border border-green-700/30 p-3 rounded-lg flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span>✅ Đã nạp: <strong>{userSectorFile}</strong> ({userSectorMap.size} mã ngành)</span>
          </div>
        )}
        <div className="mt-4 text-xs text-gray-500 border-t border-gray-800 pt-3">
          💡 <strong>Hướng dẫn:</strong> Nếu bạn chưa có file danh mục, hãy tạo file Excel với 2 cột: <strong>MaNganh</strong> và <strong>TenNganh</strong>, sau đó tải lên. Hệ thống sẽ sử dụng danh mục này để chuẩn hóa và tra cứu.
        </div>
      </div>
      <VsicCatalogExplorer />
    </div>
  );
};