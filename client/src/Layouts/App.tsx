import { ThemeProvider,createTheme } from '@mui/material';
import { Container, CssBaseline } from '@mui/material';
import { Component, useCallback, useEffect, useState } from 'react';
import {  Route, Switch } from 'react-router-dom';
import Header from './Header';
import Catalog from '../Features/catalog/Catalog'
import Homepage from '../Features/home/Homepage';
import About from '../Features/about/About';
import Contact from '../Features/contact/Contact';
import Productdetials from '../Features/productdetails/Productdetails';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from '../errors/NotFound';
import ServerError from  "../errors/ServerError";
import BasketPage from '../Features/basket/BasketPage';
import LoadingComponent from './LoadingComponent';
import { fetchBasketAsync, setBasket } from '../Features/basket/basketSlice';
import { useAppDispatch } from '../store/configureStore';
import Login from '../Features/account/Login';
import Register from '../Features/account/Register';
import { fetchCurrentUser } from '../Features/account/accountSlice';
import PrivateRoute from './PrivateRoute';
import Orders from '../Features/orders/Orders';
import CheckoutWrapper from '../Features/Checkout/CheckoutWrapper';
import Inventory from '../admin/Inventory';


const App = ()=> {

  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)

  const initApp = useCallback(async ()=>{
    try{
      await dispatch(fetchCurrentUser())
      await dispatch(fetchBasketAsync())
    }catch(error:any){
      console.log(error)
    }
  },[dispatch])

  useEffect(()=>{
    initApp().then(()=> setLoading(false))
  },[initApp])


  const [darkMode, setdarkMode] = useState(false);
  const modetype = darkMode? 'dark': 'light'

  const setMode = ()=>{
    setdarkMode(!darkMode)
    console.log("calleddd")
  }

  const darkTheme = createTheme({
    palette: {
      mode: modetype,
      background:{
        default: modetype==='light' ? '#eaeaea' : '#121212'
      }
    },
  });


  if(loading) return <LoadingComponent/>

  return(
  
    <ThemeProvider theme = {darkTheme}>
    <ToastContainer position='bottom-right' hideProgressBar theme='colored'/>
    <CssBaseline/>
    <Header  setMode = {setMode}/>

    <Container>
        <Switch>
          <Route exact path= {'/'} component={Homepage} />
          <Route exact path= {'/catalog'} component={Catalog} />
          <Route exact path= {'/about'} component =  {About} />
          <Route exact path= {'/contact'} component = {Contact} />
          <Route path = {'/basket'} component ={BasketPage} />
          <Route exact path= {'/catalog/:id'} component = {Productdetials} />
          <Route  path= {'/not-found'} component = {NotFound} />
          <Route  path= {'/server-error'} component = {ServerError} />
          <PrivateRoute  path= {'/checkout'} component = {CheckoutWrapper} />
          <PrivateRoute  path= {'/orders'} component = {Orders} />
          <PrivateRoute  path= {'/inventory'} component = {Inventory} />
          <Route  path= {'/login'} component = {Login} />
          <Route  path= {'/register'} component = {Register} />
          
          {/* <Redirect to={'/not-found'} /> */}

        </Switch>
    </Container>
    </ThemeProvider>
  
    
    
  )
}

export default App;