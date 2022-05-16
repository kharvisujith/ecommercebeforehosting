import { debounce, TextField } from "@mui/material"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../store/configureStore"
import { setProductParams } from "./catalogSlice"

const ProductSearch =()=>{

    const {productParams} = useAppSelector(state =>state.catalog)
    const dispatch = useAppDispatch()
    const [searchTerm, setSearchTerm] = useState(productParams.searchItem)

    const debouncedSearch = debounce((event:any)=>{
        dispatch(setProductParams({searchItem:event.target.value}))
    },1000)

    return(
        <> 

             <TextField
                label = 'Search products'
                variant = 'outlined'
                fullWidth
                value={searchTerm || ''}
                onChange={(event:any) =>{
                   setSearchTerm(event.target.value)
                    debouncedSearch(event)
                }}

            />

        </>
    )
}

export default ProductSearch