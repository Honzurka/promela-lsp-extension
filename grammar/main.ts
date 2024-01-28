import { CommonTokenStream, BaseErrorListener, CharStreams, ParseTree, TerminalNode } from 'antlr4ng';
import { CodeCompletionCore } from 'antlr4-c3';
import { PromelaLexer } from './generated/PromelaLexer.js';
import { PromelaParser } from './generated/PromelaParser.js';
import { CaretPosition, computeTokenPosition } from './compute-token-position.js';

export function getSuggestion(code: string, caretPosition: CaretPosition) {
    const input = CharStreams.fromString(code);
    const lexer = new PromelaLexer(input);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new PromelaParser(tokenStream);
    const tree = parser.spec();

    const position = computeTokenPosition(tree, tokenStream, caretPosition);
    if (position === undefined) {
        return [];
    }
    
    const core = new CodeCompletionCore(parser);
    const candidates = core.collectCandidates(position.index);
    
    const keywords: string[] = [];
    const other: string[] = []; //todo
    for (const candidate of candidates.tokens) {
        const symbolicName = parser.vocabulary.getSymbolicName(candidate[0]);
        if (candidate[0] == PromelaParser.NAME) {
            // skip - handled elsewhere
        }
        else if (symbolicName) {
            other.push(symbolicName.toLowerCase());
        }
        else { // keywords
            const keyword = parser.vocabulary.getDisplayName(candidate[0]);
            if (keyword) {
                keywords.push(keyword.toLocaleLowerCase().substring(1, keyword.length - 1));
            }
            else {
                console.error("Unknown token type: " + candidate[0]);
            }
        }
    }

    return [keywords, other];
}

const result = getSuggestion("bool flags[2];", { line: 1, column: 0 });
console.log(result);

