angular.module('global', ['ionic'])
.constant('GlobalVariable',{
	// SERVER_PATH:"http://192.168.8.110/ykg/index.php/Home/"
	SERVER_PATH:"http://api.zdsh365.com/ykg/index.php/Home/"
})

.value('GlobalValue',{
	FIRST_USE:true
})