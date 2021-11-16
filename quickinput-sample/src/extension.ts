/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as cp from 'child_process';
import { window, commands, ExtensionContext } from 'vscode';
import { showQuickPick, showInputBox } from './basicInput';
import { multiStepInput } from './multiStepInput';
import { quickOpen } from './quickOpen';

export function activate(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand('samples.quickInput', async () => {
			// const currentDir = await execShell('ls');
			// console.log(currentDir);

			const options: { [key: string]: (context: ExtensionContext) => Promise<void> } = {
				showQuickPick,
				showInputBox,
				multiStepInput,
				quickOpen,
			};
			const quickPick = window.createQuickPick();
			quickPick.items = Object.keys(options).map((label) => ({ label }));
			quickPick.onDidChangeSelection((selection) => {
				if (selection[0]) {
					options[selection[0].label](context).catch(console.error);
				}
			});
			quickPick.onDidHide(() => quickPick.dispose());
			quickPick.show();
		})
	);

	context.subscriptions.push(
		commands.registerCommand('samples.helloWorld', async () => {
			window.showInformationMessage('hello wolrd');
			cp.exec(`pwd`, (err, stdout) => {
				console.log(stdout);
			});
		})
	);
}

const execShell = (cmd: string) =>
	new Promise<string>((resolve, reject) => {
		cp.exec(cmd, (err, out) => {
			if (err) {
				return reject(err);
			}
			return resolve(out);
		});
	});
