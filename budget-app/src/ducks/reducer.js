import axios from 'axios';

const initailState = {
    user:{},
    transactions:[],
    envelopes: []
}

const GET_USER_INFO ='GET_USER_INFO';
const GET_ALL_TRANS = 'GET_ALL_TRANS';
const GET_ALL_ENVELOPES = 'GET_ALL_ENVELOPES';

export default function reducer(state = initailState, action){
    switch (action.type) {
        case GET_USER_INFO + '_FULFILLED':
            return Object.assign({}, state, {user: action.payload})
        case GET_ALL_TRANS + '_FULFILLED':
            return Object.assign({}, state, {transactions: action.payload})
        case GET_ALL_ENVELOPES + '_FULFILLED':
            return Object.assign({}, state, {envelopes: action.payload})
        default:
            return state;
    }
}

export function getUser(){
    let userData = axios.get('/auth/me').then( res => {
        
        return res.data
    })
    return{
        type: GET_USER_INFO,
        payload: userData
    }
}

export function getTransactions(id){
    let trans = axios.get(`/api/trans/${id}`).then(res => {
        console.log(res.data);
        return res.data
    })
    return{
        type: GET_ALL_TRANS,
        payload: trans
    }

}

export function getEnvelopes(id){
    let envelopes = axios.get(`/api/envelopes/${id}`).then(res => {
        console.log(res.data);        
        return res.data
    })
    return{
        type: GET_ALL_ENVELOPES,
        payload: envelopes
    }
}