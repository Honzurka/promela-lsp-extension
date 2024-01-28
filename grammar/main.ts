import { CommonTokenStream, BaseErrorListener, CharStreams } from 'antlr4ng';
import { PromelaLexer } from './generated/PromelaLexer';
import { PromelaParser } from './generated/PromelaParser';

const input = CharStreams.fromString("var c = a + b()");
const lexer = new PromelaLexer(input);
const parser = new PromelaParser(new CommonTokenStream(lexer));

const tree = parser.spec();
console.log(tree);

// const errorListener = new ErrorListener();
// parser.addErrorListener(errorListener);
// const tree = parser.expression();

// const core = new c3.CodeCompletionCore(parser);
// const candidates = core.collectCandidates(0);