define('app/component/invoice-editor',['require','module','react','reflux',
	'app/utils/linkedStateRadioGroupMixin','langs/'+QING_LOCALE,'app/store/invoice','lodash'],
	function(require,module,React,Reflux,LinkedStateRadioGroupMixin,langs,InvoiceStore,_){
	//发票编辑器
	module.exports = React.createClass({
		getInitialState:function(){
			return {
				'invoiceCompany':'',
				'enabled':0
			}
		},
		save:function(){
			if(this.state.enabled && ''===_.trim(this.state.invoiceCompany)){
				layer.msg(langs.trans('要开发票就要填写发票抬头，公司类型的请填写公司名称，个人的请填写个人姓名'));
			}else{
				this.props.save({enabled:this.state.enabled==1?true:false,invoiceTitle:this.state.invoiceCompany});
			}
		},
		unSave:function(){
			this.props.unsave()
		},
		mixins:[Reflux.connect(InvoiceStore),React.addons.LinkedStateMixin,LinkedStateRadioGroupMixin],
		render:function(){
			var isEnabled  = this.radioGroup("enabled");
			return (
				<div className="row">
					<form method="post" className="qing-pad-tb-10 col-md-12 form-horizontal" id="addressEditForm">
						
						<div className="form-group clearfix">
							<label className="col-md-3 align-right control-label">{langs.trans('开发票')}</label>
							<div className="col-md-9">
								<label className="radio-inline qing-radio">
								    <input type="radio" name="isEnabled"  value="1" checkedLink={isEnabled.valueLink('1')}/><i></i>{langs.trans('是')}
								</label>
					    	
					    		<label  className="radio-inline qing-radio">
								    <input type="radio" name="isEnabled" value="0" checkedLink={isEnabled.valueLink('0')}/><i></i>{langs.trans('否')}
								</label>
							</div>
						</div>
						<div className="form-group">
							<label className="col-md-3 align-right control-label">{langs.trans('发票抬头')}</label>
							<div className="col-md-9">
								<input type="text"  className="form-control required" valueLink={this.linkState('invoiceCompany')}  name="invoiceCompany" maxLength="30"/>
							</div>
						</div>
						<div className="form-group align-center clearfix">
							<button className="btn " onClick={this.save} type="button">{langs.trans('保存')}</button>
							&nbsp;<button className="btn " onClick={this.unSave} type="button">{langs.trans('取消')}</button>
						</div>
					</form>
				</div>
			)
		}
	});
	
});