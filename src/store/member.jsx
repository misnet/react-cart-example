define('app/store/member',['require','module','reflux','app/utils/qing','lodash','app/action/member','layer','langs/'+QING_LOCALE,'app/action/region','app/store/region'],function(require,m,Reflux){
	var MemberActions = require('app/action/member');
	var layer         = require('layer');
	var langs         = require('langs/'+QING_LOCALE);
	var RegionActions = require('app/action/region');
	var RegionStore   = require('app/store/region');
	var _ 			  = require('lodash');
	var Qing		  = require('app/utils/qing');

	m.exports = Reflux.createStore({
		listenables:[MemberActions],
		addressData:{
			address:'',
			receiver:'',
			phone:'',
			id:'',
			isDefault:'0',
			selected:0
		},
		selectedAddressId:'',
		initAddressData:{},
		//列表默认显示几个
		showItemLimit:4,
		init:function(){
			this.addressData     = _.assign(this.addressData,RegionStore.getInitData());
			this.initAddressData = this.addressData;
			//侦听RegionStore数据变化
			this.listenTo(RegionStore,function(s){
				this.addressData = _.assign(this.addressData,s);
				this.trigger(this.addressData);
			});
		},
		onToggleShowMoreAddress:function(){
			if(this.showItemLimit!=this.list.length){
				this.showItemLimit = this.list.length;
			}else{
				this.showItemLimit = 4;
			}
			//重排序
			this.list = _.sortByOrder(this.list,['selected','isDefault'],['desc','desc']);

			this.trigger({'list':this.list,'showItemLimit':this.showItemLimit});
		},
		//选中某地址用于配货
		onSelectAddress:function(addr){
			this.selectedAddressId = addr['id'];
			this.list = _.map(this.list,function(item){
				if(item['id']==addr['id']){
					item['selected'] = 1;
				}else{
					item['selected'] = 0;
				}
				return item;
			});
			this.trigger({'selectedAddressId':this.selectedAddressId,'list':this.list});
		},
		onSaveAddress:function(data,callback){
			Qing.apiPost('member.saveAddress',data,function(resp){
				if('function'==typeof callback){
					callback(resp);
				}
				if(!resp.error){
					//更新list
					this.onLoadAddressList();
				}
			}.bind(this));
		},
		onNewAddress:function(){
			var data = this.getInitAddressObject(true);
			this.trigger(data);
		},
		getInitAddressObject:function(){
			//省份列表不再重新初始化
			this.initAddressData['provinceList'] = this.addressData['provinceList'];
			return this.initAddressData;
		},
		onLoadAddress:function(addressObject,callback){
			this.addressData.receiver = addressObject['receiver'];
			this.addressData.phone    = addressObject['phone'];
			this.addressData.address  = addressObject['address'];
			this.addressData.selectedProvinceId = addressObject['provinceId'];
			this.addressData.selectedCityId     = addressObject['cityId'];
			this.addressData.id         = addressObject['id'];
			this.addressData.isDefault  = addressObject['isDefault'];
			this.addressData.selectedRegion = addressObject['provinceName']+'/'+addressObject['cityName'];

			//根据provinceId与cityId取得相关内容
			this.addressData.selectedProvince = _.find(this.addressData.provinceList,function(p){
	    		return p.id === addressObject['provinceId'];
	    	});
	    	var $this = this;
	    	RegionActions.selectProvince(this.addressData.selectedProvince,function(){
				$this.addressData.selectedCityId = addressObject['cityId'];
	    		$this.addressData.selectedCity = _.find($this.addressData.cityList,function(c){
		    		return c.id === $this.addressData.selectedCityId;
		    	});
		    	//由于RegionActions事件的影响，selectedRegion被清掉，需要重置
		    	$this.addressData.selectedRegion = addressObject['provinceName']+'/'+addressObject['cityName'];
		    	//console.log($this.addressData);
		    	$this.trigger($this.addressData);
		    	if('function'== typeof callback){
		    		callback.call();
		    	}
	    	});
			//this.trigger(this.addressData);
		},
		onLoadAddressList:function(){
			var $this = this;
			Qing.apiPost('member.addressList',{},function(resp){
				$this.list = resp.data['list'];
				$this.trigger({'list':resp.data['list']});
				//选中默认
				if(!this.selectedAddressId && _.isArray($this.list) && $this.list.length>0){
					var defaultAddr = _.find($this.list,function(item){
						return item['isDefault']==1;
					});
					//console.log('set default');
					//console.log(defaultAddr);
					MemberActions.selectAddress(defaultAddr);
				}
			});
		}
	});
});