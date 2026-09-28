import React, { useRef, useEffect } from 'react';
import { 
  Play, 
  CornerDownLeft, 
  Sparkles, 
  CheckCheck, 
  RotateCcw, 
  Eye, 
  Edit3,
  Crosshair,
  AlertCircle
} from 'lucide-react';
import { ClaimAnalysis, CursorPosition } from '../types/citation';

interface ManuscriptEditorProps {
  text: string;
  onChangeText: (newText: string) => void;
  cursorPos: CursorPosition;
  onCursorChange: (pos: CursorPosition) => void;
  claims: ClaimAnalysis[];
  isAnalyzing: boolean;
  onAnalyzeAll: () => void;
  onAnalyzeCurrentChunk: () => void;
  onInjectAtCursor: (citation: string) => void;
  onInjectAllVerified: () => void;
  onResetPreset: () => void;
  selectedClaim: ClaimAnalysis | null;
  onSelectClaim: (claim: ClaimAnalysis) => void;
  activeCitationToInject?: string;
}

export const ManuscriptEditor: React.FC<ManuscriptEditorProps> = ({
  text,
  onChangeText,
  cursorPos,
  onCursorChange,
  claims,
  isAnalyzing,
  onAnalyzeAll,
  onAnalyzeCurrentChunk,
  onInjectAtCursor,
  onInjectAllVerified,
  onResetPreset,
  selectedClaim,
  onSelectClaim,
  activeCitationToInject
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [viewMode, setViewMode] = React.useState<'edit' | 'annotated'>('edit');

  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    
    // Calculate line and column
    const textBefore = el.value.slice(0, start);
    const lines = textBefore.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;

    onCursorChange({ start, end, line, column });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeText(e.target.value);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const verifiedClaimsCount = claims.filter(c => !c.needs_citation).length;
  const hallucinationCount = claims.filter(c => c.hallucination_warning).length;

  // Identify current sentence near cursor
  const getCurrentSentence = (): string => {
    if (!text) return '';
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let charAcc = 0;
    for (const s of sentences) {
      if (cursorPos.start >= charAcc && cursorPos.start <= charAcc + s.length) {
        return s.trim();
      }
      charAcc += s.length;
    }
    return '';
  };

  const activeSentence = getCurrentSentence();

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
      {/* Action Toolbar */}
      <div className="p-3 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Main Analyze Button */}
          <button
            type="button"
            onClick={onAnalyzeAll}
            disabled={isAnalyzing || !text.trim()}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold shadow-xs transition-colors ${
              isAnalyzing
                ? 'bg-indigo-300 text-white cursor-not-allowed'
                : 'bg-indigo-900 hover:bg-indigo-800 text-white cursor-pointer'
            }`}
            title="Analyze claims in the manuscript against RAG sources (Ctrl+Enter)"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Auditing RAG Sources...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>Verify Manuscript Claims</span>
              </>
            )}
          </button>

          {/* Analyze at Cursor chunk */}
          <button
            type="button"
            onClick={onAnalyzeCurrentChunk}
            disabled={isAnalyzing || !text.trim()}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:text-indigo-900 hover:bg-slate-200/70 border border-slate-200 bg-white transition-colors cursor-pointer"
            title="Analyze only the paragraph or sentence around current cursor"
          >
            <Crosshair className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Audit Cursor Chunk</span>
          </button>

          {/* Inject at cursor if available */}
          {activeCitationToInject && (
            <button
              type="button"
              onClick={() => onInjectAtCursor(activeCitationToInject)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors animate-pulse"
              title={`Inject ${activeCitationToInject} at cursor offset ${cursorPos.start}`}
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
              <span>Inject &ldquo;{activeCitationToInject}&rdquo; at Cursor</span>
            </button>
          )}

          {/* Inject all verified batch */}
          {verifiedClaimsCount > 0 && (
            <button
              type="button"
              onClick={onInjectAllVerified}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
              title="Auto-insert suggested citations for all verified claims"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Inject All Verified ({verifiedClaimsCount})</span>
            </button>
          )}
        </div>

        {/* View Mode & Reset */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center p-0.5 bg-slate-200/70 rounded-md">
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'edit'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('annotated')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'annotated'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Show interactive claim annotations"
            >
              <Eye className="w-3 h-3" />
              <span>Proof Mode</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onResetPreset}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors"
            title="Reset manuscript text to original draft"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 relative overflow-auto p-4">
        {viewMode === 'edit' ? (
          <div className="h-full flex flex-col">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onKeyUp={updateCursorPosition}
              onMouseUp={updateCursorPosition}
              onSelect={updateCursorPosition}
              onFocus={updateCursorPosition}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.preventDefault();
                  onAnalyzeAll();
                }
              }}
              placeholder="Paste or write your manuscript text here. Put your cursor anywhere and click 'Verify Manuscript Claims' to audit against the RAG sources and inject verified citations..."
              className="w-full flex-1 min-h-[380px] p-4 text-base font-serif-academic text-slate-900 bg-transparent border-none resize-none focus:outline-none focus:ring-0 leading-relaxed tracking-normal"
              spellCheck="false"
            />
          </div>
        ) : (
          /* Annotated Proof Mode */
          <div className="p-4 font-serif-academic text-base leading-relaxed text-slate-900 min-h-[380px] space-y-4">
            {text.split('\n\n').map((paragraph, pIdx) => {
              // Highlight claims within this paragraph
              return (
                <p key={pIdx} className="leading-relaxed">
                  {paragraph.split(/(?<=[.!?])\s+/).map((sentence, sIdx) => {
                    const matchedClaim = claims.find(c => 
                      sentence.includes(c.claim_text.trim()) || 
                      c.claim_text.trim().includes(sentence.trim())
                    );

                    if (!matchedClaim) {
                      return <span key={sIdx}>{sentence} </span>;
                    }

                    const isVerified = !matchedClaim.needs_citation && !!matchedClaim.suggested_citation;
                    const isHallucination = matchedClaim.hallucination_warning;

                    return (
                      <span
                        key={sIdx}
                        onClick={() => onSelectClaim(matchedClaim)}
                        className={`inline cursor-pointer transition-all rounded px-1 py-0.5 ${
                          isVerified
                            ? 'bg-emerald-50 text-emerald-950 border-b-2 border-emerald-500 hover:bg-emerald-100'
                            : isHallucination
                            ? 'bg-rose-50 text-rose-950 border-b-2 border-rose-500 hover:bg-rose-100'
                            : 'bg-amber-50 text-amber-950 border-b-2 border-amber-400 hover:bg-amber-100'
                        }`}
                        title={
                          isVerified 
                            ? `Verified by RAG: ${matchedClaim.suggested_citation} (Click to inspect quote)`
                            : isHallucination
                            ? `Hallucination Alert: ${matchedClaim.rationale}`
                            : `Unsupported claim: needs citation`
                        }
                      >
                        {sentence}
                        {isVerified && matchedClaim.suggested_citation && (
                          <span className="font-mono-code text-xs font-bold text-emerald-800 ml-1 bg-emerald-100/80 px-1 py-0.2 rounded border border-emerald-300">
                            {matchedClaim.suggested_citation}
                          </span>
                        )}
                        {isHallucination && (
                          <span className="font-mono-code text-[11px] font-bold text-rose-800 ml-1 bg-rose-100 px-1 py-0.2 rounded border border-rose-300">
                            [⚠️ Hallucination]
                          </span>
                        )}
                        {' '}
                      </span>
                    );
                  })}
                </p>
              );
            })}
          </div>
        )}
      </div>

      {/* Real-time Cursor & Status Bar */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono-code flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
            <span>Ln {cursorPos.line}, Col {cursorPos.column} (Pos: {cursorPos.start})</span>
          </span>

          {activeSentence && (
            <span className="hidden xl:inline text-slate-500 truncate max-w-[280px]" title={activeSentence}>
              Active sentence: &ldquo;{activeSentence}&rdquo;
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span>{wordCount} words</span>
          <span>·</span>
          <span>{charCount} chars</span>
          <span>·</span>
          <span className="text-emerald-700 font-semibold">{verifiedClaimsCount} verified</span>
          {hallucinationCount > 0 && (
            <>
              <span>·</span>
              <span className="text-rose-700 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-rose-600" />
                {hallucinationCount} flagged
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
