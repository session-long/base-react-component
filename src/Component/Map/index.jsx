import React from 'react';
import Point from './Model/Point';
import PointBounds from './Model/PointBounds';
import LngLat from './Model/LngLat';
import './index.scss';
import { flatMap } from 'lodash';
const sideLength = 256.0;

class Map extends React.Component {
    state = {
        init: false,
    };

    /**
     * 中心像素点
     */
    _center_point = null;

    _offset = {
        x: -10,
        y: 0,
    };

    /**
     * 中心经纬度点
     * 屏幕与经纬度的关系
     */
    _center = null;

    _grid = null;

    _grid_bounds = null;

    _grid_length = 0;

    _grid_points = [];

    _zoom = null;

    _base_layer = null;

    _layers = [];

    _overlays = [];

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('地图初始化');

        // 构建中心经纬度点
        this._center = new LngLat(0, 0);

        const _width = this.map.clientWidth;
        const _height = this.map.clientHeight;
        console.log(_width, _height);

        // 构建中心像素点
        this._center_point = new Point(0, 0);
        this._center_point.top = _height / 2;
        this._center_point.left = _width / 2;

        // 构建网格
        this.__init_grid();
        this.__refresh_grid();
        this.__refresh_grid();

        this.setState({ init: true });
    }

    __init_grid = () => {
        if (!this.map) return false;
        const _width = this.map.clientWidth;
        const _height = this.map.clientHeight;
        const _length = _width > _height ? _width : _height;
        let _size = Math.ceil(_length / sideLength);
        _size += _size % 2 === 0 ? 1 : 2;
        this._grid_length = _size;
        const middle = Math.ceil(this._grid_length / 2);

        const topLeftPoint = new Point(
            (1 - middle) * sideLength,
            (1 - middle) * sideLength
        );
        const bottomRightPoint = new Point(
            (_size - middle) * sideLength,
            (_size - middle) * sideLength
        );
        this._grid_bounds = new PointBounds(topLeftPoint, bottomRightPoint);
        return true;
    };

    __refresh_grid = () => {
        const list = this.__get_survive_grid_point();
        const len = list.length;
        console.log('is all in', len, list[0]);
        if (len === Math.pow(gridLen, 2)) return false;
        const middle = Math.ceil(this._grid_length / 2);
        const gridLen = this._grid_length;
        for (let i = 1; i <= gridLen; i++) {
            for (let j = 1; j <= gridLen; j++) {
                const x = (i - middle) * sideLength;
                const y = (j - middle) * sideLength;
                const p = new Point(x, y);
                const isSurvive = list.some(
                    (item) => p.x === item.x && p.y === item.y
                );
                if (isSurvive) {
                } else {
                    console.log(isSurvive, p);
                    this._grid_points.push(p);
                }
            }
        }
        console.log('refresh success');
        return true;
    };

    __get_survive_grid_point = () => {
        const list = this._grid_points.filter((item) => {
            return this._grid_bounds.isIn(item, this._offset);
        });
        return list;
    };

    centerAndZoom = (center, zoom) => {};

    zoomIn = () => {};

    zoomOut = () => {};

    setBaseLayer = (layer) => {};

    addLayer = (layer) => {};

    removeLayer = (layer) => {};

    cleanLayers = () => {};

    addOverlay = (overlay) => {};

    removeOverLay = (overlay) => {};

    cleanOverlays = () => {};

    zoomTo = (zoom) => {
        this._zoom = zoom;
    };

    render() {
        console.log('points', this._grid_points.length);
        return (
            <div ref={(ref) => (this.map = ref)} className='map'>
                {this.state.init
                    ? [
                          <div>map</div>,
                          <div
                              key='grid'
                              className='grid'
                              style={{
                                  transform: `translate3d(${this._offset.x}px, ${this._offset.y}px, 0px)`,
                              }}
                          >
                              {this._grid_points.map((item) => {
                                  const x =
                                      this._center_point.top -
                                      5 +
                                      this._offset.x +
                                      item.x;
                                  const y =
                                      this._center_point.bottom -
                                      5 +
                                      this._offset.y +
                                      item.y;
                                  return (
                                      <div
                                          key={`grid-point-${x}-${y}`}
                                          className='grid-point'
                                          style={{
                                              width: '10px',
                                              height: '10px',
                                              borderRadius: '5px',
                                              top: this._center_point.top - 5,
                                              left: this._center_point.left - 5,
                                              transform: `translate3d(${item.x}px, ${item.y}px, 0px)`,
                                          }}
                                      ></div>
                                  );
                              })}
                          </div>,
                          <div
                              key='center-point'
                              className='center-point'
                              style={{
                                  top: this._center_point.top,
                                  left: this._center_point.left,
                              }}
                          ></div>,
                      ]
                    : null}
            </div>
        );
    }
}

export default Map;
