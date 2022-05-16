import { Button } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../store/configureStore"
import { decrement, increment } from "./counterSlice"


const Contact = ()=>{

    const state = useAppSelector((state)=> state.counter)
    const dispatch = useAppDispatch() 

    return(
        <>

        <h1>Contacts</h1>
        <h1>{state.data}</h1>
        <h1>{state.title}</h1>

        <Button onClick={ ()=> dispatch(increment(1))}> ADD</Button>
        <Button onClick={ ()=> dispatch(decrement(1))}> sub</Button>

        </>

    )
}

export default Contact


