const menuData = [ {
    name: "控制台",
    submenu: [ {
        name: "首页",
        url: "/home",
        keyValue: "homePage",
        breadcrumb: [ "控制台", "首页" ]
    }, {
        name: "未打查询",
        url: "/unPrint",
        keyValue: "queryUnPrint",
        breadcrumb: [ "控制台", "未打查询" ]
    }, {
        name: "已打查询",
        url: "/printed",
        keyValue: "queryPrinted",
        breadcrumb: [ "控制台", "已打查询" ]
    }, {
        name: "单个发货",
        url: "/singleSent",
        keyValue: "querySingleSent",
        breadcrumb: [ "学校管理", "新增学校" ]
    } ]
}, {
    name: "面单操作",
    submenu: [ {
        name: "未发单号",
        url: "/unsent",
        keyValue: "sheetUnsent",
        breadcrumb: [ "面单操作", "未发单号" ]
    }, {
        name: "已被重用",
        url: "/reused",
        keyValue: "sheetReused",
        breadcrumb: [ "面单操作", "已被重用" ]
    } ]
}, {
    name: "数据导出",
    submenu: [ {
        name: "对账",
        url: "/check",
        keyValue: "dataChecking",
        breadcrumb: [ "数据导出", "对账" ]
    }, {
        name: "查询测试单号",
        url: "/test",
        keyValue: "dataTest",
        breadcrumb: [ "数据导出", "查询测试单号" ]
    } ]
} ];

export default menuData;