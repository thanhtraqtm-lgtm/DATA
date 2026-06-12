import React from "react";
import DescriptorMatchScanner from "../../descriptorMatchScanner";

interface MatchDescTabProps {
  mainData: any[];
  columns: string[];
  mapping: any;
}

export const MatchDescTab: React.FC<MatchDescTabProps> = ({ mainData, columns, mapping }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#1f2937] rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-2">🔄 ĐỐI CHIẾU MÔ TẢ HOẠT ĐỘNG VÀ MÃ NGÀNH</h3>
        <p className="text-sm text-gray-400 mb-4">
          Công cụ tự động phát hiện mâu thuẫn giữa mô tả hoạt động kinh doanh và mã ngành đã đăng ký,
          dựa trên từ khóa (sản xuất, thương mại, dịch vụ) và phân cấp VSIC.
        </p>
      </div>
      <DescriptorMatchScanner mainData={mainData} columns={columns} mapping={mapping} />
    </div>
  );
};