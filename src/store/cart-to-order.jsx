define('app/store/cart-to-order',['require','module','reflux','lodash','app/utils/qing','app/store/member','app/action/member','layer','langs/'+QING_LOCALE],function(require,module,Reflux){
	var MemberStore   = require('app/store/member');
	var MemberActions = require('app/action/member');
	var _ 			  = require('lodash');
	var Qing		  = require('app/utils/qing');
	var layer		  = require('layer');
	var langs		  = require('langs/'+QING_LOCALE);

	module.exports = Reflux.createStore({
		shipFee:0,
		selectedAddressId:'',
		productTotalFee:0,
	    init:function(){
	    	//地址有变化时要通知过来
	    	this.listenTo(MemberActions.selectAddress,this.onSelectAddress);
	    },
	    initProductTotalFee:function(fee){
	    	this.productTotalFee = fee;
	    },
	    onSelectAddress:function(addr){
	    	if(this.shipFee)
	    		layer.msg(langs.trans('地址变更，重新计算运费'));
	    	// console.log('this.shipFee'+this.shipFee);
	    	// console.log('this.productTotalFee'+this.productTotalFee);
	    	Qing.apiPost('shipping.getFee',{'cityId':addr['cityId'],'pay':this.productTotalFee},function(resp){
				if(!resp.error){
					this.selectedAddressId = addr['id'];
					this.shipFee = parseFloat(resp.data.fee);
					this.trigger({'shipFee':this.shipFee,'selectedAddressId':this.selectedAddressId});
				}else{
					layer.closeAll();
					layer.msg(resp.msg);
				}
			}.bind(this));
	    	
	    }
	});
});