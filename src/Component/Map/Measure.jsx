import React from 'react';

/**
 * zoom
 * center
 */
class Measure extends React.Component {
    get center() {
        return this.props.center;
    }

    _graphs = [];

    __get_points_by_center = () => {
        const topLeft = this.center.move(-128, -128);
        const topRight = this.center.move(128, -128);
        const bottomRight = this.center.move(128, 128);
        const bottomLeft = this.center.move(-128, 128);
        return [topLeft, topRight, bottomRight, bottomLeft];
    };

    __add_graph = (type) => {
        new Graph(null, type, this.__get_points_by_center());
    };

    addGraph = () => {
        this.__add_graph(GraphType.rectangle);
    };

    render() {
        return <div className='measure'></div>;
    }
}

class Graph {
    id = null;

    type = null;

    points = [];

    constructor(id, type, points) {
        this._id = id || `graph-${type}-${new Date().getTime()}`;
        this._type = type;
        this._points = points;
    }
}

const GraphType = {
    /**
     * 矩形
     */
    rectangle: 'rectangle',
};

export default Measure;
