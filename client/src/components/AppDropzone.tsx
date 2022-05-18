import { UseControlledProps } from '@material-ui/core/utils/useControlled'
import  {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { useController } from 'react-hook-form'

interface Props extends UseControlledProps {}

export default function AppDropzone(props:Props) {
    const {fieldState, field}= useController({...props, defaultValue:null})


  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles[0] =Object.assign(acceptedFiles[0],
         {preview:URL.createObjectURL(acceptedFiles[0])})
         field.onChange(acceptedFiles[0])
  }, [field])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}