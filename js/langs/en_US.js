define('langs/en_US',['require','exports','module'],function (require, exports, module) {
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
			'请输入正确手机号码':'Please type the correct phone number',
			'请输入大于0的整数':'Please type the positive number',
			'请输入您的手机号码':'Please Type your phone number',
			'手机号不正确或已被注册':'The phone number is not correct or registered by somebody.',
			'请输入登陆密码':'Please type your password',
			'密码至少需要%len%位':'Passowrd length must be more than %len%',
			'请填写您手机接收到的验证码':'Please type the verification code received from your phone',
			'请填写您的真实姓名':'Please type your real name',
			'注册前必须同意协议':'Terms and conditions must be agreed upon before registration',
			'请检查表单':'Please check your form',
			'获取手机验证码':'Get verification code',
			'至少购买1件':'Add 1 product at least',
			'商品名称':'Product Name',
			'单价':'Price',
			'数量':'Quantity',
			'小计':'Subtotal',
			'操作':'Action',
			'删除':'Remove',
			'您的购物车还是空的！':'Your shopping cart is empty',
			'已选商品<em>%len%</em>件':'<em>%len%</em> of items',
			'合计（不含运费）':'Total ',
			'去结算':'Checkout',
			'请选择要购买的商品':'Please select the items',
			'收货地址':'Shipping Address',
			'修改':'Edit',
			'默认地址':'Default',
			'新增收货地址':'Add a new address',
			'显示更多地址':'Show more',
			'向上收起':'Slide up',
			'商品列表':'Products',
			'我要留言':'Message for seller',
			'发票信息':'Invoice informaction',
			'运费':'Shipping Cost',
			'应付总额':'All Total',
			'提交订单':'Place Order',
			'是':'Yes',
			'否':'No',
			'不需要开发票':'Not need invoice',
			'开发票':'Need Invoice',
			'发票抬头':'Invoice Title',
			'取消':'Cancel',
			'保存':'Save',
			'详细地址':'Street Address',
			'所在地区':'Your Region',
			'收货人电话':'Mobile/Tel',
			'收货人姓名':'Contact Name',
			'请选择省市':'Please Select',
			'省份':'Province',
			'城市':'City',
			'<em class="cart-total-qty">%len%</em>件商品，总商品金额':'Subtotal(<em class="cart-total-qty">%len%</em> items)'
		}
	}
});