define('app/action/region',['require','module','reflux'],function(require, module,Reflux){
	module.exports = Reflux.createActions([
		'loadRegionProvince',
		'selectProvince',
		'selectCity'
	])
});