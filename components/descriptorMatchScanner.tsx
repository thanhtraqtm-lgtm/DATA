import React, { useState, useMemo } from "react";
import { normalizeSectorCode, lookupSectorNameWithFallback } from "../data/vsic";

interface DescriptorMatchScannerProps {
  mainData: any[];
  columns: string[];
  mapping: any;
}

const DescriptorMatchScanner: React.FC<DescriptorMatchScannerProps> = ({ mainData, columns, mapping }) => {
  const [activeTab, setActiveTab] = useState<"desc" | "code">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "conflict">("all");

  const analysis = useMemo(() => {
    const targetMota = mapping.mota;
    const targetManganh = mapping.manganh;
    if (!mainData.length || !targetMota || !targetManganh) return { descToCodes: [], codeToDescs: [] };

    // 1. Cùng mô tả -> khác mã
    const descMap = new Map<string, Array<{ code: string; rowIdx: number; row: any }>>();
    mainData.forEach((row, idx) => {
      const rawMota = String(row[targetMota] || "").trim();
      const cleanMota = rawMota.toLowerCase().replace(/\s+/g, " ");
      if (!cleanMota) return;
      const code = normalizeSectorCode(row[targetManganh]);
      if (!descMap.has(cleanMota)) descMap.set(cleanMota, []);
      descMap.get(cleanMota)!.push({ code, rowIdx: idx, row });
    });
    const descToCodes: any[] = [];
    descMap.forEach((items, cleanMota) => {
      if (items.length <= 1) return;
      const codeCounts = new Map<string, number[]>();
      items.forEach(item => {
        if (!codeCounts.has(item.code)) codeCounts.set(item.code, []);
        codeCounts.get(item.code)!.push(item.rowIdx);
      });
      if (codeCounts.size > 1) {
        descToCodes.push({
          motaText: items[0].row[targetMota] || cleanMota,
          occurrences: items.length,
          codes: Array.from(codeCounts.entries()).map(([code, rows]) => ({ code, count: rows.length, rows }))
        });
      }
    });

    // 2. Cùng mã -> mô tả trái loại hình
    const codeMap = new Map<string, Array<{ desc: string; rowIdx: number }>>();
    mainData.forEach((row, idx) => {
      const code = normalizeSectorCode(row[targetManganh]);
      if (!code) return;
      const rawMota = String(row[targetMota] || "").trim();
      if (!rawMota) return;
      if (!codeMap.has(code)) codeMap.set(code, []);
      codeMap.get(code)!.push({ desc: rawMota, rowIdx: idx });
    });
    const tradeKeywords = ["bán", "mua", "thương mại", "đại lý", "cửa hàng", "phân phối"];
    const industrialKeywords = ["sản xuất", "gia công", "chế tạo", "chế biến", "lắp ráp", "nhà máy"];
    const codeToDescs: any[] = [];
    codeMap.forEach((items, code) => {
      const typesSeen = new Set<string>();
      const conflicts: any[] = [];
      items.forEach(item => {
        const lc = item.desc.toLowerCase();
        const hasTrade = tradeKeywords.some(kw => lc.includes(kw));
        const hasIndustrial = industrialKeywords.some(kw => lc.includes(kw));
        let type = "DỊCH VỤ / KHÁC";
        if (hasIndustrial) type = "SẢN XUẤT";
        else if (hasTrade) type = "THƯƠNG MẠI";
        typesSeen.add(type);
        conflicts.push({ type, descText: item.desc, rowIdx: item.rowIdx });
      });
      if (typesSeen.has("SẢN XUẤT") && typesSeen.has("THƯƠNG MẠI")) {
        const lookup = lookupSectorNameWithFallback(code);
        codeToDescs.push({
          code,
          tenNganh: lookup.name || "Tên ngành chưa xác định",
          occurrences: items.length,
          conflicts
        });
      }
    });
    return { descToCodes, codeToDescs };
  }, [mainData, mapping.mota, mapping.manganh]);

  const filteredDesc = useMemo(() => {
    if (!searchTerm) return analysis.descToCodes;
    return analysis.descToCodes.filter(item => item.motaText.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [analysis.descToCodes, searchTerm]);

  const filteredCode = useMemo(() => {
    if (!searchTerm) return analysis.codeToDescs;
    return analysis.codeToDescs.filter(item => item.code.includes(searchTerm) || item.tenNganh.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [analysis.codeToDescs, searchTerm]);

  const displayDesc = filterType === "all" ? filteredDesc : filteredDesc.filter(item => item.codes.length > 1);
  const displayCode = filterType === "all" ? filteredCode : filteredCode.filter(item => item.conflicts.length > 0);

  return (
    <div className="bg-[#1f2937] rounded-2xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-white">🔄 TỰ ĐỘNG PHÂN TÍCH BẤT NHẤT QUÁN (MÃ VSIC ⇄ MÔ TẢ)</h3>
      <div className="flex flex-wrap gap-4 items-center border-b border-gray-800 pb-4">
        <div className="flex gap-2">
          <button onClick={() => setActiveTab("desc")} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${activeTab === "desc" ? "bg-purple-600" : "bg-gray-800"}`}>Lỗi A: Cùng mô tả ≠ mã</button>
          <button onClick={() => setActiveTab("code")} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${activeTab === "code" ? "bg-purple-600" : "bg-gray-800"}`}>Lỗi B: Cùng mã ≠ loại hình</button>
        </div>
        <div className="flex-1">
          <input type="text" placeholder="🔍 Tìm kiếm..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full md:w-64 bg-[#111827] border border-gray-700 rounded-lg px-3 py-1.5 text-sm" />
        </div>
        <div>
          <select value={filterType} onChange={e=>setFilterType(e.target.value as any)} className="bg-[#111827] border border-gray-700 rounded-lg px-3 py-1.5 text-sm">
            <option value="all">Tất cả</option>
            <option value="conflict">Chỉ có mâu thuẫn</option>
          </select>
        </div>
      </div>

      {activeTab === "desc" && (
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {displayDesc.length === 0 ? (
            <div className="text-center text-emerald-400 py-8">✅ Tuyệt vời! Không phát hiện mâu thuẫn "cùng mô tả khác mã".</div>
          ) : (
            displayDesc.map((item, idx) => (
              <div key={idx} className="bg-[#111827] rounded-xl p-3 border border-gray-800">
                <div className="font-semibold text-white">📝 "{item.motaText}" <span className="text-gray-400 text-xs">({item.occurrences} lần)</span></div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {item.codes.map((c: any, ci: number) => (
                    <span key={ci} className="bg-purple-950/40 text-purple-300 px-2 py-0.5 rounded text-xs">{c.code} ({c.count} dòng)</span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "code" && (
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {displayCode.length === 0 ? (
            <div className="text-center text-emerald-400 py-8">✅ Tuyệt vời! Không phát hiện mâu thuẫn "cùng mã khác loại hình".</div>
          ) : (
            displayCode.map((item, idx) => (
              <div key={idx} className="bg-[#111827] rounded-xl p-3 border border-gray-800">
                <div className="font-mono text-sm font-bold text-pink-400">{item.code} - {item.tenNganh}</div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="bg-red-950/20 p-2 rounded"><div className="font-bold text-amber-400">🏭 SẢN XUẤT</div>{item.conflicts.filter((c:any)=>c.type==="SẢN XUẤT").slice(0,2).map((c:any,i:number)=><div key={i} className="truncate">- {c.descText}</div>)}</div>
                  <div className="bg-blue-950/20 p-2 rounded"><div className="font-bold text-cyan-400">🛒 THƯƠNG MẠI</div>{item.conflicts.filter((c:any)=>c.type==="THƯƠNG MẠI").slice(0,2).map((c:any,i:number)=><div key={i} className="truncate">- {c.descText}</div>)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DescriptorMatchScanner;