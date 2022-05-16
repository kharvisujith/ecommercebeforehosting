
export interface counterStates  {
    data: number,
    title : string
}

const initialState: counterStates = {
    data:42,
    title:"name"
}


export const counterReducer = (state = initialState, action: any)=>{
    switch(action.type){
        case "increment" : return {...state, data: state.data + action.payload}
        case "decrement" : return {...state, data: state.data - action.payload}
        default: return state
    }
    


    
}