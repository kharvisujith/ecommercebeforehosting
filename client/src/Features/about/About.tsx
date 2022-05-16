import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem } from "@mui/material"
import agent from '../../api/agent'
import { useState } from "react"

const About = ()=>{

    const [validationErrors , setValidationErrors] = useState<String[]>([])

    const getvalidationerror = ()=>{
        agent.testErrors.getvalidationerror()
        .then(()=> console.log("should not see this"))
        .catch(error => setValidationErrors(error))
    }

    return(
        <>
            <Container>
                <ButtonGroup fullWidth>
                    <Button variant="contained" onClick={agent.testErrors.get400error}>
                        400Error
                    </Button>
                    <Button variant="contained" onClick = {agent.testErrors.get401error}>
                        401error
                    </Button>
                    <Button variant="contained" onClick = {agent.testErrors.get404error}>
                        404error
                    </Button>
                    <Button variant="contained" onClick={agent.testErrors.get500error}>
                        500error
                    </Button>
                    <Button variant="contained" onClick ={getvalidationerror}>
                        Testvalidationerror
                    </Button>
                </ButtonGroup>

                {
                    validationErrors.length >0 && 
                    <Alert severity="error">
                        <AlertTitle>Validation Errors</AlertTitle>
                        <List>
                            {validationErrors.map((cur, ind)=>{
                                return(
                                    <ListItem key={ind}>
                                        {cur}
                                    </ListItem>
                                )
                            })
                        }
                        </List>


                    </Alert>

                }
                
            </Container>

        </>
    )
}

export default About