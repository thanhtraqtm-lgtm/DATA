import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { normalizeSectorCode, getParentSectorCode, lookupSectorNameWithFallback } from "../data/vsic";

interface SectorRevenueChartProps {
  mainData: any[];
  columns: string[];
  mapping: any;
}

const SectorRevenueChart: React.FC<SectorRevenueChartProps> = ({ mainData, columns, mapping }) => {
  const chartData = useMemo(() => {
    if (!mainData.length || !mapping.manganh || !mapping.doanhthu) return [];
    
    const sectorMap = new Map<string, number>();
    mainData.forEach(row => {
      if (!row || typeof row !== "object") return;
      const rawCode = row[mapping.manganh];
      const code = normalizeSectorCode(rawCode);
      let level1Code = "";
      if (code) {
        if (/^[A-Z]$/i.test(code)) level1Code = code.toUpperCase();
        else level1Code = getParentSectorCode(code) || "";
      }
      if (!level1Code) return;
      const revenue = parseFloat(String(row[mapping.doanhthu]).replace(/[^0-9.-]/g, "")) || 0;
      const current = sectorMap.get(level1Code) || 0;
      sectorMap.set(level1Code, current + revenue);
    });
    
    const result = Array.from(sectorMap.entries())
      .map(([code, revenue]) => {
        const lookup = lookupSectorNameWithFallback(code);
        const name = lookup.name || `Ngành ${code}`;
        return { code, name, revenue: Math.round(revenue / 1e6) }; // đơn vị triệu đồng
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
    return result;
  }, [mainData, mapping.manganh, mapping.doanhthu]);

  if (chartData.length === 0) {
    return (
      <div className="bg-[#1f2937] rounded-2xl p-6 text-center text-gray-400">
        ⚠️ Chưa có dữ liệu doanh thu theo ngành. Vui lòng chọn cột mã ngành và doanh thu trong tab Tổng hợp báo cáo.
      </div>
    );
  }

  return (
    <div className="bg-[#1f2937] rounded-2xl p-6">
      <h4 className="text-md font-bold text-amber-400 mb-4">📊 TOP 10 NGÀNH CẤP 1 THEO DOANH THU (Triệu đồng)</h4>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
          <YAxis tick={{ fill: "#9CA3AF" }} />
          <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }} />
          <Legend />
          <Bar dataKey="revenue" name="Doanh thu (triệu đồng)" fill="#8b5cf6" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SectorRevenueChart;