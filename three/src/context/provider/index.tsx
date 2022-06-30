import { ReactNode, useReducer } from "react"
import { StateContext, rootReducer, initialState } from ".."

export default ({ children }: { children: ReactNode }) => (
  <StateContext.Provider value={useReducer(rootReducer, initialState)}>
    {children}
  </StateContext.Provider>
)
