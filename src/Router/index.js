import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Config from './RouterHandler';
import { Provider } from 'mobx-react';
import Store from '../Store';
import PackageConfig from '../../package.json';

export default (props) => (
    <Provider {...Store}>
        <BrowserRouter basename={PackageConfig.homepage}>
            <Config />
        </BrowserRouter>
    </Provider>
);

/**
 * 异步加载组件
 */
export const asyncImportComponent = (component) => {
    class AsyncComponent extends React.Component {
        state = {
            instance: null,
        };

        async componentDidMount() {
            const { default: instance } = await component;

            this.setState({ instance });
        }

        render() {
            const C = this.state.instance;
            return C ? <C {...this.props} /> : null;
        }
    }

    return AsyncComponent;
};
