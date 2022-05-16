import { Basket } from "../../models/basket";
import { useState } from 'react';
import { useEffect } from 'react';
import agent from './../../api/agent';
import LoadingComponent from "../../Layouts/LoadingComponent";
import { Box, Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Delete, FlashOnRounded, Remove } from "@mui/icons-material";
import { useStoreContext } from "../../context/StoreContext";
import { LoadingButton } from "@mui/lab";
import BasketSummary from "./BasketSummary";
import { grid } from "@mui/system";
import { Link } from "react-router-dom";
import {  addBasketItemAsync, removeBasketItemAsync, setBasket } from "./basketSlice";
import BasketTable from "./BasketTable";
import {useAppSelector, useAppDispatch} from "../../store/configureStore"



const BasketPage = ()=> {

    const dispatch = useAppDispatch()
    const {basket, status} = useAppSelector((state)=> state.basket)

    if(!basket) return <Typography variant='h3'>Your basket is empty</Typography>

    return(
        <>
        
        <BasketTable items ={basket.items} />
        <Grid container>
            <Grid item xs={6}>
            </Grid>
            <Grid item xs={6}>
                <BasketSummary/>
                <Button 
                variant='contained'
                fullWidth
                component={Link}
                to={'/checkout'}
                > Check Out</Button>
            </Grid>
        </Grid>

        </>
    )
    

}

export default BasketPage