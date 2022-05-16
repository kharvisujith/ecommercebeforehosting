import { TableContainer, Paper, Table, TableBody, TableRow, TableCell,  } from "@mui/material";
import { currencyFormat } from "../../util/util";
import { useAppSelector } from "../../store/configureStore";

export default function BasketSummary() {
    const {basket} = useAppSelector((state)=>state.basket)
    const subtotal = basket?.items.reduce((sum, item) => sum + (item.quantity * item.price),0) ??0
    console.log("subtotal is  " + subtotal)
    const deliveryFee = subtotal>10000 ?0 : 500

    return (
        <>
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{currencyFormat(subtotal)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">{deliveryFee}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">${subtotal + deliveryFee}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <span style={{fontStyle: 'italic'}}>*Orders over $100 qualify for free delivery</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}