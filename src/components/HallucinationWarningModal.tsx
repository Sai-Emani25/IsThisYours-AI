import React from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  HelpCircle, 
  FileWarning, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { ClaimAnalysis } from '../types/citation';

interface HallucinationWarningModalProps {
  claim: ClaimAnalysis | null;
  onClose: () => void;
  onOpenSourcesModal: () => void;
}

export const HallucinationWarningModal: React.FC<HallucinationWarningModalProps> = ({
  claim,
  onClose,
  onOpenSourcesModal
}) => {
  if (!claim) return null;

  const isHallucination = claim.hallucination_warning;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-rose-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isHallucination ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isHallucination ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
            }`}>
              {isHallucination ? (
                <ShieldAlert className="w-5 h-5 text-rose-100" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-100" />
              )}
            </div>
            <div>
              <h3 className={`font-serif-academic font-bold text-base ${
                isHallucination ? 'text-rose-950' : 'text-amber-950'
              }`}>
                {isHallucination ? 'Hallucination Warning Module' : 'Citation Verification Alert'}
              </h3>
              <p className={`text-xs ${isHallucination ? 'text-rose-700' : 'text-amber-700'}`}>
                {isHallucination 
                  ? 'Factual discrepancy / fabricated metric detected' 
                  : 'Claim lacks backing in current RAG corpus'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Unverified Manuscript Claim:
            </h4>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-sm font-serif-academic text-slate-800 leading-relaxed italic">
              &ldquo;{claim.claim_text}&rdquo;
            </div>
          </div>

          <div className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
            isHallucination 
              ? 'bg-rose-50/70 border-rose-200 text-rose-900' 
              : 'bg-amber-50/70 border-amber-200 text-amber-900'
          }`}>
            <p className="font-semibold mb-1">
              Academic Agent Verification Rationale:
            </p>
            <p>{claim.rationale || 'The citation agent found no empirical grounding in the provided RAG source material. As instructed, suggested_citation was left blank and needs_citation was set to true.'}</p>
          </div>

          <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-700 space-y-1.5">
            <p className="font-semibold text-slate-900">Why was the citation left blank?</p>
            <p>
              In accordance with AI Studio strict JSON instructions, the agent strictly suppresses fabricated citations when evidence is missing. This prevents hallucinations from inadvertently contaminating academic manuscripts.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSourcesModal();
            }}
            className="text-xs font-semibold text-indigo-900 hover:text-indigo-700 flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Search / Add Sources to Corpus</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-medium shadow-xs"
          >
            Acknowledge Warning
          </button>
        </div>
      </div>
    </div>
  );
};
