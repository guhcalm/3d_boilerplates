import { useContext } from "react"
import { StateContext, dispatchers } from "../../context"
import { StateInterface } from "../../interfaces"

export default () => {
  const [state, dispatch] = useContext(StateContext)
  return {
    state: state as StateInterface,
    dispatch,
    actions: dispatchers
  }
}
