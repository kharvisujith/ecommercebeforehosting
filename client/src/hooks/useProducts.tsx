import { useEffect } from "react"
import { productSelectors, fetchProductsAsync, fetchfiltersAsync } from "../Features/catalog/catalogSlice"
import { useAppDispatch, useAppSelector } from "../store/configureStore"

export default function useProducts(){

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


return {
    products, 
    productsLoaded, 
    filtersLoaded,
    brands,
    types,
    metaData

}

}