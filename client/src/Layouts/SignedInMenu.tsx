import { Button, Fade, Menu,  MenuItem } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { signOut } from "../Features/account/accountSlice";
import { clearBasket } from "../Features/basket/basketSlice";
import { useAppDispatch, useAppSelector } from "../store/configureStore";

const SignedInMenu = ()=>{

const dispatch= useAppDispatch()
const {user}  = useAppSelector(state => state.account)

const [anchorEl, setAnchorEl] = useState(null);
const open = Boolean(anchorEl);
const handleClick = (event:any) => {
    console.log(event.currentTarget)
    setAnchorEl(event.currentTarget);
  };

const handleClose = () => {
    setAnchorEl(null);
};

  return (
    <>
      <Button 
       color='inherit'
       sx={{typography:'h6'}}
       onClick={handleClick}
       >
        {user?.email}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem component={Link} to='/orders'>My Orders</MenuItem>
        <MenuItem onClick={()=>{

         dispatch(signOut())
         dispatch(clearBasket())
        }}
        >Logout</MenuItem>
      </Menu>
    </>
  );

    
}
export default SignedInMenu