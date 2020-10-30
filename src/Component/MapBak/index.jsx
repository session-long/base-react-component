import React from 'react';
import Point from './Model/Point';
import PointBounds from './Model/PointBounds';
import LngLat from './Model/LngLat';
import './index.scss';
import Layer from './Model/Layer';
import config from './config';
import Graphs from './Graphs';

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

    _translate = {
        x: 0,
        y: 0,
    };

    /**
     * 【缺省】中心经纬度点
     */
    _default_center = new LngLat(116.40769, 39.89945);

    /**
     * 中心经纬度点
     */
    // 北京
    _center = new LngLat(116.40769, 39.89945);
    // 天津
    // _center = new LngLat(117.2, 39.13);

    get center() {
        return this._center
            .toTile(this._zoom)
            .move(-1 * this._translate.x, -1 * this._translate.y)
            .toLngLat();
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
        new Layer('http://c.tile.stamen.com/toner/{z}/{x}/{y}.png', {
            bounds: [new LngLat(117.2, 39.13), new LngLat(116.40769, 39.89945)],
        }),
    ];

    _overlays = [];

    componentDidMount() {
        console.log('地图初始化');

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

        console.log(this._grid_points.length);
    }

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

    __init_base_layer = () => {
        this._base_layer = new Layer(
            'http://a.tile.osm.org/{z}/{x}/{y}.png',
            {}
        );
    };

    __init_grid = () => {
        if (!this.map) return false;
        const _width = this.map.clientWidth;
        const _height = this.map.clientHeight;
        const _length = _width > _height ? _width : _height;
        let _size = Math.ceil(_length / config.length);
        _size += _size % 2 === 0 ? 1 : 2;
        this._grid_length = _size;
        const middle = Math.ceil(this._grid_length / 2);

        const topLeftPoint = new Point(
            (1 - middle) * config.length,
            (1 - middle) * config.length
        );
        const bottomRightPoint = new Point(
            (_size - middle) * config.length,
            (_size - middle) * config.length
        );
        this._grid_bounds = new PointBounds(topLeftPoint, bottomRightPoint);
        return true;
    };

    __refresh_offset = () => {
        this.__init_offset();
    };

    __refresh_grid = () => {
        const timestamp = new Date().getTime();

        const list = this.__get_survive_grid_point();
        const len = list.length;
        if (len === Math.pow(gridLen, 2)) return false;

        const offsetX = Math.ceil(
            (-1 * this._offset.left + this._translate.x) / config.length
        );
        const offsetY = Math.ceil(
            (-1 * this._offset.top + this._translate.y) / config.length
        );
        const middle = Math.ceil(this._grid_length / 2);
        const gridLen = this._grid_length;
        for (let i = 1; i <= gridLen; i++) {
            for (let j = 1; j <= gridLen; j++) {
                const x = i - middle;
                const y = j - middle;
                const isSurvive = list.some(
                    (item) => x === item.x && y === item.y
                );
                if (!isSurvive) {
                    const p = new Point(-1 * (x + offsetX), -1 * (y + offsetY));
                    p.t = timestamp;
                    this._grid_points.push(p);
                }
            }
        }
        return true;
    };

    __get_survive_grid_point = () => {
        const list = this._grid_points.filter((item) => {
            return this._grid_bounds.isIn(item, this._offset);
        });
        return list;
    };

    centerAndZoom = (center = this.center, zoom = this._zoom, keep) => {
        this._center = center;

        // 根据中心经纬度点计算偏移量
        this.__init_offset();

        // 刷新网格
        this.__refresh_grid();

        // 改变层级
        this.__set_zoom(zoom);

        // 根据中心经纬度点计算偏移量
        this.__init_offset();

        // 刷新网格
        this.__refresh_grid();

        !keep && this.refresh();
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
        this.setState({});
    };

    render() {
        console.log('地图刷新了');
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
                    this._translate.x += clientX - x;
                    this._translate.y += clientY - y;
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
                    this._translate.x += clientX - x;
                    this._translate.y += clientY - y;

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

                    // 中心点的像素位置
                    const { x, y } = this.centerPoint.getBoundingClientRect();

                    // 鼠标点的像素位置
                    const { clientX, clientY } = e;

                    // 计算偏移量
                    const offset = { x: clientX - x, y: clientY - y };

                    // 鼠标点的瓦片数据
                    const targetTile = this._center
                        .toTile(this._zoom)
                        .clone()
                        .move(offset.x, offset.y);

                    // 鼠标点的经纬度
                    const targetLngLat = targetTile.toLngLat();

                    // 判断鼠标滚轮的上下滑动
                    const deta = e.deltaY;
                    if (deta > 0) {
                        this.centerAndZoom(targetLngLat, this._zoom - 1, false);
                    } else if (deta < 0) {
                        this.centerAndZoom(targetLngLat, this._zoom + 1, false);
                    }

                    // 中心点归位
                    const newCenterTile = targetLngLat
                        .toTile(this._zoom)
                        .clone()
                        .move(-1 * offset.x, -1 * offset.y);

                    this.centerAndZoom(newCenterTile.toLngLat());

                    this.refresh();
                }}
            >
                {this.state.init
                    ? [
                          //其他
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
                          </div>,
                          // 网格层
                          <div
                              key='grid'
                              className='grid'
                              style={{
                                  transform: `translate3d(${
                                      this._offset.left + this._translate.x
                                  }px, ${
                                      this._offset.top + this._translate.y
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
                                  this._grid_points.map((item) => {
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
                              }}
                          />,
                          // 图形层
                          <Graphs
                              key={`graphs`}
                              ref={(ref) => (this.Graphs = ref)}
                              center={this._center}
                              zoom={this._zoom}
                          />,
                      ]
                    : null}
            </div>
        );
    }

    renderLayers({ x, y, t, top, left }) {
        const { tileX, tileY, zoom: z } = this._center.toTile(this._zoom);
        const list = [this._base_layer].concat(this._layers);
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
                    key={`layer-tile-${
                        index === 0 ? 'default' : index
                    }-${t}-${x}-${y}`}
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
