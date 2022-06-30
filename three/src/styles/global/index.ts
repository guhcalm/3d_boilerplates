import { createGlobalStyle } from "styled-components"

export default createGlobalStyle`
    *,
    *::before,
    *::after {
        margin: 0;
        padding: 0;
        border: 0;
        box-sizing: border-box;
    }

    ::-webkit-scrollbar {
        width: 0px;
    }

    body,
    #root {
        width: 100vw;
        height: 100vh;
        max-width: 100vw;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

`
