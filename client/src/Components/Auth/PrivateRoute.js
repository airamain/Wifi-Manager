import React from 'react'
import { Redirect, Route } from 'react-router-dom'


const PrivateRoute = ({ render: Render, ...rest }) => {
    return (
        <Route {...rest} render={props => (localStorage.getItem('JWT') ? <Render {...props} /> : <Redirect to='/users/login' />)} />
    )
}

export default PrivateRoute