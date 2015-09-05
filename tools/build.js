({
	"appDir":'../dist',
	"dir":"../app",
    fileExclusionRegExp: /^\./,
    removeCombined:true,
    findNestedDependencies:true,
    preserveLicenseComments:false,
    modules:[
        {
            name:"app/page/cart"
        }
    ],
    "skipModuleInsertion":true,

	"optimize": "uglify2",
	"mainConfigFile":"main.js",
	 
    uglify2: {
        //Example of a specialized config. If you are fine
        //with the default options, no need to specify
        //any of these properties.
        output: {
            beautify: false
        },
        compress: {
            sequences: false,
            global_defs: {
                DEBUG: false
            }
        },
        warnings: true,
        mangle: false
    }
})