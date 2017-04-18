import React, { Component } from 'react';
import { Router, Route, Link, hashHistory } from 'react-router';
import { Layout, Menu, Breadcrumb, Icon, Alert, Badge } from 'antd';
import menuData from './menuData';


import './Layout.less'

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;
const { Header, Content, Sider, Footer } = Layout;


export default class myLayout extends Component {

    render = () => {
        const { location: { pathname }, children } = this.props;
        /* 获取当前url对应的index以及当前激活状态的index
         * */
        let openIndex = 0, activeIndex = 0, breadcrumbList = [], defaultOpenKeys = [];

        return (
            <Layout>
                <Header className="header">
                    <div className="logo"><h1>智慧快递</h1></div>
                    {/*<div style={{ position: 'absolute', top: '0', right: '400' }}>*/}
                    {/*<Icon type="message" style={{ color: '#fff' }} />*/}
                    {/*</div>*/}
                    <Menu theme="dark"
                          mode="horizontal"
                          defaultSelectedKeys={[ '1' ]}
                          className="topMenu"
                    >
                        <SubMenu title={<span><Icon type="setting" />菜鸟面单模板</span>}>
                            <Menu.Item key="setting:1">便携式模板</Menu.Item>
                            <Menu.Item key="setting:2">菜鸟面单模板</Menu.Item>
                        </SubMenu>
                        <SubMenu title={<span><Icon type="user" />个人中心</span>}>
                            <Menu.Item key="user:1">修改信息</Menu.Item>
                            <Menu.Item key="user:2">退出登录</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Header>
                <Layout>
                    <Sider width={180} style={{ overflow: 'auto' }}>
                        <Menu theme="dark"
                              mode="inline"
                              defaultOpenKeys={[ '0', '1', '2' ]}
                              className="siderMenu"
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
                                })
                            }
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