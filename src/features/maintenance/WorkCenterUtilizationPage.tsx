import React, { useState } from 'react';
import { Search, ChevronDown, Calendar as CalendarIcon, Filter, ExternalLink, Settings, RotateCcw, Play, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const OPERATIONS_DATA = [
  { id: '1', priority: '3-Medium', planStart: '12/14/2023, 02:15:00 PM', planEnd: '12/15/2023, 12:07:30 PM', status: 'Due', work: '6,0 H', center: 'ELECENG' },
  { id: '2', priority: '3-Medium', planStart: '12/14/2023, 02:15:00 PM', planEnd: '12/15/2023, 12:07:30 PM', status: 'Due', work: '6,0 H', center: 'ELECENG' },
  { id: '3', priority: 'Very High', planStart: '01/02/2024, 10:00:00 AM', planEnd: '01/02/2024, 10:00:00 AM', status: 'Dispatched', work: '0,0 H', center: 'MECHENG' },
  { id: '4', priority: 'No Priority', planStart: '01/02/2024, 10:00:00 AM', planEnd: '01/02/2024, 10:00:00 AM', status: 'Due', work: '0,0 H', center: 'MECHENG' },
  { id: '5', priority: 'No Priority', planStart: '01/02/2024, 10:00:00 AM', planEnd: '01/02/2024, 11:03:45 AM', status: 'Dispatched', work: '2,0 H', center: 'MECHENG' },
  { id: '6', priority: '1-Very High', planStart: '01/02/2024, 10:00:00 AM', planEnd: '01/02/2024, 12:07:30 PM', status: 'Dispatched', work: '2,0 H', center: 'MECHENG' },
  { id: '7', priority: '1-Very High', planStart: '01/02/2024, 10:00:00 AM', planEnd: '01/02/2024, 04:22:30 PM', status: 'Dispatched', work: '6,0 H', center: 'MECHENG' },
  { id: '8', priority: '1-Very High', planStart: '01/02/2024, 04:22:30 PM', planEnd: '01/02/2024, 06:30:00 PM', status: 'Dispatched', work: '2,0 H', center: 'MECHENG' },
];

const ORDERS_DATA = [
  { id: '4003030', desc: 'Reliability Based Maintenance Plan', priority: '1-Very High', status: 'Dispatched', date: '01/02/2024' },
  { id: '4003040', desc: 'Pump Inspection - Gas', priority: 'No Priority', status: 'Due', date: '01/02/2024' },
  { id: '4003043', desc: 'Mechanical Inspection for Pump', priority: 'No Priority', status: 'Due', date: '12/26/2023' },
];

const CHART_DATA = [
  { month: 'Dec', assembly: 15, eleceng: 10, mecheng: 15 },
  { month: 'Jan', assembly: 5, eleceng: 2, mecheng: 8 },
  { month: 'Feb', assembly: 6, eleceng: 3, mecheng: 7 },
  { month: 'Mar', assembly: 5, eleceng: 2, mecheng: 6 },
  { month: 'Apr', assembly: 7, eleceng: 4, mecheng: 7 },
  { month: 'May', assembly: 6, eleceng: 2, mecheng: 6 },
  { month: 'Jun', assembly: 5, eleceng: 1, mecheng: 5 },
  { month: 'Jul', assembly: 5, eleceng: 2, mecheng: 5 },
  { month: 'Aug', assembly: 4, eleceng: 1, mecheng: 4 },
  { month: 'Sep', assembly: 3, eleceng: 1, mecheng: 3 },
  { month: 'Oct', assembly: 4, eleceng: 2, mecheng: 3 },
  { month: 'Nov', assembly: 4, eleceng: 2, mecheng: 4 },
];

export default function WorkCenterUtilizationPage() {
  const [activeTab, setActiveTab] = useState('Maintenance Order Operations (29)');
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempTarget, setTempTarget] = useState(75);
  const [targetLine, setTargetLine] = useState(75);

  const handleGo = () => {
    setIsFiltering(true);
    setTimeout(() => setIsFiltering(false), 500);
  };

  const handleAction = (action: string) => {
    alert(`${action} action triggered successfully!`);
  };

  const saveSettings = () => {
    setTargetLine(tempTarget);
    setIsSettingsOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-background -m-6 animate-fade-in text-[0.85rem]" style={{ minHeight: 'calc(100vh - 64px)' }}>
      
      {/* Settings Modal Overlay */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] animate-fade-in">
          <div className="bg-surface-1 border border-subtle shadow-xl rounded-lg w-[450px] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-subtle bg-surface-2">
              <h2 className="text-lg font-bold text-primary">Settings</h2>
              <button className="text-muted hover:text-primary transition-colors" onClick={() => setIsSettingsOpen(false)}>
                ✕
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-muted font-semibold">Show Utilization For:</label>
                <div className="flex gap-2">
                  <select className="input-field bg-background border-subtle w-24">
                    <option>12</option>
                    <option>6</option>
                    <option>3</option>
                  </select>
                  <select className="input-field bg-background border-subtle flex-1">
                    <option>Months</option>
                    <option>Weeks</option>
                    <option>Days</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-muted font-semibold">Show Utilization As:</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="utilization_type" className="accent-blue-500" />
                    <span className="text-primary">Capacity Load and Available Capacity</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="utilization_type" defaultChecked className="accent-blue-500" />
                    <span className="text-primary">Utilization Percentage</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-muted font-semibold">Show Target Line At (%):</label>
                <input 
                  type="number" 
                  className="input-field bg-background border-subtle"
                  value={tempTarget}
                  onChange={(e) => setTempTarget(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex justify-end items-center px-6 py-4 border-t border-subtle gap-3 bg-surface-2">
              <button className="btn btn-secondary px-6 font-semibold" onClick={() => setIsSettingsOpen(false)}>Cancel</button>
              <button className="btn btn-primary px-6 font-semibold" onClick={saveSettings}>OK</button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="bg-surface-1 border-b border-subtle">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-primary flex items-center gap-2">
              Standard* <ChevronDown size={14} className="text-blue-600 cursor-pointer" />
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold text-blue-600">
            <button className="bg-transparent border-none text-blue-600 hover:underline cursor-pointer">Change Work Center Capacity</button>
            <button className="bg-transparent border-none text-blue-600 hover:underline cursor-pointer">My Work Centers</button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 pb-6 pt-2">
          <div className="grid grid-cols-6 gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-muted font-medium">Time Period: *</label>
              <div className="flex items-center border border-subtle bg-surface-2 rounded-md px-3 py-1.5 cursor-pointer hover:border-blue-500 transition-colors">
                <span className="flex-1 truncate text-primary">Next 4 Weeks (12/15/20...</span>
                <CalendarIcon size={14} className="text-blue-600" />
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-muted font-medium">Performing Work Center:</label>
              <div className="flex items-center border border-subtle bg-surface-2 rounded-md px-3 py-1.5 cursor-pointer hover:border-blue-500 transition-colors">
                <span className="flex-1 truncate text-primary">MECHENG × 1 More</span>
                <ChevronDown size={14} className="text-muted" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-muted font-medium">Priority:</label>
              <div className="flex items-center border border-subtle bg-surface-2 rounded-md px-3 py-1.5 cursor-pointer hover:border-blue-500 transition-colors">
                <span className="flex-1 text-muted">Select</span>
                <ChevronDown size={14} className="text-muted" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-muted font-medium">Order Type:</label>
              <div className="flex items-center border border-subtle bg-surface-2 rounded-md px-3 py-1.5 cursor-pointer hover:border-blue-500 transition-colors">
                <span className="flex-1 text-muted">Select</span>
                <ChevronDown size={14} className="text-muted" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-muted font-medium">Maintenance Activity Type:</label>
              <div className="flex items-center border border-subtle bg-surface-2 rounded-md px-3 py-1.5 cursor-pointer hover:border-blue-500 transition-colors">
                <span className="flex-1 text-muted">Select</span>
                <ChevronDown size={14} className="text-muted" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-muted font-medium">Processing Status:</label>
              <div className="flex items-center border border-subtle bg-surface-2 rounded-md px-3 py-1.5 cursor-pointer hover:border-blue-500 transition-colors">
                <span className="flex-1 text-muted">Select</span>
                <ChevronDown size={14} className="text-muted" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end items-center mt-4 gap-4">
            <button className="btn btn-primary px-6 py-1.5 rounded-md font-semibold transition-all hover:scale-[1.02] active:scale-95" onClick={handleGo}>
              {isFiltering ? 'Filtering...' : 'Go'}
            </button>
            <button className="bg-transparent border-none text-blue-600 font-semibold hover:underline cursor-pointer">Restore</button>
            <button className="bg-transparent border-none text-blue-600 font-semibold hover:underline cursor-pointer">Adapt Filters (2)</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-surface-1 px-6 flex items-center gap-6 border-b border-subtle pt-2">
        {['Maintenance Orders (19)', 'Maintenance Order Operations (29)'].map(tab => (
          <button
            key={tab}
            className={`bg-transparent border-none pb-3 font-semibold transition-colors relative cursor-pointer outline-none ${activeTab === tab ? 'text-blue-500' : 'text-muted hover:text-primary'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-sm animate-fade-in" />
            )}
          </button>
        ))}
      </div>

      {/* Split Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Table */}
        <div className="flex-1 flex flex-col bg-surface-1 border-r border-subtle overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-surface-2 border-b border-subtle">
            <div className="flex items-center gap-2">
              <button className="bg-transparent border border-subtle rounded px-3 py-1.5 text-blue-600 font-semibold hover:bg-blue-600/10 cursor-pointer transition-colors text-xs" onClick={() => handleAction('Add to Schedule')}>Add to Schedule</button>
              <button className="bg-transparent border border-subtle rounded px-3 py-1.5 text-primary font-semibold hover:bg-surface-3 cursor-pointer transition-colors text-xs" onClick={() => handleAction('Change')}>Change</button>
              <button className="bg-transparent border border-subtle rounded px-3 py-1.5 text-primary font-semibold hover:bg-surface-3 cursor-pointer transition-colors text-xs" onClick={() => handleAction('Dispatch')}>Dispatch</button>
              <button className="bg-transparent border border-subtle rounded px-3 py-1.5 text-primary font-semibold hover:bg-surface-3 cursor-pointer transition-colors text-xs" onClick={() => handleAction('Cancel Dispatch')}>Cancel Dispatch</button>
              <button className="bg-transparent border-none text-blue-600 hover:underline cursor-pointer ml-2 text-xs" onClick={() => handleAction('Show Orders')}>Show Corresponding Orders</button>
            </div>
            <div className="flex items-center gap-1 text-blue-600">
              <button className="btn-icon p-1.5 hover:bg-surface-3 rounded cursor-pointer transition-colors"><Filter size={16}/></button>
              <button className="btn-icon p-1.5 hover:bg-surface-3 rounded cursor-pointer transition-colors"><Settings size={16}/></button>
              <button className="btn-icon p-1.5 hover:bg-surface-3 rounded cursor-pointer transition-colors"><ExternalLink size={16}/></button>
            </div>
          </div>

          <div className="flex-1 overflow-auto relative">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-surface-1 sticky top-0 shadow-sm z-10">
                <tr className="border-b border-subtle text-muted text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 w-10"><input type="checkbox" className="rounded border-subtle bg-surface-2 cursor-pointer" /></th>
                  
                  {activeTab === 'Maintenance Orders (19)' ? (
                    <>
                      <th className="px-4 py-3 font-semibold">Order</th>
                      <th className="px-4 py-3 font-semibold">Description</th>
                      <th className="px-4 py-3 font-semibold">Priority</th>
                      <th className="px-4 py-3 font-semibold">Processing Status</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 font-semibold">Priority</th>
                      <th className="px-4 py-3 font-semibold">Operation Planned Start</th>
                      <th className="px-4 py-3 font-semibold">Operation Planned End</th>
                      <th className="px-4 py-3 font-semibold">Processing Status</th>
                      <th className="px-4 py-3 font-semibold">Work</th>
                      <th className="px-4 py-3 font-semibold">Performing Work Center</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="animate-fade-in">
                {activeTab === 'Maintenance Orders (19)' ? (
                  ORDERS_DATA.map((row, i) => (
                    <tr key={i} className="border-b border-subtle hover:bg-surface-2 cursor-pointer transition-colors group">
                      <td className="px-4 py-3"><input type="checkbox" className="rounded border-subtle bg-surface-2 cursor-pointer" /></td>
                      <td className="px-4 py-3 font-semibold text-blue-500 hover:underline">{row.id}</td>
                      <td className="px-4 py-3 text-primary">{row.desc}</td>
                      <td className="px-4 py-3 text-primary">{row.priority}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${row.status === 'Dispatched' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-primary">{row.date}</td>
                    </tr>
                  ))
                ) : (
                  OPERATIONS_DATA.map((row, i) => (
                    <tr key={i} className="border-b border-subtle hover:bg-surface-2 cursor-pointer transition-colors group">
                      <td className="px-4 py-3"><input type="checkbox" className="rounded border-subtle bg-surface-2 cursor-pointer" /></td>
                      <td className="px-4 py-3 text-primary font-medium">{row.priority}</td>
                      <td className="px-4 py-3 text-muted group-hover:text-primary transition-colors">{row.planStart}</td>
                      <td className="px-4 py-3 text-muted group-hover:text-primary transition-colors">{row.planEnd}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${row.status === 'Dispatched' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-primary font-medium">{row.work}</td>
                      <td className="px-4 py-3 text-primary">{row.center}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {isFiltering && (
              <div className="absolute inset-0 bg-surface-1/50 backdrop-blur-sm flex items-center justify-center animate-fade-in z-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chart */}
        <div className="w-[450px] bg-surface-1 flex flex-col p-4 overflow-y-auto border-l border-subtle">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 bg-surface-2 border border-subtle px-3 py-1.5 rounded-md text-primary font-semibold cursor-pointer hover:border-blue-500 transition-colors">
              Work Center <ChevronDown size={14} />
            </div>
            <div className="flex items-center gap-2 border border-subtle bg-surface-2 px-3 py-1.5 rounded-md text-muted flex-1 mx-2 cursor-pointer hover:border-blue-500 transition-colors">
              Select Work Ce... <ChevronDown size={14} className="ml-auto" />
            </div>
            <button 
              className="btn-icon p-1.5 text-blue-600 hover:bg-surface-2 rounded transition-colors"
              onClick={() => {
                setTempTarget(targetLine);
                setIsSettingsOpen(true);
              }}
            >
              <Settings size={16}/>
            </button>
          </div>

          <div className="text-center font-bold text-primary mb-6">
            All My Work Centers (12/15/2023 - 11/30...
          </div>

          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CHART_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  tickFormatter={(val) => `${val}%`} 
                  axisLine={true}
                  tickLine={true}
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  dx={-10}
                  label={{ value: 'Utilization', angle: -90, position: 'insideLeft', style: { fill: 'var(--text-muted)' } }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '8px' }} 
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                
                {/* Target Line */}
                <ReferenceLine y={targetLine} stroke="var(--text-muted)" strokeDasharray="3 3" />

                <Line type="monotone" dataKey="assembly" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} name="ASSEMBLY(1010)" />
                <Line type="monotone" dataKey="eleceng" stroke="#eab308" strokeWidth={2} dot={{ r: 4, fill: '#eab308' }} name="ELECENG(1710)" />
                <Line type="monotone" dataKey="mecheng" stroke="#22c55e" strokeWidth={2} dot={{ r: 4, fill: '#22c55e' }} name="MECHENG(1710)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Custom Legend */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span><span className="text-xs text-muted font-medium">ASSEMBLY(1010)</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></span><span className="text-xs text-muted font-medium">ELECENG(1710)</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span><span className="text-xs text-muted font-medium">MECHENG(1710)</span></div>
          </div>

        </div>
      </div>

    </div>
  );
}
