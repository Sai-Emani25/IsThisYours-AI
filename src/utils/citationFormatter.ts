import { CitationStyle, RagSource } from '../types/citation';

export function formatCitationForSource(
  source: RagSource,
  style: CitationStyle,
  sourceIndex: number = 1
): string {
  const firstAuthor = source.authors[0] || 'Unknown';
  const lastName = firstAuthor.split(' ').pop() || firstAuthor;
  const authorEtAl = source.authors.length > 2 
    ? `${lastName} et al.` 
    : source.authors.length === 2 
    ? `${source.authors[0].split(' ').pop()} & ${source.authors[1].split(' ').pop()}` 
    : lastName;

  switch (style) {
    case 'apa':
      return `(${authorEtAl}, ${source.year})`;
    case 'ieee':
      return `[${sourceIndex}]`;
    case 'nature':
      return `[${sourceIndex}]`;
    case 'harvard':
      return `(${authorEtAl} ${source.year})`;
    case 'chicago':
      return `(${authorEtAl} ${source.year})`;
    case 'bibtex':
      return `\\cite{${source.citationKey || 'source' + sourceIndex}}`;
    default:
      return `(${authorEtAl}, ${source.year})`;
  }
}

export function formatFullBibliography(sources: RagSource[], style: CitationStyle): string {
  return sources
    .map((src, idx) => {
      const authorList = src.authors.join(', ');
      switch (style) {
        case 'ieee':
          return `[${idx + 1}] ${authorList}, "${src.title}," in ${src.publication || 'Preprint'}, ${src.year}. DOI: ${src.doi || 'N/A'}`;
        case 'bibtex':
          return `@article{${src.citationKey || 'ref' + (idx + 1)},
  author = {${src.authors.join(' and ')}},
  title = {${src.title}},
  journal = {${src.publication || 'Preprint'}},
  year = {${src.year}},
  doi = {${src.doi || ''}}
}`;
        case 'apa':
        default:
          return `${authorList} (${src.year}). ${src.title}. ${src.publication ? src.publication + '.' : ''} https://doi.org/${src.doi || ''}`;
      }
    })
    .join('\n\n');
}

/**
 * Injects citation string cleanly at cursor or sentence boundary
 */
export function injectCitationAtPosition(
  fullText: string,
  citationToInsert: string,
  cursorStart: number,
  cursorEnd: number
): { newText: string; newCursorPos: number } {
  const before = fullText.slice(0, cursorStart);
  const after = fullText.slice(cursorEnd);

  // Check if we need leading or trailing space
  const needsLeadingSpace = before.length > 0 && !before.endsWith(' ') && !before.endsWith('(') && !before.endsWith('[');
  const insertPayload = (needsLeadingSpace ? ' ' : '') + citationToInsert;

  const newText = before + insertPayload + after;
  const newCursorPos = cursorStart + insertPayload.length;

  return { newText, newCursorPos };
}

/**
 * Injects a citation right before the ending period of a claim sentence
 */
export function injectCitationForClaim(
  fullText: string,
  claimText: string,
  citationToInsert: string
): string {
  const trimmedClaim = claimText.trim();
  const index = fullText.indexOf(trimmedClaim);
  
  if (index === -1) {
    // If exact match isn't found, try normalized punctuation
    return fullText;
  }

  const claimEnd = index + trimmedClaim.length;
  // If sentence ends with punctuation like period, insert citation right before it, or right after as in IEEE
  const before = fullText.slice(0, claimEnd);
  const after = fullText.slice(claimEnd);

  // Check if citation is already injected in nearby region
  const nearbySlice = fullText.slice(Math.max(0, index - 20), Math.min(fullText.length, claimEnd + 40));
  if (nearbySlice.includes(citationToInsert)) {
    return fullText; // already injected
  }

  if (before.endsWith('.')) {
    return before.slice(0, -1) + ' ' + citationToInsert + '.' + after;
  }

  return before + ' ' + citationToInsert + after;
}
