// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var linterService = require('./linterService');
var config = vscode.workspace.getConfiguration();

const linterDecorationType = vscode.window.createTextEditorDecorationType({
//    isWholeLine: true,
    borderWidth: '2px',
    borderStyle: 'solid',
    color: config.linter.ErrorColor,
    overviewRulerColor: config.linter.OverviewRulerColor,
    overviewRulerLane: vscode.OverviewRulerLane.Right,
    light: {
        // this color will be used in light color themes
        borderColor: config.linter.ErrorColor
    },
    dark: {
        // this color will be used in dark color themes
        borderColor: config.linter.ErrorColor
    }
});

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "lightning-linter" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.lightningLinter', function() {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        var text = editor.document.getText();

        //vscode.window.showInformationMessage('Hello World!' + text);
        linterService.lintFile(text).then(function(results){
            var lintResults = JSON.parse(results),
                decorations = [];
            if(lintResults.length === 0){
                vscode.window.showInformationMessage('Good job, you are lightning lint free!');
            }
            for(var i=0; i<lintResults.length;i++){
                var lintResult = lintResults[i];
                decorations.push(decorate(lintResult) );
            }
            editor.setDecorations(linterDecorationType,decorations);
            
        })
    });

    context.subscriptions.push(disposable);
}

function decorate(lintResult){
    console.log(lintResult);
    var line = lintResult.line-1
    var startPos = new vscode.Position(line, lintResult.column - 1);
    var endPos = new vscode.Position(line,lintResult.column );
    var decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: lintResult.message };
    return decoration;
    
}


exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;