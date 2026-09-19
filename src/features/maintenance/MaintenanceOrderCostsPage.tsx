import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronDown, Search, Headset, HelpCircle, Bell, UserCircle, 
  ChevronUp, Settings, ListFilter, Download, LayoutTemplate, Maximize2,
  Filter, Eye, MoreHorizontal, Copy, LayoutGrid, BarChart2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CHART_DATA = [
  { id: '4002360', cost: 9800, color: '#1d70b8' },
  { id: '4002141', cost: 8000, color: '#f3b060' },
  { id: '4002362', cost: 6200, color: '#a0c96f' },
  { id: '4002942', cost: 5100, color: '#e8749a' },
  { id: '4001739', cost: 4800, color: '#b972cf' },
  { id: '4002140', cost: 4700, color: '#56c0b3' },
  { id: '4001740', cost: 3800, color: '#88a8f1' },
  { id: '4001137', cost: 3400, color: '#e076df' },
  { id: '4001616', cost: 3200, color: '#c4c8cd' },
  { id: '4002361', cost: 3000, color: '#ef8a8f' },
  { id: '4003381', cost: 2500, color: '#919df1' },
  { id: '4003699', cost: 2100, color: '#7a96b4' },
  { id: '4002932', cost: 2000, color: '#c9966d' },
  { id: '4002765', cost: 1900, color: '#a5b572' },
  { id: '4002915', cost: 1800, color: '#e384b0' },
  { id: '4002928', cost: 1800, color: '#b683cf' },
  { id: '4002652', cost: 1750, color: '#68c5b8' },
  { id: '4000848', cost: 1700, color: '#9cbdf2' },
  { id: '4002095', cost: 1650, color: '#e079e0' },
  { id: '4001527', cost: 1600, color: '#c3c7cd' },
  { id: '4001968', cost: 1550, color: '#ed8c93' },
  { id: '4002004', cost: 1500, color: '#929cf3' },
  { id: '4002143', cost: 1400, color: '#7a96b4' },
  { id: '4003033', cost: 1300, color: '#c9966d' },
];

export default function MaintenanceOrderCostsPage() {
  const navigate = useNavigate();
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [isRowExpanded, setIsRowExpanded] = useState(true);

  return (
    <div className="flex flex-col h-full bg-[#f4f7fb] -m-6 animate-fade-in font-sans overflow-x-hidden text-[13px] text-slate-800" style={{ minHeight: 'calc(100vh - 64px)' }}>
      
      {/* 1. Top Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-subtle bg-white z-20 sticky top-0 shadow-sm">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-600 font-semibold hover:text-blue-600 transition-colors">
          <ChevronLeft size={16} /> Maintenance Order Costs <ChevronDown size={14} className="ml-1" />
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
             Standard* <ChevronDown size={16} className="text-slate-500" />
           </h1>
           <div className="flex items-center gap-2 text-slate-500">
             <button className="p-1 border border-slate-300 rounded"><Copy size={16} /></button>
             <button className="p-1 border border-slate-300 rounded"><ChevronDown size={16} /></button>
           </div>
        </div>

        {/* 2. Smart Filter Bar */}
        <div className="bg-white border-b border-slate-200 pb-4 relative">
          {!isFilterCollapsed && (
            <div className="px-8 pt-6 pb-2 grid grid-cols-6 gap-x-4 gap-y-4 items-end animate-fade-in">
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">Relative Date Function:<span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="text" defaultValue="Previous year to date (..." className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">G/L Account Hierarchy:<span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="text" defaultValue="SAP Best Practices Co..." className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">Ledger:<span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="text" defaultValue="Ledger 0L (0L)" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">Company Code:<span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="text" defaultValue="2 Items" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8 text-blue-600 font-medium" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Cost Center:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Controlling Area:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Maintenance Order Type:</label>
                <div className="relative">
                  <select className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 appearance-none bg-white">
                    <option></option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1.5 text-slate-400 pointer-events-none" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Maintenance Activity Type:</label>
                <div className="relative">
                  <select className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 appearance-none bg-white">
                    <option></option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Planner Group:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Planning Plant:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Equipment:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Functional Location:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Assembly:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Priority:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Product:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
                  <Copy size={14} className="absolute right-2 top-1.5 text-slate-400" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500 font-semibold">Serial Number:</label>
                <div className="relative">
                  <input type="text" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 pr-8" />
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

              <div className="col-start-6 flex items-center justify-end gap-3 mt-4">
                <button className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-sm transition-colors text-sm">Go</button>
                <button className="text-blue-600 font-medium hover:underline text-sm">Adapt Filters (4)</button>
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
          
          {/* 3. Interactive Chart Section */}
          <div className="bg-white rounded shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Maintenance Costs</h2>
                <h3 className="text-sm font-semibold text-slate-800 mt-1">Maintenance Order</h3>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-blue-600 hover:underline font-semibold text-sm">Details (1)</button>
                <div className="flex items-center gap-1 ml-4 text-blue-600">
                  <span className="font-semibold text-sm mr-1">View By</span>
                  <button className="p-1 hover:bg-blue-50 rounded bg-blue-100 text-blue-700"><BarChart2 size={16} /></button>
                  <button className="p-1 hover:bg-blue-50 rounded"><LayoutGrid size={16} /></button>
                </div>
                <div className="w-px h-6 bg-slate-300 mx-2"></div>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><ListFilter size={16} /></button>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><LayoutTemplate size={16} /></button>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><Settings size={16} /></button>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><MoreHorizontal size={16} /></button>
              </div>
            </div>
            
            <div className="p-6 pb-2 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <YAxis tickFormatter={(val) => val === 0 ? '0' : `${val / 1000}K`} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dx={-10} />
                  <XAxis dataKey="id" hide />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="cost" maxBarSize={30}>
                    {CHART_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Chart Legend */}
            <div className="px-6 py-2 pb-4 flex justify-center border-b border-slate-100">
               <div className="flex flex-col items-center w-full max-w-5xl">
                 <span className="text-[10px] font-bold text-slate-500 mb-2 uppercase">All Measures</span>
                 <div className="flex gap-4 overflow-x-auto hide-scrollbar w-full pb-2">
                   {CHART_DATA.map(item => (
                     <div key={item.id} className="flex items-center gap-1.5 shrink-0">
                       <div className="w-2.5 h-2.5" style={{ backgroundColor: item.color }}></div>
                       <span className="text-[11px] font-semibold text-slate-500">{item.id}</span>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>

          {/* 4. Hierarchical Table Section */}
          <div className="bg-white rounded shadow-sm border border-slate-200">
            <div className="px-6 py-3 flex justify-between items-center border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">Maintenance Costs (6)</h2>
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><Eye size={16} /></button>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><ListFilter size={16} /></button>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><Settings size={16} /></button>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><Download size={16} /></button>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><Maximize2 size={16} /></button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 font-semibold text-slate-400 text-[11px]">Operation</th>
                    <th className="px-4 py-3 font-semibold text-slate-400 text-[11px]">Planned Costs (Global Currency)</th>
                    <th className="px-4 py-3 font-semibold text-slate-400 text-[11px]">Actual Costs (Global Currency)</th>
                    <th className="px-4 py-3 font-semibold text-slate-400 text-[11px]">Equipment</th>
                    <th className="px-4 py-3 font-semibold text-slate-400 text-[11px]">Maintenance Activity Type</th>
                    <th className="px-4 py-3 font-semibold text-slate-400 text-[11px]">Product Group</th>
                    <th className="px-4 py-3 font-semibold text-slate-400 text-[11px]">Product</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Parent Row */}
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <td colSpan={7} className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setIsRowExpanded(!isRowExpanded)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500"
                        >
                          {isRowExpanded ? <ChevronDown size={14} /> : <ChevronLeft size={14} className="rotate-180" />}
                        </button>
                        <span className="font-semibold text-slate-400">Maintenance Order Type: YBA2 - Preventive Maintenance</span>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Child Row (Aggregated Data) */}
                  {isRowExpanded && (
                    <tr className="hover:bg-slate-50 border-b border-slate-200">
                      <td className="px-10 py-3 text-slate-400 flex items-center">
                         <div className="w-2.5 h-4 border-l border-b border-slate-300 mr-2 -mt-4"></div>
                         -
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-400">9,658.23 <span className="text-[11px] ml-1">USD</span></td>
                      <td className="px-4 py-3 font-medium text-slate-400">9,780.00 <span className="text-[11px] ml-1">USD</span></td>
                      <td className="px-4 py-3 text-slate-400">-</td>
                      <td className="px-4 py-3 text-slate-400">-</td>
                      <td className="px-4 py-3 text-slate-400">-</td>
                      <td className="px-4 py-3 text-slate-400">-</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="h-64"></div> {/* Bottom padding to match scrollable look */}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
