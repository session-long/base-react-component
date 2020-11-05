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
        // this.__add_graph(GraphType.rectangle);
        this.refresh();
    };

    disable = () => {
        if (!this.state.visible) return;
        // this._graphs.forEach((item) => {
        //     console.log(item.points);
        // });
        this.destroy();
        this.refresh();
    };

    destroy = () => {
        this.state.visible = false;
        this.state.dragging = false;
        this._graphs = [];
        this.svg = null;
        this.refresh();
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

    __add_rectangle = (type, editable, callback) => {
        if (type !== GraphType.rectangle) return;
        const groups = [];
        const bounds = this.__get_points_by_center();
        const graph = new Graph(null, type, groups, bounds, editable);
        this._graphs.push(graph);
        callback && callback(graph);
    };

    __add_polygon = (type, pointGroups, bounds, editable, callback) => {
        if (type !== GraphType.polygon) return;
        const groups = pointGroups
            ? pointGroups.map((pointGroup) => {
                  const group = pointGroup.map(
                      (point) => new LngLat(point.lng, point.lat)
                  );
                  return group;
              })
            : null;
        const graph = new Graph(null, type, groups, bounds, editable);
        this._graphs.push(graph);
        callback && callback(graph);
    };

    addGraph = (type, pointGroups = null, bounds = null, editable = true) => {
        if (!this.state.visible) return;
        let graph = null;
        this.__add_rectangle(type, editable, (data) => {
            graph = data;
        });
        this.__add_polygon(type, pointGroups, bounds, editable, (data) => {
            graph = data;
        });
        this.refresh();
        return graph;
    };

    __to_group_str_list = (groups) => {
        if (!groups || groups.length === 0) return null;
        let groupStrList = [];
        groups.forEach((group) => {
            let groupStr = '';
            group.forEach((point) => {
                groupStr += `${point.x},${point.y} `;
            });
            groupStrList.push(groupStr);
        });
        return groupStrList;
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
                                if (!graph.type) {
                                    console.log('图形类型不存在');
                                    return null;
                                }
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
                                let groups = [];
                                switch (graph.type) {
                                    case GraphType.polygon:
                                        groups = graph.toPointGroups(
                                            this.center,
                                            this.centerPoint,
                                            this.zoom
                                        );
                                        break;
                                    case GraphType.rectangle:
                                        break;
                                    default:
                                        console.log('未知图形类型');
                                        return;
                                }
                                const groupStrs = this.__to_group_str_list(
                                    groups
                                );

                                return (
                                    <g key={graph.id}>
                                        {graph.type === GraphType.rectangle && (
                                            <rect
                                                width={width}
                                                height={height}
                                                x={x - cx}
                                                y={y - cy}
                                                // style='fill:white;opacity:0.35'
                                                fill='#ffffff'
                                                opacity={0.35}
                                                stroke={'blue'}
                                                strokeWidth={2}
                                                strokeOpacity={1}
                                                onMouseDown={(e) => {
                                                    if (!graph.editable) return;
                                                    e.stopPropagation();
                                                    const {
                                                        clientX,
                                                        clientY,
                                                    } = e;
                                                    this.state.dragging = true;
                                                    this.state.target =
                                                        graph.bounds;
                                                    this.state.cache = {
                                                        x: clientX,
                                                        y: clientY,
                                                    };
                                                    this.refresh();
                                                }}
                                            />
                                        )}
                                        {graph.type === GraphType.polygon
                                            ? groupStrs.map(
                                                  (groupStr, index) => (
                                                      <polygon
                                                          key={`polygon-${index}`}
                                                          // points='100,10 40,198 190,78 10,78 160,198'
                                                          points={groupStr}
                                                          // style='fill:white;opacity:0.35'
                                                          fill={'transparent'}
                                                          opacity={1}
                                                          stroke={'#ff0000'}
                                                          strokeWidth={3}
                                                          strokeOpacity={1}
                                                          onMouseDown={(e) => {
                                                              if (
                                                                  !graph.editable
                                                              )
                                                                  return;
                                                              e.stopPropagation();
                                                              const {
                                                                  clientX,
                                                                  clientY,
                                                              } = e;
                                                              this.state.dragging = true;
                                                              this.state.target =
                                                                  graph.bounds;
                                                              this.state.cache = {
                                                                  x: clientX,
                                                                  y: clientY,
                                                              };
                                                              this.refresh();
                                                          }}
                                                      />
                                                  )
                                              )
                                            : null}
                                        {graph.editable &&
                                            graph.bounds.map((point, index) => {
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

    groups = [];

    bounds = [];

    editable = null;

    get maxLng() {
        if (!this.bounds) return null;
        if (this.bounds.length === 0) return null;
        const list = this.bounds.map((item) => item.lng).sort((a, b) => b - a);
        return list[0];
    }

    get maxLat() {
        if (!this.bounds) return null;
        if (this.bounds.length === 0) return null;
        const list = this.bounds.map((item) => item.lat).sort((a, b) => b - a);
        return list[0];
    }

    get minLng() {
        if (!this.bounds) return null;
        if (this.bounds.length === 0) return null;
        const list = this.bounds.map((item) => item.lng).sort((a, b) => a - b);
        return list[0];
    }

    get minLat() {
        if (!this.bounds) return null;
        if (this.bounds.length === 0) return null;
        const list = this.bounds.map((item) => item.lat).sort((a, b) => a - b);
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

    toPointGroups = (center, { x, y }, zoom) => {
        const pointsGroups = this.groups.map((group) => {
            const pointGroup = group.map((lnglat) => {
                const { offsetX, offsetY } = lnglat.distinctTo(center, zoom);
                return {
                    x: x - offsetX,
                    y: y - offsetY,
                };
            });
            return pointGroup;
        });
        return pointsGroups;
    };

    constructor(id, type, groups, bounds, editable) {
        this.id = id || `graph-${type}-${new Date().getTime()}`;
        this.type = type;
        this.groups = groups;
        this.bounds = bounds;
        this.editable = editable;
    }
}

const GraphType = {
    /**
     * 矩形
     */
    rectangle: 'rectangle',
    /**
     * 多边形
     */
    polygon: 'polygon',
};

export default Index;

export { Graph, GraphType };
