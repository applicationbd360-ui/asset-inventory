import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronDown, Search, Headset, HelpCircle, Bell, 
  ChevronUp, Settings, ListFilter, Download, LayoutTemplate, Maximize2,
  Copy, BarChart2, Eye, LayoutGrid, MoreHorizontal
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const CHART_DATA = [
  { id: '1710-CWS-CTW-CTW01', count: 1, color: '#1d70b8' },
  { id: '1710-CWS-CTW02-CTFN', count: 1, color: '#1d70b8' },
  { id: '1710-CWS-WCS-CWCP1', count: 19, color: '#0055b8' },
  { id: '1710-CWS-WCS-CWCP2', count: 1, color: '#1d70b8' },
  { id: '1710-SPA-ADR-DRY02', count: 1, color: '#1d70b8' },
  { id: '1710-SPA-SAC-PLAR1-INLT-SCTV', count: 1, color: '#1d70b8' },
  { id: '1710-SPA-SAC-PLAR1-INLT-SMV', count: 1, color: '#1d70b8' },
  { id: '1710-SPA-SAC-PLAR4-CST1', count: 1, color: '#1d70b8' },
  { id: '1710-SPA-SAC-PLAR4-DMRV', count: 3, color: '#1d70b8' },
];

export default function TechnicalObjectDamagesPage() {
  const navigate = useNavigate();
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({
    'group1': true,
    'part1': true
  });

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f7fb] -m-6 animate-fade-in font-sans overflow-x-hidden text-[13px] text-slate-800" style={{ minHeight: 'calc(100vh - 64px)' }}>
      
      {/* 1. Top Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-subtle bg-white z-20 sticky top-0 shadow-sm">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-600 font-semibold hover:text-blue-600 transition-colors">
          <ChevronLeft size={16} /> Technical Object Damages <ChevronDown size={14} className="ml-1" />
        </button>
        
        <div className="flex items-center">
          <div className="flex items-center border border-slate-300 rounded-full bg-slate-100 overflow-hidden w-[400px]">
            <button className="px-3 py-1 bg-white border-r border-slate-300 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1">
              Apps <ChevronDown size={14} />
            </button>
            <input 
              type="text" 
              placeholder='Search In: "Apps"'
              className="flex-1 bg-transparent outline-none px-3 py-1 text-sm placeholder-slate-500"
            />
            <button className="px-3 py-1 text-slate-500 hover:text-slate-700">
              <Search size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <button className="hover:text-slate-800"><Headset size={18} /></button>
          <button className="hover:text-slate-800"><HelpCircle size={18} /></button>
          <button className="hover:text-slate-800"><Bell size={18} /></button>
          <button className="hover:text-slate-800 text-blue-600 bg-blue-50 rounded-full p-1"><span className="w-6 h-6 flex items-center justify-center font-bold text-xs">R</span></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        
        {/* Title Bar */}
        <div className="px-8 py-4 bg-white border-b border-slate-200 flex justify-between items-center">
           <h1 className="text-xl font-bold text-blue-700 flex items-center gap-2">
             Breakdowns by Technical Object <ChevronDown size={16} className="text-slate-500" />
           </h1>
           <div className="flex items-center gap-2 text-slate-500">
             <button className="text-blue-600 font-medium hover:underline text-sm mr-2">Adapt Filters (3)</button>
             <button className="p-1 border border-slate-300 rounded"><Copy size={16} /></button>
             <button className="p-1 border border-slate-300 rounded"><ChevronDown size={16} /></button>
           </div>
        </div>

        {/* 2. Smart Filter Bar */}
        <div className="bg-white border-b border-slate-200 pb-4 relative">
          {!isFilterCollapsed && (
            <div className="px-8 pt-6 pb-2 grid grid-cols-6 gap-x-4 gap-y-4 items-end animate-fade-in">
              
              {/* Row 1 */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">Effect:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">Maintenance Plant:<span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="w-full border border-slate-300 rounded px-2 py-1 text-sm bg-white flex items-center pr-8">
                    <span className="bg-slate-100 text-slate-700 px-1.5 rounded mr-1 flex items-center gap-1"><span className="text-[10px]">x</span> *</span>
                    <span className="text-blue-600 text-xs font-semibold">18 more</span>
                  </div>
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Object Type:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Technical Object Label:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Notification:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Construction Type:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Tech. Obj. Type:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Damage Code Group:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Cause Code Group:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Activity Code Group:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Company Code:</label>
                <div className="relative">
                  <div className="w-full border border-slate-300 rounded px-2 py-1 text-sm bg-white flex items-center pr-8">
                    <span className="bg-slate-100 text-slate-700 px-1.5 rounded mr-1 flex items-center gap-1">Company Cod... <span className="text-[10px]">x</span></span>
                  </div>
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold text-transparent">Actions</label>
                <div className="flex justify-end gap-3 mt-1">
                   {/* Empty space matching screenshot layout, button usually floats right */}
                </div>
              </div>

            </div>
          )}
          
          {/* Collapse Toggle */}
          <div className="absolute -bottom-3 w-full flex justify-center z-10">
             <button 
                onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
                className="bg-white border border-slate-300 text-blue-600 hover:bg-slate-50 w-8 h-6 flex items-center justify-center shadow-sm"
                style={{ borderRadius: '4px' }}
             >
                {isFilterCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
             </button>
          </div>
        </div>

        <div className="p-4 pt-6 flex flex-col gap-4">
          
          <div className="flex gap-4 px-2 pb-2">
            <button className="flex items-center gap-2 text-blue-600 font-bold px-3 py-1 bg-blue-50 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors">
              <span className="w-1 h-3.5 bg-blue-600 rounded-sm"></span> NOC
            </button>
            <button className="flex items-center gap-2 text-blue-600 font-bold px-3 py-1 bg-blue-50 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors">
              <span className="w-1 h-3.5 bg-blue-600 rounded-sm"></span> NOA
            </button>
            <button className="flex items-center gap-2 text-blue-600 font-bold px-3 py-1 bg-blue-50 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors">
              <span className="w-1 h-3.5 bg-blue-600 rounded-sm"></span> NOO
            </button>
          </div>

          {/* 3. Interactive Chart Section */}
          <div className="bg-white rounded shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-800">Damages and Corrective Activities</h2>
              <div className="flex items-center gap-3">
                <button className="text-blue-600 hover:underline font-semibold text-sm">Details (1)</button>
                <div className="flex items-center gap-1 ml-4 text-blue-600">
                  <span className="font-semibold text-sm mr-1">View By</span>
                  <button className="p-1 hover:bg-blue-50 rounded bg-blue-100 text-blue-700"><BarChart2 size={16} /></button>
                  <button className="p-1 hover:bg-blue-50 rounded"><LayoutGrid size={16} /></button>
                </div>
                <div className="w-px h-6 bg-slate-300 mx-2"></div>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><Settings size={16} /></button>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><MoreHorizontal size={16} /></button>
              </div>
            </div>
            
            <div className="p-6 pb-2 h-[350px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="1 0" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="id" 
                    axisLine={true} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    dy={10} 
                  />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#1d70b8" maxBarSize={60}>
                    {CHART_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="absolute bottom-4 left-0 w-full flex justify-center mt-4">
                <span className="text-[11px] font-semibold text-slate-600">Functional Location</span>
              </div>
            </div>
            
            {/* Chart Legend */}
            <div className="px-6 py-4 flex justify-start border-t border-slate-100">
               <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-3 h-3 bg-[#1d70b8]"></div>
                    <span className="text-[11px] font-semibold text-slate-500">Causes of damage</span>
                  </div>
               </div>
            </div>
          </div>

          {/* 4. Hierarchical Table Section */}
          <div className="bg-white rounded shadow-sm border border-slate-200">
            <div className="px-6 py-4 flex justify-between items-center border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">Damages and Corrective Activities</h2>
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><Eye size={16} /></button>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><ListFilter size={16} /></button>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><Settings size={16} /></button>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><Download size={16} /></button>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><Maximize2 size={16} /></button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-200 bg-white">
                    <th className="px-4 py-3 font-semibold text-slate-600 text-[11px] w-8"></th>
                    <th className="px-4 py-3 font-semibold text-slate-600 text-[11px]">Damage Code</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 text-[11px]">Object Part Code Group</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 text-[11px] flex items-center gap-1">Object Part Code <ChevronUp size={12} className="text-slate-400" /></th>
                    <th className="px-4 py-3 font-semibold text-slate-600 text-[11px]">Cause Code Group</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 text-[11px]">Cause Code</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 text-[11px]">Activity Code Group</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  
                  {/* Level 1: Part Code Group */}
                  <tr className="bg-slate-50 hover:bg-slate-100 border-b border-slate-200">
                    <td colSpan={7} className="px-2 py-1.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleRow('group1')} className="p-1 hover:bg-slate-200 rounded text-slate-500">
                          {expandedRows['group1'] ? <ChevronDown size={14} /> : <ChevronLeft size={14} className="rotate-180" />}
                        </button>
                        <span className="font-semibold text-slate-600">Object Part Code: ME01 - Bearing</span>
                      </div>
                    </td>
                  </tr>
                  
                  {expandedRows['group1'] && (
                    <>
                      {/* Individual Records for Bearing */}
                      {[
                        { dmg: 'Breakage (ME00)', cause: 'Corrosion (ME02)', act: 'Not assigned' },
                        { dmg: 'Crack (ME01)', cause: 'Corrosion (ME02)', act: 'Activities mechanical (YB-PMME1)' },
                        { dmg: 'Crack (ME01)', cause: 'Corrosion (ME02)', act: 'Not assigned' },
                        { dmg: 'Crack (ME01)', cause: 'Insufficient Lubrication (ME00)', act: 'Activities mechanical (YB-PMME1)' },
                        { dmg: 'Crack (ME01)', cause: 'Insufficient Lubrication (ME00)', act: 'Not assigned' },
                        { dmg: 'Crack (ME01)', cause: 'Insufficient Lubrication (ME00)', act: 'Activities mechanical (YB-PMME1)' },
                        { dmg: 'Crack (ME01)', cause: 'Insufficient Lubrication (ME00)', act: 'Not assigned' },
                        { dmg: 'Bearing damage (ME03)', cause: 'Insufficient Lubrication (ME00)', act: 'Activities mechanical (YB-PMME1)' },
                        { dmg: 'Bearing damage (ME03)', cause: 'Insufficient Lubrication (ME00)', act: 'Not assigned' },
                        { dmg: 'Bearing damage (ME03)', cause: 'Corrosion (ME02)', act: 'Activities mechanical (YB-PMME1)' },
                      ].map((row, i) => (
                        <tr key={i} className="bg-white hover:bg-slate-50 border-b border-slate-100">
                          <td className="px-4 py-1.5 border-l-2 border-transparent"></td>
                          <td className="px-4 py-2 text-slate-600">{row.dmg}</td>
                          <td className="px-4 py-2 text-slate-500">Object parts mechanical (YB-PMME1)</td>
                          <td className="px-4 py-2 text-slate-600">Bearing (ME01)</td>
                          <td className="px-4 py-2 text-slate-500">Causes mechanical (YB-PMME1)</td>
                          <td className="px-4 py-2 text-slate-600">{row.cause}</td>
                          <td className="px-4 py-2 text-slate-500">{row.act}</td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
              <div className="h-64"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
