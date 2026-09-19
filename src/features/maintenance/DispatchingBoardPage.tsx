import React, { useState } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Filter, Settings, Map, Calendar, Briefcase, ClipboardList, Clock, Sparkles } from 'lucide-react';

const RESOURCES = [
  { id: 1, name: 'Castro-Jones Service Co.', time: '05/03/2024 | 12:08 pm', type: 'company', initial: 'C' },
  { id: 2, name: 'Craig Bisktek', time: '08/21/2024 | 2:13 pm', type: 'person', initial: 'CB' },
  { id: 3, name: 'Gordon MacNeill', time: '10/16/2023 | 2:56 pm', type: 'person', initial: 'GM' },
  { id: 4, name: 'Natali Castro (External)', time: '05/21/2024 | 8:30 pm', type: 'person', initial: 'NC' },
  { id: 5, name: 'Oliver Knaufer', time: '07/16/2024 | 9:24 am', type: 'person', initial: 'OK' },
  { id: 6, name: 'Raul Johns', time: '11/20/2024 | 7:37 pm', type: 'person', initial: 'RJ' },
  { id: 7, name: 'Rhod James', time: '02/27/2024 | 4:28 pm', type: 'person', initial: 'RJ' },
  { id: 8, name: 'Sophia Anderson', time: '08/13/2024 | 12:52 pm', type: 'person', initial: 'SA' },
  { id: 9, name: 'Tatiana Reyes', time: '02/27/2024 | 4:19 pm', type: 'person', initial: 'TR' },
];

const QUEUED_TASKS = [
  { id: '519', priority: 'Emergency', subject: 'Transformer Overheating', operation: '2063', type: 'Maintenance', date: 'November 6, 2024 ...', equipment: 'Transformer_T1000', serial: '811066547', signal: 'WARNING', zip: '43081', city: 'Westerville', stNo: '714', street: 'Bigham Ridge Blvd' },
];

export default function DispatchingBoardPage() {
  const [activeTab, setActiveTab] = useState('General Information');
  const [searchQuery, setSearchQuery] = useState('show me all emergency priority service calls due today within 30km of westerville');

  return (
    <div className="flex h-full bg-surface-1 animate-fade-in" style={{ minHeight: 'calc(100vh - 64px)', margin: '-24px', fontSize: '0.85rem' }}>
      
      {/* 1. Minimized Sub-Sidebar Navigation */}
      <div className="border-r border-subtle flex flex-col items-center bg-surface-1 shrink-0 py-4 gap-4" style={{ width: '56px' }}>
        <button className="p-2 bg-blue-600/10 text-blue-600 rounded-md cursor-pointer transition-colors group relative">
          <Calendar size={20} />
        </button>
        <button className="p-2 text-muted hover:bg-surface-2 hover:text-primary rounded-md cursor-pointer transition-colors">
          <Map size={20} />
        </button>
        <button className="p-2 text-muted hover:bg-surface-2 hover:text-primary rounded-md cursor-pointer transition-colors">
          <Briefcase size={20} />
        </button>
        <button className="p-2 text-muted hover:bg-surface-2 hover:text-primary rounded-md cursor-pointer transition-colors">
          <ClipboardList size={20} />
        </button>
        <button className="p-2 text-muted hover:bg-surface-2 hover:text-primary rounded-md cursor-pointer transition-colors">
          <Clock size={20} />
        </button>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface-2">
        
        {/* Top Header */}
        <div className="bg-surface-1 px-6 py-4 border-b border-subtle flex justify-between items-center shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold text-primary">Dispatching Board</h1>
            <div className="flex items-center gap-2 text-blue-600 cursor-pointer font-semibold hover:underline">
              Select View <ChevronDown size={14} />
            </div>
            <div className="text-muted font-medium">11 Entries</div>
            <div className="flex items-center gap-2 text-blue-600 cursor-pointer font-semibold hover:underline">
              Filter By <ChevronDown size={14} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-icon p-1.5 text-muted hover:text-primary hover:bg-surface-2 rounded"><Search size={16} /></button>
            <button className="btn-icon p-1.5 text-muted hover:text-primary hover:bg-surface-2 rounded"><Settings size={16} /></button>
          </div>
        </div>

        {/* Timeline Controls */}
        <div className="bg-surface-1 px-6 py-2 border-b border-subtle flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <button className="p-1 text-blue-600 hover:bg-surface-2 rounded"><ChevronLeft size={16} /></button>
            <span className="font-semibold text-primary">Today</span>
            <button className="p-1 text-blue-600 hover:bg-surface-2 rounded"><ChevronRight size={16} /></button>
            <span className="font-semibold text-primary ml-4">11/06/2024</span>
            <div className="flex items-center gap-1 text-blue-600 font-semibold cursor-pointer hover:underline ml-4">
              2 Days <ChevronDown size={14} />
            </div>
            <Search size={14} className="text-muted ml-4" />
          </div>
        </div>

        {/* Gantt Chart Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-surface-1">
          {/* Header Row */}
          <div className="flex border-b border-subtle shrink-0">
            <div className="shrink-0 p-4 font-semibold text-muted border-r border-subtle bg-surface-1 flex items-end" style={{ width: '280px' }}>
              Resources
            </div>
            <div className="flex-1 flex overflow-x-auto" style={{ minWidth: '800px' }}>
              {['Wed, 11/06', 'Thu, 11/07'].map((day, i) => (
                <div key={i} className="flex-1 border-r border-subtle relative" style={{ minWidth: '300px' }}>
                  <div className="text-center py-2 text-xs font-semibold text-primary">{day}</div>
                  <div className="flex justify-between px-2 text-muted border-t border-subtle pt-1 pb-1" style={{ fontSize: '10px' }}>
                    <span>2</span><span>4</span><span>8</span><span>12</span><span>4</span><span>8</span>
                  </div>
                  {/* Current time line simulation */}
                  {i === 0 && <div className="absolute top-0 bottom-0 z-10" style={{ left: '45%', width: '2px', backgroundColor: '#3b82f6' }} />}
                </div>
              ))}
            </div>
          </div>

        {/* Resources Rows */}
          <div className="flex-1 overflow-y-auto relative">
            {RESOURCES.map((res, i) => (
              <div key={res.id} className="flex border-b border-subtle hover-bg-surface-2 transition-colors relative z-10">
                <div className="shrink-0 p-3 border-r border-subtle flex items-center gap-3 bg-surface-1" style={{ width: '280px' }}>
                  <div className="rounded-full flex items-center justify-center text-white font-bold relative" style={{ width: '32px', height: '32px', backgroundColor: res.type === 'company' ? '#1f2937' : '#f97316' }}>
                    {res.initial}
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-surface-1 rounded-full" style={{ width: '10px', height: '10px', backgroundColor: '#22c55e', border: '1px solid var(--bg-surface)' }}></div>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold text-primary truncate">{res.name}</span>
                    <span className="text-xs text-muted truncate">{res.time}</span>
                  </div>
                </div>
                <div className="flex-1 flex relative h-14" style={{ minWidth: '800px' }}>
                  {/* Mock Blocks for visual similarity */}
                  {i === 1 && (
                    <>
                      <div className="absolute top-2 rounded flex flex-col text-white p-1 overflow-hidden shadow-sm" style={{ left: '20%', height: '40px', width: '60px', backgroundColor: '#0d9488', fontSize: '10px' }}>
                        <span className="font-bold truncate">Pump Install</span>
                        <div className="flex gap-0.5 mt-auto"><span className="bg-yellow-400 w-3 h-3 rounded-sm" style={{ width: '12px', height: '12px', backgroundColor: '#facc15' }}></span></div>
                      </div>
                      <div className="absolute top-2 rounded flex flex-col text-white p-1 overflow-hidden shadow-sm" style={{ left: '35%', height: '40px', width: '70px', backgroundColor: '#2563eb', fontSize: '10px' }}>
                        <span className="font-bold truncate">Motor Swap</span>
                        <div className="flex gap-0.5 mt-auto"><span className="bg-red-500 w-3 h-3 rounded-sm" style={{ width: '12px', height: '12px', backgroundColor: '#ef4444' }}></span></div>
                      </div>
                    </>
                  )}
                  {i === 3 && (
                    <>
                      <div className="absolute top-2 rounded flex flex-col text-white p-1 overflow-hidden shadow-sm" style={{ left: '25%', height: '40px', width: '120px', backgroundColor: '#9333ea', fontSize: '10px' }}>
                        <span className="font-bold truncate">Transformer Check</span>
                        <div className="flex gap-0.5 mt-auto"><span className="bg-red-500 w-3 h-3 rounded-sm" style={{ width: '12px', height: '12px', backgroundColor: '#ef4444' }}></span><span className="bg-green-500 w-3 h-3 rounded-sm" style={{ width: '12px', height: '12px', backgroundColor: '#22c55e' }}></span></div>
                      </div>
                    </>
                  )}
                  {i === 8 && (
                    <>
                      <div className="absolute top-2 rounded flex flex-col text-white p-1 overflow-hidden shadow-sm" style={{ left: '15%', height: '40px', width: '80px', backgroundColor: '#0d9488', fontSize: '10px' }}>
                        <span className="font-bold truncate">Valve Repair</span>
                        <div className="flex gap-0.5 mt-auto"><span className="bg-yellow-400 w-3 h-3 rounded-sm" style={{ width: '12px', height: '12px', backgroundColor: '#facc15' }}></span></div>
                      </div>
                      <div className="absolute top-2 rounded flex flex-col text-white p-1 overflow-hidden shadow-sm" style={{ left: '45%', height: '40px', width: '90px', backgroundColor: '#db2777', fontSize: '10px' }}>
                        <span className="font-bold truncate">Routine Maint.</span>
                        <div className="flex gap-0.5 mt-auto"><span className="bg-red-500 w-3 h-3 rounded-sm" style={{ width: '12px', height: '12px', backgroundColor: '#ef4444' }}></span></div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom AI Search & Task List */}
        <div className="bg-surface-1 border-t-4 border-teal-500 flex flex-col shrink-0" style={{ height: '280px', borderColor: '#14b8a6' }}>
          
          <div className="px-6 py-3 border-b border-subtle flex items-center gap-4 bg-surface-2">
            <div className="flex items-center gap-4 border-r border-subtle pr-4">
              <span className="font-semibold text-primary">Select View</span>
              <span className="text-muted">1 Entries</span>
              <span className="text-muted font-medium ml-2">Filter Mode:</span>
              <button className="btn-primary w-6 h-6 flex items-center justify-center rounded bg-blue-600 text-white"><Search size={12} /></button>
            </div>
            
            {/* AI Search Bar */}
            <div className="flex-1 flex items-center">
              <div className="relative flex-1 max-w-[800px] flex items-center border border-blue-500 rounded-md bg-background px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500/30 transition-all shadow-sm">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-primary text-[0.9rem]"
                />
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-xs text-muted">140/200</span>
                  <button className="text-muted hover:text-primary p-0.5"><span className="text-xs font-bold">✕</span></button>
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white shrink-0 ml-1">
                    <Sparkles size={14} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="btn-icon p-1 text-muted hover:text-primary"><Settings size={16} /></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-surface-1 sticky top-0 shadow-sm z-10">
                <tr className="border-b border-subtle text-muted text-[11px] uppercase tracking-wider">
                  <th className="px-4 py-2 w-10"><input type="checkbox" className="rounded border-subtle bg-surface-2" /></th>
                  <th className="px-4 py-2 font-semibold">Work Order</th>
                  <th className="px-4 py-2 font-semibold">Priority</th>
                  <th className="px-4 py-2 font-semibold">Subject</th>
                  <th className="px-4 py-2 font-semibold">Operation</th>
                  <th className="px-4 py-2 font-semibold text-center">Type</th>
                  <th className="px-4 py-2 font-semibold">SC Due Date</th>
                  <th className="px-4 py-2 font-semibold">Equipment Name</th>
                  <th className="px-4 py-2 font-semibold">Equipment Serial ...</th>
                  <th className="px-4 py-2 font-semibold">Signal Word</th>
                  <th className="px-4 py-2 font-semibold">Zip Code</th>
                  <th className="px-4 py-2 font-semibold">City</th>
                  <th className="px-4 py-2 font-semibold">Street No.</th>
                  <th className="px-4 py-2 font-semibold">Street</th>
                </tr>
              </thead>
              <tbody>
                {QUEUED_TASKS.map((task, i) => (
                  <tr key={i} className="border-b border-subtle hover:bg-surface-2 cursor-pointer transition-colors text-[0.8rem]">
                    <td className="px-4 py-3"><input type="checkbox" className="rounded border-subtle bg-surface-2" /></td>
                    <td className="px-4 py-3 text-primary flex items-center gap-2">
                      <Settings size={12} className="text-muted"/> {task.id}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-red-500 text-red-500 bg-red-500/5">{task.priority}</span>
                    </td>
                    <td className="px-4 py-3 text-primary font-medium">{task.subject}</td>
                    <td className="px-4 py-3 text-muted">{task.operation}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border border-blue-500/30 text-blue-500 bg-blue-500/5">{task.type}</span>
                    </td>
                    <td className="px-4 py-3 text-muted">{task.date}</td>
                    <td className="px-4 py-3 text-primary">{task.equipment}</td>
                    <td className="px-4 py-3 text-muted">{task.serial}</td>
                    <td className="px-4 py-3">
                      {task.signal === 'WARNING' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500 text-white flex items-center gap-1 w-max">
                          <span className="w-2.5 h-2.5 rounded-full bg-white text-orange-500 flex items-center justify-center text-[7px]">!</span> {task.signal}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white flex items-center gap-1 w-max">
                          <span className="w-2.5 h-2.5 rounded-full bg-white text-red-600 flex items-center justify-center text-[7px] border border-white">!</span> {task.signal}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">{task.zip}</td>
                    <td className="px-4 py-3 text-muted">{task.city}</td>
                    <td className="px-4 py-3 text-muted">{task.stNo}</td>
                    <td className="px-4 py-3 text-muted">{task.street}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 3. Right Sidebar Details Pane */}
      <div className="bg-surface-1 border-l border-subtle shrink-0 flex flex-col overflow-y-auto" style={{ width: '380px' }}>
        <div className="p-4 border-b border-subtle flex justify-between items-center bg-surface-2">
          <h2 className="font-bold text-primary" style={{ fontSize: '1.25rem', margin: 0 }}>Queued 0 / 0</h2>
        </div>

        {/* Best Matching Technicians Panel */}
        <div className="p-5 flex flex-col gap-4 border-b border-subtle bg-surface-1">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-primary" style={{ fontSize: '1.1rem', margin: 0 }}>Best Matching Technicians</h2>
            <button className="text-muted hover:text-primary"><span className="text-sm">✕</span></button>
          </div>
          
          <div className="border border-subtle rounded flex items-center px-3 py-1.5 cursor-pointer hover:border-blue-500 transition-colors">
            <span className="flex-1 text-primary">SLACompliance</span>
            <ChevronDown size={14} className="text-muted" />
          </div>

          <div className="border border-subtle border-dashed rounded p-3 flex flex-col gap-3">
            <span className="font-bold text-primary text-sm">Activity 2063: Transformer Overheating</span>
            <div className="flex justify-between text-xs text-muted">
              <div className="flex flex-col">
                <span>Estimated Duration:</span>
                <span>2 h</span>
              </div>
              <div className="flex flex-col text-right">
                <span>Planned Duration:</span>
                <span>2 h</span>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600/30"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600/30"></span>
            </div>
          </div>
        </div>

        {/* Activity Details */}
        <div className="p-5 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-muted font-semibold text-xs">Activity 2063</span>
                <span className="px-2 py-0.5 text-[10px] font-bold text-orange-500 bg-orange-500/10 rounded flex items-center gap-1 border border-orange-500/20">
                  <span className="w-2.5 h-2.5 rounded-full border border-orange-500 text-[6px] flex items-center justify-center">!</span>
                  Reminder 1
                </span>
              </div>
              <div className="flex gap-2 text-muted">
                <button className="p-1 hover:text-primary"><ClipboardList size={14}/></button>
                <button className="p-1 hover:text-primary"><span className="text-xs">•••</span></button>
              </div>
            </div>
            <h1 className="text-xl font-bold text-primary leading-tight mt-1">Transformer Overheating</h1>
            <div className="flex gap-2 mt-1">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-600 text-white">Dispatching</span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-orange-500 text-white flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-white text-orange-500 flex items-center justify-center text-[8px]">!</span> WARNING
              </span>
            </div>
          </div>

          {/* Customer Card */}
          <div className="bg-surface-2 rounded-lg p-4 flex gap-4 border border-subtle shadow-sm">
            <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
              <ClipboardList size={24} />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-xs text-muted">Customer: <span className="text-blue-500 font-semibold truncate hover:underline cursor-pointer">Smart Solutions Inc</span></span>
              <span className="text-xs text-muted truncate">Contact Person: Lou Daly</span>
              <span className="text-xs text-muted truncate">Service Call: 519</span>
              <div className="flex gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">Maintenance</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-500 border border-red-500/20">Emergency</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-subtle justify-between">
            <div className="flex gap-6">
              {['General Information', 'Skills', 'Tools'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 font-semibold transition-colors relative cursor-pointer outline-none text-[13px] ${activeTab === tab ? 'text-blue-500' : 'text-muted hover:text-primary'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-t-sm" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 pb-2 text-muted cursor-pointer hover:text-primary text-[13px] font-semibold">
              3 <ChevronDown size={14} />
            </div>
          </div>

          {/* General Information Content */}
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-primary">General Information</h3>
              <button className="text-blue-600 border border-subtle px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-600/10 transition-colors">Edit</button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <h4 className="font-bold text-primary mb-2 text-sm">Equipment</h4>
                <div className="flex flex-col">
                  <span className="text-xs text-muted">Name</span>
                  <span className="text-blue-500 font-medium text-sm hover:underline cursor-pointer">Transformer_T1000</span>
                </div>
                <div className="flex flex-col mt-3">
                  <span className="text-xs text-muted">Serial No.</span>
                  <span className="text-primary font-medium text-sm">811066547</span>
                </div>
              </div>

              <div className="pt-4 border-t border-subtle">
                <h4 className="font-bold text-primary mb-2 text-sm">Notes</h4>
                <span className="text-xs text-muted">Remarks (for Technician)</span>
              </div>

              <div className="pt-4 border-t border-subtle flex flex-col gap-3">
                <h4 className="font-bold text-primary mb-1 text-sm">Dispatching</h4>
                
                <div className="flex flex-col">
                  <span className="text-xs text-muted">Earliest Start Date</span>
                  <span className="text-primary font-medium text-sm">November 6, 2024 4:00 PM</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-muted">Due Date</span>
                  <span className="text-primary font-medium text-sm">November 6, 2024 11:59 PM</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-muted">Planned Start Date</span>
                  <span className="text-primary font-medium text-sm">November 6, 2024 4:00 PM</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-muted">Planned End Date</span>
                  <span className="text-primary font-medium text-sm">November 6, 2024 6:00 PM</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-muted">Estimated Duration</span>
                  <span className="text-primary font-medium text-sm">2 hours</span>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
