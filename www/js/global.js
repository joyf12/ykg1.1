angular.module('global', ['ionic'])
.constant('GlobalVariable',{
	SERVER_PATH:"http://192.168.10.233/ykg/index.php/Home/"
})

.value('GlobalValue',{
	FIRST_USE:true
})
