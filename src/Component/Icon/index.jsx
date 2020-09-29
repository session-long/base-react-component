import React from 'react';
import './index.scss';


/**
 * 此Icon组件是可以跟随系统主题色而变化，无法主动设置颜色，大小
 */

class Icon extends React.Component {

    render() {
        let {src} = this.props
        return (
            <div className={'component component-icon'}>
               {
                   src ? <img src={src} /> : null
               } 
            </div>
        )
    }

}

export default Icon;