import { Divider, Grid, TableContainer,Table,TableBody,TableRow,TableCell, Typography, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import LoadingComponent from "../../Layouts/LoadingComponent"
import { LoadingButton } from "@mui/lab"
import { useAppDispatch, useAppSelector } from "../../store/configureStore"
import {  addBasketItemAsync, removeBasketItemAsync, setBasket } from "../basket/basketSlice"
import NotFound from "../../errors/NotFound"
import { fetchProductAsync, productSelectors } from "../catalog/catalogSlice"

const Productdetials = ()=>{
    const {basket,status} = useAppSelector((state)=> state.basket)
    const dispatch = useAppDispatch()
    const {id} = useParams<{id:string}>()

    const product = useAppSelector(state => productSelectors.selectById(state, id))

    const {status: productStatus} = useAppSelector(state=> state.catalog)
    


   
   
    const item = basket?.items.find(i => i.productId === product?.id) 
    const [quantity, setQuantity] = useState(0)


    const handleInputChange = (event: any)=> {
        if(event.target.value >= 0){
            setQuantity(parseInt(event.target.value))

        }
    }

    const handleUpdateCart = ()=>{
        if(!item || quantity > item.quantity){
            const updatedQuantity = item ? quantity - item?.quantity: quantity
            dispatch(addBasketItemAsync({productId:product?.id!, quantity: updatedQuantity}))
           
        }
        else{
            const updatedQuantity = item.quantity - quantity
            dispatch(removeBasketItemAsync({productId:product?.id!, quantity: updatedQuantity}))
            
        }
    }


    useEffect(()=>{
      
            if(item) setQuantity(item.quantity)
            if(!product) dispatch(fetchProductAsync(parseInt(id)))

    },[id,item, dispatch, product])

    if(productStatus.includes('pending')) return <LoadingComponent />

    if(!product) return <NotFound />

    return(
        <>
        <Grid container>
            <Grid item sm={6} width='100%' display='flex' justifyContent='center'  >
                <img src={product?.pictureUrl} alt={product?.name} style={{height:400}}  />
            </Grid>
            <Grid item sm={6}>
                <Typography variant='h4' color='primary.main' fontWeight='bold'>{product?.name.toUpperCase()}</Typography>
                <Divider />
            
                <Typography variant='h5' color='primary.main' fontWeight='bold' sx={{my:2}}>${product?.price?.toFixed(2)}</Typography>
                <Divider />

                <TableContainer>
                    <Table>
                        <TableBody sx={{textTransform:'capitalize'}}>
                            <TableRow>
                                <TableCell>
                                    Name
                                </TableCell>
                                <TableCell>
                                    {product?.name}
                                </TableCell>
                            </TableRow>
                        
                            <TableRow>
                                <TableCell>
                                    Description
                                </TableCell>
                                <TableCell>
                                    {product?.description}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Type 
                                </TableCell>
                                <TableCell>
                                    {product?.type} 
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Brand 
                                </TableCell>
                                <TableCell>
                                    {product?.brand} 
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    In Stock
                                </TableCell>
                                <TableCell>
                                    {product?.quantityInStock}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
        <Grid container spacing={2}>
            <Grid item xs={6}></Grid>
            <Grid item>
                <TextField
                    variant='outlined'
                    type='number'
                    label= 'Quantity in Cart'
                    fullWidth
                    value={quantity}
                    onChange ={handleInputChange}
                /> 
            </Grid>
            <Grid item>
            <LoadingButton
             disabled={item?.quantity === quantity ||!item && quantity===0}
            sx={{
                height:'55px'
            }}
            color='primary'
            size='large'
            variant = 'contained'
            fullWidth
            loading={status.includes('pending')}
            onClick={handleUpdateCart}
           
            
            >
                {item? 'Update Quantity' : 'Add to cart'}
                </LoadingButton>
            </Grid>   
        </Grid>
       
        
        </>
    )
}

export default Productdetials