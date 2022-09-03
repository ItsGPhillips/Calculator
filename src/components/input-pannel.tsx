import styled from "styled-components"
import {
   Command, CommandType, operationToDisplayString, operationToLogicalString,
   OperationType, translateCommandQueue, useCommandQueue
} from "./contexts/commands";
import { evaluate, EvaluatorError } from "../evaluator/evaluator";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useHistory } from "./contexts/history";

enum ButtonType {
   Number,
   Operator,
   Misc
}

interface InvokeArgs {
   commands: Command[],
   setCommands: React.Dispatch<Command[]>,
   history: string[],
   setHistory: React.Dispatch<string[]>,
}

interface ButtonDef {
   display: string,
   invoke: (args: InvokeArgs) => void;
   type: ButtonType,
}

const btnDefNumberHelper = (value: number): ButtonDef => {
   return {
      display: value.toString(),
      invoke: (args) => {
         // It is always valid to push a number command
         args.setCommands([...args.commands, {
            value: value,
            type: CommandType.Number,
         }])
      },
      type: ButtonType.Number,
   }
}

const btnDefOpHelper = (op: OperationType, buttonType?: ButtonType): ButtonDef => {
   let display = operationToDisplayString(op)
   return {
      display,
      invoke: (args) => {
         const lastCommand = args.commands[args.commands.length - 1]
         if (lastCommand === undefined) {
            // The first command cannot be an operation
            return
         }
         if (lastCommand.type === CommandType.Operation) {
            if (!(lastCommand.value === OperationType.Percent && op !== OperationType.Percent)) {
               // If the last command was an operation replace it with this operation
               args.commands.pop()
            }
         }
         // The last command was a number therefore we can push this operation to the commands
         args.setCommands([...args.commands, {
            value: op,
            type: CommandType.Operation,
         }])
      },
      type: buttonType ?? ButtonType.Operator,
   }
}

const BUTTONS: ButtonDef[][] = [
   [
      {
         display: operationToDisplayString(OperationType.Clear),
         invoke: (args) => {
            if(args.commands.length === 0) {
               args.setHistory([])
            }
            args.setCommands([])
         },
         type: ButtonType.Misc,
      },
      {
         display: operationToDisplayString(OperationType.Invert),
         invoke: (args) => {
            const value = Number(translateCommandQueue(args.commands, {
               operationConverter: operationToLogicalString,
               applyPadding: false,
            }))
            if (!isNaN(value)) {
               args.setCommands([{
                  type: CommandType.Number,
                  value: -Number(value)
               }])
            }
         },
         type: ButtonType.Misc,
      },
      btnDefOpHelper(OperationType.Percent, ButtonType.Misc),
      btnDefOpHelper(OperationType.Div),
   ],
   [
      // -----
      btnDefNumberHelper(7),
      btnDefNumberHelper(8),
      btnDefNumberHelper(9),
      btnDefOpHelper(OperationType.Mul),
   ],
   [
      // -----
      btnDefNumberHelper(4),
      btnDefNumberHelper(5),
      btnDefNumberHelper(6),
      btnDefOpHelper(OperationType.Sub),
   ],
   [
      // -----
      btnDefNumberHelper(1),
      btnDefNumberHelper(2),
      btnDefNumberHelper(3),
      btnDefOpHelper(OperationType.Add),
   ],
   [
      // ["1", "2", "3"]
      // -----
      btnDefNumberHelper(0),
      btnDefOpHelper(OperationType.Decimal, ButtonType.Number),
      {
         display: operationToDisplayString(OperationType.Equals),
         invoke: (args) => {
            try {
               const current = translateCommandQueue(args.commands, {
                  operationConverter: operationToDisplayString,
                  applyPadding: true,
               }).slice(0, 10)
               args.setCommands([{
                  type: CommandType.Number,
                  value: Number(evaluate(args.commands))
               }])
               args.setHistory([current, ...args.history.slice(0, 2)])
            } catch (err) {
               if (!(err instanceof EvaluatorError)) {
                  throw err
               }
            }
         },
         type: ButtonType.Operator,
      }
   ]
]

const Button = styled(motion.button) <{ buttontype: ButtonType }>`
   cursor: pointer;
   width: 100%;
   height: 100%;
   font-size: 2em;
   border: 1px solid #121212;
   border-radius: var(--border-radius);
   background-color: ${(props) => {
      switch (props.buttontype) {
         case ButtonType.Number: return "#3b3b3b"
         case ButtonType.Operator: return "#ef9b13"
         case ButtonType.Misc: return "#c3c3c3"
      }
   }};
   color: ${(props) => {
      switch (props.buttontype) {
         case ButtonType.Number: return "#e7e7e7"
         case ButtonType.Operator: return "#dddddd"
         case ButtonType.Misc: return "#232323"
      }
   }};
`
const ButtonTable = styled.table`
   border-spacing: 0px;
   margin-top: 0.4em;
   & td {
      width: 60px;
      height: 60px;
   }
`
const InputPannel: React.FC = () => {
   const [commands, setCommands] = useCommandQueue();
   const [history, setHistory] = useHistory();

   const audioClip = useRef<HTMLAudioElement | null>(null)
   useEffect(() => {
      audioClip.current = new Audio("/pop.mp3")
   }, [])

   const useCreateButton = (row: number, col: number, colspan: number = 1) => {
      const button = BUTTONS[row][col]
      return (
         <td colSpan={colspan}>
            <Button
               whileTap={{ scale: [1, 0.95, 1] }}
               transition={{ ease: "linear", duration: 0.2 }}
               buttontype={button.type}
               onClick={() => {
                  const audio = audioClip?.current;
                  if (audio) {
                     audio.pause()
                     audio.currentTime = 0
                     audio.play()
                  }
                  button.invoke({
                     commands,
                     setCommands,
                     history,
                     setHistory,
                  })
               }}>
               {button.display}
            </Button>
         </td>
      )
   }

   return (
      <ButtonTable>
         <tbody>
            <tr>
               {useCreateButton(0, 0)}
               {useCreateButton(0, 1)}
               {useCreateButton(0, 2)}
               {useCreateButton(0, 3)}
            </tr>
            <tr>
               {useCreateButton(1, 0)}
               {useCreateButton(1, 1)}
               {useCreateButton(1, 2)}
               {useCreateButton(1, 3)}
            </tr>
            <tr>
               {useCreateButton(2, 0)}
               {useCreateButton(2, 1)}
               {useCreateButton(2, 2)}
               {useCreateButton(2, 3)}
            </tr>
            <tr>
               {useCreateButton(3, 0)}
               {useCreateButton(3, 1)}
               {useCreateButton(3, 2)}
               {useCreateButton(3, 3)}
            </tr>
            <tr>
               {useCreateButton(4, 0, 2)}
               {useCreateButton(4, 1)}
               {useCreateButton(4, 2)}
            </tr>
         </tbody>
      </ButtonTable>
   )
}
export default InputPannel
