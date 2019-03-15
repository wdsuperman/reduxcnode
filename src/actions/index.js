import Axios from "axios"

export const getState = () => {
    return dispatch => {
        Axios.get('https://cnodejs.org/api/v1/topics').then(res => {
            dispatch({type: 'GET_STATE', state: res.data.data})
        })
    }
}
export const changeGetState = (type) => {
    return dispatch => {
        Axios.get(`https://cnodejs.org/api/v1/topics?tab=${type}`).then(res => {
            dispatch({type: 'CHANGE_GET_STATE', state: res.data.data})
        })
    }
}
export const changePage = (type,page) => {
    return dispatch => {
        Axios.get(`https://cnodejs.org/api/v1/topics?tab=${type}&&page=${page}`).then(res => {
            dispatch({type: 'CHANGE_GET_STATE', state: res.data.data})
        })
    }
}
export const getTopic = id => {
    return dispatch => {
        Axios.get(`https://cnodejs.org/api/v1/topic/${id}`).then(res => {
            dispatch({type: 'GET_TOPIC', state: res.data.data})
        })
    }
}
export const getUserInfo = userName => {
    return dispatch => {
        Axios.get(`https://cnodejs.org/api/v1/user/${userName}`).then(res => {
            dispatch({type: 'GET_USERINFO', state: res.data.data})
        })
    }
}