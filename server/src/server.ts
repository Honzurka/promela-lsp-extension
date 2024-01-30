/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
	createConnection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult
} from 'vscode-languageserver/node.js';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';

import {
	getSuggestion
} from './processing/main.js';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;

	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			// Tell the client that this server supports code completion.
			completionProvider: {
				resolveProvider: true
			}
		}
	};

	return result;
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {

	const { errors } = getSuggestion(textDocument.getText(), null);

	// const text = textDocument.getText();
	// const pattern = /.*\S.*#\b/g; // match a macro after another symbol
	// let m: RegExpExecArray | null;

	const diagnostics: Diagnostic[] = [];
	/*
	while ((m = pattern.exec(text))) {
		const diagnostic: Diagnostic = {
			severity: DiagnosticSeverity.Error,
			range: {
				start: textDocument.positionAt(m.index + m[0].length - 1),
				end: textDocument.positionAt(m.index + m[0].length)
			},
			message: `Macro can only be defined at the start of a line.`,
			source: 'Promela file'
		};
		if (hasDiagnosticRelatedInformationCapability) {
			diagnostic.relatedInformation = [
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnostic.range)
					},
					message: '<some related info here...>'
				},
			];
		}
		diagnostics.push(diagnostic);
	}
	*/

	for (const e of errors) {
		diagnostics.push({
			severity: DiagnosticSeverity.Error,
			range: {
				start: { line: e.line, character: e.column },
				end: { line: e.line, character: e.column }
			},
			message: e.msg,
			source: 'Promela file'
		});
	}

	// Send the computed diagnostics to VSCode.
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have change in VSCode
	connection.console.log('We received a file change event');
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
	(pos: TextDocumentPositionParams): CompletionItem[] => {
		const doc = documents.get(pos.textDocument.uri)!.getText();
		const line = pos.position.line;
		const column = pos.position.character;
		console.log("DOC");
		console.log(doc);
		const { keywords, variables } = getSuggestion(doc, { line, column });

		const complVariables: CompletionItem[] = variables.map((label, i) => ({
			label,
			kind: CompletionItemKind.Variable,
			data: i
		}));
		const complKeywords: CompletionItem[] = keywords.map((label, i) => ({
			label,
			kind: CompletionItemKind.Keyword,
			data: variables.length + i
		}));

		return complVariables.concat(complKeywords);
	}
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		/* TODO
		if (item.data === 1) {
			item.detail = 'Makes the process initialize automatically';
			item.documentation = 'https://spinroot.com/spin/Man/active.html';
		} else if (item.data === 2) {
			item.detail = 'Defines a new process type.';
			item.documentation = 'https://spinroot.com/spin/Man/proctype.html';
		} else if (item.data === 3) {
			item.detail = 'for declaring an initial process.';
			item.documentation = 'https://spinroot.com/spin/Man/init.html';
		}
		*/
		return item;
	}
);

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// Listen on the connection
connection.listen();
