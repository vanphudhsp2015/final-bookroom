import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MasterLayout } from '../../layouts/admin';
import { TableComponent } from '../../shared/admin';
import { requestGetUsers } from '../../../actions/user';

class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            views: 'LIST',
        }
    }
    componentDidMount() {
        this.props.requestGetUsers();
    }

    render() {
        const mainContent = () => {
            switch (this.state.views) {
                case "LIST":
                    return (
                        <TableComponent choice="USER" onChangerView={this.onChangerView} data={this.props.users} onDelete={this.onDelete}></TableComponent>
                    )

                default:
                    return (
                        <></>
                    )
            }
        }
        return (
            <MasterLayout>
                {mainContent()}
            </MasterLayout>
        );
    }
}
function mapStateProps(state) {
    return {

        users: state.user.all,
    }
}
export default connect(mapStateProps, { requestGetUsers })(UserPage);
