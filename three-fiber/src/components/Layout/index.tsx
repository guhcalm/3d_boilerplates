import { ReactNode } from "react"
import { useCustomContext } from "../../hooks"
import Container from "./styles"

export default ({ children: App }: { children: ReactNode }) => {
  const { state } = useCustomContext()
  return (
    <Container 
      palette={state.theme.palette} 
      data-layout=""
    >
      {App}
    </Container>
  )
}
