import React, { Component } from 'react';
import { Router, Route, Link, hashHistory } from 'react-router';
import { Layout, Menu, Breadcrumb, Icon, Alert, Badge } from 'antd';
import menuData from './menuData';


import './Layout.less'

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;
const { Header, Content, Sider, Footer } = Layout;
let breadcrumbList = [];

export default class myLayout extends Component {
    state = {
        collapsed: false
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    render = () => {
        const { location: { pathname }, children } = this.props;


        return (
            <Layout>
                <Header className="header"
                        style={{ padding: '0 32px 0 0' }}>
                    <div className="logo"><h1>智慧快递</h1></div>
                    <Icon
                        className="trigger"
                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                        style={{ lineHeight: '64px' }}
                    />

                    <Menu theme="dark"
                          mode="horizontal"
                          defaultSelectedKeys={[ '1' ]}
                          style={{ float: 'right', lineHeight: '64px', padding: '0' }}
                    >
                        <SubMenu title={<span><Icon type="user" />个人中心</span>}>
                            <Menu.Item key="setting:1">便携式模板</Menu.Item>
                            <Menu.Item key="setting:2">菜鸟面单模板</Menu.Item>
                            <Menu.Item key="user:1">修改信息</Menu.Item>
                            <Menu.Item key="user:2">退出登录</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Header>
                <Layout style={{ height: '100vh' }}>
                    <Sider width={180}
                           breakpoint="lg"
                           collapsedWidth="0"
                           collapsed={this.state.collapsed}
                           onCollapse={(collapsed, type) => {
                               this.toggle();
                           }}
                           style={{
                               overflow: 'hidden',
                               background: '#2c3e50',
                           }}>
                        <Menu theme="dark"
                              mode="inline"
                              defaultOpenKeys={[ '0', '1', '2' ]}
                              selectedKeys={[]}
                        >
                            {
                                menuData.map(function (menu, index) {
                                    return (
                                        <SubMenu key={index}
                                                 title={<span><Icon type="laptop" />{menu.name}</span>}>
                                            {
                                                menu.submenu.map(function (submenu, index2) {
                                                    if (submenu.url.indexOf(pathname) > -1) {
                                                        breadcrumbList = submenu.breadcrumb;
                                                    }
                                                    return (
                                                        <Menu.Item
                                                            key={index.toString() + index2.toString()}><Link
                                                            to={submenu.url}>{submenu.name}</Link></Menu.Item>
                                                    )
                                                })
                                            }
                                        </SubMenu>
                                    )
                                })}
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '8px 32px 8px 40px' }}>
                        <Breadcrumb separator=">" className="myBreadcrumb">
                            {
                                breadcrumbList.map((data, index) => {
                                    return (
                                        <Breadcrumb.Item key={index}>{data}</Breadcrumb.Item>
                                    )
                                })
                            }
                        </Breadcrumb>
                        <Content className="content">
                            {
                                children
                            }
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                            Ant Design ©2016 Created by Ant UED
                        </Footer>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}