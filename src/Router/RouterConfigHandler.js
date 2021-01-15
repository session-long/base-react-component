import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import config from './config';
import WrappedComponent from './without';

class RouterConfigHandler extends React.Component {
    //组件被销毁之前重写setState方法 不对状态做任何改变
    componentWillUnmount() {
        this.setState = () => {
            return;
        };
    }

    render() {
        const { config } = this.props;
        return (
            <div className='router'>
                <WrappedComponent
                    wrappedComponentRef={(c) => (this.component = c)}
                />
                {
                    <Switch>
                        {config.map((item, index) => {
                            const path = this.props.pathPrefix
                                ? this.props.pathPrefix + item.path
                                : item.path;
                            return item.redirect ? (
                                <Redirect key={index} to={item.redirect} />
                            ) : (
                                    <Route
                                        key={index}
                                        path={path}
                                        exact={item.exact}
                                        render={(props) => {
                                            return (
                                                <item.component
                                                    {...props}
                                                    {...item}
                                                    pathPrefix={path}
                                                />
                                            );
                                        }}
                                    />
                                );
                        })}
                    </Switch>
                }
            </div>
        );
    }
}

RouterConfigHandler.defaultProps = {
    config: config,
};

export default RouterConfigHandler;
