import { Grid} from "@mui/material";
import ProductCard from "./ProductCard";
import {Products} from '../../models/Products'
import { useAppSelector } from "../../store/configureStore";
import ProductCardSkeleton from "./ProductCardCatalog";


export interface Props{
  products:Products[]
}

const ProductList = ({products}:Props)=>{

  const {productsLoaded} = useAppSelector(state => state.catalog)
  return(
    <Grid container spacing={2} >
      {
        products.map((product)=>{
          return(
            <Grid item xs={4} margin='auto' key={product.id} >
              {!productsLoaded ? (
                <ProductCardSkeleton />
              ): ( <ProductCard key={product.id} product={product} />)
              }
            
            </Grid>
          )
        })
      }
     </Grid>
  


  )
}

export default ProductList;