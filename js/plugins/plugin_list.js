/*:ja
 * @plugindesc 入れてあるプラグインの一覧を出力します。
 * 
 * @author しぐれん（魔のささやき）
 * 
 * @param name
 * @desc 説明を出力するかを設定します。
 * 1:出力する/0:出力しない
 * @default 1
 * 
 * @param desc
 * @desc 説明を出力するかを設定します。
 * 1:出力する/0:出力しない
 * @default 1
 * 
 * @param writeParamFlag
 * @desc パラメータを出力します。
 * 1:出力する/0:出力しない
 * @default 0
 *
 * @param ON_only
 * @desc 設定でONになっているプラグインだけ出力するかを設定します。
 * true:ONのみ出力する/false:OFFも出力する
 * @default 0
 * 
 * @help
 * デバッグ用の情報チェック用です。
 * パラメータの状態も出力します。
 * 
 * var 1.0(2017/6/4) 公開
 */

(function (global) {
    'use strict';

	var p_params = PluginManager.parameters('plugin_list');

	var ON_only = Boolean(Number(p_params.ON_only));
	var desc = Boolean(Number(p_params.desc));
	var name = Boolean(Number(p_params.name));
	var writeParamFlag = Boolean( Number( p_params.writeParamFlag));

	var mode =1;
	var dataStr ='';


	function tub(){
		return (' ').repeat(4);
	}
	function endl(){
		return '\r\n';
	}

	function write(str){
		console.log(str);
		dataStr +=str;

	}

	function writeName(plg){
		write('<'+plg.name+'>'+endl());
	}

	function writeDesc(plg) {
		write(plg.description+endl());
		
	}

	function writeParams(plg){
		var param =plg.parameters;
		for(var p in param){
			write( tub()+p + ':'+ param[p]+endl());
		}
	}

	function writePlugin(plg){
		if(!ON_only || plg.status ){

			if(name){
				writeName(plg);
			}
			if(desc){
				writeDesc(plg);
			}

			if(writeParamFlag){
				writeParams(plg);
			}
		}
	}
	function save_XX(){
		 var path = require('path');

	    var dirPath = path.dirname(process.mainModule.filename)+'/debug/';
 
		var filePath = 'pluginData.txt';
	    var fs = require('fs');
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath);
		}
		console.log(dirPath);
	    fs.writeFileSync(dirPath+ filePath, dataStr);		
	}

    var zz_Scene_Boot_create_preDef = Scene_Boot.loadSystemImages;
    Scene_Boot.loadSystemImages= function() {
        zz_Scene_Boot_create_preDef.apply(this,arguments);
		var xxx=$plugins;		
		for(var i=0;i < xxx.length;++i){
			writePlugin(  xxx[i]);
		}

		save_XX();
		return;
    }

}());
