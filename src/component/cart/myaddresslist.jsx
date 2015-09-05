define('app/component/cart/myaddresslist',['require','module','layer','react','reflux','app/action/member','app/store/member','app/component/addresseditor'],function(require,module,layer,React,Reflux){
	var MemberActions = require('app/action/member');
	var MemberStore   = require('app/store/member');
	var AddressEditor = require('app/component/addresseditor');
	var langs		  = require('langs/'+QING_LOCALE);
	//地址项
	var MyAddressItem = React.createClass({
		editAddrItem:function(e){
			this.props.editHandler(this.props.data);
			e.stopPropagation();
		},
		selectAddrItem:function(){
			this.props.selectHandler(this.props.data);
		},
		render:function(){
			return (
				<div className="col-md-3 qing-no-padding">
				<div className={(this.props.data['id']==this.props.selectedId)?'cart-addr-item cart-addr-active':'cart-addr-item'} onClick={this.selectAddrItem}>
					<div className="cart-addr-title">
						{this.props.data['provinceName'] + this.props.data['cityName']} （{langs.trans('%name% 收',{name:this.props.data['receiver']})}）
					</div>
					<div className="cart-addr-detail" >
						{this.props.data['address'] + ' ' + this.props.data['phone']}
						<br/><a className="cart-addr-edit" onClick={this.editAddrItem}><i className="fa fa-pencil"></i>{langs.trans('修改')}</a>
					</div><i></i>
					{(this.props.data['isDefault']==1)?<span className="cart-default-addr">{langs.trans('默认地址')}</span>:''}
					
				</div>
				</div>
			)
		}
	});
	//地址列表
	module.exports = React.createClass({
		getDefaultProps:function(){
			return {
				'selectAddress':function(){}
			}
		},
		getInitialState:function(){
			return {
				list:[],
				selectedAddressId:'',
				showItemLimit:4
			}
		},
		editorLayerIndex:null,
		mixins: [Reflux.connect(MemberStore)],
		componentDidMount:function(){
			MemberActions.loadAddressList();
		},
		newAddress:function(){
			MemberActions.newAddress();
			this.editorLayerIndex = layer.open({
			    type: 1,
			    skin: 'layui-layer-demo', //样式类名
			    closeBtn: false, //不显示关闭按钮
			    shift: 2,
			    shadeClose: true, //开启遮罩关闭
			    maxWidth:900,
			    area:'500px',
			    closeBtn:1,
			    title:langs.trans('新建收货地址'),
			    content: $('#addressEditor')
			});
		},
		hideAddressEditor:function(){
			layer.closeAll();
		},
		saveAddress:function(data){
			MemberActions.saveAddress(data,function(resp){
				layer.msg(resp.msg);
				layer.close(this.editorLayerIndex);
			}.bind(this));
		},
		editAddress:function(addr){
			MemberActions.loadAddress(addr);
			this.editorLayerIndex = layer.open({
				    type: 1,
				    skin: 'layui-layer-demo', //样式类名
				    closeBtn: false, //不显示关闭按钮
				    shift: 2,
				    shadeClose: true, //开启遮罩关闭
				    maxWidth:900,
				    area:'500px',
				    closeBtn:1,
				    title:langs.trans('修改收货地址'),
				    content: $('#addressEditor')
				});
		},
		selectAddress:function(addr){
			MemberActions.selectAddress(addr);
			this.props.selectAddress(addr['id']);
		},
		toggleShowMoreAddress:function(){
			MemberActions.toggleShowMoreAddress();
		},
		render:function(){
			var moreAddrs = '';
			if(_.isArray(this.state.list)){
				if(this.state.list.length>this.state.showItemLimit){
					moreAddrs = <a className="cart-addr-more" onClick={this.toggleShowMoreAddress}>{langs.trans('显示更多地址')}</a>
				}else{
					moreAddrs = <a className="cart-addr-more" onClick={this.toggleShowMoreAddress}>{langs.trans('向上收起')}</a>
				}
			}
			return (
				<div className="cart-mod row">
					<h2 className="cart-mod-title"><i className="icon iconfont">&#xe646;</i> {langs.trans('收货地址')}</h2>
					<div className="cart-addr-list qing-pad-bottom-10">
					{_.map(this.state.list,function(addr,i){
						if(i>=this.state.showItemLimit){
							return;
						}
						return <MyAddressItem data={addr} selectedId={this.state.selectedAddressId} selectHandler={this.selectAddress} editHandler={this.editAddress} key={addr['id']}/>
					},this)}
					</div>
					<div className="col-md-12">
						<button className="btn" onClick={this.newAddress} type="button"><i className="icon iconfont">&#xe62d;</i>{langs.trans('新增收货地址')}</button>
						{moreAddrs}
					</div>
					
					<div className="container-fluid" style={{display:'none'}} id="addressEditor"><AddressEditor saveHandler={this.saveAddress} cancelSave={this.hideAddressEditor}/></div>
				</div>
			)
		}
	});
});