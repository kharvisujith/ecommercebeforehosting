import { Remove, Add, Delete } from "@mui/icons-material"
import { LoadingButton } from "@mui/lab"
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material"
import { BasketItem } from "../../models/basket"
import { useAppDispatch, useAppSelector } from "../../store/configureStore"
import { removeBasketItemAsync, addBasketItemAsync } from "./basketSlice"

interface Props {
    items:BasketItem[]
    isBakset?:boolean
}

const BasketTable = ({items, isBakset =true}:Props)=>{

    const dispatch = useAppDispatch()
    const { status} = useAppSelector((state)=> state.basket)
    return(
        <>
            <TableContainer component={Paper}> 
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell >Product</TableCell>
                        <TableCell >Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell >Subtotal</TableCell>
                        {isBakset &&
                        <TableCell ></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        items.map(item => (
                            <TableRow key={item.productId}> 
                            
                                <TableCell>
                                <Box display='flex' alignItems='center'>
                                <img src={item.pictureUrl} alt={item.name} style={{height:40, marginRight:20}} />
                                <span>{item.name}</span>
                                </Box>
                                </TableCell>

                                <TableCell>${(item.price/100).toFixed(2)}</TableCell>
                                <TableCell>
                                    {isBakset &&
                                        <LoadingButton loading={ status === ('pendingRemoveItem'+item.productId+'rem')} 
                                        onClick={()=> dispatch(removeBasketItemAsync({productId:item.productId, quantity:1 , name:'rem'}))} color='error'>
                                            <Remove />
                                        </LoadingButton  >}
                                        <span>{item.quantity}</span>
                                        {isBakset &&
                                        <LoadingButton
                                         loading={status === ('pendingAddItem' + item.productId)} 
                                        onClick = {()=> dispatch(addBasketItemAsync({productId:item.productId}))} color='secondary'>
                                            <Add/>
                                        </LoadingButton>}
                                    </TableCell>
                                <TableCell>${((item.price/100) * item.quantity).toFixed(2)}</TableCell>
                                {isBakset &&
                                <TableCell>
                                    <LoadingButton loading={status === ('pendingRemoveItem' + item.productId + 'del')}
                                     onClick ={()=> dispatch(removeBasketItemAsync({productId:item.productId,quantity:item.quantity, name:'del'}))}color="error">
                                        <Delete />
                                    </LoadingButton>

                                </TableCell>}
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

        </TableContainer>
        </>
    )
}
export default BasketTable