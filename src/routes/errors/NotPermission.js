import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Button } from 'antd';
import './NotFound.less';

@inject('login') @observer
export default class NotPermission extends Component {
    handleClick = () => {
        const { login: { loginOut } } = this.props;
        loginOut()
    };

    render = () => {
        const { login: { btnLoading } } = this.props;
        return (
            <div className={`normal`}>
                <div className={`container`}>
                    <h1 className={`title`}>来错地方了</h1>
                    <p className={`desc`}>您没有当前页面的权限，可尝试通过重新登录刷新权限。<br />如有疑问，请联系后台管理员！</p>
                    <Button
                        onClick={this.handleClick}
                        loading={btnLoading}
                        type="primary"
                        size="large"
                        style={{ marginTop: 20 }}
                    >
                        退出并重新登录
                    </Button>
                </div>
            </div>
        )
    }
}

