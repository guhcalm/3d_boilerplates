import { createContext } from "react"

export const StateContext = createContext<any>(null)
export { default as StateProvider } from "./provider"
export { default as rootReducer, dispatchers, initialState } from "./reducers"
