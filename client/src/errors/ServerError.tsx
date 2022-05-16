import { Button, Container, Divider, Paper, Typography } from "@mui/material"
import { useHistory, useLocation } from "react-router-dom"

const ServerError = ()=>{
     
    const history = useHistory()
    const {state}= useLocation<any>();

    return(
        <>
       
       <Container component={Paper} >
           { state.error? (
               <>
                <Typography variant='h5'>Server Error</Typography>
                <Divider/>
                <Typography variant='body1'>{state.error.detail}</Typography>
                </>
           ) : (
               <Typography variant="h5">Server error</Typography>
           )

           }
           <Divider/>
           <Button fullWidth onClick={()=>history.push('/catalog')}>Go back</Button>
           
          
        </Container>
   
        </>
    )
}
export default ServerError