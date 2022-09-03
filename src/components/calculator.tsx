import { useEffect, useState } from "react";
import styled, { css } from "styled-components"
import CommandQueueProvider, {
   operationToDisplayString, useCommandQueue, translateCommandQueue
} from "./contexts/commands";
import HistoryProvider, { useHistory } from "./contexts/history";
import InputPannel from "./input-pannel";

// converts the command queue into a human readable form
const useDisplayString = (): string => {
   const [commandQueue] = useCommandQueue()
   const [displayString, setDisplayString] = useState<string>("")

   // TODO(George): gross hack to make array equality work, should I use useMemo()
   const stringifed = JSON.stringify(commandQueue);

   useEffect(() => {
      setDisplayString(translateCommandQueue(commandQueue, {
         operationConverter: operationToDisplayString,
         applyPadding: true
      }).slice(0, 10))
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [stringifed])

   return displayString
}
const HistorySpan = styled.span`
   color: #cfcfcf;
   font-weight: 300;
   font-size: 0.9em;

   &:hover {
      cursor: pointer;
      color: #a4fcff;
   }
`
const ActiveArea = styled.div`
   font-size: 1.8em;
`
const DisplayArea = styled.div`
   background-color: #101245;
   border: solid 1px #262626;
   width: 100%;
   height: 100px;
   padding: 0.4em;
   color: white;
   border-radius: var(--border-radius);

   display: flex;
   flex-direction: column;
   justify-content: flex-end;
   align-items: flex-end;
   text-overflow: ellipsis;
   overflow: hidden;
`
const Display: React.FC = () => {
   const [history] = useHistory();
   const displayString = useDisplayString()
   return (
      <DisplayArea>
         {history.reverse().map((t, idx) => (<HistorySpan key={idx}>{t}</HistorySpan>))}
         <ActiveArea>{displayString === "" ? "0" : displayString}</ActiveArea>
      </DisplayArea>
   )
}

const CalculatorBody = styled.div`
   background-color: #0b0d16;
   border-radius: var(--border-radius);
   border: solid #4e4e4e 1px;
   display: flex;
   width: 256px;
   flex-direction: column;
   justify-content: center;
   padding: 0.5em;
`
const Calculator: React.FC = () => {
   return (
      <HistoryProvider>
         <CommandQueueProvider>
            <CalculatorBody>
               <Display />
               <InputPannel />
            </CalculatorBody>
         </CommandQueueProvider>
      </HistoryProvider>
   )
}

export default Calculator