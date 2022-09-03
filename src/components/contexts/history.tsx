import { createContext, PropsWithChildren, useContext, useState } from "react"

const HISTORY_CONTEXT = createContext<[string[], React.Dispatch<string[]>] | null>(null)
export const useHistory = () => {
   const ctx = useContext(HISTORY_CONTEXT)
   if (ctx === null) {
      throw "Command Context was null"
   }
   return ctx
}

const HistoryProvider: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
   const ctx = useState<string[]>([])
   return (
      <HISTORY_CONTEXT.Provider value={ctx}>
         {props.children}
      </HISTORY_CONTEXT.Provider>
   )
}

export default HistoryProvider