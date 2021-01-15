import React, { useReducer } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import WrappedComponent from './without';
import DEFAULT_CONFIG from './config';

const configReducer = (state, action) => {
    return { ...state, ...action };
};

export default function RouterHandler(props) {
    const [config, computeConfig] = useReducer(configReducer, DEFAULT_CONFIG);

    if (props && props.config) computeConfig(props.config);

    return (
        <div className='router'>
            <WrappedComponent />
            {
                <Switch>
                    {config.map((item, index) => {
                        const path = props.pathPrefix
                            ? props.pathPrefix + item.path
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
