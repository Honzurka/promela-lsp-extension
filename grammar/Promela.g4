grammar Promela;

/* PARSER RULES */

spec: module+ EOF;

module:
	proctype
	| init
	| never
	| trace
	| utype
	| mtype
	| decl_lst;

proctype:
	active? PROCTYPE NAME LeftParen decl_lst? RightParen priority? enabler? LeftBrace sequence
		RightBrace; // decl_lst here shouldnt be separated by semicolons

init: INIT priority? LeftBrace sequence RightBrace;

never: NEVER LeftBrace sequence RightBrace;

trace: TRACE LeftBrace sequence RightBrace;

utype: TYPEDEF NAME LeftBrace decl_lst RightBrace;

mtype: MTYPE Assign? LeftBrace NAME (Comma NAME)* RightBrace;

decl_lst:
	one_decl Semic (one_decl Semic)+; //changed from original

one_decl:
	visible? typename ivar (Comma ivar)*
	| visible? unsigned_decl;

unsigned_decl: UNSIGNED NAME Colon CONST (Assign any_expr)?;

typename:
	BIT
	| BOOL
	| BYTE
	| SHORT
	| INT
	| MTYPE
	| CHAN
	| uname;

active: ACTIVE (LeftBracket CONST RightBracket)?;

priority: PRIORITY CONST;

enabler: PROVIDED LeftParen expr RightParen;

visible: HIDDEN_VIS | SHOW;

sequence: step (step)*; //changed from original

step:
	stmnt (UNLESS stmnt)? Semic //changed from original
	| decl_lst
	| XR varref (Comma varref)*
	| XS varref (Comma varref)*;

ivar:
	decl_var_name (LeftBracket CONST RightBracket)? ivar_assign?;

ivar_assign: Assign any_expr | Assign ch_init;

decl_var_name: NAME;

ch_init:
	LeftBracket CONST RightBracket OF LeftBrace typename (
		Comma typename
	)* RightBrace;

varref: NAME (LeftBracket any_expr RightBracket)? (Dot varref)?;

send: varref Not send_args | varref DoubleNot send_args;

receive:
	varref Question recv_args
	| varref DoubleQuestion recv_args
	| varref QuestionLess recv_args Greater
	| varref DoubleQuestionLess recv_args Greater;

poll:
	varref Question LeftBracket recv_args RightBracket
	| varref DoubleQuestion LeftBracket recv_args RightBracket;

send_args: arg_lst | any_expr LeftParen arg_lst RightParen;

arg_lst: any_expr (Comma any_expr)*;

recv_args:
	recv_arg (Comma recv_arg)*
	| recv_arg LeftParen recv_args RightParen;

recv_arg:
	varref
	| EVAL LeftParen varref RightParen
	| Minus? CONST;

assign:
	varref Assign any_expr
	| varref PlusPlus
	| varref MinusMinus;

stmnt:
	IF opts FI
	| DO opts OD
	| FOR LeftParen range RightParen LeftBrace sequence RightBrace
	| ATOMIC LeftBrace sequence RightBrace
	| D_STEP LeftBrace sequence RightBrace
	| SELECT LeftParen range RightParen
	| LeftBrace sequence RightBrace
	| send
	| receive
	| assign
	| ELSE
	| BREAK
	| GOTO NAME
	| NAME Colon stmnt
	| PRINTF LeftParen STR (Comma arg_lst)? RightParen
	| ASSERT expr
	| expr;

range: NAME Colon any_expr DotDot any_expr | NAME IN NAME;

opts: (ColonColon sequence)+;

andor: AndAnd | OrOr;

binarop:
	Plus
	| Minus
	| Star
	| Div
	| Mod
	| And
	| Caret
	| Or
	| Greater
	| Less
	| GreaterEqual
	| LessEqual
	| Equal
	| NotEqual
	| LeftShift
	| RightShift
	| andor;

unarop: Tilde | Minus | Not;

any_expr:
	LeftParen any_expr RightParen
	| any_expr binarop any_expr
	| unarop any_expr
	| LeftParen any_expr Arrow any_expr Colon any_expr RightParen // TODO: seems wrong
	| LEN LeftParen varref RightParen
	| poll
	| varref
	| CONST
	| TIMEOUT
	| NP
	| ENABLED LeftParen any_expr RightParen
	| PC_VALUE LeftParen any_expr RightParen
	| NAME LeftBracket any_expr RightBracket At NAME
	| RUN NAME LeftParen (arg_lst)? RightParen (priority)?;

expr:
	any_expr
	| LeftParen expr RightParen
	| expr andor expr
	| chanpoll LeftParen varref RightParen;

chanpoll: FULL | EMPTY | NFULL | NEMPTY;

uname: NAME;

// /* LEXER RULES */

/* keywords - TODO: some might be missspelled [eg. print->printf] */

ACTIVE: 'active';
ASSERT: 'assert';
ATOMIC: 'atomic';
BIT: 'bit';
BOOL: 'bool';
BREAK: 'break';
BYTE: 'byte';
CHAN: 'chan';
DO: 'do';
D_STEP: 'd_step';
ELSE: 'else';
EMPTY: 'empty';
ENABLED: 'enabled';
EVAL: 'eval';
FALSE: 'false';
FI: 'fi';
FOR: 'for';
FULL: 'full';
GOTO: 'goto';
HIDDEN_VIS: 'hidden';
IF: 'if';
IN: 'in';
INIT: 'init';
INT: 'int';
LEN: 'len';
MTYPE: 'mtype';
NEMPTY: 'nempty';
NEVER: 'never';
NFULL: 'nfull';
NP: 'np_';
OD: 'od';
OF: 'of';
PC_VALUE: 'pc_value';
PRINTF: 'printf'; //missing printm variant
PRIORITY: 'priority';
PROCTYPE: 'proctype';
PROVIDED: 'provided';
RUN: 'run';
SELECT: 'select';
SHORT: 'short';
SHOW: 'show';
SKIP_CONST: 'skip';
TIMEOUT: 'timeout';
TRACE: 'trace';
TRUE: 'true';
TYPEDEF: 'typedef';
UNLESS: 'unless';
UNSIGNED: 'unsigned';
XR: 'xr';
XS: 'xs';

/* symbols */
LeftParen: '(';
RightParen: ')';
LeftBracket: '[';
RightBracket: ']';
LeftBrace: '{';
RightBrace: '}';
Assign: '=';
Comma: ',';
Semic: ';';
Colon: ':';
Dot: '.';
Not: '!';
DoubleNot: '!!';
Question: '?';
DoubleQuestion: '??';
QuestionLess: '?<';
Greater: '>';
DoubleQuestionLess: '??<';
Minus: '-';
PlusPlus: '++';
MinusMinus: '--';
DotDot: '..';
ColonColon: '::';
AndAnd: '&&';
OrOr: '||';
Plus: '+';
Star: '*';
Div: '/';
Mod: '%';
And: '&';
Caret: '^';
Or: '|';
Less: '<';
GreaterEqual: '>=';
LessEqual: '<=';
Equal: '==';
NotEqual: '!=';
LeftShift: '<<';
RightShift: '>>';
Tilde: '~';
Arrow: '->';
At: '@';

/* --- */
STR: '"' [\u0000-\u0021\u0023-\u0080]* '"'; //disallow "

CONST: TRUE | FALSE | SKIP_CONST | NUMBER+;

NAME: ALPHA (ALPHA | NUMBER)*;

ALPHA: [a-zA-Z_];

NUMBER: [0-9];

BLOCK_COMMENT: '/*' .*? '*/' -> skip;

LINE_COMMENT: '//' ~[\n\r]* -> skip;

WHITESPACE: [ \n\r\t] -> channel(HIDDEN);