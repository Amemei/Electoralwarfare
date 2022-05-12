//===================================================================
//ItemTrigger.js
//アイテム使用でイベント実行プラグイン
//===================================================================
//Copyright (c) 2017 蔦森くいな
//Released under the MIT license.
//http://opensource.org/licenses/mit-license.php
//-------------------------------------------------------------------
//blog   : http://paradre.com/
//Twitter: https://twitter.com/Kuina_T
//===================================================================
//＜更新情報＞
//　ver1.0.0 2017/06/30 初版
//===================================================================

/*:
 * @plugindesc メニュー画面からアイテムを使用して目の前のイベントを実行できます。
 * @author 蔦森くいな
 *
 * @help プラグイン管理画面からパラメータ「ItemId_Variable」に変数番号を設定すると、
 * メニュー画面からアイテムを使用した時、指定した番号の変数に
 * 使用アイテムのIDを代入してから目の前のイベントを実行します。
 * 
 * アイテム使用をトリガーに設定したいイベントの実行内容には、
 * プラグインで指定した変数を使った「条件分岐」を設定しておいて下さい。
 * 特定のアイテムを使った時だけ特定の処理を実行するイベントが作成できます。
 * 
 * 例）指定した変数の値が「3」の時のみ実行する条件分岐を設定したイベントは、
 * 　　ID「3」のアイテムを目の前で使った時のみ条件分岐の内容を実行します。
 * 
 * なお、１つのページのイベント内容の中に複数の条件分岐を設定する事で
 * 「アイテム１を使った時」「アイテム２を使った時」「話しかけられた時」など
 * それぞれの開始トリガーごとに実行内容を分ける事ができます。
 * 
 * また、データベースのアイテム使用効果にコモンイベントを設定している場合、
 * アイテム使用対象となるイベントが存在しなければそのコモンイベントを実行し
 * 使用対象となるイベントが存在すればコモンイベントをキャンセルします。
 * これにより、対象イベントが存在しない状況でアイテムを使用した時に
 * 「アイテムを使用したが何も起こらなかった」的な表現が実現できます。
 * 
 * 
 * ※このプラグインは対象イベントのプライオリティと
 * 　タイルセットのカウンター設定に対応しています。
 * 　通常の「決定ボタン」トリガーと同様の感覚でアイテム使用トリガーが発動します。
 * 
 * ※このプラグインで指定した変数はイベント終了時に自動的に値がリセットされます。
 * 　使用アイテムの判定以外の用途に利用する事は推奨されません。
 * 
 * @param ItemId_Variable
 * @desc 使用されたアイテムIDを受け取る変数の番号
 * @default 0
 *
 * 利用規約：
 * このプラグインは商用・非商用を問わず無料でご利用いただけます。
 * どのようなゲームに使っても、どのように加工していただいても構いません。
 * MIT Licenseにつき著作権表示とライセンスURLは残しておいて下さい。
 */

(function() {
    'use strict';
    var pd_IT_useVariableId = Number(PluginManager.parameters("ItemTrigger")["ItemId_Variable"]);
    var pd_IT_Scene_ItemBase_checkCommonEvent = Scene_ItemBase.prototype.checkCommonEvent;
    Scene_ItemBase.prototype.checkCommonEvent = function() {
        if(pd_IT_useVariableId != 0){
            if(!this.pd_IT_checkUseItemEvent($gamePlayer._x, $gamePlayer._y, false)){
                var x = $gameMap.roundXWithDirection($gamePlayer._x, $gamePlayer._direction);
                var y = $gameMap.roundYWithDirection($gamePlayer._y, $gamePlayer._direction);
                if(!this.pd_IT_checkUseItemEvent(x, y, true) && $gameMap.isCounter(x, y)){
                    var x2 = $gameMap.roundXWithDirection(x, $gamePlayer._direction);
                    var y2 = $gameMap.roundYWithDirection(y, $gamePlayer._direction);
                    this.pd_IT_checkUseItemEvent(x2, y2, true)
                }
            }
        }
        pd_IT_Scene_ItemBase_checkCommonEvent.call(this);
    };
    
    Scene_ItemBase.prototype.pd_IT_checkUseItemEvent = function(x, y, normal) {
        if(pd_IT_useVariableId != 0){
            var useItemId = this._itemWindow.item().id;
            var frontEvents = $gameMap.eventsXy(x, y);
            
            if(frontEvents.length >= 1){
                frontEvents.forEach(function(event) {
                    if(event.isNormalPriority() === normal && !event._erased){
                        if($dataMap.events[event._eventId].pages[event._pageIndex]){ // Add.20201207
                            var eventList = $dataMap.events[event._eventId].pages[event._pageIndex].list;
                            for(var i = 0; i < eventList.length; i++){
                                if(eventList[i].code === 111 && eventList[i].parameters[0] === 1 ){
                                    if(eventList[i].parameters[1] === pd_IT_useVariableId){
                                        var variableValue;
                                        if (eventList[i].parameters[2] === 0) {
                                            variableValue = eventList[i].parameters[3];
                                        } else {
                                            variableValue = $gameVariables.value(eventList[i].parameters[3]);
                                        }
                                        if(variableValue === useItemId){
                                            if ($gameTemp.isCommonEventReserved()) {
                                                $gameTemp.clearCommonEvent();
                                            }
                                            $gameVariables.setValue(pd_IT_useVariableId, useItemId);
                                            event.start();
                                            SceneManager.goto(Scene_Map);
                                            return true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
        return false;
    };
    
    var pd_IT_Game_Map_isEventRunning = Game_Map.prototype.isEventRunning;
    Game_Map.prototype.isEventRunning = function() {
        if(pd_IT_Game_Map_isEventRunning.call(this)){
            return true;
        }else{
            if(pd_IT_useVariableId != 0 && $gameVariables.value(pd_IT_useVariableId) != 0){
                $gameVariables.setValue(pd_IT_useVariableId, 0);
            }
            return false;
        }
    };
    
})();