if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/LineObstacle'
], function(
	LineObstacle
) {
	function Level() {
		this.obstacles = [];

		//create the level
		this._createPoly([900,1100,  1100,1100, 1100,1110, 900,1110], true);
		this._createPoly([1150,1100, 1175,1100, 1175,1110, 1150,1110], true);
		this._createPoly([1200,1100, 1250,1103, 1250,1107, 1200,1110], true);
		this._createPoly([1300,1100, 1310,1100, 1310,1110, 1300,1110], true);
		this._createPoly([1325,1100, 1375,1090, 1375,1120, 1325,1110], true);

		this._createPoly([700,700, 710,700, 710,900, 700,900], true);
		this._createPoly([700,680, 710,680, 710,690, 700,690], true);
		this._createPoly([703,660, 707,660, 710,670, 700,670], true);
		this._createPoly([700,640, 710,640, 710,650, 700,650], true);
		this._createPoly([695,620, 715,620, 710,630, 700,630], true);

		this._createPoly([750,550, 900,550, 900,560, 750,560], true);
		this._createPoly([910,550, 920,550, 920,560, 910,560], true);
		this._createPoly([930,550, 940,553, 940,557, 930,560], true);
		this._createPoly([950,550, 960,550, 960,560, 950,560], true);
		this._createPoly([970,550, 980,545, 980,565, 970,560], true);

		this._createPoly([875,1090,  885,1090, 885,1070, 875,1070]);

		this._createPoly([600,1210,  600,1220,  710,1220,  710,1210]);
		this._createPoly([1300,900,  1400,1000, 1300,1000], true);
		this._createPoly([1225,825,  1275,875,  1225,875], true);
		this._createPoly([1175,700,  1200,800,  1175,800], true);
		this._createPoly([1500,900,  1510,900,  1510,600,  1500,600]);
		this._createPoly([1505,990,  1515,990,  1510,950,  1500,950]);
		this._createPoly([1600,860,  1590,860,  1590,600,  1600,600], true);
		this._createPoly([980,1220,  900,1180,  900,1170,  1100,1170, 1100,1180, 1020,1220], true);
		this._createPoly([200,1510,  200,1500,  2000,1500, 2000,1510], true);
		this._createPoly([1300,1315, 1260,1250, 1300,1340, 1340,1250]);
		this._createPoly([1400,1300, 1360,1250, 1400,1320, 1440,1250]);
		this._createPoly([1500,1285, 1460,1250, 1500,1320, 1540,1250]);
		this._createPoly([1600,1270, 1560,1250, 1600,1320, 1640,1250]);
		this._createPoly([1600,1100, 1560,1150, 1600,1080, 1640,1150], true);
		this._createPoly([990,800,   1010,800,  1010,820,  990,820], true);
		this._createPoly([1030,880,  1050,880,  1050,900,  1030,900], true);
		this._createPoly([950,880,   970,880,   970,900,   950,900], true);
		this._createPoly([1030,720,  1050,720,  1050,740,  1030,740], true);
		this._createPoly([950,720,   970,720,   970,740,   950,740], true);
		this._createPoly([910,840,   930,840,   930,860,   910,860], true);
		this._createPoly([910,760,   930,760,   930,780,   910,780], true);
		this._createPoly([1070,840,  1090,840,  1090,860,  1070,860], true);
		this._createPoly([1070,760,  1090,760,  1090,780,  1070,780], true);
		this._createPoly([800,1000,  680,1100,  625,1085,  590,980,], false);
	}
	Level.prototype.render = function(ctx, camera) {
		for(var i = 0; i < this.obstacles.length; i++) {
			this.obstacles[i].render(ctx, camera);
		}
	};
	Level.prototype._createPoly = function(points, reverse) {
		var i, line;
		if(reverse) {
			var reversedPoints = [];
			for(i = 0; i < points.length; i += 2) {
				reversedPoints[i] = points[points.length - i - 2];
				reversedPoints[i+1] = points[points.length - i - 1];
			}
			points = reversedPoints;
		}

		//create the lines
		for(i = 0; i < points.length - 2; i += 2) {
			line = new LineObstacle(points[i], points[i + 1], points[i + 2], points[i + 3]);
			this.obstacles.push(line);
		}
		line = new LineObstacle(points[points.length - 2], points[points.length - 1], points[0], points[1]);
		this.obstacles.push(line);
	};
	return Level;
});