/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Filter, 
  Layers, 
  FileText,
  CornerDownLeft,
  Info,
  Clock,
  Cpu
} from 'lucide-react';
import { 
  CitationStyle, 
  RagSource, 
  ClaimAnalysis, 
  CursorPosition,
  CitationAnalysisResponse 
} from './types/citation';
import { DEFAULT_RAG_SOURCES, MANUSCRIPT_PRESETS } from './data/defaultData';
import { SYSTEM_INSTRUCTION_DEFAULT } from './server/citationService';
import { 
  injectCitationAtPosition, 
  injectCitationForClaim 
} from './utils/citationFormatter';

import { Header } from './components/Header';
import { ManuscriptEditor } from './components/ManuscriptEditor';
import { ClaimCard } from './components/ClaimCard';
import { RagCorpusModal } from './components/RagCorpusModal';
import { PromptSchemaDrawer } from './components/PromptSchemaDrawer';
import { HallucinationWarningModal } from './components/HallucinationWarningModal';
import { BibliographyView } from './components/BibliographyView';

export default function App() {
  const [sources, setSources] = useState<RagSource[]>(DEFAULT_RAG_SOURCES);
  const [activePresetId, setActivePresetId] = useState<string>('deep-learning-transformers');
  const [text, setText] = useState<string>(MANUSCRIPT_PRESETS[0].text);
  const [citationStyle, setCitationStyle] = useState<CitationStyle>('apa');
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ start: 0, end: 0, line: 1, column: 1 });
  
  const [claims, setClaims] = useState<ClaimAnalysis[]>([]);
  const [analysisSummary, setAnalysisSummary] = useState<string>('');
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [rawJson, setRawJson] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [selectedClaim, setSelectedClaim] = useState<ClaimAnalysis | null>(null);
  
  const [customInstruction, setCustomInstruction] = useState<string>(SYSTEM_INSTRUCTION_DEFAULT);
  const [claimsFilter, setClaimsFilter] = useState<'all' | 'verified' | 'unsupported' | 'hallucinations'>('all');

  // Modals & Drawers
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);
  const [isPromptDrawerOpen, setIsPromptDrawerOpen] = useState(false);
  const [warningModalClaim, setWarningModalClaim] = useState<ClaimAnalysis | null>(null);
  const [highlightedSourceId, setHighlightedSourceId] = useState<string | undefined>(undefined);
  const [isCopied, setIsCopied] = useState(false);

  // Run initial citation analysis on mount for the default preset
  useEffect(() => {
    analyzeText(MANUSCRIPT_PRESETS[0].text, sources, citationStyle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const analyzeText = async (
    textToAnalyze: string,
    currentSources: RagSource[],
    style: CitationStyle
  ) => {
    if (!textToAnalyze.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-citations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textChunk: textToAnalyze,
          ragSources: currentSources,
          citationStyle: style,
          customInstruction: customInstruction
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data: CitationAnalysisResponse = await res.json();
      setClaims(data.claims || []);
      setAnalysisSummary(data.analysis_summary || '');
      setExecutionTime(data.execution_time_ms || 0);
      setRawJson(data.raw_json || JSON.stringify(data, null, 2));

      // Select first verified claim if available, or first hallucination to draw attention
      const firstHallucination = data.claims.find(c => c.hallucination_warning);
      const firstVerified = data.claims.find(c => !c.needs_citation);
      setSelectedClaim(firstHallucination || firstVerified || (data.claims[0] ?? null));
    } catch (err: unknown) {
      console.error('Failed to analyze citations:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeAll = () => {
    analyzeText(text, sources, citationStyle);
  };

  const handleAnalyzeCurrentChunk = () => {
    // Find current paragraph or sentence
    const paragraphs = text.split('\n\n');
    let acc = 0;
    let targetChunk = '';

    for (const p of paragraphs) {
      if (cursorPos.start >= acc && cursorPos.start <= acc + p.length + 2) {
        targetChunk = p;
        break;
      }
      acc += p.length + 2;
    }

    if (!targetChunk) {
      targetChunk = text;
    }

    analyzeText(targetChunk, sources, citationStyle);
  };

  const handleInjectAtCursor = (citationToInsert: string) => {
    if (!citationToInsert) return;

    const { newText, newCursorPos } = injectCitationAtPosition(
      text,
      citationToInsert,
      cursorPos.start,
      cursorPos.end
    );

    setText(newText);
    setCursorPos({
      ...cursorPos,
      start: newCursorPos,
      end: newCursorPos
    });
  };

  const handleInjectAtClaim = (claimText: string, citationToInsert: string) => {
    if (!citationToInsert) return;
    const newText = injectCitationForClaim(text, claimText, citationToInsert);
    setText(newText);
  };

  const handleInjectAllVerified = () => {
    let updatedText = text;
    for (const claim of claims) {
      if (!claim.needs_citation && claim.suggested_citation) {
        updatedText = injectCitationForClaim(updatedText, claim.claim_text, claim.suggested_citation);
      }
    }
    setText(updatedText);
  };

  const handlePresetSelect = (presetId: string) => {
    setActivePresetId(presetId);
    const preset = MANUSCRIPT_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setText(preset.text);
      analyzeText(preset.text, sources, citationStyle);
    }
  };

  const handleStyleChange = (newStyle: CitationStyle) => {
    setCitationStyle(newStyle);
    analyzeText(text, sources, newStyle);
  };

  const handleToggleSource = (id: string) => {
    const updated = sources.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s);
    setSources(updated);
  };

  const handleAddSource = (newSourceData: Omit<RagSource, 'id'>) => {
    const newId = `src-${Date.now()}`;
    const newSource: RagSource = { ...newSourceData, id: newId };
    const updated = [newSource, ...sources];
    setSources(updated);
  };

  const handleDeleteSource = (id: string) => {
    const updated = sources.filter(s => s.id !== id);
    setSources(updated);
  };

  const handleViewSourceInCorpus = (sourceId: string) => {
    setHighlightedSourceId(sourceId);
    setIsSourcesModalOpen(true);
  };

  const handleCopyManuscript = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleExportManuscript = () => {
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `manuscript-${activePresetId}-${citationStyle}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filtered claims
  const verifiedClaims = claims.filter(c => !c.needs_citation);
  const unsupportedClaims = claims.filter(c => c.needs_citation && !c.hallucination_warning);
  const hallucinationClaims = claims.filter(c => c.hallucination_warning);

  const displayedClaims = claims.filter(c => {
    if (claimsFilter === 'verified') return !c.needs_citation;
    if (claimsFilter === 'unsupported') return c.needs_citation && !c.hallucination_warning;
    if (claimsFilter === 'hallucinations') return c.hallucination_warning;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans">
      {/* Top Navbar */}
      <Header
        citationStyle={citationStyle}
        onStyleChange={handleStyleChange}
        activePresetId={activePresetId}
        onPresetSelect={handlePresetSelect}
        sources={sources}
        onOpenSourcesModal={() => {
          setHighlightedSourceId(undefined);
          setIsSourcesModalOpen(true);
        }}
        onOpenPromptDrawer={() => setIsPromptDrawerOpen(true)}
        onCopyManuscript={handleCopyManuscript}
        isCopied={isCopied}
        onExportManuscript={handleExportManuscript}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Prompt Structure Banner */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-900 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200">
                <Sparkles className="w-4 h-4 text-indigo-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif-academic font-bold text-base text-slate-900">
                    Academic Citation Agent · Strict Structured JSON
                  </h1>
                  <span className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                    Schema Enforced
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-4xl leading-relaxed">
                  <strong className="text-slate-800">System Instruction Rule:</strong> Analyzes each manuscript chunk against active RAG sources. If supported, outputs <code className="bg-slate-100 px-1 py-0.2 rounded text-indigo-950 font-mono-code text-[11px]">claim_text</code>, <code className="bg-slate-100 px-1 py-0.2 rounded text-indigo-950 font-mono-code text-[11px]">suggested_citation</code>, and <code className="bg-slate-100 px-1 py-0.2 rounded text-indigo-950 font-mono-code text-[11px]">source_verification_quote</code>. If unsupported, sets <code className="bg-slate-100 px-1 py-0.2 rounded text-indigo-950 font-mono-code text-[11px]">needs_citation: true</code> and leaves <code className="bg-slate-100 px-1 py-0.2 rounded text-indigo-950 font-mono-code text-[11px]">suggested_citation: &quot;&quot;</code> blank to power cursor injection and hallucination warning popups.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsPromptDrawerOpen(true)}
              className="text-xs font-semibold text-indigo-900 hover:text-indigo-700 underline underline-offset-2 shrink-0 self-center"
            >
              Inspect JSON Schema & Prompt
            </button>
          </div>
        </div>

        {/* 2-Column Split Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Manuscript Drafting & Cursor Tracker (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono-code">
                  Manuscript Draft Editor
                </h2>
                <p className="text-xs text-slate-500">
                  Click anywhere in the draft to position cursor for instant citation injection
                </p>
              </div>

              {selectedClaim && !selectedClaim.needs_citation && (
                <div className="text-xs text-slate-600 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
                  <span className="text-emerald-800 font-medium">Ready to inject:</span>
                  <span className="font-mono-code font-bold text-emerald-900">
                    {selectedClaim.suggested_citation}
                  </span>
                </div>
              )}
            </div>

            {/* Editor Component */}
            <ManuscriptEditor
              text={text}
              onChangeText={setText}
              cursorPos={cursorPos}
              onCursorChange={setCursorPos}
              claims={claims}
              isAnalyzing={isAnalyzing}
              onAnalyzeAll={handleAnalyzeAll}
              onAnalyzeCurrentChunk={handleAnalyzeCurrentChunk}
              onInjectAtCursor={handleInjectAtCursor}
              onInjectAllVerified={handleInjectAllVerified}
              onResetPreset={() => {
                const preset = MANUSCRIPT_PRESETS.find(p => p.id === activePresetId);
                if (preset) setText(preset.text);
              }}
              selectedClaim={selectedClaim}
              onSelectClaim={(claim) => {
                setSelectedClaim(claim);
                if (claim.hallucination_warning) {
                  setWarningModalClaim(claim);
                }
              }}
              activeCitationToInject={
                selectedClaim && !selectedClaim.needs_citation 
                  ? selectedClaim.suggested_citation 
                  : undefined
              }
            />

            {/* Dynamic Bibliography / References Accordion */}
            <BibliographyView
              sources={sources}
              citationStyle={citationStyle}
              onAppendToManuscript={(bibText) => setText(text + bibText)}
            />
          </div>

          {/* Right Column: Citation Verification & Hallucination Inspector (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono-code">
                  Citation Verification Feed
                </h2>
                <p className="text-xs text-slate-500">
                  Parsed JSON claims with verbatim source proof and hallucination warnings
                </p>
              </div>

              {executionTime > 0 && (
                <span className="text-[11px] font-mono-code text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {executionTime}ms
                </span>
              )}
            </div>

            {/* Filter Tabs / Segmented Controls */}
            <div className="bg-white border border-slate-200 rounded-lg p-1.5 flex items-center justify-between gap-1 shadow-xs">
              <button
                type="button"
                onClick={() => setClaimsFilter('all')}
                className={`flex-1 py-1 px-2 text-xs font-medium rounded-md transition-colors ${
                  claimsFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({claims.length})
              </button>
              <button
                type="button"
                onClick={() => setClaimsFilter('verified')}
                className={`flex-1 py-1 px-2 text-xs font-medium rounded-md transition-colors ${
                  claimsFilter === 'verified'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-800'
                }`}
              >
                Verified ({verifiedClaims.length})
              </button>
              <button
                type="button"
                onClick={() => setClaimsFilter('unsupported')}
                className={`flex-1 py-1 px-2 text-xs font-medium rounded-md transition-colors ${
                  claimsFilter === 'unsupported'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-amber-800'
                }`}
              >
                Unsupported ({unsupportedClaims.length})
              </button>
              <button
                type="button"
                onClick={() => setClaimsFilter('hallucinations')}
                className={`flex-1 py-1 px-2 text-xs font-medium rounded-md transition-colors ${
                  claimsFilter === 'hallucinations'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-rose-800'
                }`}
              >
                Flagged ({hallucinationClaims.length})
              </button>
            </div>

            {/* Summary Callout */}
            {analysisSummary && (
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 shadow-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold text-slate-900">Summary: </span>
                  {analysisSummary}
                </div>
              </div>
            )}

            {/* Claims Feed Cards */}
            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {isAnalyzing ? (
                <div className="p-12 text-center bg-white rounded-lg border border-slate-200 shadow-xs space-y-3">
                  <div className="w-8 h-8 border-3 border-indigo-900/20 border-t-indigo-900 rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-medium text-slate-700 font-mono-code">
                    Running citation agent against active RAG corpus...
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Extracting verification quotes and enforcing strict JSON output
                  </p>
                </div>
              ) : displayedClaims.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-lg border border-dashed border-slate-300 text-xs text-slate-500 space-y-1">
                  <p className="font-medium text-slate-700">No claims match the active filter.</p>
                  <p>Click &ldquo;Verify Manuscript Claims&rdquo; or choose another filter above.</p>
                </div>
              ) : (
                displayedClaims.map((claim, idx) => (
                  <ClaimCard
                    key={idx}
                    claim={claim}
                    index={idx}
                    citationStyle={citationStyle}
                    isSelected={selectedClaim?.claim_text === claim.claim_text}
                    onSelectClaim={(c) => {
                      setSelectedClaim(c);
                      if (c.hallucination_warning) {
                        setWarningModalClaim(c);
                      }
                    }}
                    onInjectAtCursor={handleInjectAtCursor}
                    onInjectAtClaim={handleInjectAtClaim}
                    onViewSource={handleViewSourceInCorpus}
                  />
                ))
              )}
            </div>

            {/* Orchestration Helper info */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-800">Orchestration Layer Architecture:</span>
              <p className="mt-1 text-[11px]">
                Because the agent strictly returns structured JSON conforming to <code className="font-mono-code text-indigo-900">responseSchema</code>, frontend tools can programmatically map every sentence to exact cursor indices, disable dead injection buttons on unverified claims, and alert authors prior to preprint publication.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* RAG Sources Library Modal */}
      <RagCorpusModal
        isOpen={isSourcesModalOpen}
        onClose={() => setIsSourcesModalOpen(false)}
        sources={sources}
        onToggleSource={handleToggleSource}
        onAddSource={handleAddSource}
        onDeleteSource={handleDeleteSource}
        highlightedSourceId={highlightedSourceId}
      />

      {/* System Instruction & JSON Schema Inspector Drawer */}
      <PromptSchemaDrawer
        isOpen={isPromptDrawerOpen}
        onClose={() => setIsPromptDrawerOpen(false)}
        rawJson={rawJson}
        customInstruction={customInstruction}
        onUpdateCustomInstruction={setCustomInstruction}
        onResetInstruction={() => setCustomInstruction(SYSTEM_INSTRUCTION_DEFAULT)}
      />

      {/* Hallucination Warning Module Pop-up */}
      <HallucinationWarningModal
        claim={warningModalClaim}
        onClose={() => setWarningModalClaim(null)}
        onOpenSourcesModal={() => {
          setWarningModalClaim(null);
          setIsSourcesModalOpen(true);
        }}
      />
    </div>
  );
}
