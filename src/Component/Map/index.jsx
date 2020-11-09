import React from 'react';
import Point from './Model/Point';
import PointBounds from './Model/PointBounds';
import LngLat from './Model/LngLat';
import './index.scss';
import Layer from './Model/Layer';
import config from './config';
import Graphs from './Graphs';
import { isEqual } from 'lodash';
import * as Util from './Util';

/**
 * layers
 */
class Map extends React.Component {
    state = {
        init: false,
        dragging: false,
    };

    /**
     * 中心像素点
     */
    _center_point = null;

    get centerPointStyle() {
        return this.centerPoint
            ? getComputedStyle(this.centerPoint, null)
            : null;
    }

    /**
     * 【缺省】中心经纬度点
     */
    _default_center = new LngLat(116.40769, 39.89945);

    /**
     * 中心经纬度点
     */
    // 北京
    // _center = new LngLat(116.40769, 39.89945);
    // 天津
    // _center = new LngLat(117.2, 39.13);
    _center = new LngLat(104.5925, 26.86);

    get center() {
        const lnglat = this._center
            .toTile(this._zoom)
            .move(-1 * this._grid_translate.x, -1 * this._grid_translate.y)
            .toLngLat();
        return lnglat;
    }

    /**
     * 中心点的偏移量
     */
    _offset = {
        top: 0,
        left: 0,
    };

    _grid = null;

    _grid_bounds = null;

    _grid_translate = {
        x: 0,
        y: 0,
    };

    _grid_length = 0;

    _grid_points = [];

    _zoom = 10;

    __set_zoom = (zoom) => {
        if (zoom > config.maxZoom) return;
        if (zoom < config.minZoom) return;
        this._zoom = zoom;
    };

    _base_layer = null;

    _layers = [
        new Layer(
            // 'http://c.tile.stamen.com/toner/{z}/{x}/{y}.png',
            `http://192.168.1.128/static_map/gf_map/520201/2020/{z}/{x}/{y}.png`,
            {
                bounds: [
                    new LngLat(104.5925, 26.86),
                    new LngLat(105.099444, 26.441944),
                ],
            }
        ),
    ];

    get layers() {
        return this.props.layers || [];
    }

    _overlays = [];

    __init_center_point = () => {
        const _width = this.map.clientWidth;
        const _height = this.map.clientHeight;
        this._center_point = new Point(0, 0, _height / 2, _width / 2);
    };

    __init_offset = () => {
        const { pixelX, pixelY } = this._center.toTile(this._zoom);
        this._offset = {
            top: -1 * (pixelY % config.length),
            left: -1 * (pixelX % config.length),
        };
    };

    __refresh_offset = () => {
        this.__init_offset();
    };

    __init_base_layer = () => {
        this._base_layer = new Layer(
            'http://{r}.tile.osm.org/{z}/{x}/{y}.png',
            {
                replace: (url) => {
                    const index = Math.floor(Math.random() * 3);
                    const list = ['a', 'b', 'c'];
                    const prefix = list[index];
                    return url.replace('{r}', prefix);
                },
            }
        );
    };

    __init_grid = () => {
        if (!this.map) return false;
        const { clientWidth: width, clientHeight: height } = this.map;
        const len = width > height ? width : height;
        let size = Math.ceil(len / config.length);
        size += size % 2 === 0 ? 3 : 2;
        this._grid_length = size;
        const middle = Math.ceil(size / 2);

        const topLeftPoint = new Point(1 - middle, 1 - middle);
        const bottomRightPoint = new Point(size - middle, size - middle);
        this._grid_bounds = new PointBounds(topLeftPoint, bottomRightPoint);
        return true;
    };

    __refresh_grid = () => {
        const timestamp = new Date().getTime();

        const list = this.__get_survive_grid_point();
        const len = list.length;
        if (len === Math.pow(gridLen, 2)) return false;

        const { x: translateX, y: translateY } = this._grid_translate;

        const offsetX = Math.ceil(translateX / config.length);
        const offsetY = Math.ceil(translateY / config.length);
        const middle = Math.ceil(this._grid_length / 2);
        const gridLen = this._grid_length;
        const extraList = [];
        for (let i = 1; i <= gridLen; i++) {
            for (let j = 1; j <= gridLen; j++) {
                const x = i - middle;
                const y = j - middle;
                const isSurvive = list.some(
                    (item) => x - offsetX === item.x && y - offsetY === item.y
                );
                if (!isSurvive) {
                    const p = new Point(x - offsetX, y - offsetY);
                    p.t = timestamp;
                    extraList.push(p);
                    // this._grid_points.push(p);
                }
            }
        }
        this._grid_points = list.concat(extraList);
        return true;
    };

    __clean_grid = () => {
        this._grid_points = [];
    };

    __get_survive_grid_point = () => {
        const list = this._grid_points.filter((item, index) => {
            const flag = this._grid_bounds.isIn(item, this._grid_translate);
            return flag;
        });
        return list;
    };

    centerAndZoom = (center, zoom = this._zoom, keep = true) => {
        if (zoom > config.maxZoom) return;
        if (zoom < config.minZoom) return;
        const hasCenter = center ? true : false;

        const { lng, lat } = hasCenter ? center : this._center;
        this._center = new LngLat(lng, lat);

        this._grid_translate = {
            x: 0,
            y: 0,
        };

        this.__clean_grid();

        // 根据中心经纬度点计算偏移量
        hasCenter && this.__init_offset();

        // 刷新网格
        hasCenter && this.__refresh_grid();

        // 改变层级
        zoom !== this._zoom && this.__set_zoom(zoom);

        // 根据中心经纬度点计算偏移量
        zoom !== this._zoom && this.__init_offset();

        // 刷新网格
        zoom !== this._zoom && this.__refresh_grid();

        keep && this.refresh();
    };

    zoomIn = () => {
        this.centerAndZoom(this.center, this._zoom + 1);
    };

    zoomOut = () => {
        this.centerAndZoom(this.center, this._zoom - 1);
    };

    setBaseLayer = (layer) => {};

    addLayer = (layer) => {};

    removeLayer = (layer) => {};

    cleanLayers = () => {};

    addOverlay = (overlay) => {};

    removeOverLay = (overlay) => {};

    cleanOverlays = () => {};

    refresh = () => {
        console.log(this._grid_points.length);
        this.setState({});
    };

    componentDidMount() {
        // 构建中心像素点
        this.__init_center_point();

        // 构建网格
        this.__init_grid();

        // 根据中心经纬度点计算偏移量
        this.__init_offset();

        // 刷新网格
        this.__refresh_grid();

        // 其他
        this.__init_base_layer();

        this.setState({ init: true });
    }

    componentDidUpdate(preProps) {
        if (!isEqual(this.props, preProps)) {
            this.refresh();
        }
    }

    render() {
        return (
            <div
                ref={(ref) => (this.map = ref)}
                className={`map ${this.state.dragging ? 'dragging' : 'drag'}`}
                onMouseDown={(e) => {
                    const { clientX, clientY } = e;
                    this.state.dragging = true;
                    this.state.temp = {
                        x: clientX,
                        y: clientY,
                    };
                    this.refresh();
                }}
                onMouseMove={(e) => {
                    if (!this.state.dragging) return false;
                    const { clientX, clientY } = e;
                    const { x, y } = this.state.temp;
                    this._grid_translate.x += clientX - x;
                    this._grid_translate.y += clientY - y;
                    this.state.temp = {
                        x: clientX,
                        y: clientY,
                    };
                    this.refresh();
                }}
                onMouseUp={(e) => {
                    if (!this.state.dragging) return false;
                    this.state.dragging = false;
                    const { clientX, clientY } = e;
                    const { x, y } = this.state.temp;
                    this._grid_translate.x += clientX - x;
                    this._grid_translate.y += clientY - y;

                    // 刷新网格
                    this.__refresh_grid();

                    this.refresh();

                    // const tile = this._center.toTile(this._zoom);
                    // tile.move(x - clientX, y - clientY);
                    // this._center = tile.toLngLat();
                    // this.centerAndZoom();
                }}
                onWheel={async (e) => {
                    e.stopPropagation();

                    // 鼠标点的像素位置
                    const { clientX, clientY, deltaY } = e;

                    // 判断鼠标滚轮的上下滑动
                    if (deltaY > 0 && this._zoom <= config.minZoom) return;
                    if (deltaY < 0 && this._zoom >= config.maxZoom) return;

                    // 中心点的像素位置
                    const { x, y } = this.centerPoint.getBoundingClientRect();

                    // 计算偏移量
                    this._grid_translate.x += x - clientX;
                    this._grid_translate.y += y - clientY;
                    // if (deta > 0 && this.zoom > config.minZoom) {
                    if (deltaY > 0) {
                        this.centerAndZoom(this.center, this._zoom - 1, false);
                        // } else if (deta < 0 && this.zoom >= config.maxZoom) {
                    } else if (deltaY < 0) {
                        this.centerAndZoom(this.center, this._zoom + 1, false);
                    } else {
                        return;
                    }

                    // 中心点归位
                    this._grid_translate.x += clientX - x;
                    this._grid_translate.y += clientY - y;

                    this.centerAndZoom(this.center);
                }}
            >
                {this.state.init
                    ? [
                          //其他

                          config.testModel && (
                              <div
                                  key='map'
                                  style={{
                                      position: 'fixed',
                                      top: 0,
                                      left: 0,
                                      zIndex: 9,
                                  }}
                              >
                                  <div style={{ backgroundColor: '#ffffff' }}>
                                      地图当前层级 {this._zoom}
                                  </div>
                                  <button
                                      onClick={(e) => {
                                          this.zoomIn();
                                          this.refresh();
                                      }}
                                  >
                                      放大
                                  </button>
                                  <button
                                      onClick={(e) => {
                                          this.zoomOut();
                                          this.refresh();
                                      }}
                                  >
                                      缩小
                                  </button>
                                  <button
                                      onClick={(e) => {
                                          this.Graphs.enable();
                                      }}
                                  >
                                      打开
                                  </button>
                                  <button
                                      onClick={(e) => {
                                          this.Graphs.disable();
                                      }}
                                  >
                                      关闭
                                  </button>
                              </div>
                          ),
                          // 网格层
                          <div
                              key='grid'
                              className='grid'
                              style={{
                                  transform: `translate3d(${
                                      this._offset.left + this._grid_translate.x
                                  }px, ${
                                      this._offset.top + this._grid_translate.y
                                  }px, 0px)`,
                              }}
                          >
                              {config.testModel &&
                                  this._grid_points.map((item) => {
                                      return (
                                          <div
                                              key={`grid-point-${item.t}-${item.x}-${item.y}`}
                                              className='grid-point'
                                              style={{
                                                  width: '10px',
                                                  height: '10px',
                                                  borderRadius: '5px',
                                                  top:
                                                      this._center_point.top -
                                                      5,
                                                  left:
                                                      this._center_point.left -
                                                      5,
                                                  transform: `translate3d(${item.left}px, ${item.top}px, 0px)`,
                                              }}
                                          >
                                              <div
                                                  style={{
                                                      position: 'absolute',
                                                      top: '-6px',
                                                      left: '20px',
                                                      width: '200px',
                                                      height: '24px',
                                                      lineHeight: '24px',
                                                  }}
                                              >
                                                  {item.x} : {item.y}
                                              </div>
                                          </div>
                                      );
                                  })}
                              {!config.testModel &&
                                  this._grid_points
                                      .sort((a, b) => {
                                          return (
                                              Math.abs(a.x) +
                                              Math.abs(a.y) -
                                              (Math.abs(b.x) + Math.abs(b.y))
                                          );
                                      })
                                      .map((item) => {
                                          return this.renderLayers(item);
                                      })}
                          </div>,
                          //   中心点
                          <div
                              ref={(ref) => (this.centerPoint = ref)}
                              key='center-point'
                              className='center-point'
                              style={{
                                  top: this._center_point.top,
                                  left: this._center_point.left,
                                  //   visibility: this.props.showCenterPoint,
                                  visibility: this.props.showCenterPoint
                                      ? 'visible'
                                      : 'hidden',
                              }}
                          />,
                          // 图形层
                          <Graphs
                              key={`graphs`}
                              ref={(ref) => (this.Graphs = ref)}
                              center={this.center}
                              zoom={this._zoom}
                          />,
                      ]
                    : null}
            </div>
        );
    }

    renderLayers({ x, y, t, top, left }) {
        const { tileX, tileY, zoom: z } = this._center.toTile(this._zoom);
        const list = [this._base_layer].concat(this.layers);
        return list.map((layer, index) => {
            const src = layer.toRealUrl(z, tileX + x, tileY + y);
            const bounds = layer.config.bounds;
            let isIn = true;
            if (bounds) {
                const topLeft = new LngLat(
                    layer.config.minLng,
                    layer.config.maxLat
                );
                const bottomRight = new LngLat(
                    layer.config.maxLng,
                    layer.config.minLat
                );
                const maxTileX = bottomRight.toTile(z).tileX;
                const maxTileY = bottomRight.toTile(z).tileY;
                const minTileX = topLeft.toTile(z).tileX;
                const minTileY = topLeft.toTile(z).tileY;

                if (tileX + x > maxTileX) isIn = false;
                if (tileX + x < minTileX) isIn = false;
                if (tileY + y + 1 > maxTileY) isIn = false;
                if (tileY + y + 1 < minTileY) isIn = false;
            }
            return isIn ? (
                <img
                    // key={`layer-tile-${
                    //     index === 0 ? 'default' : index
                    // }-${t}-${x}-${y}`}
                    key={`layer-tile-${
                        index === 0 ? 'default' : index
                    }-${x}-${y}`}
                    className='layer-tile'
                    style={{
                        position: 'absolute',
                        width: `${config.length}px`,
                        height: `${config.length}px`,
                        borderRadius: '5px',
                        top: this._center_point.top,
                        left: this._center_point.left,
                        zIndex: index,
                        transform: `translate3d(${left}px, ${top}px, 0px)`,
                        opacity: '1',
                        userSelect: 'none',
                    }}
                    src={src}
                />
            ) : null;
        });
    }
}

export default Map;

export { Util };
