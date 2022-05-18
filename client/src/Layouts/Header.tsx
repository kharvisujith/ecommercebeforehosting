
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { AppBar, ListItem, List,Toolbar, Typography,IconButton,Badge } from "@mui/material"
import { Switch } from "@mui/material"
import { Box } from "@mui/system"
import { Link, NavLink } from "react-router-dom"
import { useStoreContext } from '../context/StoreContext'
import { useAppSelector } from '../store/configureStore'
import SignedInMenu from './SignedInMenu'


export interface Props{
    setMode: () => void
}

const midlinks = [
    {title:'catalog',path:'/catalog'},
    {title:'about', path:'/about'},
    {title:'contact', path:'/contact'}
]

const rightlinks = [
    {title:'Login', path:'/login'},
    {title:'register',path:'/register'}
]

const Header = ({setMode}:Props)=>{

    const {user} = useAppSelector(state => state.account)

    const {basket} = useAppSelector((state)=> state.basket)
    const itemCount = basket?.items.reduce((prevValue, curValue) => prevValue+ curValue.quantity, 0)

    return(

        <>
            <AppBar position='static' sx={{mb:5}}>
                <Toolbar sx={{display:'flex', justifyContent:'space-around', alignItems:'center'}} >
                    <Box display='flex' alignItems='center'>
                        <Typography variant="h4"> 
                            My-sToRe
                        </Typography>
                        <Switch
                            onChange={setMode}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />

                    </Box>

                    <List sx={{display:'flex'}}>
                        {
                        midlinks.map(({title,path})=>{
                            return(
                                <ListItem 
                                    component={NavLink}
                                    to={path} 
                                    key={path}
                                    sx={{
                                        color:'inherit',
                                        typography:'h6',
                                        '&:hover' : {
                                            color:'grey.500'
                                        },
                                        '&.active':{
                                            color:'text.secondary'
                                        }
                                    
                                    }} 
                                >
                                    {title.toUpperCase()}
                                </ListItem>
                            )
                            })}

                            {user && 

                                <ListItem 
                                    component={NavLink}
                                    to={'/inventory'} 
                                    sx={{
                                        color:'inherit',
                                        typography:'h6',
                                        '&:hover' : {
                                            color:'grey.500'
                                        },
                                        '&.active':{
                                            color:'text.secondary'
                                        }
                                    
                                    }} 
                                >
                                    INVENTORY
                                </ListItem>
                                }

                            
                        
                        
                    </List>
                

                    <Box display='flex'>
                        <IconButton component={Link} to={'/basket'} color='inherit'>
                        <Badge badgeContent={itemCount} color='secondary' >
                        <ShoppingCartIcon/>
                        </Badge>
                        </IconButton>

                        {user ?( <SignedInMenu />)
                        : (
                            <List sx={{display:'flex'}}>
                            {
                                rightlinks.map(({title,path})=>{
                                    return(
                                    <ListItem 
                                    component = {NavLink}
                                    to={path}
                                    key={path}
                                    sx={{color:'inherit',
                                    typography:'h6',
                                    '&:hover' : {
                                        color:'grey.500'
                                    },
                                    '&.active':{
                                        color:'text.secondary'
                                    }
                                    }}
                                    >
                                        {title.toUpperCase()}
                                    </ListItem>
                                    )

                                })
                            }
                        
                        </List>
                        )
                    }
                            
                    </Box> 
                </Toolbar>
            </AppBar>
        </>
    )
}
export default Header