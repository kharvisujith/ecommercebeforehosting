
import { Avatar, Box, Button, Container, Grid, Paper, TextField, Typography } from "@mui/material"
import LockIcon from '@mui/icons-material/Lock';
import { Link, useHistory } from "react-router-dom";
import agent from "../../api/agent";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch } from "../../store/configureStore";
//import { signInUser } from "./accountSlice";
import { toast } from "react-toastify";
const Register = () =>{


    const history = useHistory()
    const dispatch  = useAppDispatch()
 
    const {register, handleSubmit,setError, formState:{isSubmitting, errors,isValid}} = useForm({
        mode:'all'
    })
    const handleApiError = (errors:any)=> {
        console.log(errors)
        if(errors){
            errors.forEach((error:string) => {
                if(error.includes('Password')){
                    setError('password', {message:error})
                }
                else if(error.includes('Email')){
                    setError('email', {message:error})
                }
                 if(error.includes("Username")){
                    setError('username', {message:error})
                }
                
            })
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
                    Register
                </Typography>
            </Box>
            <Box component="form" 
                onSubmit={handleSubmit((data) => agent.account.register(data)
                    .then(()=> {
                        toast.success('Registration successful - you can now login')
                        history.push('/login')
                    })
                    .catch(error => handleApiError(error)))}
                 noValidate sx={{mt:1}}>
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
                    label = "Email"
                    {...register('email',
                     {
                         required:"Email is required",
                         pattern: {
                             value:/^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
                             message:'Not a valid email address'
                         }
                        })}
                    error ={!!errors.email}
                    helperText = {errors?.email?.message}
                 />
                
                 <TextField
                    margin="normal"
                    required
                    fullWidth
                    label = "Password"
                    type="password"
                    {...register('password',
                     {
                         required:"Password is required",
                         pattern:{
                             value:/(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                             message:'Not a valid password'
                             
                         }
                        })}
                    error={!!errors.password}
                    helperText= {errors?.password?.message}
                   
                 />

                 <LoadingButton 
                 disabled={!isValid}
                 loading={isSubmitting} 
                 type="submit" fullWidth variant="contained" sx={{mt:3, mb:2}}>
                     Register
                 </LoadingButton>
                 <Grid container>
                     <Grid item>
                         <Link to="/register" >
                             {
                                 "Already have an account? Login "
                             }
                             
                         </Link>
                     </Grid>
                 </Grid>

            </Box>


        </Container>
    )
}
export default Register 