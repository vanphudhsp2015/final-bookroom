import React, { Component } from 'react';
import { http } from '../../../../libraries/http/http';
import { Select, Spin, message } from 'antd';
import debounce from 'lodash/debounce';
const { Option } = Select;

class SearchComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: [],
            arrayEmail: [],
            email: '',
            value: [],
            fetching: false,
        }
        this.lastFetchId = 0;
        this.fetchUser = debounce(this.fetchUser, 800);

    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.value !== prevState.value) {
            this.props.onGetArrayEmail(this.state.value);
        }
        if (this.state.email !== prevState.email) {
            if (this.state.email.trim() === '') {
                this.setState({
                    isChanger: false
                })
            }
        }
    }
    fetchUser = value => {
        var self = this;
        this.setState({ data: [], fetching: true });
        http.request({
            method: 'GET',
            url: `/search/${value === '' ? 's' : value}`,
        }).then(function (response) {
            self.setState({
                data: response,
                fetching: false
            })
        }).catch(function (error) {

        })
    };

    handleChange = value => {
        const regex = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
        if (value[value.length - 1].key.match(regex) === null) {
            message.error('Email không hợp lệ')
            return;
        }
        this.setState({
            value,
            data: [],
            fetching: false,
        });
    };

    render() {

        const { fetching, data, value } = this.state;
        return (
            <div className="b-description-right">
                <div className="b-heading">
                    <h2 className="b-text-title">
                        Thành phần tham dự
                    </h2>
                </div>
                <div className="b-description-content">
                    <div className="b-form-group">
                        <Select
                            mode="tags"
                            labelInValue
                            value={value}
                            placeholder="Thêm khách"
                            notFoundContent={fetching ? <Spin size="small" /> : null}
                            filterOption={false}
                            onSearch={this.fetchUser}
                            onChange={this.handleChange}
                            style={{ width: '70%' }}
                        >
                            {data.map(d => (
                                <Option key={d.id} value={d.attributes.email}>{d.attributes.name} - {d.attributes.email}</Option>
                            ))}
                        </Select>
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchComponent;