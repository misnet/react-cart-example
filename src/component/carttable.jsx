define('app/component/carttable',[
	'require','module','react','langs/'+QING_LOCALE,'reflux','react-router',
	'app/action/cart','app/action/region','app/action/member',
	'app/store/region','app/store/member','app/store/cart',
	'app/component/cart/myaddresslist','layer','app/store/cart-to-order',
	'app/action/invoice','app/store/invoice','app/utils/linkedStateRadioGroupMixin','app/component/invoice-editor'],function (require,module,React) {

	var langs         = require('langs/'+QING_LOCALE);
	var CartActions   = require('app/action/cart');
	var RegionActions = require('app/action/region');
	var MemberActions = require('app/action/member');
	var InvoiceActions= require('app/action/invoice');
	var CartStore     = require('app/store/cart');
	var RegionStore   = require('app/store/region');
	var MemberStore   = require('app/store/member');
	var InvoiceStore  = require('app/store/invoice');
	var Reflux        = require('reflux');
	var ReactRouter   = require('react-router');
	var MyAddressList = require('app/component/cart/myaddresslist');
	var layer         = require('layer');
	var LinkedStateRadioGroupMixin = require('app/utils/linkedStateRadioGroupMixin');
	var InvoiceEditor = require('app/component/invoice-editor');
	var CartToOrderStore = require('app/store/cart-to-order');
	var CartTableHead = React.createClass({
		getDefaultProps:function(){
			return {
				'editable':true,
				'data':[
					{'label':'','className':'cart-checkbox select-all','type':'checkbox','forEdit':true},
					{'label':langs.trans('商品名称'),'className':'cart-col-name','type':'text','forEdit':false},
					{'label':langs.trans('单价'),'className':'cart-col-price','type':'text','forEdit':false},
					{'label':langs.trans('数量'),'className':'cart-col-qty','type':'text','forEdit':false},
					{'label':langs.trans('小计'),'className':'cart-col-sum','type':'text','forEdit':false},
					{'label':langs.trans('操作'),'className':'cart-col-op','type':'text','forEdit':true}]
			}
		},
		toggleAll:function(evt){
			CartActions.toggleSelectAll(evt.target.checked);
		},
		render:function(){
			$this = this;
			var h = this.props.data.map(function(item,i){
				if(item['forEdit'] && !$this.props.editable){
					return '';
				}
				var t;
				if(item['type']=='text'){
					t = item['label']
				}else if(item['type']=='checkbox'){
					t = (<label className="qing-checkbox" htmlFor={"col-index-"+i}>
						<input type="checkbox" onChange={$this.toggleAll} className={item['className']} id={'col-index-'+i}/><i></i>
					</label>);
				}
				return (
					<div key={i} className={"qing-col qing-col-th "+item['className']}>
					{t}
					</div>
				)
			});
			return (
				<div className="qing-table-head">
					{h}
				</div>
			)
		}
	});
	var CartItem = React.createClass({
		handleToggleChecked:function(){
			CartActions.toggleSelectItem(this.props.item['id']);
		},
		subtractQty:function(){
			if(this.props.item['qty']!=1){
				CartActions.subtractQty(this.props.item['id']);
			}
		},
		addQty:function(){
			CartActions.addQty(this.props.item['id']);
		},
		removeItem:function(e){
			CartActions.deleteItem(this.props.item['id']);
			e.preventDefault();
		},
		mixins: [React.addons.LinkedStateMixin],
		render:function(){
			var item = this.props.item;
			var cbxHtml = '',delHtml='',qtyHtml;
			if(this.props.editable){
				cbxHtml = (<div className="qing-col-td cart-checkbox">
					<label className="qing-checkbox" htmlFor={"cartItem-"+item['id']}>
						<input type="checkbox" onChange={this.handleToggleChecked} checked={!!item['selected']} id={"cartItem-"+item['id']} className="cart-item" value={item['id']}/><i></i>
					</label>
				</div>)
				delHtml = (
						<div className="qing-col-td">
							<a href="#" onClick={this.removeItem}>{langs.trans('删除')}</a>
						</div>
				)
				qtyHtml = (
						<div className="shop-product-qty">
							<button className={item['qty']==1 ? 'qty-btn qty-btn-disabled':'qty-btn'} onClick={this.subtractQty} data-qty="subtract" type="button">-</button>
							<input type="text" readOnly="readonly" value={item['qty']} name="buy-num" id="buy-num" className="qty-field"/>
							<button className="qty-btn" onClick={this.addQty} data-qty="add" type="button">+</button>
						</div>
				)
			}else{
				qtyHtml = <span >{item['qty']}</span>
			}
			return (
				<div className="qing-table-row">
					{cbxHtml}
					<div className="qing-col-td cart-col-name align-left">
						<img src={item['imgurl']} className="cart-item-img" width="120" height="120"/>
						<ul className="cart-item-title">
							<li>{item['productName']}</li>
							<li>{item['sn']}</li>
							<li>{item['skuNameString']}</li>
						</ul>
						
					</div>
					<div className="qing-col-td cart-col-price"><i className="fa fa-rmb"></i>{item['price']}</div>
					<div className="qing-col-td cart-col-qty">
						{qtyHtml}
					</div>
					<div className="qing-col-td cart-col-sum"><i className="fa fa-rmb"></i>{item['qty'] * item['price']}</div>
					{delHtml}
				</div>
			)
		}
	});
	var CartTableBody = React.createClass({
		getDefaultProps:function(){
			return {
				data:[],
				editable:true
			}
		},
		propTypes: {
            data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        },
		selectCartItem:function(){
			//console.log('11');
		},
		changeQty:function(){

		},
		render:function(){
			var $this = this;
			return (
				<div className="qing-table-body">
				{this.props.data.map(function(item,i){
					return <CartItem key={'cart-item'+i} item={item} editable={$this.props.editable}/>
				})}
				</div>
			);
		}
	});
	//空购物车
	var EmptyShoppingCart = React.createClass({
		render:function(){
			return (
				<div className="qing-empty-cart">
					<h2>{langs.trans('您的购物车还是空的！')}</h2>
				</div>
			);
		}
	});
	function flowCartSummary(){
		if($('#cart-summary').length){
			var curTop = parseInt($(document).scrollTop()) + parseInt($(window).height()) - parseInt($('#cart-summary').height());
			var minTop = $('#cart-summary').data('minTop');
			if(curTop<minTop){
				if(!$('#cart-summary').hasClass('cart-summary-up')){
					$('#cart-summary').addClass('cart-summary-up');
					//console.log('addClass');
				}
			}else{
				if($('#cart-summary').hasClass('cart-summary-up')){
					$('#cart-summary').removeClass('cart-summary-up');
					//console.log('removeClass');
				}
			}
		}
	}
	//合计部分
	var CartSummary = React.createClass({
		getInitialState:function(){
			return {
				className:'cart-summary clearfix'
			}
		},
		componentDidMount:function(){
			var minTop = $('#cart-summary').offset().top;
			$('#cart-summary').data('minTop',minTop);
			$(window).scroll(function(){
				flowCartSummary();
			});
			flowCartSummary();
		},
		mixins: [ ReactRouter.Navigation ],
		readyCreateOrder:function(){
			var selectedList = _.filter(this.props.data,function(item){
				return item['selected']==true;
			});
			if(_.isArray(selectedList) && selectedList.length>0){
				CartActions.selectItemToOrder(selectedList);
				this.transitionTo('rCartToOrder');
			}else
				layer.msg(langs.trans('请选择要购买的商品'));
		},
		render:function(){
			var selectedLen = 0;
			_.map(this.props.data,function(item){
				if(item['selected']){
					selectedLen+=parseInt(item['qty']);
				}
			});
			var selectedItemString = langs.trans('已选商品<em>%len%</em>件',{'len':selectedLen});
			var totalPay    = 0;
			_.map(this.props.data,function(item){
				if(item['selected']){
					totalPay+=parseInt(item['qty']) * parseFloat(item['price'])
				}
			});
			return (
				<div id="cart-summary" className={this.state.className}>
					<div className="pull-left"></div>
					<div className="pull-right">
						<span className="cart-selected-num" dangerouslySetInnerHTML={{
							__html:selectedItemString
						}}></span>
						<span className="cart-pay-amount">{langs.trans('合计（不含运费）')}<em><i className="fa fa-rmb"></i>{totalPay}</em></span>
						<button className="btn cart-goto-order" onClick={this.readyCreateOrder} type="button">{langs.trans('去结算')}</button>
					</div>
				</div>
			)
		}
	});
	//购物车应用
	var CartApp   = React.createClass({
		mixins: [Reflux.connect(CartStore)],
		getInitialState:function(){
			return{
				loaded:false,
				list:[]
			}
		},
		componentDidMount:function(){
			CartActions.loadItems();
		},
		render:function(){
			return (
				<ReactRouter.RouteHandler list={this.state.list} loaded={this.state.loaded} />
			)
		}
	});
	//购物车表
	var CartTable = React.createClass({
		//mixins:[ReactRouter.state],
		render:function(){
			var content = summary = '';
			if(this.props.loaded===false){
				layer.load(1);
				content = <p className="alert alert-warning"><i className="fa fa-info"></i> {langs.trans('加载中...')}</p>
			}else{
				layer.closeAll();
				var content = <EmptyShoppingCart />;
				var summary = <CartSummary data={this.props.list}/>;
				if (this.props.list!=null && this.props.list.length>0){
					content = (<div className="qing-table">
						<CartTableHead editable={true}/>
						<CartTableBody data={this.props.list} editable={true}/>
						</div>
						);
				}else{
					summary = '';
				}
			}
			return (
				<div>
				{content}
				{summary}
				</div>
			)
		}
	});
	//下单前，填信息界面
	var CartToOrder = React.createClass({
		getDefaultProps:function(){
			return {
				list:[]
			}
		},
		getInitialState:function(){
			return {
				shipFee:0,
				productTotalFee:0,
				selectedAddressId:'',
				selectedList:[],
				orderMemo:'',
				invoiceTitle:''
			}
		},
		mixins: [ Reflux.connect(CartStore),ReactRouter.State,ReactRouter.Navigation,React.addons.LinkedStateMixin],
		componentWillMount:function(){
			//TODO:如何改用Store的数据源
			var selectedList = _.filter(this.props.list,function(item){
				return item['selected']==true;
			});
			//var selectedList = this.state.selectedList;
			if(!_.isArray(selectedList) || selectedList.length==0){
				this.transitionTo('rCartTable');
			}
			var ptf = 0;
			_.map(selectedList,function(item){
				ptf+=parseInt(item['qty']) * parseFloat(item['price']);
			});
			CartStore.initProductTotalFee(ptf);
			this.setState({'productTotalFee':ptf});
		},
		submitOrder:function(){
			//CartActions.createOrder(this.state);
			var ids = [];
			_.map(this.state.selectedList,function(item){
				ids.push(item['id']);
			});
			CartActions.createOrder({
				addressId:this.state.selectedAddressId,
				memo:this.state.orderMemo,
				invoiceTitle:this.state.invoiceTitle,
				ids:ids
			},function(resp){
				//成功下单后，跳转

				if(resp.data['sn']){
					//订单号：
					console.log('订单号：'+resp.data['sn']);
				}

				//
			});
		},
		render:function(){

			return (
				<div classRow="row">
					<div className="col-md-12">
						<MyAddressList />
					</div>
					<WaitingForPayCartItemList list={this.state.selectedList}/>
					<div className="row">
						<div className="col-md-6">
							<div className="cart-mod">
								<h2 className="cart-mod-title"><i className="icon iconfont">&#xe625;</i> {langs.trans('我要留言')}</h2>
								<textarea className="form-control" rows="3" valueLink={this.linkState('orderMemo')}></textarea>
							</div>
						</div>
						<div className="col-md-6">
							<CartInvoice/>
						</div>
						<div className="col-xs-12">
							<CartSummaryForPay submitOrder={this.submitOrder} list={this.state.selectedList} shipFee={this.state.shipFee}/>
						</div>
					</div>
				</div>
			)
		}
	});
	//下单前计算总价
	var CartSummaryForPay = React.createClass({
		getDefaultProps:function(){
			return {
				shipFee:0,
				list:[],
				submitOrder:function(){}
			}
		},
		render:function(){
			var len = 0,totalPay=0,shipFeeHtml='';
			_.map(this.props.list,function(item){
				len     += parseInt(item['qty']);
				totalPay+= parseInt(item['qty'])*parseFloat(item['price']);
			});
			var totalProductAmountString = langs.trans('<em class="cart-total-qty">%len%</em>件商品，总商品金额',{'len':len});
			if(this.props.shipFee>0){
				shipFeeHtml = '￥' + this.props.shipFee;
			}else{
				shipFeeHtml = langs.trans('包邮');
			}
			return (
				<div className="cart-mod cart-beforepay-summary">
					<dl className="col-md-12 ">
						<dt dangerouslySetInnerHTML={{
							__html:totalProductAmountString
						}}></dt><dd>￥{totalPay}</dd>
					</dl>
					<dl className="col-md-12 ">
						<dt>{langs.trans('运费')}</dt>
						<dd>{shipFeeHtml}</dd>
					</dl>
					<dl className="col-md-12 ">
						<dt>{langs.trans('应付总额')}</dt>
						<dd>￥{parseFloat(totalPay) + parseFloat(this.props.shipFee)}</dd>
					</dl>
					<div className="col-md-12 clearfix cart-should-pay">
						<span>{langs.trans('应付总额')} ￥{parseFloat(totalPay) + parseFloat(this.props.shipFee)}</span>
						<button type="button" className="btn" onClick={this.props.submitOrder}>{langs.trans('提交订单')}</button>
					</div>
				</div>
			)
		}
	})
	//待付商品列表
	var WaitingForPayCartItemList = React.createClass({
		render:function(){
			return (
				<div className="row">
				<div className="cart-mod col-md-12">
					<h2 className="cart-mod-title"><i className="icon iconfont">&#xe620;</i> {langs.trans('商品列表')}</h2>
					<div className="qing-table">
						<CartTableHead editable={false}/>
						<CartTableBody data={this.props.list} editable={false}/>
					</div>
				</div>
				</div>
			)
		}
	});
	var CartMemo = React.createClass({
		render:function(){
			return (
				<div className="cart-mod">
					<h2 className="cart-mod-title"><i className="icon iconfont">&#xe625;</i> {langs.trans('我要留言')}</h2>
					<textarea className="form-control" rows="3">{this.props.orderMemo}</textarea>
				</div>
			)
		}
	});
	//支付方式
	var CartPayWay = React.createClass({
		render:function(){
			return (
				<div className="cart-mod">
					<h2 className="cart-mod-title"><i className="icon iconfont">&#xe611;</i> {langs.trans('支付方式')}</h2>
					<span><img src={QING_IMGHOST+'www/i/alipay.jpg'}/></span>
					<span><img src={QING_IMGHOST+'www/i/wxpay.jpg'}/></span>
				</div>
			)
		}
	});

	//发票
	var CartInvoice = React.createClass({
		editorLayerIndex:null,
		editInvoice:function(){
			this.editorLayerIndex = layer.open({
			    type: 1,
			    skin: 'layui-layer-demo', //样式类名
			    closeBtn: false, //不显示关闭按钮
			    shift: 2,
			    shadeClose: true, //开启遮罩关闭
			    maxWidth:900,
			    area:'500px',
			    closeBtn:1,
			    title:langs.trans('设置发票信息'),
			    content: $('#invoiceEditor')
			});
		},
		getInitialState:function(){
			return {
				enabled:false,
				invoiceTitle:''
			}
		},
		saveInvoice:function(data){
			CartActions.saveInvoice(data.enabled,data.invoiceTitle);
			this.setState(data);
			layer.close(this.editorLayerIndex);
		},
		unsaveInvoice:function(){
			layer.close(this.editorLayerIndex);
		},
		render:function(){
			//TODO:发票内容需要可定义
			if(this.state.enabled){
				var text = langs.trans('【发票抬头】') + this.state.invoiceTitle+langs.trans('，【发票内容】商品明细');
			}else{
				var text = langs.trans('不需要开发票');
			}
			return (
				<div className="cart-mod ">
					<h2 className="cart-mod-title"><i className="icon iconfont">&#xe624;</i> {langs.trans('发票信息')}</h2>

					<p>{text}
						<a className="cart-invoice-edit" onClick={this.editInvoice}><i className="fa fa-pencil"></i> {langs.trans('修改')}</a>
					
					</p>
					<div className="container-fluid" id="invoiceEditor" style={{display:'none'}}>
						<InvoiceEditor save={this.saveInvoice} unsave={this.unsaveInvoice}/>
					</div>
				</div>
			)
		}
	});
	module.exports = {
		render:function(tableId){
			var Router = ReactRouter; // 由于是html直接引用的库，所以 ReactRouter 是以全局变量的形式挂在 window 上  
			var Route = ReactRouter.Route;
			var routes = (
		        <Route handler={CartApp}>
		            <Route name="rCartTable" path="/" handler={CartTable} />
		            <Route name="rCartToOrder" path="/readyOrder" handler={CartToOrder} />
		            <Router.DefaultRoute handler={CartTable}/>
		            <Router.NotFoundRoute handler={CartTable}/>
		        </Route>
		    );

		    ReactRouter.run(routes, function(Handler) {
		        React.render(<Handler/>, document.getElementById(tableId));
		    });
			//React.render(<CartTable />,document.getElementById(tableId));
		}
	}
});