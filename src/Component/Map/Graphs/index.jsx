import React from 'react';
import LngLat from '../Model/LngLat';
import './index.scss';
/**
 * zoom
 * center
 */
class Index extends React.Component {
    state = {
        visible: false,
        dragging: false,
    };

    refresh = (callback) => {
        this.setState({}, () => {
            callback && callback();
        });
    };

    enable = () => {
        if (this.state.visible) return;
        this.state.visible = true;
        this.__add_graph(GraphType.rectangle);
        this.refresh();
    };

    disable = () => {
        if (!this.state.visible) return;
        this._graphs.forEach((item) => {
            console.log(item.points);
        });
        this.destory();
        this.refresh();
    };

    destory = () => {
        this.state.visible = false;
        this.state.dragging = false;
        this._graphs = [];
        this.svg = null;
    };

    /**
     * SVG容器对象
     */
    svg = null;

    get zoom() {
        return this.props.zoom;
    }

    get center() {
        return this.props.center;
    }

    get centerPoint() {
        if (!this.svg) return null;
        const style = getComputedStyle(this.svg, null);
        return {
            x: parseFloat(style.width) / 2,
            y: parseFloat(style.height) / 2,
        };
    }

    _graphs = [];

    __get_points_by_center = () => {
        const topLeft = this.center
            .toTile(this.zoom)
            .move(-128, -128)
            .toLngLat();
        const topRight = this.center
            .toTile(this.zoom)
            .move(-128, 128)
            .toLngLat();
        const bottomRight = this.center
            .toTile(this.zoom)
            .move(128, 128)
            .toLngLat();
        const bottomLeft = this.center
            .toTile(this.zoom)
            .move(128, -128)
            .toLngLat();
        return [topLeft, bottomRight];
    };

    __add_graph = (type) => {
        const graph = new Graph(null, type, this.__get_points_by_center());
        this._graphs.push(graph);
    };

    addGraph = (type) => {
        if (!this.state.visible) return;
        this.__add_graph(GraphType.rectangle);
        this.refresh();
    };

    render() {
        return (
            <div
                className={`graphs ${
                    this.state.visible ? 'enable' : 'disable'
                }`}
            >
                {this.state.visible ? (
                    <svg
                        ref={(ref) => {
                            if (this.svg) return;
                            this.svg = ref;
                            this.refresh();
                        }}
                        onMouseMove={(e) => {
                            if (!this.state.dragging || !this.state.target)
                                return false;
                            e.stopPropagation();
                            const { clientX, clientY } = e;
                            const { x, y } = this.state.cache;
                            this.state.target.forEach((item) => {
                                const target = item;
                                const newTarget = target
                                    .toTile(this.zoom)
                                    .move(clientX - x, clientY - y)
                                    .toLngLat();
                                target.copy(newTarget);
                                console.log(target);
                            });
                            this.refresh(() => {
                                this.state.cache = {
                                    x: clientX,
                                    y: clientY,
                                };
                            });
                        }}
                        onMouseUp={(e) => {
                            if (!this.state.dragging || !this.state.target)
                                return false;
                            e.stopPropagation();
                            this.state.dragging = null;
                            this.state.target = null;
                            this.state.cache = null;
                            this.refresh();
                        }}
                    >
                        {this.svg &&
                            this._graphs.map((graph) => {
                                const { x, y } = this.centerPoint;
                                const topLeftLngLat = graph.topLeftLngLat;
                                const {
                                    offsetX: cx,
                                    offsetY: cy,
                                } = topLeftLngLat.distinctTo(
                                    this.center,
                                    this.zoom
                                );
                                const bottomRightLngLat =
                                    graph.bottomRightLngLat;
                                const {
                                    offsetX: width,
                                    offsetY: height,
                                } = topLeftLngLat.distinctTo(
                                    bottomRightLngLat,
                                    this.zoom
                                );

                                return (
                                    <g key={graph.id}>
                                        <rect
                                            width={width}
                                            height={height}
                                            x={x - cx}
                                            y={y - cy}
                                            onMouseDown={(e) => {
                                                e.stopPropagation();
                                                const { clientX, clientY } = e;
                                                this.state.dragging = true;
                                                this.state.target =
                                                    graph.points;
                                                this.state.cache = {
                                                    x: clientX,
                                                    y: clientY,
                                                };
                                                this.refresh();
                                            }}
                                        />
                                        {graph.points.map((point, index) => {
                                            const {
                                                offsetX,
                                                offsetY,
                                            } = point.distinctTo(
                                                this.center,
                                                this.zoom
                                            );
                                            return (
                                                <circle
                                                    key={`graph-item-${index}`}
                                                    cx={x - offsetX}
                                                    cy={y - offsetY}
                                                    r={8}
                                                    fill='red'
                                                    onMouseDown={(e) => {
                                                        e.stopPropagation();
                                                        const {
                                                            clientX,
                                                            clientY,
                                                        } = e;
                                                        this.state.dragging = true;
                                                        this.state.target = [
                                                            point,
                                                        ];
                                                        this.state.cache = {
                                                            x: clientX,
                                                            y: clientY,
                                                        };
                                                        this.refresh();
                                                    }}
                                                />
                                            );
                                        })}
                                    </g>
                                );
                            })}
                    </svg>
                ) : null}
            </div>
        );
    }
}

class Graph {
    id = null;

    type = null;

    points = [];

    options = null;

    get maxLng() {
        if (!this.points) return null;
        if (this.points.length === 0) return null;
        const list = this.points.map((item) => item.lng).sort((a, b) => b - a);
        return list[0];
    }

    get maxLat() {
        if (!this.points) return null;
        if (this.points.length === 0) return null;
        const list = this.points.map((item) => item.lat).sort((a, b) => b - a);
        return list[0];
    }

    get minLng() {
        if (!this.points) return null;
        if (this.points.length === 0) return null;
        const list = this.points.map((item) => item.lng).sort((a, b) => a - b);
        return list[0];
    }

    get minLat() {
        if (!this.points) return null;
        if (this.points.length === 0) return null;
        const list = this.points.map((item) => item.lat).sort((a, b) => a - b);
        return list[0];
    }

    get topLeftLngLat() {
        return new LngLat(this.minLng, this.maxLat);
        // return new LngLat(this.maxLng, this.minLat);
    }

    get bottomRightLngLat() {
        return new LngLat(this.maxLng, this.minLat);
        // return new LngLat(this.minLng, this.maxLat);
    }

    constructor(id, type, points, options) {
        this.id = id || `graph-${type}-${new Date().getTime()}`;
        this.type = type;
        this.points = points;
        this.options = options;
    }
}

const GraphType = {
    /**
     * 矩形
     */
    rectangle: 'rectangle',
};

export default Index;

export { Graph, GraphType };
