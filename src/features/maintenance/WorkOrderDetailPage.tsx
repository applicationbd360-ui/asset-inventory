import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, ChevronDown, Search, Headset, HelpCircle, Bell, UserCircle, 
  ExternalLink, ChevronUp, Settings, ListFilter, Download, LayoutTemplate, 
  Maximize2
} from 'lucide-react';

const OPERATIONS_DATA = [
  {
    op: '0010',
    title: 'Check for additional damage',
    subOp: '',
    desc: 'Check for additional damage',
    controlKey: 'Plant maintenance - internal (YBM1)',
    workCenter: 'Mechanics (RES-0100)',
    plant: 'Plant 1 DE (1010)',
    plannedWork: '1.000 H',
    personnel: 'RyanJones (50004127)',
    status: ['CNF', 'JBFI', 'ORSP', 'PWF', 'TECO'],
    actualWork: '1.000 H'
  },
  {
    op: '0020',
    title: 'Replace worn gasket',
    subOp: '',
    desc: 'Replace worn gasket',
    controlKey: 'Plant maintenance - internal (YBM1)',
    workCenter: 'Mechanics (RES-0100)',
    plant: 'Plant 1 DE (1010)',
    plannedWork: '1.000 H',
    personnel: 'RyanJones (50004127)',
    status: ['CNF', 'JBFI', 'ORSP', 'PWF', 'TECO'],
    actualWork: '20.000 H'
  },
  {
    op: '0030',
    title: 'Inspect Work, Take Readings',
    subOp: '',
    desc: 'Inspect Work, Take Readings',
    controlKey: 'Plant maintenance - internal (YBM1)',
    workCenter: 'Mechanics (RES-0100)',
    plant: 'Plant 1 DE (1010)',
    plannedWork: '1.000 H',
    personnel: 'RyanJones (50004127)',
    status: [],
    actualWork: ''
  }
];

const COSTS_DATA = [
  { category: 'Internal Activity', est: '150.00', plan: '38.40', act: '240.00' },
  { category: 'Stock Material', est: '200.00', plan: '522.00', act: '1,491.53' },
  { category: '3rd party Material', est: '0.00', plan: '0.00', act: '0.00' },
  { category: '3rd party Services', est: '0.00', plan: '0.00', act: '0.00' },
  { category: 'Total', est: '350.00', plan: '560.40', act: '1,731.53', isTotal: true },
];

const SYSTEM_STATUS_DATA = [
  { status: 'ESTC', text: 'Estimated Costs' },
  { status: 'CNF', text: 'Confirmed' },
  { status: 'PRC', text: 'Pre-costed' },
  { status: 'SETC', text: 'Settlement rule created' },
  { status: 'TECO', text: 'Technically completed' },
  { status: 'CSER', text: 'Error in cost calculation' },
  { status: 'GMPS', text: 'Goods movement posted' },
  { status: 'MACM', text: 'Material committed' },
  { status: 'JBFI', text: 'Job Finished' },
];

export default function WorkOrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Account Assignment');
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(true);

  return (
    <div className="flex flex-col h-full bg-white -m-6 animate-fade-in font-sans overflow-x-hidden text-[13px] text-slate-800" style={{ minHeight: 'calc(100vh - 64px)' }}>
      
      {/* 1. Top Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-subtle bg-white">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-600 font-semibold hover:text-blue-600 transition-colors">
          <ChevronLeft size={16} /> Maintenance Order <ChevronDown size={14} className="ml-1" />
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
        <div className="max-w-[1400px] w-full mx-auto px-8 pt-6 pb-12 flex flex-col gap-6">
          
          {/* 2. Main Metadata Header */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-slate-800">{id || '4003699'}</h1>
              <h2 className="text-base text-slate-600">Oil pooling under pump</h2>
              
              {!isHeaderCollapsed && (
                <div className="flex mt-4 gap-6 animate-fade-in">
                  <div className="mt-1 relative">
                     <div className="w-12 h-10 border-2 border-slate-400 rounded-t-full rounded-b-md relative">
                        <div className="absolute -bottom-1 -right-2 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-4 gap-x-12 gap-y-2">
                    <div className="flex gap-2"><span className="text-slate-500 w-24">Order Type:</span><span className="font-medium text-slate-700">Corrective Maintenance (YBA1)</span></div>
                    <div className="flex gap-2"><span className="text-slate-500 w-20">Notification:</span><span className="font-medium text-slate-700">-</span></div>
                    <div className="flex gap-2"><span className="text-slate-500 w-24">System Status:</span><span className="font-medium text-slate-700">TECO CNF ESTC CSER GMPS JBFI MACM PRC</span></div>
                    <div className="flex flex-col row-span-2">
                      <span className="font-bold text-slate-800">Estimated Cost</span>
                      <span className="text-2xl font-bold text-slate-800">350.00 <span className="text-lg">EUR</span></span>
                    </div>

                    <div className="flex gap-2"><span className="text-slate-500 w-24">Processing Context:</span><span className="font-medium text-slate-700">Standard Order</span></div>
                    <div className="flex gap-2"><span className="text-slate-500 w-20">Basic Start:</span><span className="font-medium text-slate-700">12/17/2024, 04:00:00 AM</span></div>
                    <div className="flex gap-2"><span className="text-slate-500 w-24">Has Open Main Work:</span><span className="font-medium text-slate-700">No</span></div>
                    
                    <div className="flex gap-2"><span className="text-slate-500 w-24">Priority:</span><span className="font-medium text-red-600">1-Very High (1)</span></div>
                    <div className="flex gap-2"><span className="text-slate-500 w-20">Basic Finish:</span><span className="font-medium text-slate-700">12/18/2024, 04:00:00 AM</span></div>
                    <div></div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">Actual Cost</span>
                      <span className="text-2xl font-bold text-slate-800">1,731.53 <span className="text-lg">EUR</span></span>
                    </div>

                    <div className="flex gap-2 col-span-2 mt-1"><span className="text-slate-500 w-24">Technical Object:</span><a href="#" className="font-medium text-blue-600 hover:underline">Cooling Water Circulation Pump (210100092)</a></div>
                    
                    <div className="col-start-4 flex flex-col gap-1 -mt-4 text-xs font-medium text-slate-500">
                      <div>Original Files: <span className="text-slate-800">0</span></div>
                      <div>Operations: <span className="text-slate-800">4</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-sm transition-colors shadow-sm">
                Edit
              </button>
              <button className="flex items-center gap-1 text-blue-600 font-bold hover:underline text-sm">
                Related Apps <ExternalLink size={14} className="ml-1" /> <ChevronDown size={14} />
              </button>
            </div>
          </div>

          <div className="flex justify-center -mt-2">
            <button 
              onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
              className="bg-white border border-slate-200 rounded-full p-1 shadow-sm text-slate-400 hover:text-blue-600 flex gap-1 transition-transform"
            >
              {isHeaderCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>

          {/* 3. Tabs Navigation */}
          <div className="flex gap-6 border-b border-slate-200 mt-2">
            {['General Information', 'Operations', 'Organizational Data', 'Account Assignment', 'Costs', 'System Status', 'Original Files', 'History'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 font-semibold transition-colors relative outline-none text-[13px] ${activeTab === tab ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-sm" />
                )}
              </button>
            ))}
          </div>

          {/* 4. Tab Content: General Information */}
          <div className="grid grid-cols-4 gap-8 py-4 bg-slate-50/30 p-6 rounded-md">
            
            {/* Column 1 */}
            <div className="flex flex-col gap-6">
              <h3 className="font-bold text-slate-800 mb-2">General</h3>
              <div className="flex flex-col"><span className="text-slate-500 mb-1">Notification:</span><span>-</span></div>
              <div className="flex flex-col"><span className="text-slate-500 mb-1">Task List:</span><span>-</span></div>
              <div className="flex flex-col"><span className="text-slate-500 mb-1">Maintenance Plan:</span><span>-</span></div>
              <div className="flex flex-col"><span className="text-slate-500 mb-1">Long Text:</span><span>Fix the pump and stop leaking oil.</span></div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-6">
              <h3 className="font-bold text-slate-800 mb-2">Responsibilities</h3>
              <div className="flex flex-col"><span className="text-slate-500 mb-1">Main Work Center:</span><a href="#" className="text-blue-600 hover:underline">Mechanics (RES-0100)</a></div>
              <div className="flex flex-col"><span className="text-slate-500 mb-1">Main Work Center Plant:</span><span>Plant 1 DE (1010)</span></div>
              <div className="flex flex-col"><span className="text-slate-500 mb-1">Planner Group:</span><a href="#" className="text-blue-600 hover:underline">PM Planner Mech. (920)</a></div>
              <div className="flex flex-col"><span className="text-slate-500 mb-1">Planning Plant:</span><span>Plant 1 DE (1010)</span></div>
              <div className="flex flex-col"><span className="text-slate-500 mb-1">Person Responsible:</span><a href="#" className="text-blue-600 hover:underline">RyanJones</a></div>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-6">
              <h3 className="font-bold text-slate-800 mb-2">Dates</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col"><span className="text-slate-500 mb-1">Basic Start:</span><span>12/17/2024, 04:00:00 AM</span></div>
                <div className="flex flex-col"><span className="text-slate-500 mb-1">Created On/At:</span><span>12/17/2024, 04:46:39 PM</span></div>
                <div className="flex flex-col"><span className="text-slate-500 mb-1">Scheduled Start:</span><span>12/17/2024, 10:00:00 AM</span></div>
                <div className="flex flex-col"><span className="text-slate-500 mb-1">Basic Finish:</span><span>12/18/2024, 04:00:00 AM</span></div>
                <div className="flex flex-col"><span className="text-slate-500 mb-1">Created By:</span><a href="#" className="text-blue-600 hover:underline">RyanJones (CB9980002001)</a></div>
                <div className="flex flex-col"><span className="text-slate-500 mb-1">Scheduled Finish:</span><span>12/17/2024, 02:15:00 PM</span></div>
              </div>
            </div>

            {/* Column 4 */}
            <div className="flex flex-col gap-6">
              <h3 className="font-bold text-slate-800 mb-2">Technical Object</h3>
              <div className="flex flex-col"><span className="text-slate-500 mb-1">Technical Object:</span><a href="#" className="text-blue-600 hover:underline">Cooling Water Circulation Pump (210100092)</a></div>
              <div className="flex flex-col"><span className="text-slate-500 mb-1">Material:</span><span>-</span></div>
              <div className="flex flex-col"><span className="text-slate-500 mb-1">Serial Number:</span><span>-</span></div>
              <div className="flex flex-col"><span className="text-slate-500 mb-1">Assembly:</span><span>-</span></div>
              <div className="flex flex-col"><span className="text-slate-500 mb-1">System Condition:</span><span>-</span></div>
            </div>

          </div>
          
          <div className="flex justify-end -mt-4 border-b-2 border-blue-600/20 pb-4 mb-2">
             <button className="text-blue-600 font-bold hover:underline">Show More</button>
          </div>

          {/* 5. Operations Table */}
          <div className="flex flex-col border border-slate-200 shadow-sm rounded-md overflow-hidden">
            <div className="bg-white px-4 py-3 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-1">
                Operations (4) <span className="text-blue-600 font-normal flex items-center cursor-pointer hover:underline">Standard <ChevronDown size={16} /></span>
              </h3>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input type="text" placeholder="Search" className="border border-slate-300 rounded px-3 py-1 pl-8 text-sm outline-none focus:border-blue-500 w-48" />
                  <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
                </div>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><ListFilter size={16} /></button>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><LayoutTemplate size={16} /></button>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><Settings size={16} /></button>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><Maximize2 size={16} /></button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="px-4 py-3 font-semibold text-slate-700 w-[20%]">Operation</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Suboperation</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Operation Description</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Control Key</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Work Center</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Plant</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Planned Work</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Personnel Number</th>
                    <th className="px-2 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {OPERATIONS_DATA.map((op, i) => (
                    <tr key={i} className="hover:bg-slate-50 align-top group cursor-pointer transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-bold text-slate-800">{op.title}</span>
                          <span className="text-slate-500">{op.op}</span>
                          {op.status.length > 0 && (
                            <div className="flex gap-2 text-slate-600">
                              <span className="text-slate-400">System Status:</span>
                              <div className="flex gap-1 flex-wrap">
                                {op.status.map(s => <span key={s}>{s}</span>)}
                              </div>
                            </div>
                          )}
                          <div className="flex gap-2 text-slate-600">
                            <span className="text-slate-400">Notification:</span>
                          </div>
                          {op.actualWork && (
                            <div className="flex gap-4 font-semibold text-slate-700 mt-1">
                              <span className="text-slate-400 font-normal">Actual Work:</span> {op.actualWork.split(' ')[0]} <span className="ml-2 font-normal text-slate-500">H</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{op.subOp}</td>
                      <td className="px-4 py-4 text-slate-700">{op.desc}</td>
                      <td className="px-4 py-4"><a href="#" className="text-blue-600 hover:underline">{op.controlKey}</a></td>
                      <td className="px-4 py-4 text-slate-700">{op.workCenter}</td>
                      <td className="px-4 py-4"><a href="#" className="text-blue-600 hover:underline">{op.plant}</a></td>
                      <td className="px-4 py-4 text-slate-700">{op.plannedWork.split(' ')[0]} <span className="ml-2 font-normal text-slate-500">H</span></td>
                      <td className="px-4 py-4"><a href="#" className="text-blue-600 hover:underline">{op.personnel}</a></td>
                      <td className="px-2 py-4 text-slate-300 group-hover:text-blue-600">
                        <ChevronRight size={16} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. Account Assignment Section */}
          <div className="flex flex-col mt-4">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Account Assignment</h2>
            <div className="grid grid-cols-4 gap-8 pb-8 border-b border-slate-200">
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col"><span className="text-slate-500 mb-1">Company Code:</span><span>Company Code 1010 (1010)</span></div>
                <div className="flex flex-col"><span className="text-slate-500 mb-1">Business Area:</span><span>-</span></div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col"><span className="text-slate-500 mb-1">Controlling Area:</span><span>Controlling Area A000 (A000)</span></div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col"><span className="text-slate-500 mb-1">Cost Center:</span><span>Manufacturing 1 (DE) (10101301)</span></div>
                <div className="flex flex-col"><span className="text-slate-500 mb-1">City:</span><span>Walldorf</span></div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col"><span className="text-slate-500 mb-1">Settlement Order:</span><span>-</span></div>
              </div>

              <div className="flex flex-col gap-4 -mt-12 col-start-5">
                <div className="flex flex-col"><span className="text-slate-500 mb-1">Asset:</span><span>-</span></div>
                <div className="flex flex-col"><span className="text-slate-500 mb-1">Asset Subnumber:</span><span>-</span></div>
                <div className="flex flex-col"><span className="text-slate-500 mb-1">WBS Element:</span><span>-</span></div>
              </div>

            </div>
          </div>

          {/* 7. Costs Section */}
          <div className="flex flex-col mt-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1">
                Costs (5) <span className="text-blue-600 font-normal flex items-center cursor-pointer hover:underline text-base">Standard <ChevronDown size={16} /></span>
              </h2>
              <div className="flex gap-2">
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><Settings size={16} /></button>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><LayoutTemplate size={16} /></button>
              </div>
            </div>
            
            <div className="w-1/2">
              <table className="w-full text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="px-4 py-2 font-semibold text-slate-700">Value Category</th>
                    <th className="px-4 py-2 font-semibold text-slate-700 text-right">Estimated Cost</th>
                    <th className="px-4 py-2 font-semibold text-slate-700 text-right">Planned Cost</th>
                    <th className="px-4 py-2 font-semibold text-slate-700 text-right">Actual Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {COSTS_DATA.map((row, i) => (
                    <tr key={i} className={`hover:bg-slate-50 ${row.isTotal ? 'border-t border-slate-300 font-semibold' : ''}`}>
                      <td className="px-4 py-2 text-slate-700">{row.category}</td>
                      <td className="px-4 py-2 text-slate-700 text-right">{row.est} <span className="ml-1 text-slate-400">EUR</span></td>
                      <td className="px-4 py-2 text-slate-700 text-right">{row.plan} <span className="ml-1 text-slate-400">EUR</span></td>
                      <td className="px-4 py-2 text-slate-700 text-right">{row.act} <span className="ml-1 text-slate-400">EUR</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 8. System Status Section */}
          <div className="flex flex-col mt-8 pb-12">
            <h2 className="text-lg font-bold text-slate-800 mb-4">System Status</h2>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-1">
                System Status (9) <span className="text-blue-600 font-normal flex items-center cursor-pointer hover:underline">Standard <ChevronDown size={16} /></span>
              </h3>
              <div className="flex gap-2">
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><Settings size={16} /></button>
                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-transparent hover:border-slate-300"><LayoutTemplate size={16} /></button>
              </div>
            </div>

            <div className="w-1/4 min-w-[300px]">
              <table className="w-full text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="px-4 py-2 font-semibold text-slate-700 w-24">Status</th>
                    <th className="px-4 py-2 font-semibold text-slate-700">Text</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SYSTEM_STATUS_DATA.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-4 py-2 text-slate-700">{row.status}</td>
                      <td className="px-4 py-2 text-slate-700">{row.text}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}

function ChevronRight({ size, className }: { size?: number, className?: string }) {
  return (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
