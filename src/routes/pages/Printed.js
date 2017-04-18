import React, { Component } from 'react';

import ContentListSearch from '../../components/dashboard/Search';
import ContentListTable from '../../components/dashboard/Table';

export default class Printed extends Component {

    render = () => {
        return (
            <div>
                <ContentListSearch />
                <ContentListTable />
            </div>
        )
    }
}