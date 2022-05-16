import { LoadingButton } from "@mui/lab";
import {Card, CardMedia,CardContent,Typography,CardActions,CardHeader,Button, Avatar} from "@mui/material"
import { useState } from "react";
import { NavLink,Link } from "react-router-dom"
import { useStoreContext } from "../../context/StoreContext";
import { Products } from "../../models/Products"
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { currencyFormat } from "../../util/util";
import { addBasketItemAsync, setBasket } from "../basket/basketSlice";
import agent from './../../api/agent';

export interface Props{
    product:Products
}



const ProductCard = ({product}:Props)=>{

  const dispatch = useAppDispatch()
  const {status} = useAppSelector((state) =>state.basket)
  
    return(
    <Card >

      <CardHeader 
            avatar={
                <Avatar >
                    {product.name.charAt(0).toUpperCase()}
                </Avatar>
            }
            title={product.name}
            titleTypographyProps={{
                sx:{fontWeight:'bold',color:'primary.main', textTransform:'capitalize'}
            }}
        
        />



      <CardMedia 
        sx={{height:140, backgroundSize:"contain",backgroundColor:"primary.main"}}
        image={product.pictureUrl}
        />


      <CardContent>
        <Typography gutterBottom variant="h5">
          {currencyFormat(product.price!)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {product.brand}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton
        loading = {status === ('pendingAddItem' + product.id)}
        onClick={()=> dispatch(addBasketItemAsync({productId:product.id})) } 
        size = "small" 
        sx={{fontWeight:'bold'}}

        >Add to Cart
        </LoadingButton>
        <Button component={Link} to={`/catalog/${product.id}`}  size="small" sx={{fontWeight:'bold'}}>View</Button>
      </CardActions>
    </Card>
    )
}
export default ProductCard