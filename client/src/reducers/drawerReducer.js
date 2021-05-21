export const drawerReducer = (state = false, action) =>{
    switch(action.type){
        case "SET_VISIBILITY":
            return action.payload;
        default:
            return state;
    }
}