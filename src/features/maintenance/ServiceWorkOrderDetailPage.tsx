import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, Plus, Wrench, Settings, AlertTriangle, Play, Map, 
  Download, Clock, CheckCircle2, Factory, Link, PanelLeftClose 
} from 'lucide-react';

const OPERATIONS = [
  { id: '1', title: 'Check for additional...', status: 'Completed', wo: '4027420', date: 'Feb 22, 2023', confirmed: false },
  { id: '2', title: 'Replace worn gask...', status: 'Completed', wo: '4027420', date: 'Feb 22, 2023', confirmed: false },
  { id: '3', title: 'Inspect Work, Take...', status: '', wo: '4027420', date: 'Feb 22, 2023', confirmed: true },
  { id: '4', title: 'Clean up the Oil spill (00...', status: '', wo: '4027420', date: 'Feb 22, 2023', confirmed: true },
];

export default function ServiceWorkOrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isTimeModalOpen, setIsTimeModalOpen] = React.useState(false);
  const [isPendingReview, setIsPendingReview] = React.useState(false);

  return (
    <div className={`flex flex-col h-full ${isPendingReview ? 'bg-slate-300' : 'bg-[#f4f7fb]'} -m-6 animate-fade-in font-sans relative overflow-x-hidden`} style={{ minHeight: 'calc(100vh - 64px)' }}>
      
      {/* Top Header */}
      <div className={`flex justify-between items-center px-6 py-4 bg-white sticky top-0 z-20 border-b border-subtle ${isPendingReview ? 'opacity-40 pointer-events-none' : 'shadow-sm'}`}>
        <div className="flex items-center gap-4">
          <button className="text-blue-600 hover:bg-blue-600/10 p-2 rounded-md transition-colors"><PanelLeftClose size={20} /></button>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-blue-600 font-semibold hover:bg-blue-600/10 px-2 py-1.5 rounded-md transition-colors">
            <ChevronLeft size={20} /> Map
          </button>
        </div>
        <h1 className="text-lg font-bold text-slate-800">Work Order {id || '4027420'}</h1>
        <div className="flex items-center gap-4 text-blue-600 font-semibold">
          <button className="hover:underline cursor-pointer">Edit</button>
          <button className="hover:bg-blue-600/10 p-1.5 rounded-md transition-colors"><Plus size={24} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-6xl w-full mx-auto bg-white min-h-screen border-l border-r border-subtle shadow-sm flex flex-col">
          
          {/* Info Section */}
          <div className="p-8 pb-4 flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
                <Wrench size={28} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-slate-800 leading-tight">Oil pooling under pump</h1>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[13px] text-slate-500 font-medium">PM01</span>
                  <span className="text-[13px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium border border-slate-200">
                    {isPendingReview ? 'Pending Review' : 'Started'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mt-4 text-red-500 font-bold text-sm">
                  <div className="w-2.5 h-2.5 bg-red-500 flex items-center justify-center text-white text-[8px] rounded-[2px]">!</div>
                  1-Very high
                </div>

                <div className="flex flex-col gap-1 mt-4 text-[13px] text-slate-600 font-medium">
                  <span>Pump, Electric, 250-300 GPM (Z10210225)</span>
                  <span>Substation 17 (88-001-1)</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-3xl font-bold text-slate-800 leading-none">0/6</span>
              <span className="text-xs text-slate-500 font-medium mt-1">Readings taken</span>
            </div>
          </div>

          {/* Actions Row */}
          <div className={`px-8 py-6 flex gap-3 overflow-x-auto hide-scrollbar border-b border-slate-100 ${isPendingReview ? 'opacity-40 pointer-events-none' : ''}`}>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-sm border border-slate-200 shrink-0">
              <Settings size={18} className="text-slate-500" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-sm border border-slate-200 shrink-0">
              <Wrench size={18} className="text-slate-500" /> Add Order
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-sm border border-slate-200 shrink-0">
              <AlertTriangle size={18} className="text-slate-500" /> Add Notification
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-sm border border-slate-200 shrink-0">
              <Link size={18} className="text-slate-500" /> Take Readings
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-sm border border-slate-200 shrink-0">
              <Map size={18} className="text-slate-500" /> View Map
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-300 font-bold rounded-lg text-sm border border-slate-100 shrink-0 cursor-not-allowed">
              <Download size={18} className="text-slate-300" /> Download Documents
            </button>
            <button 
              onClick={() => setIsTimeModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-sm border border-slate-200 shrink-0"
            >
              <Clock size={18} className="text-slate-500" /> Add Time Confirmation
            </button>
          </div>

          {/* Progress Stepper with Spotlight Effect */}
          <div className={`px-8 py-10 flex justify-center border-b border-slate-100 transition-all ${isPendingReview ? 'relative z-50 bg-white scale-105 shadow-2xl rounded-xl mx-4 my-4 ring-1 ring-slate-200' : ''}`}>
            
            {/* Backdrop for Spotlight */}
            {isPendingReview && (
              <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsPendingReview(false)}></div>
            )}

            <div className={`flex items-center w-full max-w-2xl relative ${isPendingReview ? 'z-50' : ''}`}>
              
              <div className="flex flex-col items-center flex-1 relative z-10">
                <span className="text-xs font-bold text-slate-600 mb-3 absolute -top-8">Ready</span>
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white ring-4 ring-white shadow-sm">
                  <CheckCircle2 size={12} strokeWidth={4} />
                </div>
              </div>
              
              <div className="h-[2px] bg-blue-500 flex-1 -ml-12 -mr-12 z-0 relative top-[2px]"></div>

              <div className="flex flex-col items-center flex-1 relative z-10">
                <span className="text-xs font-bold text-slate-800 mb-3 absolute -top-8">Work</span>
                {isPendingReview ? (
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white ring-4 ring-white shadow-sm">
                    <CheckCircle2 size={12} strokeWidth={4} />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-blue-600 ring-4 ring-white shadow-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
                {!isPendingReview && <span className="text-xs font-semibold text-slate-500 absolute -bottom-6">Started</span>}
              </div>
              
              <div className={`h-[2px] flex-1 -ml-12 -mr-12 z-0 relative top-[2px] ${isPendingReview ? 'bg-blue-500' : 'bg-slate-200'}`}></div>

              <div className="flex flex-col items-center flex-1 relative z-10">
                <span className={`text-xs font-bold mb-3 absolute -top-10 text-center leading-tight ${isPendingReview ? 'text-slate-800' : 'text-slate-500'}`}>Submit For<br/>Review</span>
                {isPendingReview ? (
                  <div className="w-5 h-5 rounded-full bg-blue-600 ring-4 ring-white shadow-sm"></div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-300 ring-4 ring-white"></div>
                )}
                {isPendingReview && <span className="text-xs font-semibold text-slate-500 absolute -bottom-6">Pending Review</span>}
              </div>
              
              <div className="h-[2px] bg-slate-200 flex-1 -ml-12 -mr-12 z-0 relative top-[2px]"></div>

              <div className="flex flex-col items-center flex-1 relative z-10">
                <span className="text-xs font-bold text-slate-500 mb-3 absolute -top-8 text-center">Finish</span>
                <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-300 ring-4 ring-white"></div>
              </div>

            </div>
          </div>

          {/* Assets Section */}
          <div className={`flex flex-col border-b border-slate-100 ${isPendingReview ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="px-8 py-3 bg-slate-50/50 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500">Assets</span>
            </div>
            <div className="flex px-4 py-2">
              <div className="flex-1 flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors border-r border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white shrink-0">
                    <Settings size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-[15px]">Pump, Electric, 250-300 GPM</span>
                    <span className="text-xs text-slate-500 font-medium">Z10210225</span>
                    <span className="text-xs text-slate-400 mt-0.5">Equipment</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="text-xs font-semibold">Installed</span>
                  <ChevronLeft size={16} className="rotate-180" />
                </div>
              </div>
              <div className="flex-1 flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white shrink-0">
                    <Factory size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-[15px]">Substation 17</span>
                    <span className="text-xs text-slate-500 font-medium">88-001-1</span>
                    <span className="text-xs text-slate-400 mt-0.5">Functional Location</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <ChevronLeft size={16} className="rotate-180" />
                </div>
              </div>
            </div>
          </div>

          {/* Operations Section */}
          <div className={`flex flex-col flex-1 ${isPendingReview ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-[13px] font-semibold text-slate-500">Operations</span>
              <button className="text-blue-600 font-bold text-[13px] hover:underline cursor-pointer">Confirm All</button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto p-6 pb-8 snap-x snap-mandatory hide-scrollbar">
              {OPERATIONS.map((op, i) => (
                <div key={i} className="min-w-[280px] bg-white border border-slate-200 rounded-xl p-5 flex flex-col snap-start hover:shadow-md transition-shadow relative">
                  <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">•••</button>
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center text-white shrink-0">
                      <Wrench size={18} />
                    </div>
                    <div className="flex flex-col pr-6">
                      <h3 className="font-bold text-slate-800 text-[15px] leading-tight">{op.title}</h3>
                      {op.status && <span className="text-[13px] text-slate-600 font-medium mt-1">{op.status}</span>}
                      <span className="text-[13px] text-slate-500 font-medium">{op.wo}</span>
                      <span className="text-[13px] text-slate-500">{op.date}</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-2 flex w-full">
                    {op.confirmed ? (
                      <button className="flex-1 py-2 rounded-lg font-bold text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                        Confirm
                      </button>
                    ) : (
                      <button 
                        onClick={() => navigate('/maintenance/service-asset-manager/form')}
                        className="flex-1 py-2 rounded-lg font-bold text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        Unconfirm
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center px-8 py-4 border-t border-slate-100 cursor-pointer group mb-4">
              <span className="font-bold text-slate-600 text-[15px] group-hover:text-blue-600 transition-colors">See All</span>
              <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-600 transition-colors">
                <span className="font-semibold text-sm">4</span>
                <ChevronLeft size={16} className="rotate-180" />
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className={`fixed bottom-0 left-[304px] right-[40px] bg-white border-t border-subtle p-3 flex justify-between items-center shadow-[0_-4px_12px_rgba(0,0,0,0.05)] ${isPendingReview ? 'z-50' : 'z-30'}`}>
        <div></div> {/* Spacer */}
        <div className="flex items-center gap-3">
          {isPendingReview ? (
            <button 
              onClick={() => setIsPendingReview(false)}
              className="px-6 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm text-sm"
            >
              Start
            </button>
          ) : (
            <>
              <button className="px-5 py-1.5 bg-white text-blue-600 font-bold rounded-lg transition-colors text-sm hover:bg-blue-50">
                Hold
              </button>
              <button 
                onClick={() => setIsPendingReview(true)}
                className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm text-sm"
              >
                Review
              </button>
            </>
          )}
        </div>
      </div>

      {/* Add Time Confirmation Modal */}
      {isTimeModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center animate-fade-in p-4">
          <div className="bg-[#f0f1f6] w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="px-5 py-4 bg-white flex justify-between items-center border-b border-subtle sticky top-0 z-10 rounded-t-2xl">
              <button onClick={() => setIsTimeModalOpen(false)} className="text-blue-500 font-semibold text-[15px]">Cancel</button>
              <h2 className="font-bold text-slate-800 text-[16px]">Add Time Confirmation</h2>
              <button className="text-blue-200 font-semibold text-[15px] cursor-not-allowed">Done</button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-5 flex flex-col gap-6">
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
                  <div className="flex justify-between items-center p-3.5 px-4">
                    <span className="text-[14px] text-slate-500 font-semibold">Work Order</span>
                    <span className="text-[14px] text-slate-700">4027420 - Oil pooling under pump</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 px-4 cursor-pointer hover:bg-slate-50">
                    <span className="text-[14px] text-slate-500 font-semibold">Operation</span>
                    <div className="flex items-center gap-1 text-[14px] text-slate-700">
                      <span>0040 - Clean up the Oil spill</span>
                      <ChevronLeft size={16} className="rotate-180 text-slate-400" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3.5 px-4">
                    <span className="text-[14px] text-slate-300 font-semibold">Sub-Operation</span>
                    <span className="text-[14px] text-slate-300">None</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 px-4">
                    <span className="text-[14px] text-slate-500 font-semibold">Date</span>
                    <span className="text-[14px] text-slate-700">Dec 16, 2024</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 px-4">
                    <span className="text-[14px] text-slate-500 font-semibold">Start Time</span>
                    <span className="text-[14px] text-slate-700">3:20 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 px-4">
                    <span className="text-[14px] text-slate-500 font-semibold">Duration</span>
                    <span className="text-[14px] text-slate-700">0 Hrs 15 Min</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 px-4 cursor-pointer hover:bg-slate-50">
                    <span className="text-[14px] text-slate-500 font-semibold">Activity Type</span>
                    <div className="flex items-center gap-1 text-[14px] text-slate-400">
                      <span>None</span>
                      <ChevronLeft size={16} className="rotate-180" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3.5 px-4 cursor-pointer hover:bg-slate-50">
                    <span className="text-[14px] text-slate-500 font-semibold">Variance Reason</span>
                    <div className="flex items-center gap-1 text-[14px] text-slate-400">
                      <span>None</span>
                      <ChevronLeft size={16} className="rotate-180" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3.5 px-4 cursor-pointer hover:bg-slate-50">
                    <span className="text-[14px] text-slate-500 font-semibold">Account Indicator</span>
                    <div className="flex items-center gap-1 text-[14px] text-slate-400">
                      <span>None</span>
                      <ChevronLeft size={16} className="rotate-180" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3.5 px-4">
                    <span className="text-[14px] text-slate-300 font-semibold">Set as Final Confirmation</span>
                    <div className="w-11 h-6 bg-slate-200 rounded-full flex items-center p-1">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[14px] font-bold text-slate-600 px-1">Notes</span>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 min-h-[100px]">
                    <span className="text-slate-400 text-sm">Notes</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
