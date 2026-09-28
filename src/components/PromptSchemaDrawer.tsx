import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Check, 
  Copy, 
  Terminal, 
  Sparkles, 
  RotateCcw,
  Layers,
  FileJson
} from 'lucide-react';
import { SYSTEM_INSTRUCTION_DEFAULT } from '../server/citationService';

interface PromptSchemaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rawJson?: string;
  customInstruction: string;
  onUpdateCustomInstruction: (val: string) => void;
  onResetInstruction: () => void;
}

export const PromptSchemaDrawer: React.FC<PromptSchemaDrawerProps> = ({
  isOpen,
  onClose,
  rawJson,
  customInstruction,
  onUpdateCustomInstruction,
  onResetInstruction
}) => {
  const [activeTab, setActiveTab] = useState<'instruction' | 'schema' | 'raw_json'>('instruction');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schemaCode = `{
  "type": "OBJECT",
  "properties": {
    "analysis_summary": {
      "type": "STRING",
      "description": "Executive academic overview of verified vs unsupported claims"
    },
    "claims": {
      "type": "ARRAY",
      "items": {
        "type": "OBJECT",
        "properties": {
          "claim_text": {
            "type": "STRING",
            "description": "The specific assertion or sentence made in the text chunk"
          },
          "needs_citation": {
            "type": "BOOLEAN",
            "description": "True if unsupported by source material; false if supported"
          },
          "suggested_citation": {
            "type": "STRING",
            "description": "Formatted academic citation string if supported, or blank string if unsupported"
          },
          "source_verification_quote": {
            "type": "STRING",
            "description": "The verbatim quotation from the RAG source material proving the claim, or blank string if unsupported"
          },
          "matched_source_id": { "type": "STRING" },
          "matched_source_title": { "type": "STRING" },
          "confidence_score": { "type": "NUMBER" },
          "verification_status": { 
            "type": "STRING",
            "enum": ["verified", "unsupported", "hallucination_warning"] 
          },
          "hallucination_warning": { "type": "BOOLEAN" },
          "rationale": { "type": "STRING" }
        },
        "required": [
          "claim_text",
          "needs_citation",
          "suggested_citation",
          "source_verification_quote"
        ]
      }
    }
  },
  "required": ["analysis_summary", "claims"]
}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-indigo-900 text-white flex items-center justify-center">
              <Code2 className="w-4 h-4 text-indigo-200" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 font-serif-academic">
                AI Studio System Instruction & JSON Schema
              </h2>
              <p className="text-xs text-slate-500">
                Structured JSON configuration for deterministic citation orchestration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-slate-200 px-4 bg-slate-100/60 gap-2">
          <button
            onClick={() => setActiveTab('instruction')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'instruction'
                ? 'border-indigo-900 text-indigo-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>System Instruction</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'border-indigo-900 text-indigo-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>responseSchema</span>
          </button>
          <button
            onClick={() => setActiveTab('raw_json')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'raw_json'
                ? 'border-indigo-900 text-indigo-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Raw JSON Payload</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-5 overflow-auto space-y-4">
          {activeTab === 'instruction' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-200/80 text-xs text-indigo-950 leading-relaxed">
                <p className="font-semibold mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
                  Citation Agent Prompt Structure:
                </p>
                <p className="font-serif-academic italic text-[13px] text-slate-800 bg-white p-2.5 rounded border border-indigo-100 my-2">
                  &ldquo;You are an academic citation agent. Analyze the provided text chunk and the provided RAG source material. If the text makes a claim supported by the source, output a JSON object with claim_text, suggested_citation, and source_verification_quote. If the claim is unsupported, set needs_citation to true and leave suggested_citation blank.&rdquo;
                </p>
                <p className="text-slate-600 text-[11px]">
                  Enforcing structured JSON guarantees that the frontend orchestration layer can deterministically parse every claim, inject formatted citations at the exact cursor coordinates, and trigger warning modules when claims lack empirical grounding.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="custom-instruction-editor" className="text-xs font-semibold text-slate-800">
                    Live System Instruction Editor:
                  </label>
                  <button
                    type="button"
                    onClick={onResetInstruction}
                    className="text-xs text-indigo-700 hover:text-indigo-900 flex items-center gap-1 font-medium"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset to Default
                  </button>
                </div>
                <textarea
                  id="custom-instruction-editor"
                  value={customInstruction}
                  onChange={(e) => onUpdateCustomInstruction(e.target.value)}
                  rows={6}
                  className="w-full text-xs font-mono-code p-3 bg-slate-900 text-slate-100 rounded-lg border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleCopy(customInstruction)}
                  className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy System Instruction</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Gemini API Strict JSON Schema definition:</span>
                <button
                  type="button"
                  onClick={() => handleCopy(schemaCode)}
                  className="flex items-center gap-1 text-indigo-700 hover:text-indigo-900 font-medium"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Schema</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 text-emerald-400 rounded-lg text-xs font-mono-code overflow-x-auto leading-relaxed border border-slate-800">
                {schemaCode}
              </pre>
            </div>
          )}

          {activeTab === 'raw_json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Last execution JSON output from Gemini:</span>
                {rawJson && (
                  <button
                    type="button"
                    onClick={() => handleCopy(rawJson)}
                    className="flex items-center gap-1 text-indigo-700 hover:text-indigo-900 font-medium"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Copy JSON</span>
                  </button>
                )}
              </div>
              {rawJson ? (
                <pre className="p-4 bg-slate-950 text-indigo-300 rounded-lg text-xs font-mono-code overflow-x-auto max-h-[480px] leading-relaxed border border-slate-800">
                  {rawJson}
                </pre>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs italic bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  No analysis run yet. Click &ldquo;Verify Manuscript Claims&rdquo; to generate structured JSON output.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
