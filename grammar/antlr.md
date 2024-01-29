# Antlr
## Commands

- antlr4 -visitor <Grammar-file>
    - navic generovani visitoru
- grun <grammar-name> <rule-to-test> <input-filename(s)>
    - testovani gramatiky (vyzaduje prelozene java soubory)
        - `antlr4 Promela.g4 && javac Promela*.java && grun Promela spec mesi.pml -gui`
    - -gui: zobrazi AST
- js: `antlr4 -Dlanguage=JavaScript Promela.g4 -o generated`
    - node => `npm install antlr4`
- testovani: `javac *.java && grun Promela spec ../promela-tests/test.pml -gui`

## Lexer

- defined using regex
- UPPERCASE rules
    - eg: `NUMBER : [0-9]+ ;`
    - `WHITESPACE : ' ' -> skip ;`
- fragment (something like inline function - to make it more readable)
    - eg: `fragment DIGIT : [0-9] ;`

## Parser

- literals: 'literal'
- rules: `ruleName: rule1 rule2 ;`

# Antlr4-c4

- symbol table (provided by lib)
    - dynamic parts: from parser + parse listener
    - static parts: hardcoded
    - keywords
        - from parser
    - variables / classnames
        - **requires change in grammar**
        - `The code completion core can return parser rule indexes (as created by ANTLR4 when it generated your files). With a returned candidate ExprParser.RULE_variableRef you know that you have to ask your symbol for all visible variables (or functions if you get back ExprParser.RULE_functionRef)`

# Zdroje

- https://github.com/mike-lischke/antlr4-c3
- https://tomassetti.me/code-completion-with-antlr4-c3/
    - viz take git repo
