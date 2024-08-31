const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const commandKeySymbol = {darwin: "⌘", win32: "Ctrl+", linux: "Ctrl+"}[process.platform]

	const QuickFoldWhenContext = "LetsMakePaperCranes"

	const folds = [
		{
			label: `Fold (${commandKeySymbol}F)`,
			value: "editor.foldRecursively"
		},
		{
			label: `Fold All (${commandKeySymbol}A)`,
			value: "editor.foldAll"
		},
		{
			label:`Fold All Except Selected (${commandKeySymbol}X)`,
			value: "editor.foldAllExcept"
		},
		{
			label: `Unfold (${commandKeySymbol}U)`,
			value: "editor.unfoldRecursively"
		},
		{
			label: `Unfold All (${commandKeySymbol}N)`,
			value: "editor.unfoldAll"
		},
		{
			label: `Unfold All Except Selected (${commandKeySymbol}G)`,
			value: "editor.unfoldAllExcept"
		}

	]
	let foldPicker;

    let commands = [
		vscode.commands.registerCommand(
			"quickFold.showPicker",
			() => {

			vscode.commands.executeCommand("setContext", QuickFoldWhenContext, true);

			foldPicker = vscode.window.createQuickPick();

			foldPicker.placeholder = "Fold ... ?";

			foldPicker.items = folds;

			foldPicker.onDidChangeSelection(([selection]) => {

				vscode.commands.executeCommand(selection.value);
				foldPicker.hide();
			});

			foldPicker.onDidHide(() =>{
				foldPicker.dispose()
				vscode.commands.executeCommand("setContext", QuickFoldWhenContext, undefined);
			});
			foldPicker.show();
		}),
		vscode.commands.registerCommand(
			"quickFold.origamiThatShit",
			(args) => {
			foldPicker.hide();

			if (args && args.foldCommand){
				vscode.commands.executeCommand(args.foldCommand);
			} else {
				vscode.window.showInformationMessage(`A fold command is not specified for this keybinding. Please provide a "foldCommand" argument in the keybinding:
					"args": {
					"foldCommand": "editor.foldRecursively"
					}"
				`)
			}
		}),
	] // end of commands

	context.subscriptions.push(commands);
} // end of activate

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
