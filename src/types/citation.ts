export type CitationStyle = 'apa' | 'ieee' | 'nature' | 'chicago' | 'harvard' | 'bibtex';

export interface RagSource {
  id: string;
  title: string;
  authors: string[];
  year: number;
  publication?: string;
  doi?: string;
  citationKey: string;
  excerpt: string;
  isActive: boolean;
  tags?: string[];
}

export interface ClaimAnalysis {
  claim_text: string;
  needs_citation: boolean;
  suggested_citation: string;
  source_verification_quote: string;
  matched_source_id?: string;
  matched_source_title?: string;
  confidence_score?: number;
  verification_status?: 'verified' | 'unsupported' | 'hallucination_warning';
  hallucination_warning?: boolean;
  rationale?: string;
}

export interface CitationAnalysisResponse {
  analysis_summary: string;
  claims: ClaimAnalysis[];
  execution_time_ms?: number;
  model_used?: string;
  citation_style?: CitationStyle;
  raw_json?: string;
}

export interface CursorPosition {
  start: number;
  end: number;
  line: number;
  column: number;
}
