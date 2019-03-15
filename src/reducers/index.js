const rootReducer = (state = [], action) => {
    switch (action.type) {
        case 'GET_STATE':
            return action.state
        case 'CHANGE_GET_STATE':
            return action.state
        case 'GET_TOPIC':
            return action.state
        case 'GET_USERINFO':
            return action.state
        default:
            return state
    }
}

export default rootReducer