import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useEffect, useState } from "react"
import agent from "../../api/agent"
import LoadingComponent from "../../Layouts/LoadingComponent"
import { useAppDispatch } from "../../store/configureStore"
import { setBasket } from "../basket/basketSlice"
import CheckoutPage from "./CheckoutPage"


const stripePromise= loadStripe('pk_test_51KyYtuSBI6EvY0QAwLFh6tHlMcCDFdUIBGGOy5QgPxwkULwwLTUuRBwgpWnNuBPPr0LU16IqauvflyYWgVyD3ix1005ec1OUoj')

const CheckoutWrapper = () => {

    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        agent.payment.createPaymentIntent()
            .then(basket => dispatch(setBasket(basket)))
            .catch(error=> console.log(error))
            .finally(()=> setLoading(false))
    },[dispatch])

    if(loading) return <LoadingComponent />

    return (
       <Elements stripe = {stripePromise}>
           <CheckoutPage/>
       </Elements>
    )
}
export default CheckoutWrapper
