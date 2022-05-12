//=============================================================================
// RTK_EventMatch.js  ver1.01 2016/07/24
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc Set switch when all conditions are met in map events
 * @author Toshio Yamashita (yamachan)
 *
 * @param tag name
 * @desc Tag name used in Event's note.
 * @default event match
 *
 * @help This plugin does not provide plugin commands.
 *
 * Event Note:
 *   <event match_sr:s,r>	# Switch s' condition is this event is in r region
 *   <event match_!sr:s,r>	# Switch s' condition is this event is not in r region
 *   <event match_vr:v,r>	# Add 1 to variable v, if this event is in r region
 *   <event match_!vr:v,r>	# Add 1 to variable v, if this event is not in r region
 *   <event match_se:s,e>	# Switch s' condition is this event and e event is in a same location
 *   <event match_!se:s,e>	# Switch s' condition is this event and e event is not in a same location
 *   <event match_ve:v,e>	# Add 1 to variable v, if this event and e event is in a same location
 *   <event match_!ve:v,e>	# Add 1 to variable v, if this event and e event is not in a same location
 */

/*:ja
 * @plugindesc マップでイベントの条件が全て揃うとスイッチをON
 * @author Toshio Yamashita (yamachan)
 *
 * @param tag name
 * @desc イベントのメモ欄で使用するタグ名
 * @default event match
 *
 * @help このプラグインにはプラグインコマンドはありません。
 *
 * イベントのメモ:
 *   <event match_sr:s,r>	# スイッチ s の条件はこのイベントが r リージョンにあること
 *   <event match_!sr:s,r>	# スイッチ s の条件はこのイベントが r リージョンにないこと
 *   <event match_vr:v,r>	# このイベントが r リージョンにあれば変数 v に1を加える
 *   <event match_!vr:v,r>	# このイベントが r リージョンになければ変数 v に1を加える
 *   <event match_se:s,e>	# スイッチ s の条件はこのイベントが e イベントと同じ位置にあること
 *   <event match_!se:s,e>	# スイッチ s の条件はこのイベントが e イベントと同じ位置にないこと
 *   <event match_ve:v,e>	# このイベントが  e イベントと同じ位置にあれば変数 v に1を加える
 *   <event match_!ve:v,e>	# このイベントが  e イベントと同じ位置になければ変数 v に1を加える
 *
 * 解説ページ:
 * https://github.com/yamachan/jgss-hack/blob/master/RTK_EventMatch.ja.md
 */

//-----------------------------------------------------------------------------

(function(_global) {
	var N = 'RTK_EventMatch';

	var param = PluginManager.parameters(N);
	var tag_name = param['tag name'] || "event match";

	var _Game_Map_updateEvents = Game_Map.prototype.updateEvents;
	Game_Map.prototype.updateEvents = function() {
		_Game_Map_updateEvents.call(this);

		var sws = [];
		var vars = [];
		this.events().forEach(function(event) {
			var meta = event.event().meta || {};
			var ret = String(meta[tag_name + "_sr"]||"").match(/^\s*(\d+),(\d+)\s*$/);
			if (ret) {
				var sw = Number(ret[1]);
				if (sw > 0) {
					sws[sw] = (sws[sw] === undefined ? true : sws[sw]) && event.regionId() == Number(ret[2]);
				}
			}
			ret = String(meta[tag_name + "_!sr"]||"").match(/^\s*(\d+),(\d+)\s*$/);
			if (ret) {
				var sw = Number(ret[1]);
				if (sw > 0) {
					sws[sw] = (sws[sw] === undefined ? true : sws[sw]) && event.regionId() != Number(ret[2]);
				}
			}
			ret = String(meta[tag_name + "_vr"]||"").match(/^\s*(\d+),(\d+)\s*$/);
			if (ret) {
				var v = Number(ret[1]);
				if (v > 0 && event.regionId() == Number(ret[2])) {
					vars[v] = vars[v] || 0;
					vars[v]++;
				}
			}
			ret = String(meta[tag_name + "_!vr"]||"").match(/^\s*(\d+),(\d+)\s*$/);
			if (ret) {
				var v = Number(ret[1]);
				if (v > 0 && event.regionId() != Number(ret[2])) {
					vars[v] = vars[v] || 0;
					vars[v]++;
				}
			}
			ret = String(meta[tag_name + "_se"]||"").match(/^\s*(\d+),(\d+)\s*$/);
			if (ret) {
				var sw = Number(ret[1]);
				var ev = $gameMap.event(Number(ret[2])) || {};
				if (sw > 0) {
					sws[sw] = (sws[sw] === undefined ? true : sws[sw]) && event.x == ev.x && event.y == ev.y;
				}
			}
			ret = String(meta[tag_name + "_!se"]||"").match(/^\s*(\d+),(\d+)\s*$/);
			if (ret) {
				var sw = Number(ret[1]);
				var ev = $gameMap.event(Number(ret[2])) || {};
				if (sw > 0) {
					sws[sw] = (sws[sw] === undefined ? true : sws[sw]) && (event.x != ev.x || event.y != ev.y);
				}
			}
			ret = String(meta[tag_name + "_ve"]||"").match(/^\s*(\d+),(\d+)\s*$/);
			if (ret) {
				var v = Number(ret[1]);
				var ev = $gameMap.event(Number(ret[2])) || {};
				if (sw > 0 && event.x == ev.x && event.y == ev.y) {
					vars[v] = vars[v] || 0;
					vars[v]++;
				}
			}
			ret = String(meta[tag_name + "_!ve"]||"").match(/^\s*(\d+),(\d+)\s*$/);
			if (ret) {
				var v = Number(ret[1]);
				var ev = $gameMap.event(Number(ret[2])) || {};
				if (sw > 0 && (event.x != ev.x || event.y != ev.y)) {
					vars[v] = vars[v] || 0;
					vars[v]++;
				}
			}
		});
		for (var l=0; l<sws.length; l++) {
			if (sws[l] && !$gameSwitches.value(l)) {
				$gameSwitches.setValue(l, true);
			}
		}
		for (var l=0; l<vars.length; l++) {
			if (vars[l] && $gameVariables.value(l) != vars[l]) {
				$gameVariables.setValue(l, vars[l]);
			}
		}
	};
})(this);
