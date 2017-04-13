import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import LoginLayout from '../../components/Login/LoginLayout';

@inject('login') @observer
export default class Login extends Component{
    render = () => {
        const { 
            login: { 
                verify, getVerify, loginPost, btnLoading, loginOut,
                verifyError
            }, location
        } = this.props;
        const LoginLayoutProps = {
            verify, getVerify, loginPost, btnLoading, loginOut,
            verifyError, location
        };
        return (
            <LoginLayout {...LoginLayoutProps} />
        )
    }
}