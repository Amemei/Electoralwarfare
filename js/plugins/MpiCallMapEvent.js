//===========================================================================
// MpiCallMapEvent.js
//===========================================================================

/*:
 * @plugindesc プラグインコマンドでマップイベントを呼び出します。
 * @author 奏ねこま（おとぶき ねこま）
 *
 * @param Plugin Command
 * @desc プラグインコマンド名を任意のコマンド名に変更できます。
 * @default CallMapEvent
 * 
 * @help
 * [使用方法]
 *  プラグインコマンドにて、以下のようにコマンドを指定してください。
 * 
 *   CallMapEvent 数字
 *   CallMapEvent 文字列
 *   CallMapEvent \v[変数番号]
 * 
 * [使用例] 引数に数字を指定した場合
 * 
 *   CallMapEvent 2
 * 
 *  ID:002のイベントを呼び出します。（同マップ内のイベント）
 * 
 * [使用例] 引数に文字列を指定した場合
 * 
 *   CallMapEvent ABC
 * 
 *  メモ欄に「<ABC>」と書かれたイベントを呼び出します。（同マップ内のイベント）
 * 
 * [使用例] 引数に変数を指定した場合
 * 
 *   CallMapEvent \v[3]
 * 
 *  変数#0003番の値を引数として、プラグインコマンドを実行します。
 *  変数の値が数字であれば「引数に数字を指定した場合」の挙動となり、
 *  変数の値が文字列であれば「引数に文字列を指定した場合」の挙動となります。
 * 
 * [利用規約] ..................................................................
 *  - 本プラグインの利用は、RPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
 *  - 商用、非商用、有償、無償、一般向け、成人向けを問わず、利用可能です。
 *  - 利用の際、連絡や報告は必要ありません。また、製作者名の記載等も不要です。
 *  - プラグインを導入した作品に同梱する形以外での再配布、転載はご遠慮ください。
 *  - 本プラグインにより生じたいかなる問題についても、一切の責任を負いかねます。
 * [改訂履歴] ..................................................................
 *   Version 1.00  2017/06/10  First edition.
 * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
 *  Web Site: http://makonet.sakura.ne.jp/rpg_tkool/
 *  Twitter : https://twitter.com/koma_neko
 *  Copylight (c) 2017 Nekoma Otobuki
 */

var Imported = Imported || {};
var Makonet = Makonet || {};

(function(){
    'use strict';

    var plugin = 'MpiCallMapEvent';

    Imported[plugin] = true;
    Makonet[plugin] = {};

    var $mpi = Makonet[plugin];
    $mpi.parameters = PluginManager.parameters(plugin);

    $mpi.plugin_command = $mpi.parameters['Plugin Command'];

    var _ = plugin;
    var $_ = `$${_}`;

    //==============================================================================
    // Private Methods
    //==============================================================================

    function convertVariables(text) {
        if (typeof(text) !== 'string') return text;
        var pattern = '\\\\v\\[(\\d+)\\]';
        while (text.match(RegExp(pattern, 'i'))) {
            text = text.replace(RegExp(pattern, 'gi'), function(){
                return $gameVariables.value(+arguments[1]);
            });
        }
        return text;
    }

    //==============================================================================
    // Game_Interpreter
    //==============================================================================

    (function(o,p){
        var f=o[p];o[p]=function(command, args){
            f.apply(this,arguments);
            if (command === $mpi.plugin_command) {
                var tag = convertVariables(args[0]);
                var id = +tag;
                console.log(tag);
                if (id) {
                    this.setupChild($gameMap._events[id].list(), this._eventId);
                } else {
                    $gameMap._events.some(function(event) {
                        if (event && event.event().meta[tag]) {
                            this.setupChild(event.list(), this._eventId);
                            return true;
                        }
                    }, this);
                }
            }
        };
    }(Game_Interpreter.prototype,'pluginCommand'));
}());
