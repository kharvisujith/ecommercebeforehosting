import { Avatar, Box,  Container, Grid, Paper, TextField, Typography } from "@mui/material"
import LockIcon from '@mui/icons-material/Lock';
import { Link, useHistory, useLocation } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { signInUser } from "./accountSlice";
import { useAppDispatch } from "../../store/configureStore";
import { FieldValues, useForm } from "react-hook-form";

const Login = () =>{

    const history = useHistory()
    const location = useLocation()
    const dispatch  = useAppDispatch()

    const {register, handleSubmit, formState:{isSubmitting, errors,isValid}} = useForm({
        mode:'all'
    })

    const submitForm = async (data:FieldValues)=>{
        try{
            await dispatch(signInUser(data))
            // history.push(location.pathname || '/catalog')
            history.push('/catalog')
        }catch(error :any){
            console.log(error)
        }
       
    }

    return (
        <Container component={Paper} 
        maxWidth="sm"
        sx ={{p:4}} >
            <Box sx={{ display:'flex', alignItems:'center', flexDirection:'column'}} >
                <Avatar sx={{m:1, bgcolor:'secondary.main'}}>     
                <LockIcon/>  
                </Avatar>
                <Typography>
                    Sign in
                </Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{mt:1}}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label = "Username"
                    {...register('username', {required:"Username is required"})}
                    error ={!!errors.username}
                    helperText = {errors?.username?.message}
                 />
                 <TextField
                    margin="normal"
                    required
                    fullWidth
                    label = "password"
                    type="password"
                    {...register('password', {required:"Password is required"})}
                    error={!!errors.password}
                    helperText= {errors?.password?.message}
                   
                 />
                 <LoadingButton 
                 disabled={!isValid}
                 loading={isSubmitting} 
                 type="submit" fullWidth variant="contained" sx={{mt:3, mb:2}}>
                     Sign In
                 </LoadingButton>
                 <Grid container>
                     <Grid item>
                         <Link to="/register" >
                             {
                                 "Dont have an account? Sign Up"
                             }
                             
                         </Link>
                     </Grid>
                 </Grid>

            </Box>


        </Container>
    )
}
export default Login 