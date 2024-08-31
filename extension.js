const vscode = require("vscode");

// Maintain a history of recently selected items
let selectionHistory = [];

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

			foldPicker.items = reorderFoldsByHistory(folds);

			foldPicker.onDidChangeSelection(([selection]) => {

				// add an option to add additional fold commands to the picker

				vscode.commands.executeCommand(selection.value);

				updateSelectionHistory(selection);

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

	function reorderFoldsByHistory(items){
		return items
		// // Create a new array that will contain reordered items
		// let reorderedItems = [];

		// // Add recently selected items first
		// selectionHistory.forEach((label) => {
		// 	const item = items.find(i => i.label === label);
		// 	if (item) {
		// 		reorderedItems.push(item);
		// 	}
		// });

		// // Add the rest of the items that are not in the selection history
		// items.forEach((item) => {
		// 	if (!selectionHistory.includes(item.label)) {
		// 		reorderedItems.push(item);
		// 	}
		// });

		// return reorderedItems;
	}

	// Function to update the selection history
	function updateSelectionHistory(selectedLabel) {
		// // Remove the item if it already exists in the history to avoid duplicates
		// const index = selectionHistory.indexOf(selectedLabel);
		// if (index !== -1) {
		// 	selectionHistory.splice(index, 1);
		// }

		// // Add the selected item to the front of the history
		// selectionHistory.unshift(selectedLabel);

		// // Optionally, limit the history size to a certain number of items
		// if (selectionHistory.length > 5) {
		// 	selectionHistory.pop();
		// }
	}


	context.subscriptions.push(commands);
} // end of activate

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
