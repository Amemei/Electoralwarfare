//=============================================================================
// Parallaxtiratira.js
//=============================================================================

/*:ja
 * @plugindesc ver1.00 ゲーム開始時にタイルセットロードの猶予を与えます。
 * @author まっつＵＰ
 *
 * @help
 * 
 * RPGで笑顔を・・・
 * 
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 * 
 * 利用規約(2019/9/17変更)：
 * この作品は マテリアル・コモンズ・ブルー・ライセンスの下に提供されています。
 * https://materialcommons.tk/mtcm-b-summary/
 * クレジット表示：まっつＵＰ
 */

(function() {

var _Game_Player_fadeType = Game_Player.prototype.fadeType;
Game_Player.prototype.fadeType = function() {
    if(!this._fadeType) return 0;
    return _Game_Player_fadeType.call(this);
};
 
})();
