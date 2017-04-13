import React, { Component } from 'react';
import { Link } from 'react-router';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import './Layout.less'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default class myLayout extends Component {

    render = () => {
        const { children } = this.props;
        return (
            <Layout id="myLayout">
                <Header className="header">
                    <div className="logo">西河韵达</div>
                    {/*<Menu theme="dark"*/}
                    {/*mode="vertical"*/}
                    {/*defaultSelectedKeys={[ '1' ]}*/}
                    {/*style={{ lineHeight: '64px' }}*/}
                    {/*>*/}
                    {/*<Menu.Item key="1">菜鸟面单模板</Menu.Item>*/}
                    {/*<Menu.Item key="2">1111</Menu.Item>*/}
                    {/*</Menu>*/}
                </Header>
                <Layout>
                    <Sider width={200} style={{ background: '#fff' }}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={[ '1' ]}
                            defaultOpenKeys={[ 'dashboard', 'console', 'export' ]}
                            style={{ height: '100%' }}
                        >
                            <SubMenu key="dashboard" title={<span><Icon type="user"/>控制台</span>}>
                                <Menu.Item key="homePage"><Link to={'/home'}>首页</Link></Menu.Item>
                                <Menu.Item key="unPrint"><Link to={'/unprint'}>未打查询</Link></Menu.Item>
                                <Menu.Item key="printed"><Link to={'/printed'}>已打查询</Link></Menu.Item>
                                <Menu.Item key="singleSend"><Link to={'/singleSend'}>单个发货</Link></Menu.Item>
                            </SubMenu>
                            <SubMenu key="console" title={<span><Icon type="laptop"/>面单操作</span>}>
                                <Menu.Item key="unSend">未发单号</Menu.Item>
                                <Menu.Item key="reused">已被重用</Menu.Item>
                            </SubMenu>
                            <SubMenu key="export" title={<span><Icon type="notification"/>数据导出</span>}>
                                <Menu.Item key="balance">对账</Menu.Item>
                                <Menu.Item key="searchTestData">查询测试单号</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                            {
                                children
                            }
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}