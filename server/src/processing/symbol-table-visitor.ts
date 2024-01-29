import { ScopedSymbol, SymbolTable, VariableSymbol } from "antlr4-c3";
import { PromelaVisitor } from "../generated/PromelaVisitor";
import { AbstractParseTreeVisitor } from "antlr4ng";
import { Decl_var_nameContext } from "../generated/PromelaParser";

export class SymbolTableVisitor extends AbstractParseTreeVisitor<SymbolTable> implements PromelaVisitor<SymbolTable> {
    constructor(
        protected readonly symbolTable = new SymbolTable("", {}),
        protected scope = symbolTable.addNewSymbolOfType(ScopedSymbol, undefined)) { // TODO: 1 global context for now
        super();
    }

    defaultResult() {
        return this.symbolTable;
    }

    visitDecl_var_name = (ctx: Decl_var_nameContext) => {
        // const name = ctx.NAME().getText();
        // const variable = new VariableSymbol(name, undefined);
        // this.scope.addSymbol(variable);

        this.symbolTable.addNewSymbolOfType(VariableSymbol, this.scope, ctx.NAME().getText(), undefined);

        return this.visitChildren(ctx)!;
    };  
}