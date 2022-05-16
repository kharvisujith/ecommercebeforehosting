import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import BasketSummary from '../basket/BasketSummary';
import BasketTable from '../basket/BasketTable';
import { useAppSelector } from '../../store/configureStore';

export default function Review() {

    const {basket} = useAppSelector(state => state.basket)

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      {basket &&
      <BasketTable items ={basket?.items} />}
        <Grid container>
            <Grid item xs={6}>
            </Grid>
            <Grid item xs={6}>
                <BasketSummary/>
            </Grid>
        </Grid>
      
    </>
  );
}
