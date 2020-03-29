import ActionTypes from "./user-manager-action-constants";


const INITIAL_STATE = {
    loggedIn:false,
    username:"",
    addUserModalShowing:false,
    users:[]
};

const Reducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
    case ActionTypes.ADD_USER_SUCCESS:
        return{
            ...state,
            addUserModalShowing:false
        };
    case ActionTypes.OPEN_ADD_USER_MODAL:
        return{
            ...state,
            addUserModalShowing:true
        };
    case ActionTypes.CLOSE_ADD_USER_MODAL:
        return{
            ...state,
            addUserModalShowing:false
        };
    case ActionTypes.FETCH_USER_SUCCESS:
    //   let users = [
    //     ...state.users
    // ];
        // users = users.concat(action.data);
        return{
            ...state,
            users:action.data
        };  
        // case REHYDRATE:
        //   return {
        //     ...state,
        //     users: [] 
        //   };
    default:
        return state;
    }
};

export default Reducer;

