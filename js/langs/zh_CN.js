define('langs/zh_CN',['require','exports','module'],function (require, exports, module) {
	module.exports = {
			trans:function(index,placeholders){
				var translated;
				if(typeof this.data[index] !='undefined'){
					translated =  this.data[index];
				}else{
					translated = index;
				}
				return this._replacePlaceholder(translated,placeholders);
		},
		_replacePlaceholder:function(translated,placeholders){
			if(typeof placeholders=='object'){
				for(var k in placeholders){
					translated = translated.replace(new RegExp('%'+k+'%', 'g'),placeholders[k]);
				}
			}
			return translated;
		},
		data:{
		}
	}
});