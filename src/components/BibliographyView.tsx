import React, { useState } from 'react';
import { 
  BookMarked, 
  Copy, 
  Check, 
  Download, 
  ChevronDown, 
  ChevronUp,
  FileText
} from 'lucide-react';
import { CitationStyle, RagSource } from '../types/citation';
import { formatFullBibliography } from '../utils/citationFormatter';

interface BibliographyViewProps {
  sources: RagSource[];
  citationStyle: CitationStyle;
  onAppendToManuscript: (bibliographyText: string) => void;
}

export const BibliographyView: React.FC<BibliographyViewProps> = ({
  sources,
  citationStyle,
  onAppendToManuscript
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeSources = sources.filter(s => s.isActive);
  const bibliographyText = formatFullBibliography(activeSources, citationStyle);

  const handleCopy = () => {
    navigator.clipboard.writeText(bibliographyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <BookMarked className="w-4 h-4 text-indigo-800" />
          <span className="font-serif-academic font-bold text-sm text-slate-900">
            Manuscript Bibliography & Reference List ({activeSources.length})
          </span>
          <span className="text-xs font-mono-code text-slate-500 uppercase">
            [{citationStyle.toUpperCase()}]
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">
            {isExpanded ? 'Collapse References' : 'View References'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-slate-200 space-y-3 bg-white">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs text-slate-500">
              Generated references from active RAG grounding library:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy References</span>
              </button>
              <button
                type="button"
                onClick={() => onAppendToManuscript(`\n\n## References (${citationStyle.toUpperCase()})\n\n${bibliographyText}`)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded transition-colors"
                title="Append reference list to bottom of manuscript editor"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-700" />
                <span>Append to Draft</span>
              </button>
            </div>
          </div>

          <pre className="p-4 bg-slate-50 text-slate-800 rounded-md text-xs font-serif-academic whitespace-pre-wrap leading-relaxed border border-slate-200 overflow-x-auto">
            {bibliographyText}
          </pre>
        </div>
      )}
    </div>
  );
};
