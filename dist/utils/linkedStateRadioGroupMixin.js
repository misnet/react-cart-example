define('app/utils/linkedStateRadioGroupMixin',['require','module'],function(require,module){
	module.exports = {
	    radioGroup : function(key){
	        return {
	            valueLink : function(value){
	                return {
	                    value : this.state[key] == value,
	                    requestChange : function(){
	                        var s = {};
	                        s[key] = value;
	                        this.setState(s) 
	                    }.bind(this)  
	                }
	            }.bind(this)
	        }
	    }
	};
});
