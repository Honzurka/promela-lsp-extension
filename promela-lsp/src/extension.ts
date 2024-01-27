/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';

import { LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    let serverExe = 'dotnet';
    let serverDLLPath = context.asAbsolutePath(path.join('..', 'ServerExample', 'Server', 'bin', 'Debug', 'netcoreapp2.1', 'Server.dll'));
    let serverOptions: ServerOptions = {
        run: { command: serverExe, args: [serverDLLPath] },
            debug: { command: serverExe, args: [serverDLLPath] }
    }

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'promela' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
            configurationSection: 'promelaLanguageServer',
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc') //todo: change this to .csproj ?
		},

        // outputChannelName: 'Promela Language Client',// todo: set logging?
        // errorHandler
	};

    client = new LanguageClient(
        'promelaLanguageServer',
        'Promela Language Server',
        serverOptions,
        clientOptions,
    )

	// Start the client. This will also launch the server
    // client.trace = Trace.Verbose; //todo: logging?
    client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}