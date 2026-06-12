import React, { useState, useMemo } from "react";
import { Database, Search, ChevronLeft, ChevronRight } from "lucide-react";

export const DataPreviewTable = ({ data, columns, title }: { data: any[]; columns: string[]; title?: string }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const filtered = useMemo(() => {
    if (!search) return data;
    const term = search.toLowerCase();
    return data.filter(row => Object.values(row).some(v => String(v).toLowerCase().includes(term)));
  }, [data, search]);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page-1)*pageSize, page*pageSize);
  if (!data.length) return null;
  return (
    <div className="mt-6 bg-[#1f2937]/80 rounded-2xl border border-gray-800 p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2"><Database className="w-4 h-4 text-cyan-400"/><span className="font-bold">{title||"Kết quả"}</span><span className="text-xs text-gray-400">{data.length} dòng</span></div>
        <div className="relative"><Search className="absolute left-2 top-1.5 w-3.5 h-3.5 text-gray-500"/><input className="pl-7 pr-2 py-1 bg-[#111827] border border-gray-700 rounded-lg text-xs" placeholder="Tìm..." value={search} onChange={e=>{setSearch(e.target.value); setPage(1);}}/></div>
      </div>
      <div className="overflow-x-auto"><table className="w-full text-xs"><thead className="bg-[#0f172a]"><tr>{columns.map(c=><th key={c} className="p-2 text-center">{c}</th>)}</thead><tbody>{paginated.map((row,i)=>(
        <tr key={i} className="border-t border-gray-800">{columns.map(c=><td key={c} className="p-2 text-center truncate max-w-[180px]">{row[c]??""}</td>)}</tr>
      ))}</tbody></table></div>
      <div className="flex justify-between mt-3 text-xs"><span>Trang {page}/{totalPages||1}</span><div className="flex gap-2"><button disabled={page===1} onClick={()=>setPage(p=>p-1)}><ChevronLeft className="w-4 h-4"/></button><button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}><ChevronRight className="w-4 h-4"/></button></div></div>
    </div>
  );
};