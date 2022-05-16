import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../api/agent";
import { MetaData } from "../../models/pagination";
import { ProductParams, Products } from "../../models/Products";
import { RootState } from "../../store/configureStore";

interface CatalogState{
    productsLoaded:boolean
    filtersLoaded:boolean
    status:string
    brands:string[]
    types:string[]
    productParams:ProductParams
    metaData: MetaData| null
}

const productsAdapter = createEntityAdapter<Products>()

const getAxiosParams = (productParams:ProductParams)=>{
    const params =new URLSearchParams();

    params.append('OrderBy', productParams.orderBy.toString())
    if(productParams.searchItem) params.append('SearchItem', productParams.searchItem.toString())
    params.append('PageNumber', productParams.pageNumber.toString())
    params.append('PageSize', productParams.pageSize.toString())
    if(productParams.brands.length>0) params.append('brands', productParams.brands?.toString())
    if(productParams.types.length>0) params.append('types', productParams.types?.toString())

    return params

    
}

export const fetchProductsAsync = createAsyncThunk<Products[], void,{state:RootState}>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) =>{
         const params = getAxiosParams(thunkAPI.getState().catalog.productParams)
        console.log("parms is"+ " " +params)
        try{
            const response = await agent.catalog.list(params)
            thunkAPI.dispatch(setMetaData(response.metaData))
            return response.items
        } catch(error:any){
            return thunkAPI.rejectWithValue({error:error.data})
        }
    }
)


export const fetchProductAsync = createAsyncThunk<Products, number>(
    'catalog/fetchProductAsync',
    async (productId, thunkAPI) =>{
        try{
            return await agent.catalog.details(productId)
        } catch(error:any){
            return thunkAPI.rejectWithValue({error:error.data})
        }
    }
)
export const fetchfiltersAsync = createAsyncThunk(
"catalog/fetchfiltersAsync",
async(_, thunkAPI)=>{
    try{
        return await agent.catalog.fetchfilters()
    } catch(error:any){
        return thunkAPI.rejectWithValue({error: error.data})
    }
}

)

const initParams= ()=>{
    return {
        
        pageNumber:1,
        pageSize:6,
        orderBy:'name',
        types:[],
        brands:[]
    }
}

export const catalogSlice = createSlice({
    name:'catalog',
    initialState : productsAdapter.getInitialState<CatalogState>({
       productsLoaded: false,
       filtersLoaded: false,
       status:'idle' , 
       types :[],
       brands:[],
       productParams:initParams(),
       metaData: null
    }),
    reducers: {
        setProductParams : (state, action) =>{
            state.productsLoaded = false;
            state.productParams = {...state.productParams, ...action.payload, pageNumber:1}

        },
        setPageNumber : (state, action) =>{
            state.productsLoaded = false
            state.productParams = {...state.productParams, ...action.payload}
        },
        setMetaData : (state, action) =>{
            state.metaData = action.payload

        },

        resetProductParams:(state)=>{
            state.productParams = initParams();
        }


    },
    extraReducers:(builder => {
        builder.addCase(fetchProductsAsync.pending, (state =>{
            state.status = "pendingFetchProducts"
        }))
        builder.addCase(fetchProductsAsync.fulfilled,(state,action)=>{
            productsAdapter.setAll(state, action.payload)
            state.status ='idle'
            state.productsLoaded = true
        })

        builder.addCase(fetchProductsAsync.rejected, (state)=>{
            state.status = 'idle'
        })

        builder.addCase(fetchProductAsync.pending, (state)=>{
            state.status = 'pendingFetchProduct'
        })
        builder.addCase(fetchProductAsync.fulfilled , (state, action)=>{
            productsAdapter.upsertOne(state, action.payload)
            state.status ='idle'
        })
        builder.addCase(fetchProductAsync.rejected, (state,action)=>{
            state.status = 'idle'
        })

        builder.addCase(fetchfiltersAsync.pending,(state, action)=>{
            state.status= "pendingFetchFilters"

        } )
        builder.addCase(fetchfiltersAsync.fulfilled, (state, action)=> {
            state.status ='idle'
            state.filtersLoaded = true
            state.types = action.payload.types
            state.brands = action.payload.brands

        })
        builder.addCase(fetchfiltersAsync.rejected, (state)=>{
            state.status = 'idle'
        })
    })
})

//selector
export const productSelectors = productsAdapter.getSelectors((state:RootState) => state.catalog)

export const {setProductParams, resetProductParams, setMetaData, setPageNumber} = catalogSlice.actions