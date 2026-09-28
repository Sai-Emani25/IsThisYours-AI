import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Quote, 
  CornerDownLeft, 
  BookOpen, 
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';
import { ClaimAnalysis, CitationStyle } from '../types/citation';

interface ClaimCardProps {
  claim: ClaimAnalysis;
  index: number;
  citationStyle: CitationStyle;
  onInjectAtCursor: (citation: string) => void;
  onInjectAtClaim: (claimText: string, citation: string) => void;
  onViewSource?: (sourceId: string) => void;
  onSelectClaim?: (claim: ClaimAnalysis) => void;
  isSelected?: boolean;
}

export const ClaimCard: React.FC<ClaimCardProps> = ({
  claim,
  index,
  citationStyle,
  onInjectAtCursor,
  onInjectAtClaim,
  onViewSource,
  onSelectClaim,
  isSelected = false
}) => {
  const isVerified = !claim.needs_citation && !!claim.suggested_citation;
  const isHallucination = claim.hallucination_warning || claim.verification_status === 'hallucination_warning';
  const isUnsupported = claim.needs_citation && !isHallucination;

  return (
    <div 
      onClick={() => onSelectClaim && onSelectClaim(claim)}
      className={`border rounded-lg p-4 transition-all cursor-pointer ${
        isSelected
          ? 'ring-2 ring-indigo-500 bg-white shadow-sm'
          : 'bg-white hover:border-slate-300 shadow-xs'
      } ${
        isVerified
          ? 'border-emerald-200'
          : isHallucination
          ? 'border-rose-300 bg-rose-50/20'
          : 'border-amber-200 bg-amber-50/20'
      }`}
    >
      {/* Header status bar */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono-code text-slate-500 font-semibold">
            #{index + 1}
          </span>

          {isVerified && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified by Source
            </span>
          )}

          {isHallucination && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              Hallucination Warning
            </span>
          )}

          {isUnsupported && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Needs Citation
            </span>
          )}

          {claim.confidence_score !== undefined && (
            <span className="text-[11px] font-mono-code text-slate-500">
              Conf: {(claim.confidence_score * 100).toFixed(0)}%
            </span>
          )}
        </div>

        {/* Suggested citation pill or empty notice */}
        {isVerified ? (
          <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-300 text-emerald-900 px-2 py-1 rounded text-xs font-mono-code font-bold tracking-tight">
            <span>{claim.suggested_citation}</span>
          </div>
        ) : (
          <div className="text-[11px] font-mono-code text-slate-500 italic bg-slate-100 px-2 py-0.5 rounded border border-slate-200" title="Suggested citation left blank as claim is unsupported">
            citation: &quot;&quot; (blank)
          </div>
        )}
      </div>

      {/* Claim Sentence */}
      <div className="mb-3">
        <p className="text-sm font-serif-academic text-slate-800 leading-relaxed font-medium">
          &ldquo;{claim.claim_text}&rdquo;
        </p>
      </div>

      {/* Hallucination / Unsupported Warning Module */}
      {(isHallucination || isUnsupported) && (
        <div className={`p-3 rounded-md mb-3 text-xs border ${
          isHallucination 
            ? 'bg-rose-50 border-rose-200 text-rose-900' 
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-start gap-2">
            {isHallucination ? (
              <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold mb-0.5">
                {isHallucination 
                  ? 'Factual Contradiction / Fabricated Claim Flagged'
                  : 'Unsupported Claim - Citation Required'}
              </p>
              <p className="text-xs leading-normal opacity-90">
                {claim.rationale || 'No corroborating evidence found in active RAG sources. Suggested citation left blank per strict system instructions to prevent accidental propagation of hallucinations.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Source Verification Quote Block */}
      {isVerified && claim.source_verification_quote && (
        <div className="bg-slate-50 border-l-3 border-emerald-500 rounded-r-md p-3 mb-3 text-xs">
          <div className="flex items-center justify-between text-slate-600 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <Quote className="w-3.5 h-3.5" />
              Source Verification Quote:
            </span>
            {claim.matched_source_title && (
              <span className="text-[11px] text-slate-500 truncate max-w-[200px]" title={claim.matched_source_title}>
                {claim.matched_source_title}
              </span>
            )}
          </div>
          <blockquote className="font-serif-academic text-slate-800 italic leading-relaxed pl-1 text-[13px]">
            &ldquo;{claim.source_verification_quote}&rdquo;
          </blockquote>

          {claim.matched_source_id && onViewSource && (
            <div className="mt-2 pt-2 border-t border-slate-200/60 flex justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewSource(claim.matched_source_id!);
                }}
                className="text-[11px] font-medium text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
              >
                <BookOpen className="w-3 h-3" />
                View matching source in RAG corpus
              </button>
            </div>
          )}
        </div>
      )}

      {/* Rationale explanation if verified */}
      {isVerified && claim.rationale && (
        <div className="text-xs text-slate-500 mb-3 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>{claim.rationale}</span>
        </div>
      )}

      {/* Action injection buttons */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
        <span className="text-[11px] text-slate-500 font-mono-code">
          {claim.needs_citation ? 'Status: needs_citation=true' : 'Status: verified'}
        </span>

        <div className="flex items-center gap-1.5">
          {isVerified && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onInjectAtCursor(claim.suggested_citation);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded-md shadow-xs transition-colors"
                title="Inject this citation at the current editor cursor position"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
                Inject at Cursor
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onInjectAtClaim(claim.claim_text, claim.suggested_citation);
                }}
                className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                title="Append citation before the sentence ending period"
              >
                Append to Claim
              </button>
            </>
          )}

          {!isVerified && (
            <span className="text-[11px] text-slate-500 italic">
              Citation injection disabled (unsupported claim)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
