import React from 'react';
import { Sparkles, Info, X } from 'lucide-react';

interface AIOrderRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECOMMENDATIONS = [
  {
    id: '4517493',
    type: 'Best Match Proposal',
    title: 'Pump overheating',
    technicalObject: 'Pump (10526082)',
    operations: 5,
    score: 8.06,
    isBestMatch: true
  },
  {
    id: '4018083',
    type: 'Alternative Proposal',
    title: 'Replace Belt',
    technicalObject: 'Elevator Typ 630-10 (ELEV-610)',
    operations: 2,
    score: 7.71,
    isBestMatch: false
  },
  {
    id: '4517492',
    type: 'Alternative Proposal',
    title: 'Pump provide very low head',
    technicalObject: 'Pump (10526082)',
    operations: 1,
    score: 7.63,
    isBestMatch: false
  }
];

export default function AIOrderRecommendationModal({ isOpen, onClose }: AIOrderRecommendationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70 animate-fade-in backdrop-blur-sm p-4">
      <div className="bg-surface-1 w-full max-w-5xl rounded-lg shadow-2xl flex flex-col overflow-hidden border border-subtle">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-surface-2 border-b border-subtle">
          <h2 className="text-lg font-bold text-primary">Select an Order Recommendation</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-muted flex items-center gap-1">
              Created with AssetIQ AI <Sparkles size={14} className="text-primary" />
            </span>
            <button className="btn-icon" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex gap-4 overflow-x-auto bg-background">
          {RECOMMENDATIONS.map((rec) => (
            <div 
              key={rec.id} 
              className="bg-surface-1 border border-subtle rounded-lg p-5 flex-1 min-w-[280px] shadow-sm hover:bg-surface-2 transition-colors cursor-pointer relative"
            >
              {rec.isBestMatch && (
                <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-lg" style={{ backgroundColor: 'var(--color-primary)' }}></div>
              )}
              <h3 className="font-bold text-primary text-lg">Order {rec.id}</h3>
              <p className="text-sm text-muted mb-4">{rec.type}</p>
              
              <div className="flex flex-col gap-3 text-sm">
                <div>
                  <span className="text-muted block mb-1">Order:</span>
                  <a href="#" className="text-primary font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>{rec.title} ({rec.id})</a>
                </div>
                <div>
                  <span className="text-muted block mb-1">Technical Object:</span>
                  <a href="#" className="text-primary font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>{rec.technicalObject}</a>
                </div>
                <div>
                  <span className="text-muted block mb-1">Operations:</span>
                  <span className="font-medium text-primary">{rec.operations}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-subtle">
                <span className="text-muted text-sm block mb-1">Matching Score:</span>
                <div className="flex items-center gap-1">
                  <span className={`font-bold ${rec.isBestMatch ? 'text-success' : 'text-warning'}`}>
                    {rec.score.toFixed(2)}
                  </span>
                  <span className="text-sm text-primary font-semibold">/ 10</span>
                  <Info size={14} className="text-muted ml-1 cursor-pointer hover:text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-surface-2 px-6 py-4 border-t border-subtle flex flex-col items-center gap-4">
          <button className="btn btn-secondary w-full py-2">
            More<br/>[3/6]
          </button>
          
          <div className="flex justify-end w-full gap-3 mt-2">
            <button className="btn btn-primary px-6" onClick={onClose}>
              Select
            </button>
            <button className="btn btn-secondary px-6" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
