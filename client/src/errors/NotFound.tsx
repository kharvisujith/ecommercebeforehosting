import { Container, Paper, Typography,Divider, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = ()=>{

    return(
        <>
        <Container component={Paper} sx={{height:400}}>
            <Typography variant="h4" sx={{textTransform:'capitalize'}}>OOpss!! We could not find what you are looking for!!</Typography>
            <Button fullWidth component={Link} to='/catalog'>Go back to Shop</Button>
            <Divider />
        </Container>
        
        </>
    )
}

export default NotFound