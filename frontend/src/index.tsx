import {createRoot} from 'react-dom/client'
import ReactDOM from 'react-dom'
import App from './App'
 


const rootDom = document.getElementById("root")



const root = createRoot(rootDom, { onUncaughtError(error, errorInfo) {
    console.log("unCaughtError")
    console.log(error)
    console.log(errorInfo)
}, onCaughtError(error, errorInfo) {
    console.log("caught error ")
},})

root.render(<App/>)








