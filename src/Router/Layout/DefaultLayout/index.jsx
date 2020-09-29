import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import './index.scss';

class Layout extends React.Component {
    render() {
        return (
            <div
                className={
                    'layout layout-default' +
                    (this.props.className ? ' ' + this.props.className : '')
                }
            >
                <LayoutRouter
                    pathPrefix={this.props.pathPrefix}
                    children={this.props.children || []}
                />
            </div>
        );
    }
}

class LayoutRouter extends React.Component {
    render() {
        return (
            <Switch>
                {this.props.children.map((item, index) => {
                    const path = this.props.pathPrefix
                        ? this.props.pathPrefix + item.path
                        : item.path;
                    console.log(index, item, path);
                    return item.redirect ? (
                        <Redirect
                            key={`layout-dashboard-${index}`}
                            to={item.redirect}
                        />
                    ) : (
                        <Route
                            key={`layout-dashboard-${index}`}
                            path={path}
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
        );
    }
}

export default Layout;
