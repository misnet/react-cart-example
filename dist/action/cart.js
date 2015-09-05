define('app/action/cart',['require','module','reflux'],function(require, module,Reflux){
	module.exports = Reflux.createActions([
	  'toggleSelectAll',
	  'loadItems',
	  'toggleSelectItem',
	  'deleteItem',
	  'subtractQty',
	  'addQty',
	  
	  'createOrder',
	  'saveInvoice',
	  'selectItemToOrder'
	]);
});