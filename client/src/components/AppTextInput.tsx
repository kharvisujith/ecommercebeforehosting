import { TextField } from "@mui/material"
import { produceWithPatches } from "immer"
import { useController,UseControllerProps } from "react-hook-form"

interface Props extends UseControllerProps   {
    label :string
    mulitline?: boolean;
    rows?:number;
    type?:string;
}


const AppTextInput = (props:Props) => {
    const {fieldState, field} = useController({...props, defaultValue:''})
    return(
        <>
            <TextField
                {...props}
                {...field}
                multiline={props.mulitline}
                rows={props.rows}
                type={props.type}
                fullWidth
                variant='outlined'
                error = {!!fieldState.error}
                helperText = {fieldState.error?.message}
            />
        </>
    )
}

export default AppTextInput