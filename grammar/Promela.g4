grammar Promela;

/* PARSER RULES */

spec: module+;

module:
	proctype
	| init
	| never
	| trace
	| utype
	| mtype
	| decl_lst;

proctype:
	active? 'PROCTYPE' NAME '(' decl_lst? ')' priority? enabler? '{' sequence '}';

init: 'INIT' priority? '{' sequence '}';

never: 'NEVER' '{' sequence '}';

trace: 'TRACE' '{' sequence '}';

utype: 'TYPEDEF' NAME '{' decl_lst '}';

mtype: 'MTYPE' '='? '{' NAME (',' NAME)* '}';

decl_lst: one_decl ( ';' one_decl)*;

one_decl:
	visible? typename ivar (',' ivar)*
	| visible? unsigned_decl;

unsigned_decl: 'UNSIGNED' NAME ':' CONST ('=' any_expr)?;

typename:
	'BIT'
	| 'BOOL'
	| 'BYTE'
	| 'SHORT'
	| 'INT'
	| 'MTYPE'
	| 'CHAN'
	| uname;

active: 'ACTIVE' ('[' CONST ']')?;

priority: 'PRIORITY' CONST;

enabler: 'PROVIDED' '(' expr ')';

visible: 'HIDDEN' | 'SHOW';

sequence: step (';' step)*;

step:
	stmnt ('UNLESS' stmnt)?
	| decl_lst
	| 'XR' varref (',' varref)*
	| 'XS' varref (',' varref)*;

ivar:
	decl_var_name ('[' CONST ']')?; //('=' any_expr | '=' ch_init)?;

decl_var_name: NAME;

ch_init: '[' CONST ']' 'OF' '{' typename (',' typename)* '}';

varref: NAME ('[' any_expr ']')? ('.' varref)?;

send: varref '!' send_args | varref '!!' send_args;

receive:
	varref '?' recv_args
	| varref '??' recv_args
	| varref '?<' recv_args '>'
	| varref '??<' recv_args '>';

poll:
	varref '?' '[' recv_args ']'
	| varref '??' '[' recv_args ']';

send_args: arg_lst | any_expr '(' arg_lst ')';

arg_lst: any_expr (',' any_expr)*;

recv_args:
	recv_arg (',' recv_arg)*
	| recv_arg '(' recv_args ')';

recv_arg: varref | 'EVAL' '(' varref ')' | '-'? CONST;

assign: varref '=' any_expr | varref '++' | varref '--';

stmnt:
	'IF' opts 'FI'
	| 'DO' opts 'OD'
	| 'FOR' '(' range ')' '{' sequence '}'
	| 'ATOMIC' '{' sequence '}'
	| 'D_STEP' '{' sequence '}'
	| 'SELECT' '(' range ')'
	| '{' sequence '}'
	| send
	| receive
	| assign
	| 'ELSE'
	| 'BREAK'
	| 'GOTO' NAME
	| NAME ':' stmnt
	| 'PRINT' '(' STR (',' arg_lst)? ')'
	| 'ASSERT' expr
	| expr; // | c_code | c_expr | c_decl | c_track | c_state;

range: NAME ':' any_expr '..' any_expr | NAME 'IN' NAME;

opts: ('::' sequence)+;

andor: '&&' | '||';

binarop:
	'+'
	| '-'
	| '*'
	| '/'
	| '%'
	| '&'
	| '^'
	| '|'
	| '>'
	| '<'
	| '>='
	| '<='
	| '=='
	| '!='
	| '<<'
	| '>>'
	| andor;

unarop: '~' | '-' | '!';

any_expr:
	'(' any_expr ')'
	| any_expr binarop any_expr
	| unarop any_expr
	| '(' any_expr '->' any_expr ':' any_expr ')'
	| 'LEN' '(' varref ')'
	| poll
	| varref
	| CONST
	| 'TIMEOUT'
	| 'NP_'
	| 'ENABLED' '(' any_expr ')'
	| 'PC_VALUE' '(' any_expr ')'
	| NAME '[' any_expr ']' '@' NAME
	| 'RUN' NAME '(' (arg_lst)? ')' (priority)?;

expr:
	any_expr
	| '(' expr ')'
	| expr andor expr
	| chanpoll '(' varref ')';

chanpoll: 'FULL' | 'EMPTY' | 'NFULL' | 'NEMPTY';

uname: NAME;

// /* LEXER RULES */

STR: '"' [\u0000-\u0080]* '"';

NAME: ALPHA (ALPHA | NUMBER)*;

CONST: 'TRUE' | 'FALSE' | 'SKIP' | NUMBER+;

ALPHA: [a-zA-Z_];

NUMBER: [0-9];

WHITESPACE: [ \n\r\t] -> channel(HIDDEN);

BLOCK_COMMENT: '/*' .*? '*/' -> skip;

LINE_COMMENT: '//' ~[\n\r]* -> skip;

/* explicit token definitions: TODO */