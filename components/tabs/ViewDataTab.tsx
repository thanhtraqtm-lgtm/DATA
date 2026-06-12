import React, { useState } from "react";
import * as XLSX from "xlsx";
import { FileUp, Plus } from "lucide-react";
import { DataPreviewTable } from "../common/DataPreviewTable";

interface ViewDataTabProps {
  rawData: any[];
  setRawData: (data: any[]) => void;
  mainData: any[];
  setMainData: (data: any[]) => void;
  columns: string[];
  setColumns: (cols: string[]) => void;
  fileName: string;
  setFileName: (name: string) => void;
  mapping: any;
  setMapping: (m: any) => void;
  colConfigs: any[];
  setColConfigs: (c: any[]) => void;
  detectedSheets: string[];
  setDetectedSheets: (s: string[]) => void;
  selectedSheets: string[];
  setSelectedSheets: (s: string[]) => void;
  sheetKey: string;
  setSheetKey: (k: string) => void;
  workbook: any;
  setWorkbook: (wb: any) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: "main") => void;
  onMergeSheets: () => void;
  onRedefine: () => void;
  onCalcColumn: (calcName: string, calcCol1: string, calcCol2: string, calcOp: string, calcType: string, calcConst: string, calcRound: string) => void;
}

export const ViewDataTab: React.FC<ViewDataTabProps> = ({
  rawData, mainData, columns, fileName, mapping, colConfigs,
  detectedSheets, selectedSheets, setSelectedSheets, sheetKey, setSheetKey,
  onFileUpload, onMergeSheets, onRedefine, onCalcColumn
}) => {
  const [expanded, setExpanded] = useState(true);
  const [calcName, setCalcName] = useState("");
  const [calcCol1, setCalcCol1] = useState("");
  const [calcCol2, setCalcCol2] = useState("");
  const [calcOp, setCalcOp] = useState<"+"|"-"|"*"|"/"|"concat">("+");
  const [calcType, setCalcType] = useState<"column"|"constant">("column");
  const [calcConst, setCalcConst] = useState("");
  const [calcRound, setCalcRound] = useState<"none"|"int"|"1dec"|"2dec">("none");

  return (
    <div className="space-y-6">
      <div className="bg-[#1f2937] rounded-2xl p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">📂 FILE DỮ LIỆU CHÍNH</h3>
          <label className="bg-purple-600 px-4 py-2 rounded-xl cursor-pointer">
            <FileUp className="w-4 h-4 inline"/> TẢI FILE
            <input type="file" accept=".xlsx,.xls,.csv" onChange={(e)=>onFileUpload(e,"main")} className="hidden"/>
          </label>
        </div>
        {detectedSheets.length > 1 && (
          <div className="mt-3 p-3 bg-amber-950/30 rounded-lg">
            <p>Ghép {detectedSheets.length} sheets</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {detectedSheets.map(s=>(
                <label key={s} className="flex items-center gap-1">
                  <input type="checkbox" checked={selectedSheets.includes(s)} onChange={()=>setSelectedSheets(prev=>prev.includes(s)?prev.filter(x=>x!==s):[...prev,s])}/>
                  {s}
                </label>
              ))}
            </div>
            <select value={sheetKey} onChange={e=>setSheetKey(e.target.value)} className="bg-[#111827] p-1 rounded mt-2">
              <option value="">Chọn cột khóa</option>
              {columns.map(c=><option key={c}>{c}</option>)}
            </select>
            <button onClick={onMergeSheets} className="bg-amber-600 px-3 py-1 rounded mt-2">Ghép sheets</button>
          </div>
        )}
      </div>

      {rawData.length > 0 && (
        <div className="bg-[#1f2937] rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <h4 className="font-bold">📌 Định nghĩa lại cột & lọc cột thừa</h4>
            <button onClick={()=>setExpanded(!expanded)} className="text-xs text-purple-400">{expanded?"Thu gọn":"Mở rộng"}</button>
          </div>
          {expanded && (
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-xs">
                <thead className="bg-[#111827]"><tr><th className="p-2">Dùng</th><th>Tên gốc</th><th>Tên mới</th><th>Vai trò</th></tr></thead>
                <tbody>
                  {colConfigs.map((cfg, i) => (
                    <tr key={i}>
                      <td className="p-2 text-center"><input type="checkbox" checked={cfg.use} onChange={e=>{const newC=[...colConfigs]; newC[i].use=e.target.checked; /* setColConfigs(newC) */}}/></td>
                      <td className="p-2">{cfg.originalName}</td>
                      <td className="p-2"><input value={cfg.newName} onChange={e=>{const newC=[...colConfigs]; newC[i].newName=e.target.value; /* setColConfigs(newC) */}} className="bg-[#111827] border border-gray-700 rounded px-1 w-36"/></td>
                      <td className="p-2">
                        <select value={cfg.role} onChange={e=>{const newC=[...colConfigs]; newC[i].role=e.target.value as any; /* setColConfigs(newC) */}} className="bg-[#111827] border border-gray-700 rounded">
                          <option value="">--</option><option value="mota">Mô tả</option><option value="manganh">Mã ngành</option><option value="xa">Xã</option><option value="doanhthu">Doanh thu</option><option value="laodong">Lao động</option><option value="idCol">ID</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={onRedefine} className="mt-3 bg-indigo-600 px-4 py-1 rounded text-sm">Áp dụng định nghĩa</button>
            </div>
          )}
        </div>
      )}

      {rawData.length > 0 && (
        <div className="bg-[#1f2937] rounded-2xl p-6">
          <h4 className="text-indigo-400 font-bold flex items-center gap-2"><Plus className="w-4 h-4"/> TÍNH TOÁN & TẠO CỘT MỚI</h4>
          <div className="grid grid-cols-2 md:grid-cols-12 gap-2 mt-2">
            <input className="col-span-3 bg-[#111827] border rounded p-1" placeholder="Tên cột mới" value={calcName} onChange={e=>setCalcName(e.target.value)}/>
            <select className="col-span-2 bg-[#111827] border rounded p-1" value={calcCol1} onChange={e=>setCalcCol1(e.target.value)}><option value="">Cột A</option>{columns.map(c=><option key={c}>{c}</option>)}</select>
            <select className="col-span-1 bg-[#111827] border rounded p-1" value={calcOp} onChange={e=>setCalcOp(e.target.value as any)}><option value="+">+</option><option value="-">-</option><option value="*">*</option><option value="/">/</option><option value="concat">concat</option></select>
            <select className="col-span-1 bg-[#111827] border rounded p-1" value={calcType} onChange={e=>setCalcType(e.target.value as any)}><option value="column">Cột</option><option value="constant">Số</option></select>
            {calcType==="column"?
              <select className="col-span-3 bg-[#111827] border rounded p-1" value={calcCol2} onChange={e=>setCalcCol2(e.target.value)}><option value="">Cột B</option>{columns.map(c=><option key={c}>{c}</option>)}</select>:
              <input className="col-span-3 bg-[#111827] border rounded p-1" placeholder="Hằng số" value={calcConst} onChange={e=>setCalcConst(e.target.value)}/>
            }
          </div>
          <div className="flex gap-3 mt-2">
            <select value={calcRound} onChange={e=>setCalcRound(e.target.value as any)} className="bg-[#111827] border rounded p-1"><option value="none">Không làm tròn</option><option value="int">Số nguyên</option><option value="1dec">1 số thập phân</option><option value="2dec">2 số thập phân</option></select>
            <button onClick={()=>onCalcColumn(calcName, calcCol1, calcCol2, calcOp, calcType, calcConst, calcRound)} className="bg-indigo-600 px-4 py-1 rounded">➕ Thêm cột</button>
          </div>
        </div>
      )}

      <DataPreviewTable data={mainData} columns={columns} title="DỮ LIỆU CHÍNH" />
    </div>
  );
};