import { ATNSimulator, BaseErrorListener, RecognitionException, Recognizer, Token } from 'antlr4ng';
import { error } from 'console';

export class SyntaxErrorListener extends BaseErrorListener {
	constructor(protected errors = []) {
		super();
	}

	syntaxError<S extends Token, T extends ATNSimulator>(recognizer: Recognizer<T>, offendingSymbol: S | null, line: number, column: number, msg: string, e: RecognitionException | null) {
		this.errors.push({line, column, msg});
	}

	getSyntaxErrors() {
		return this.errors;
	}
}