/**
 * 
 */

const earthRadiusMeters = 6371000.0;
const metersPerDegree = 2.0 * Math.PI * earthRadiusMeters / 360.0;
const radiansPerDegree = Math.PI / 180.0;
const degreesPerRadian = 180.0 / Math.PI;
let pointArr;

export const calculateArea = (points) => {
    if (!points || points.length < 3) return null;
    let areaMeters2 = PlanarPolygonAreaMeters2(points);
    console.log('result', areaMeters2)
    // if (areaMeters2 > 1000000.0) {
    //     areaMeters2 = SphericalPolygonAreaMeters2(points);
    //     alert("面积为" + areaMeters2 + "平方米");
    // }
    return areaMeters2
}

/*球面多边形面积计算*/
function SphericalPolygonAreaMeters2(points) {
    var totalAngle = 0;
    for (var i = 0; i < points.length; i++) {
        var j = (i + 1) % points.length;
        var k = (i + 2) % points.length;
        totalAngle += Angle(points[i], points[j], points[k]);
    }
    var planarTotalAngle = (points.length - 2) * 180.0;
    var sphericalExcess = totalAngle - planarTotalAngle;
    if (sphericalExcess > 420.0) {
        totalAngle = points.length * 360.0 - totalAngle;
        sphericalExcess = totalAngle - planarTotalAngle;
    } else if (sphericalExcess > 300.0 && sphericalExcess < 420.0) {
        sphericalExcess = Math.abs(360.0 - sphericalExcess);
    }
    return sphericalExcess * radiansPerDegree * earthRadiusMeters * earthRadiusMeters;
}

/*角度*/
function Angle(p1, p2, p3) {
    var bearing21 = Bearing(p2, p1);
    var bearing23 = Bearing(p2, p3);
    var angle = bearing21 - bearing23;
    if (angle < 0) {
        angle += 360;
    }
    return angle;
}


/*方向*/
function Bearing(from, to) {
    var lat1 = from[1] * radiansPerDegree;
    var lon1 = from[0] * radiansPerDegree;
    var lat2 = to[1] * radiansPerDegree;
    var lon2 = to[0] * radiansPerDegree;
    var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
    if (angle < 0) {
        angle += Math.PI * 2.0;
    }
    angle = angle * degreesPerRadian;
    return angle;
}

/*平面多边形面积*/
const PlanarPolygonAreaMeters2 = (points) => {
    let a = 0;
    for (let i = 0; i < points.length; ++i) {
        const j = (i + 1) % points.length;
        const xi = points[i][0] * metersPerDegree * Math.cos(points[i][1] * radiansPerDegree);
        const yi = points[i][1] * metersPerDegree;
        const xj = points[j][0] * metersPerDegree * Math.cos(points[j][1] * radiansPerDegree);
        const yj = points[j][1] * metersPerDegree;
        a += xi * yj - xj * yi;
    }
    return Math.abs(a / 2);
}

function b() {
    var s = "112.523197631836,37.868892669677734;112.5170669555664,37.8605842590332;112.52099609375,37.849857330322266;112.54137420654297,37.8512732521875;112.5351180302734,37.858699798583984";
    var s1 = new Array()
    s1 = s.split(";");
    for (var i = 0; i < s1.length; i++) {
        var ss = s1[i];
        var temp = ss.split(",");
        var point = new Array();
        point.push(Number(temp[0]), Number(temp[1]));
        pointArr.push(point);
    }
    calculateArea(pointArr);
}