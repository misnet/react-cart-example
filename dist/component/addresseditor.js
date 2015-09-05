define('app/component/addresseditor',['require','exports','module','react','reflux','app/action/region','app/store/member','app/utils/linkedStateRadioGroupMixin','validator'],function(require,exports,module,React,Reflux){
	var RegionActions = require('app/action/region');
	var MemberStore   = require('app/store/member');
	var langs		  = require('langs/'+QING_LOCALE);

	var LinkedStateRadioGroupMixin = require('app/utils/linkedStateRadioGroupMixin');

	//省份
	var ProvinceItem = React.createClass({displayName: "ProvinceItem",
		getDefaultProps:function(){
			return {
				data:[],
				selectProvince:null,
				selected:0
			}
		},
		shouldComponentUpdate:function(nextProp,nextState){
			return (nextProp.data!=this.props.data || nextProp.selected!=this.props.selected);
		},
		select:function(){
			this.props.selectProvince(this.props.data)
		},
		render:function(){
			return (
				React.createElement("li", null, 
					React.createElement("a", {className: this.props.selected['id']==this.props.data['id']?'cart-region-item active':'cart-region-item', onClick: this.select, key: 'province-'+this.props.data['id'], "data-province-id": this.props.data['id']}, this.props.data['name'])
				)
			)
		}
	});

	//城市
	var CityItem = React.createClass({displayName: "CityItem",
		getDefaultProps:function(){
			return {
				data:[],
				selectCity:null
			}
		},
		shouldComponentUpdate:function(nextProp,nextState){
			return (nextProp.data!=this.props.data || nextProp.selected!=this.props.selected);
		},
		select:function(){
			this.props.selectCity(this.props.data)
		},
		render:function(){
			return (
				React.createElement("li", null, 
					React.createElement("a", {className: this.props.selected['id']==this.props.data['id']?'cart-region-item active':'cart-region-item', onClick: this.select, key: 'city-'+this.props.data['id'], "data-city-id": this.props.data['id']}, this.props.data['name'])
				)
			)
		}
	});
	//新增或修改地址
	module.exports = React.createClass({displayName: "exports",
		showRegionSelector:function(ev){
			$(ev.target).next('.cart-region-list').removeClass('hide');
			$(document).on('mousedown touchstart',function(e){
				if (!($('.cart-region-selector-title').is(e.target) ||
					$('.cart-region-selector-title').find(e.target).length ||
					$('.cart-region-list').is(e.target) ||
					$('.cart-region-list').find(e.target).length
				)){
					$('.cart-region-list').addClass('hide');
				}
			});
		},
		selectProvince:function(province){
			RegionActions.selectProvince(province,function(){
				$('a[for=cityTab]').trigger('click');
			});
		},
		selectCity:function(city){
			RegionActions.selectCity(city);
			$('#addressEditForm').valid();
		},
		//保存收货地址
		saveAddress:function(){
			var data = {
				phone:this.state.phone,
				receiver:this.state.receiver,
				address:this.state.address,
				cityId:this.state.selectedCity['id'],
				provinceId:this.state.selectedProvince['id'],
				isDefault:this.state.isDefault,
				id:this.state.id
			};

			
			if($('#addressEditForm').valid()){
				this.props.saveHandler(data);
			}
		},
		cancelSave:function(){
			this.props.cancelSave()
		},
		getInitialState:function(){
			return MemberStore.getInitAddressObject();
		},
		componentWillMount:function(){

		},
		componentDidMount:function(){
			//初始化省份列表
			RegionActions.loadRegionProvince();
			//切换机制
			$('.nav-region a').on('click',function(){
				var htmlFor = $(this).attr('for');
				$(this).parent('li').siblings('li.active').removeClass('active');
				$(this).parent('li').addClass('active');
				var contentContainer = $(this).parents('ul.nav').eq(0).next('.tab-content');
				contentContainer.children('div.tab-pane').removeClass('active');
				contentContainer.children('#'+htmlFor).addClass('active');
			});
			//ready validate
			require('validator');
			$('#addressEditForm').validate({
				ignore:"",
				messages:{
					addrMan:{required:langs.trans('请填写收货人姓名')},
					addrPhone:{required:langs.trans('请填写收货人电话')},
					addrDetail:{required:langs.trans('请填写详细收货地址')},
					provinceId:{required:langs.trans('请选择省份')},
					cityId:{required:langs.trans('请选择城市')}
				}
			});
		},
		mixins: [Reflux.connect(MemberStore),React.addons.LinkedStateMixin,LinkedStateRadioGroupMixin],

		render:function(){
			var defaultAddress = this.radioGroup("isDefault");
			return (
				React.createElement("div", {className: "row"}, 
					React.createElement("form", {method: "post", className: "qing-pad-tb-10 col-md-12 form-horizontal", id: "addressEditForm"}, 
						React.createElement("div", {className: "form-group"}, 
							React.createElement("label", {className: "col-md-3 align-right control-label"}, langs.trans('收货人姓名')), 
							React.createElement("div", {className: "col-md-9"}, 
								React.createElement("input", {type: "text", className: "form-control required", valueLink: this.linkState('receiver'), name: "addrMan", maxLength: "30"})
							)
						), 
						React.createElement("div", {className: "form-group"}, 
							React.createElement("label", {className: "col-md-3 align-right control-label"}, langs.trans('收货人电话')), 
							React.createElement("div", {className: "col-md-9"}, 
								React.createElement("input", {type: "text", className: "form-control required", valueLink: this.linkState('phone'), name: "addrPhone", maxLength: "30"})
							)
						), 
						React.createElement("div", {className: "form-group"}, 
							React.createElement("label", {className: "col-md-3 align-right control-label"}, langs.trans('所在地区')), 
							React.createElement("div", {className: "col-md-9"}, 
								React.createElement("div", {className: "cart-region-selector"}, 
									React.createElement("input", {type: "hidden", className: "required", valueLink: this.linkState('selectedProvinceId'), name: "provinceId"}), 
									React.createElement("input", {type: "hidden", className: "required", valueLink: this.linkState('selectedCityId'), name: "cityId"}), 
									React.createElement("div", {className: "cart-region-selector-title", onClick: this.showRegionSelector}, this.state.selectedRegion), 
									React.createElement("div", {className: "cart-region-list hide"}, 
										React.createElement("ul", {className: "nav nav-tabs nav-justified nav-region"}, 
											React.createElement("li", {className: "active"}, React.createElement("a", {htmlFor: "provinceTab"}, langs.trans('省份'))), 
											React.createElement("li", null, React.createElement("a", {htmlFor: "cityTab"}, langs.trans('城市')))
										), 
										React.createElement("div", {className: "tab-content"}, 
											React.createElement("div", {id: "provinceTab", className: "tab-pane active fade in"}, 
												React.createElement("ul", null, 
												_.map(this.state.provinceList,function(province){
													return React.createElement(ProvinceItem, {selectProvince: this.selectProvince, selected: this.state.selectedProvince, data: province, key: "province-"+province['id']})
												},this)
												)
											), 
											React.createElement("div", {id: "cityTab", className: "tab-pane fade in"}, 
												React.createElement("ul", null, 
												_.map(this.state.cityList,function(city){
													return React.createElement(CityItem, {selectCity: this.selectCity, selected: this.state.selectedCity, data: city, key: "city-"+city['id']})
												},this)
												)
											)
										)
									)
								)
							)
						), 
						React.createElement("div", {className: "form-group"}, 
							React.createElement("label", {className: "col-md-3 align-right control-label"}, langs.trans('详细地址')), 
							React.createElement("div", {className: "col-md-9"}, 
								React.createElement("input", {type: "text", className: "form-control required", valueLink: this.linkState('address'), name: "addrDetail", maxLength: "100"})
							)
						), 
						React.createElement("div", {className: "form-group clearfix"}, 
							React.createElement("label", {className: "col-md-3 align-right control-label"}, langs.trans('默认地址')), 
								
							React.createElement("div", {className: "col-md-9"}, 
								React.createElement("label", {className: "radio-inline qing-radio"}, 
								    React.createElement("input", {type: "radio", name: "isDefault", value: "1", checkedLink: defaultAddress.valueLink('1')}), React.createElement("i", null), langs.trans('是')
								), 
					    	
					    		React.createElement("label", {className: "radio-inline qing-radio"}, 
								    React.createElement("input", {type: "radio", name: "isDefault", value: "0", checkedLink: defaultAddress.valueLink('0')}), React.createElement("i", null), langs.trans('否')
								)
							)
						), 
						React.createElement("div", {className: "form-group align-center clearfix"}, 
							React.createElement("button", {className: "btn ", onClick: this.saveAddress, type: "button"}, langs.trans('保存')), 
							" ", React.createElement("button", {className: "btn ", onClick: this.cancelSave, type: "button"}, langs.trans('取消'))
						)
					)
				)
			)
		}
	});
});