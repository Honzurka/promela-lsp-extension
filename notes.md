# Notes

## Antlr C#

- traversing syntax tree
    - visitors
        - return values
        - 1 context for each parser non-terminal
    - listeners

```csharp
// usage
AntlrInputStream inputStream = new AntlrInputStream(text.ToString());
SpeakLexer speakLexer = new SpeakLexer(inputStream);
CommonTokenStream commonTokenStream = new CommonTokenStream(speakLexer);
SpeakParser speakParser = new SpeakParser(commonTokenStream);
SpeakParser.ChatContext chatContext = speakParser.chat();
SpeakVisitor visitor = new SpeakVisitor();
visitor.Visit(chatContext); //visiting root expression == chat
```

## Zprovozneni LSP serveru a clienta

- client code
    1. npm install -g yo generator-code
    2. yo code  (vygeneruje LSP clienta)
    3. pridat `src/extension.ts`
    4. pridat dependence (bude soucasti package.json)
        - `npm i vscode-languageclient`
        - `npm i @types/vscode`
        - `npm i path`
        - `npm i @types/node`
- extensions folder: `C:\Users\jfuer.HONZURKA-WIN\.vscode\extensions`

## zdroje
- https://martinbjorkstrom.com/posts/2018-11-29-creating-a-language-server?fbclid=IwAR2dYapi5GuGZ86fHGlveTXJG809jaYMFJoh4qOYOXrDf39AU8bP4IEZFuQ
    - VSCode LSP pro XML
- https://tomassetti.me/getting-started-with-antlr-in-csharp/?fbclid=IwAR2jQ6DJIJuPD3ioQgVrc5lpjvB2dTxs1xCUpKKFV0l6GjfXkyDwwEeFb4w
    - ANTLR C#
- https://code.visualstudio.com/api/language-extensions/language-server-extension-guide
- 