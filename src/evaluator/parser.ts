import { Command, CommandType, operationToLogicalString, OperationType } from "../components/contexts/commands"

export interface ExprBase {
   type: "number" | "binop" | "unop"
}
export type Expr = ((NumberLit | BinopExpr | UnopExpr) & ExprBase | null)
export interface NumberLit {
   value: number
}
export interface BinopExpr {
   lhs: Expr,
   op: OperationType,
   rhs: Expr,
}
export interface UnopExpr {
   expr: Expr,
   op: OperationType,
}
export class Parser {
   constructor(commands: Command[]) {
      this.commands = commands
      this.pos = 0
   }
   parseExpr = (): Expr => {
      // input must start with a number
      let expr: Expr = this.parseOperand()
      expr = this.parseBinop(expr)
      return expr
   }
   parseOperand = (): Expr => {
      let expr: Expr = this.parseNumber()
      if (expr === null) {
         return null
      }
      let next = this.commands[this.pos]
      if (next !== undefined) {
         // this must be an operation
         if (isPostfixUnop(next.value)) {
            expr = {
               expr,
               op: next.value,
               type: "unop",
            }
            this.pos++
         }
      }
      return expr
   }
   parseBinop = (current: Expr): Expr => {
      while (true) {
         // check if there is a binop, returning the current expr if there isnt
         let binop = this.commands[this.pos]
         if (binop === undefined || !isBinop(binop.value)) {
            return current
         }

         // parse the rhs expr
         this.pos++
         let rhs = this.parseOperand()
         if (rhs === null) {
            return {
               lhs: current,
               op: binop.value,
               rhs: null,
               type: "binop"
            }
         }

         let peekedBinop = this.commands[this.pos]
         if (peekedBinop === undefined || !isBinop(peekedBinop.value)) {
            return {
               lhs: current,
               op: binop.value,
               rhs: rhs,
               type: "binop"
            }
         }

         const currentPrec = getPrecedence(binop.value)
         const peekedPrec = getPrecedence(peekedBinop.value)
         if (currentPrec < peekedPrec) {
            rhs = this.parseBinop(rhs)
         }

         current = {
            lhs: current,
            op: binop.value,
            rhs: rhs,
            type: "binop"
         }
      }
   }
   parseNumber = (): Expr => {
      let collectDigits = ""
      while (this.pos < this.commands.length) {
         const current = this.commands[this.pos]

         switch (current.type) {
            case CommandType.Number: {
               collectDigits += current.value.toString()
               this.pos++
               break
            }
            case CommandType.Operation: {
               if (current.value === OperationType.Decimal) {
                  collectDigits += operationToLogicalString(current.value)
                  this.pos++
               } else {
                  return {
                     value: Number(collectDigits),
                     type: "number",
                  }
               }
            }
         }
      }
      if (collectDigits === "") {
         return null
      }
      return {
         value: Number(collectDigits),
         type: "number",
      }
   }

   readonly commands: Command[]
   pos: number
}
const getPrecedence = (op: OperationType): number => {
   switch (op) {
      case OperationType.Percent: return 5
      case OperationType.Div: return 4
      case OperationType.Mul: return 4
      case OperationType.Sub: return 2
      case OperationType.Add: return 2
   }
   console.log(op)
   throw new ParseError("Not convertable to precedence")
}
const isBinop = (op: OperationType): boolean => {
   switch (op) {
      case OperationType.Percent: return false
      case OperationType.Div: return true
      case OperationType.Mul: return true
      case OperationType.Sub: return true
      case OperationType.Add: return true
   }
   throw new ParseError("Not convertable to binop")
}
const isPostfixUnop = (op: OperationType): boolean => {
   switch (op) {
      case OperationType.Percent: return true
      case OperationType.Div: return false
      case OperationType.Mul: return false
      case OperationType.Sub: return false
      case OperationType.Add: return false
   }
   throw new ParseError("Not convertable to postfix unop")
}
export class ParseError {
   constructor(message?: string) {
      this.message = message ?? "Parse Error"
   }
   message: string
}