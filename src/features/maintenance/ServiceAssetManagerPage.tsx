import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Wrench, AlertTriangle, Clock, Map, Search, ChevronRight, RefreshCw, PanelLeftClose } from 'lucide-react';

const WORK_ORDERS = [
  { id: '4027420', title: 'Oil pooling under pump', status: 'Started', priority: '1-Very high', priorityColor: 'text-red-500', date: 'Feb 23, 2023', actions: ['Hold', 'Review'] },
  { id: '4027...', title: 'Transformer overheating', status: 'Pending Review', priority: '1-Very high', priorityColor: 'text-red-500', date: 'Mar 14, 2023', actions: [] },
  { id: '4027...', title: 'Monthly Pump Inspection', status: 'Received', priority: '3-Medium', priorityColor: 'text-orange-500', date: 'Mar 1, 2023', actions: ['Transfer'] },
  { id: '4027...', title: 'Container Inspection', status: 'Received', priority: '3-Medium', priorityColor: 'text-orange-500', date: 'Apr 3, 2023', actions: ['Transfer'] },
  { id: '4027442', title: 'Engine Check', status: 'Received', priority: '2-High', priorityColor: 'text-red-500', date: 'Sep 16, 2024', actions: ['Transfer'] },
];

const NOTIFICATIONS = [
  { id: '10037590', title: 'Pump leaking oil', date: 'Feb 22, 2023', status: 'Received' },
  { id: '10037614', title: 'Tree Down on Powerline', date: 'Mar 16, 2023', status: 'Received' },
  { id: 'LOCAL_N00001', title: 'Smell of gas', date: 'No Due Date Available', status: 'Received' },
];

export default function ServiceAssetManagerPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f4f7fb] -m-6 animate-fade-in font-sans overflow-y-auto" style={{ minHeight: 'calc(100vh - 64px)' }}>
      
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-subtle sticky top-0 z-20">
        <button className="text-blue-600 hover:bg-blue-600/10 p-2 rounded-md transition-colors"><PanelLeftClose size={20} /></button>
        <h1 className="text-lg font-bold text-slate-800">Service and Asset Manager</h1>
        <button className="text-blue-600 hover:bg-blue-600/10 p-2 rounded-md transition-colors"><RefreshCw size={20} /></button>
      </div>

      <div className="flex-1 max-w-6xl w-full mx-auto p-8 flex flex-col gap-8">
        
        {/* KPI Stats */}
        <div className="flex justify-center gap-16 px-4">
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <span className="text-4xl font-bold text-blue-600 group-hover:scale-110 transition-transform">1</span>
            <span className="text-sm font-semibold text-blue-600">In Progress</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <span className="text-4xl font-bold text-blue-600 group-hover:scale-110 transition-transform">17</span>
            <span className="text-sm font-semibold text-blue-600">Open</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <span className="text-4xl font-bold text-blue-600 group-hover:scale-110 transition-transform">1</span>
            <span className="text-sm font-semibold text-blue-600">Completed</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <span className="text-4xl font-bold text-blue-600 group-hover:scale-110 transition-transform">2:45</span>
            <span className="text-sm font-semibold text-blue-600">Hours Logged Today</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition-colors text-sm shadow-sm border border-slate-200">
            <Settings size={18} className="text-slate-500" />
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition-colors text-sm shadow-sm border border-slate-200">
            <Wrench size={18} className="text-slate-500" /> Create Work Order
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition-colors text-sm shadow-sm border border-slate-200">
            <AlertTriangle size={18} className="text-slate-500" /> Create Notification
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition-colors text-sm shadow-sm border border-slate-200">
            <Clock size={18} className="text-slate-500" /> Add Time Confirmation
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition-colors text-sm shadow-sm border border-slate-200">
            <Map size={18} className="text-slate-500" /> View Map
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition-colors text-sm shadow-sm border border-slate-200">
            <Search size={18} className="text-slate-500" /> Online Search
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-4">
          
          {/* My Work Section */}
          <div className="p-6">
            <h2 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-4">My Work</h2>
            
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
              {WORK_ORDERS.map((wo, i) => (
                <div 
                  key={i} 
                  onClick={() => i === 0 && navigate(`/maintenance/service-asset-manager/work-order/${wo.id.replace('...', '')}`)}
                  className={`min-w-[280px] bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1 snap-start transition-all relative ${i === 0 ? 'cursor-pointer hover:shadow-md hover:border-blue-300' : ''}`}
                >
                  <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">•••</button>
                  <h3 className="font-bold text-slate-800 text-[15px] leading-tight pr-6">{wo.title} - {wo.id}</h3>
                  <span className="text-[13px] text-slate-600 font-medium mt-1">{wo.status}</span>
                  <span className={`text-[13px] font-bold ${wo.priorityColor}`}>{wo.priority}</span>
                  <span className="text-[13px] text-slate-500">{wo.date}</span>
                  
                  <div className="mt-4 flex gap-3 h-10 w-full items-end">
                    {wo.actions.map((action, j) => (
                      <button 
                        key={j} 
                        className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-colors ${action === 'Review' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 cursor-pointer group">
              <span className="font-bold text-slate-600 text-[15px] group-hover:text-blue-600 transition-colors">See All</span>
              <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-600 transition-colors">
                <span className="font-semibold">13</span>
                <ChevronRight size={16} />
              </div>
            </div>
          </div>

          <div className="h-4 bg-[#f4f7fb]"></div>

          {/* My Notifications Section */}
          <div className="p-6">
            <h2 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-2">My Notifications</h2>
            
            <div className="flex flex-col">
              {/* Row 1 */}
              <div className="flex gap-6 border-b border-slate-100">
                <div className="flex-1 flex justify-between items-center py-4 cursor-pointer hover:bg-slate-50 rounded-lg px-2 -ml-2">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-bold text-slate-800 text-[15px]">{NOTIFICATIONS[0].title}</h3>
                    <span className="text-[13px] text-slate-500 font-medium">{NOTIFICATIONS[0].id}</span>
                    <span className="text-[13px] text-slate-500">{NOTIFICATIONS[0].date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <span className="text-[13px] font-semibold">{NOTIFICATIONS[0].status}</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
                <div className="flex-1 flex justify-between items-center py-4 cursor-pointer hover:bg-slate-50 rounded-lg px-2 -mr-2">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-bold text-slate-800 text-[15px]">{NOTIFICATIONS[1].title}</h3>
                    <span className="text-[13px] text-slate-500 font-medium">{NOTIFICATIONS[1].id}</span>
                    <span className="text-[13px] text-slate-500">{NOTIFICATIONS[1].date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <span className="text-[13px] font-semibold">{NOTIFICATIONS[1].status}</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
              
              {/* Row 2 */}
              <div className="flex gap-6">
                <div className="flex-1 flex justify-between items-center py-4 cursor-pointer hover:bg-slate-50 rounded-lg px-2 -ml-2">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-bold text-slate-800 text-[15px]">{NOTIFICATIONS[2].title}</h3>
                    <span className="text-[13px] text-slate-500 font-medium">{NOTIFICATIONS[2].id}</span>
                    <span className="text-[13px] text-slate-500">{NOTIFICATIONS[2].date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <span className="text-[13px] font-semibold">{NOTIFICATIONS[2].status}</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
                <div className="flex-1"></div> {/* Empty space for grid alignment */}
              </div>
            </div>

            <div className="flex justify-end items-center mt-2 pt-4 border-t border-slate-100 cursor-pointer group">
              <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-600 transition-colors">
                <span className="font-semibold">3</span>
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  );
}
