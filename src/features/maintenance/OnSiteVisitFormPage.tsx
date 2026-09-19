import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';

export default function OnSiteVisitFormPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white -m-6 animate-fade-in font-sans relative overflow-x-hidden" style={{ minHeight: 'calc(100vh - 64px)' }}>
      
      {/* Top Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-white sticky top-0 z-20 border-b border-subtle">
        <button onClick={() => navigate(-1)} className="text-blue-500 font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors text-[15px]">
          Close
        </button>
        <h1 className="text-lg font-bold text-slate-800">On_Site_Visit_Forms</h1>
        <div className="flex items-center gap-2">
          <button className="text-blue-500 font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors text-[15px]">Save</button>
          <button className="text-blue-500 font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors text-[15px]">Submit</button>
        </div>
      </div>

      {/* Sub Header */}
      <div className="bg-[#1c2433] text-white px-6 py-3 flex justify-between items-center shadow-md z-10">
        <h2 className="text-[17px] font-medium tracking-wide">On-Site Visit Forms</h2>
        <Check size={18} className="text-white" />
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto pb-24 bg-white">
        <div className="max-w-4xl w-full mx-auto px-8 pt-8 pb-16 flex flex-col gap-6">
          
          {/* Schematic Diagram Placeholder */}
          <div className="flex justify-center mb-6">
            <div className="w-[450px] border border-slate-200 rounded-lg p-6 bg-slate-50 flex flex-col items-center justify-center relative min-h-[220px]">
              <div className="w-32 h-32 rounded-full border-4 border-dashed border-slate-300 flex items-center justify-center mb-4 relative">
                 <div className="absolute top-0 right-0 w-8 h-8 bg-slate-200 rotate-45 transform translate-x-4 -translate-y-2"></div>
                 <div className="absolute bottom-4 -left-6 w-12 h-2 bg-slate-200 transform -rotate-12"></div>
              </div>
              <div className="flex justify-between w-full px-8 text-xs font-bold text-slate-500">
                <span>IMPELLER</span>
                <span className="italic">Image Source - DOE Handbook</span>
                <span>VOLUTE</span>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-200 mb-2"></div>

          {/* Form Fields */}
          <div className="flex flex-col gap-5 max-w-[650px] mx-auto w-full">
            
            {/* Field 1 */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-500">High Level Scope of Work</label>
              <span className="text-[10px] text-slate-400">Text-input title</span>
              <input 
                type="text" 
                defaultValue="Applied sealant and replaced warm gaskets" 
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Field 2 */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-500">Needed Tools</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white appearance-none cursor-pointer">
                <option>Scaffolding</option>
                <option>Wrenches</option>
                <option>Safety Gear</option>
              </select>
            </div>

            {/* Field 3 */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-[11px] font-semibold text-slate-500">Resources Needed</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" />
                  <span className="text-sm text-slate-700">First choice</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" />
                  <span className="text-sm text-slate-400">Second choice</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" />
                  <span className="text-sm text-slate-400">Third choice</span>
                </label>
              </div>
            </div>

            {/* Field 4 */}
            <div className="flex flex-col gap-1 mt-2">
              <label className="text-[11px] font-semibold text-slate-500">Man Hour</label>
              <input 
                type="text" 
                defaultValue="4" 
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Field 5 */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-500">Observations</label>
              <textarea 
                defaultValue="Applied sealant and replaced war gaskets to stop oil leakage below the pump in the substation." 
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>
            
            <div className="w-full flex justify-center mt-6 mb-2">
              <span className="text-[13px] font-bold text-slate-600">3. Signatures</span>
            </div>

            {/* Signatures */}
            <div className="flex gap-6 w-full">
              {/* Coord Signature */}
              <div className="flex-1 flex flex-col gap-1 relative">
                <label className="text-[11px] font-semibold text-slate-500">Coordinator Signature</label>
                <div className="w-full h-40 border border-slate-300 rounded-md bg-white flex items-center justify-center relative overflow-hidden">
                  {/* Handwritten styling */}
                  <span className="font-[Caveat,cursive] text-7xl text-slate-800 opacity-90 transform -rotate-12 scale-150 tracking-widest pointer-events-none">RJ</span>
                  <button className="absolute bottom-1 right-2 text-[10px] text-blue-500 font-semibold hover:underline flex items-center bg-white/80 px-1 rounded">
                    <X size={10} className="mr-0.5" /> Clear
                  </button>
                </div>
              </div>

              {/* Work Responsible Signature */}
              <div className="flex-1 flex flex-col gap-1 relative">
                <label className="text-[11px] font-semibold text-slate-500">Work Responsible Signature</label>
                <div className="w-full h-40 border border-slate-300 rounded-md bg-white flex items-center justify-center relative overflow-hidden">
                   {/* Handwritten styling */}
                   <span className="font-[Caveat,cursive] text-[90px] text-slate-800 opacity-90 transform -rotate-6 tracking-[0.2em] pointer-events-none ml-4">NC</span>
                  <button className="absolute bottom-1 right-2 text-[10px] text-blue-500 font-semibold hover:underline flex items-center bg-white/80 px-1 rounded">
                    <X size={10} className="mr-0.5" /> Clear
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
      
      {/* Adding Google Font for Signature */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');
      `}</style>
    </div>
  );
}
