import { Command, operationToDisplayString, OperationType } from "../components/contexts/commands";
import { BinopExpr, Expr, NumberLit, Parser, UnopExpr } from "./parser";

export const evaluate = (commands: Command[]): number => {
   const parser = new Parser([...commands])
   const ast = parser.parseExpr()

   console.log("ast", JSON.stringify(ast, undefined, 3))

   return evaluateExpr(ast)
}

const evaluateExpr = (expr: Expr): number => {
   if (!expr) {
      throw new EvaluatorError("Expression was null")
   }
   switch (expr.type) {
      case "number": return (expr as NumberLit).value
      case "binop": return evaluateBinopExpr(expr as BinopExpr)
      case "unop": return evaluateUnopExpr(expr as UnopExpr)
   }
}

const evaluateBinopExpr = (expr: BinopExpr): number => {
   switch (expr.op) {
      case OperationType.Div: return evaluateExpr(expr.lhs) / evaluateExpr(expr.rhs)
      case OperationType.Mul: return evaluateExpr(expr.lhs) * evaluateExpr(expr.rhs)
      case OperationType.Sub: return evaluateExpr(expr.lhs) - evaluateExpr(expr.rhs)
      case OperationType.Add: return evaluateExpr(expr.lhs) + evaluateExpr(expr.rhs)
   }
   throw new EvaluatorError("Evaluator: Invalid Binop Expr" +
      `expected \"Binop\" found ${operationToDisplayString(expr.op)}`)
}

const evaluateUnopExpr = (expr: UnopExpr): number => {
   switch (expr.op) {
      case OperationType.Percent: return evaluateExpr(expr.expr) / 100.0
   }
   throw new EvaluatorError("Evaluator: Invalid Unop Expr," +
      `expected \"Unop\" found ${operationToDisplayString(expr.op)}`)
}
export class EvaluatorError {
   constructor(message?: string) {
      this.message = message ?? "Evaluator Error"
   }
   message: string
}