import ProductList from "./ProductList";
import { Products } from "../../models/Products"
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import agent from "../../api/agent";
import LoadingComponent from "../../Layouts/LoadingComponent";
import { useAppSelector, useAppDispatch } from "../../store/configureStore";
import { fetchfiltersAsync, fetchProductsAsync, productSelectors, setPageNumber, setProductParams } from "./catalogSlice";
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup,  Grid, Pagination, Paper, Radio , RadioGroup,Typography} from "@mui/material";
import { TextField } from "@material-ui/core";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../components/RadioButtonGroup";
import CheckBoxButtons from "../../components/CheckBoxButtons";
import AppPagination from "../../components/AppPagination";



const sortOptions = [
    {value:'name', label:'Alphabetical'},
    {value:'price', label:'Low to High'},
    {value:'piceDec', label:'High to Low'}
]


const Catalog = ()=>{
    

          const products = useAppSelector(productSelectors.selectAll)

          const dispatch = useAppDispatch()
          const {productsLoaded, status, filtersLoaded, types, brands, productParams, metaData} = useAppSelector(state=> state.catalog)



    useEffect(()=>{

        if(!productsLoaded) dispatch( fetchProductsAsync())
        console.log("productsloaded useeffect is called")  

    },[productsLoaded,dispatch])

    useEffect(()=>{
        if(!filtersLoaded) dispatch(fetchfiltersAsync())

    },[filtersLoaded, dispatch])


     if(!filtersLoaded) return <LoadingComponent/>


    return(
        <>
            <Grid container columnSpacing={4}>
                <Grid item xs={3}>
                    <Paper sx={{mb:2}}>
                       <ProductSearch/>
                    </Paper>    
                    <Paper sx={{mb:2, p:2}}>
                        <RadioButtonGroup
                        selectedValue={productParams.orderBy}
                        options={sortOptions}
                        onChange={(e)=> dispatch(setProductParams({orderBy:e.target.value}))}

                        />
               
                    </Paper>  

                    <Paper>
                       
                        <CheckBoxButtons
                            items = {types}
                            checked = {productParams.types}
                            onChange = {(items: string[]) =>dispatch(setProductParams({types:items}))}
                            />
        
                    </Paper>

                    <Paper>
                        <CheckBoxButtons
                            items = {brands}
                            checked = {productParams.brands}
                            onChange = {(items:string[])=> dispatch(setProductParams({brands: items}))}
                         />

                    </Paper>
                      
                        
                </Grid>
                <Grid item xs={9}>
                    <ProductList products={products} />
                </Grid>
            

           
            <Grid item xs={3}>


            </Grid>

            <Grid item xs={9} sx={{mb:2}}>
            {metaData &&
                <AppPagination
                    metaData={metaData}
                    onPageChange = {(page:number)=> dispatch(setPageNumber({pageNumber:page}))}
                />
            }

            </Grid>

        </Grid>
           

        </>
        

    )
}
export default Catalog