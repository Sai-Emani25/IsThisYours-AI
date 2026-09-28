import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Plus, 
  Search, 
  Check, 
  Trash2, 
  FileText, 
  ExternalLink,
  BookOpen,
  Filter
} from 'lucide-react';
import { RagSource } from '../types/citation';

interface RagCorpusModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: RagSource[];
  onToggleSource: (id: string) => void;
  onAddSource: (source: Omit<RagSource, 'id'>) => void;
  onDeleteSource: (id: string) => void;
  highlightedSourceId?: string;
}

export const RagCorpusModal: React.FC<RagCorpusModalProps> = ({
  isOpen,
  onClose,
  sources,
  onToggleSource,
  onAddSource,
  onDeleteSource,
  highlightedSourceId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // New source form state
  const [title, setTitle] = useState('');
  const [authorsStr, setAuthorsStr] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [publication, setPublication] = useState('');
  const [doi, setDoi] = useState('');
  const [citationKey, setCitationKey] = useState('');
  const [excerpt, setExcerpt] = useState('');

  if (!isOpen) return null;

  const filteredSources = sources.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
    s.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitNewSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) return;

    const authors = authorsStr
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0);

    onAddSource({
      title: title.trim(),
      authors: authors.length > 0 ? authors : ['Unknown Author'],
      year: Number(year) || new Date().getFullYear(),
      publication: publication.trim() || 'Academic Preprint',
      doi: doi.trim(),
      citationKey: citationKey.trim() || title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14),
      excerpt: excerpt.trim(),
      isActive: true,
      tags: ['Custom Source']
    });

    // Reset form
    setTitle('');
    setAuthorsStr('');
    setPublication('');
    setDoi('');
    setCitationKey('');
    setExcerpt('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[88vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-900 text-white flex items-center justify-center">
              <Database className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-lg font-serif-academic font-bold text-slate-900">
                RAG Source Material Corpus
              </h2>
              <p className="text-xs text-slate-500">
                Grounding knowledge base for citation verification quotes and claim analysis
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

        {/* Search & Actions Bar */}
        <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search source title, authors, or excerpt passage..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Cancel' : 'Add Custom Source'}</span>
          </button>
        </div>

        {/* Add Source Form Drawer */}
        {showAddForm && (
          <form onSubmit={handleSubmitNewSource} className="p-5 bg-slate-50 border-b border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Add New Academic Reference to RAG Index
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Document / Paper Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. BERT: Pre-training of Deep Bidirectional Transformers"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Authors (comma separated)
                </label>
                <input
                  type="text"
                  value={authorsStr}
                  onChange={(e) => setAuthorsStr(e.target.value)}
                  placeholder="e.g. Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Publication Year & Journal / Conference
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-24 px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
                  />
                  <input
                    type="text"
                    value={publication}
                    onChange={(e) => setPublication(e.target.value)}
                    placeholder="e.g. NAACL-HLT 2019"
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  DOI & Citation Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    placeholder="10.18653/v1/N19-1423"
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
                  />
                  <input
                    type="text"
                    value={citationKey}
                    onChange={(e) => setCitationKey(e.target.value)}
                    placeholder="devlin2019bert"
                    className="w-32 px-3 py-1.5 text-xs font-mono-code border border-slate-300 rounded-md bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full-Text Source Excerpt / Abstract (Grounding Corpus) *
              </label>
              <textarea
                required
                rows={4}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Paste the excerpt, key empirical results, or exact methodology text that the agent will use for verification quotes..."
                className="w-full p-3 text-xs font-serif-academic border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 bg-white leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-indigo-900 hover:bg-indigo-800 text-white rounded-md shadow-xs"
              >
                Add to RAG Corpus
              </button>
            </div>
          </form>
        )}

        {/* Source List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filteredSources.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs italic">
              No matching sources found in the RAG corpus.
            </div>
          ) : (
            filteredSources.map((source, index) => {
              const isTargeted = highlightedSourceId === source.id;

              return (
                <div
                  key={source.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isTargeted
                      ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50/20'
                      : source.isActive
                      ? 'border-slate-200 bg-white'
                      : 'border-slate-200 bg-slate-50 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">
                        <input
                          type="checkbox"
                          id={`source-toggle-${source.id}`}
                          checked={source.isActive}
                          onChange={() => onToggleSource(source.id)}
                          className="w-4 h-4 rounded text-indigo-900 focus:ring-indigo-500 cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <label
                            htmlFor={`source-toggle-${source.id}`}
                            className="font-serif-academic font-bold text-slate-900 text-sm hover:text-indigo-900 cursor-pointer"
                          >
                            {source.title}
                          </label>
                          <span className="text-xs font-mono-code text-slate-500 font-medium">
                            ({source.year})
                          </span>
                          <span className="text-[11px] font-mono-code bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                            {source.citationKey}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {source.authors.join(', ')}
                          {source.publication && <span className="text-slate-400"> · {source.publication}</span>}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onDeleteSource(source.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded"
                        title="Delete source"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Excerpt callout */}
                  <div className="mt-3 p-3 bg-slate-50 rounded-md border border-slate-100 text-xs font-serif-academic text-slate-700 leading-relaxed max-h-32 overflow-y-auto">
                    &ldquo;{source.excerpt}&rdquo;
                  </div>

                  {source.doi && (
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>DOI: {source.doi}</span>
                      <span className="font-mono-code text-[10px] text-slate-400">ID: {source.id}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>{sources.filter(s => s.isActive).length} of {sources.length} sources active in RAG index</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md font-medium text-xs shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
