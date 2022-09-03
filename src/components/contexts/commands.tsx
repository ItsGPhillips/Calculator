import { createContext, PropsWithChildren, useContext, useState } from "react"

export type OperationDisplayString = "AC" | "±" | "%" | "÷" | "×" | "−" | "+" | "=" | "."
export type OperationLogialString = "/" | "*" | "-" | "+" | "."
export enum OperationType {
   Clear, Invert, Percent, Div, Mul, Sub, Add, Equals, Decimal
}
export const operationToDisplayString = (op: OperationType): OperationDisplayString => {
   switch (op) {
      case OperationType.Clear: return "AC"
      case OperationType.Invert: return "±"
      case OperationType.Percent: return "%"
      case OperationType.Div: return "÷"
      case OperationType.Mul: return "×"
      case OperationType.Sub: return "−"
      case OperationType.Add: return "+"
      case OperationType.Equals: return "="
      case OperationType.Decimal: return "."
   }
   throw "Not convertable to display string"
}
export const operationToLogicalString = (op: OperationType): OperationLogialString => {
   switch (op) {
      case OperationType.Div: return "/"
      case OperationType.Mul: return "*"
      case OperationType.Sub: return "-"
      case OperationType.Add: return "+"
      case OperationType.Decimal: return "."
   }
   throw "Not convertable to logical string"
}

export interface Command {
   type: CommandType,
   value: number | OperationType,
}
export enum CommandType {
   Operation,
   Number,
}

const COMMAND_QUEUE_CONTEXT = createContext<[Command[], React.Dispatch<Command[]>] | null>(null)
export const useCommandQueue = () => {
   const ctx = useContext(COMMAND_QUEUE_CONTEXT)
   if (ctx === null) {
      throw "Command Context was null"
   }
   return ctx
}

const CommandQueueProvider: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
   const ctx = useState<Command[]>([])
   return (
      <COMMAND_QUEUE_CONTEXT.Provider value={ctx}>
         {props.children}
      </COMMAND_QUEUE_CONTEXT.Provider>
   )
}

export default CommandQueueProvider

// translates the command queue into a string
export const translateCommandQueue = (
   commandQueue: Command[],
   options: {
      operationConverter: (op: OperationType) => string
      applyPadding?: boolean
   }
): string => {
   let output = ""
   commandQueue.forEach(command => {
      switch (command.type) {
         case CommandType.Number: {
            output += command.value.toString()
            break
         }
         case CommandType.Operation: {
            let stringifed = options.operationConverter(command.value)
            if (command.value === OperationType.Decimal || command.value === OperationType.Percent) {
               // Decimal commands are part of the number
               output += stringifed
            } else {
               output += options.applyPadding ? ` ${stringifed} ` : stringifed
            }
            break
         }
      }
   })
   return output
}
