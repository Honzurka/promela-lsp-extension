import { CommonTokenStream, BaseErrorListener, CharStreams, ParseTree, TerminalNode } from 'antlr4ng';
import { CodeCompletionCore, SymbolTable, VariableSymbol } from 'antlr4-c3';
import { PromelaLexer } from '../generated/PromelaLexer.js';
import { PromelaParser } from '../generated/PromelaParser.js';
import { CaretPosition, TokenPosition, computeTokenPosition } from './compute-token-position.js';
import { SymbolTableVisitor } from './symbol-table-visitor.js';

export function getSuggestion(code: string, caretPosition: CaretPosition) {
    const input = CharStreams.fromString(code);
    const lexer = new PromelaLexer(input);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new PromelaParser(tokenStream);

    const tree = parser.spec();
    const symbolTable = new SymbolTableVisitor().visit(tree);

    const position = computeTokenPosition(tree, tokenStream, caretPosition);
    if (position === undefined) {
        return { variables: [], keywords: [], other: [] };
    }
    
    const core = new CodeCompletionCore(parser);
    core.preferredRules = new Set([PromelaParser.RULE_decl_var_name]);

    const candidates = core.collectCandidates(position.index);

    const variables = [];
    if (candidates.rules.has(PromelaParser.RULE_decl_var_name)) {
        const declaredVariables = symbolTable?.getNestedSymbolsOfTypeSync(VariableSymbol);
        const declaredVariableNames = declaredVariables?.map(v => v.name);
        variables.push(...declaredVariableNames ?? []);
    }
    
    const keywords: string[] = [];
    const other: string[] = []; //todo
    for (const candidate of candidates.tokens) {
        const symbolicName = parser.vocabulary.getSymbolicName(candidate[0]);
        if (candidate[0] == PromelaParser.NAME) {
            console.log("DBG-skip: " + parser.vocabulary.getDisplayName(candidate[0]));
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

    return { variables, keywords, other };
}

// getSuggestion("bool flags[2];\nbool x;", { line: 1, column: 5 }).then(console.log);
