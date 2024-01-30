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
        if (ctx.NAME()) {
            const name = ctx.NAME().getText();
            if (this.scope.getAllNestedSymbolsSync(name).length == 0) {
                this.symbolTable.addNewSymbolOfType(VariableSymbol, this.scope, name, undefined);
            }
        } else {
            console.error("Unknown variable name: " + ctx.getText());
        }

        return this.visitChildren(ctx)!;
    };
}