import { Backdrop, Box, CircularProgress, Typography } from "@mui/material"

const LoadingComponent = ()=>{
    return(
        <>
          <Backdrop open={true} invisible={true}>
              <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                <CircularProgress color="secondary" />
                <Typography variant="h6">Loading...</Typography>
              </Box>
              
          </Backdrop>
        </>
    )
}

export default LoadingComponent