/*:ja
 * @plugindesc マップリロード
 * @author hiz
 *
 * @param triggerKey
 * @desc リロードを行うキーのキーコード（標準はF11）
 * @default 122
 *
 * @help 指定したキー（標準はF11）を押した際に、マップを強制的にリロードするプラグインです。
 */

(function() {
	var parameters = PluginManager.parameters('ReloadMap');
  	var triggerKey = Number(parameters['triggerKey']);
	var _Scene_Map_update = Scene_Map.prototype.update;
	Input.keyMapper[triggerKey] = 'reload_map';
    Scene_Map.prototype.update = function() {
    	_Scene_Map_update.call(this);
    	if(Input.isTriggered ('reload_map')) {
    		// 現在の座標に場所移動（強制的にマップをリロード）
    		$gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer._x, $gamePlayer._y, $gamePlayer._direction, 2);
    		$gamePlayer._needsMapReload = true;
    	}

	};
})();