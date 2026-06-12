import React from "react";

export const HomeTab = ({ sectorCount }: { sectorCount: number }) => {
  return (
    <div>
      <div className="bg-gradient-to-r from-purple-900/30 to-[#1f2937] p-6 rounded-2xl">
        <h2 className="text-2xl font-bold">Hệ thống phân tích dữ liệu ngành</h2>
        <p className="text-gray-400">Upload danh mục ngành, chuẩn hóa, ghép nối, báo cáo</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-[#1f2937]/50 p-4 rounded-xl">📁 Bước 1: Tải dữ liệu chính</div>
        <div className="bg-[#1f2937]/50 p-4 rounded-xl">📚 Bước 2: Nạp danh mục ngành</div>
        <div className="bg-[#1f2937]/50 p-4 rounded-xl">⚙️ Bước 3: Xử lý & báo cáo</div>
        <div className="bg-[#1f2937]/50 p-4 rounded-xl">📊 Kết quả hiển thị ngay tại tab</div>
      </div>
      <div className="mt-4 text-center text-sm text-gray-500">Đã nạp {sectorCount} mã ngành</div>
    </div>
  );
};