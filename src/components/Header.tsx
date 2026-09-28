import React from 'react';
import { 
  FileText, 
  Sparkles, 
  Database, 
  Code2, 
  BookMarked,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { CitationStyle, RagSource } from '../types/citation';
import { MANUSCRIPT_PRESETS } from '../data/defaultData';

interface HeaderProps {
  citationStyle: CitationStyle;
  onStyleChange: (style: CitationStyle) => void;
  activePresetId: string;
  onPresetSelect: (presetId: string) => void;
  sources: RagSource[];
  onOpenSourcesModal: () => void;
  onOpenPromptDrawer: () => void;
  onCopyManuscript: () => void;
  isCopied: boolean;
  onExportManuscript: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  citationStyle,
  onStyleChange,
  activePresetId,
  onPresetSelect,
  sources,
  onOpenSourcesModal,
  onOpenPromptDrawer,
  onCopyManuscript,
  isCopied,
  onExportManuscript
}) => {
  const activeSourcesCount = sources.filter(s => s.isActive).length;

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-900 text-white flex items-center justify-center shadow-xs">
              <BookMarked className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-academic font-bold text-lg text-slate-900 tracking-tight">
                  Citation Engine
                </span>
                <span className="text-xs px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 font-mono-code font-medium border border-slate-200">
                  AI Studio
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Academic claim verification & cursor-directed citation injection
              </p>
            </div>
          </div>

          {/* Preset Selector & Citation Style */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Preset Selector */}
            <div className="relative">
              <label htmlFor="preset-select" className="sr-only">Manuscript Preset</label>
              <select
                id="preset-select"
                value={activePresetId}
                onChange={(e) => onPresetSelect(e.target.value)}
                className="text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                title="Select sample research draft"
              >
                {MANUSCRIPT_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    Draft: {p.name.slice(0, 32)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Citation Style Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md p-1">
              <span className="text-xs text-slate-500 px-1 font-medium hidden md:inline">Style:</span>
              {(['apa', 'ieee', 'nature', 'chicago', 'bibtex'] as CitationStyle[]).map((style) => (
                <button
                  key={style}
                  onClick={() => onStyleChange(style)}
                  className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                    citationStyle === style
                      ? 'bg-indigo-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title={`Format as ${style.toUpperCase()}`}
                >
                  {style.toUpperCase()}
                </button>
              ))}
            </div>

            {/* RAG Library Button */}
            <button
              onClick={onOpenSourcesModal}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-indigo-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-md transition-colors"
              title="Manage RAG Source Documents"
            >
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span>RAG Sources</span>
              <span className="bg-indigo-100 text-indigo-800 font-mono-code text-[11px] px-1.5 py-0.2 rounded font-semibold">
                {activeSourcesCount}
              </span>
            </button>

            {/* Prompt & Schema Drawer Button */}
            <button
              onClick={onOpenPromptDrawer}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-indigo-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-md transition-colors"
              title="Inspect System Instruction and JSON Schema"
            >
              <Code2 className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden lg:inline">System Instruction</span>
            </button>

            {/* Copy / Export */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                onClick={onCopyManuscript}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                title="Copy current manuscript to clipboard"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={onExportManuscript}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                title="Download draft and bibliography (.md)"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
