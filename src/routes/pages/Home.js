import React, { Component } from 'react';
import { Tag } from 'antd';
import createG2 from 'g2-react';
import { Stat } from 'g2';

const Pie = createG2(chart => {
    chart.coord('theta');
    chart.intervalStack().position(Stat.summary.proportion()).color('cut');
    chart.render();
});

const tags = [
    { key: "现金", value: "66.66" },
    { key: "微信", value: "66.66" },
    { key: "支付宝", value: "66.66" },
    { key: "今日未打", value: "66.66" },
    { key: "今日已打", value: "66.66" },
    { key: "未打印", value: "66.66" },
    { key: "已打印", value: "66.66" },
];
const colors = [ "pink", "red", "orange", "green", "cyan", "blue", "purple" ]

export default class Home extends Component {
    state = {
        data: tags,
        width: 500,
        height: 250,
        plotCfg: { margin: [ 10, 100, 50, 120 ], }
    }
    render = () => {
        const data = [
            { "gender": "男", "count": 40 },
            { "gender": "女", "count": 30 }
        ];

        return (
            <div>
                <h2 style={{ marginBottom: 16 }}>欢迎使用本系统</h2>

                {
                    tags.map((tag, index) => {
                        return (
                            <Tag key={tag.key} color={colors[ index % colors.length ]}>{tag.key} {tag.value}</Tag>
                        )
                    })

                }

                <Pie
                    data={[
                        { "gender": "男", "count": 40 },
                        { "gender": "女", "count": 30 }
                    ]}
                    width={this.state.width}
                    height={this.state.height}
                    plotCfg={this.state.plotCfg}
                    ref="myChart"
                />

            </div>
        )
    }
}