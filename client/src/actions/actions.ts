export const increment = (val:number)=>{
    return {
        type:"increment",
        payload : val
    }
}

export const decrement = (val: number) => {
    return {
        type:"decrement",
        payload : val
    }
}