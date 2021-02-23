module.exports = global.config = {
    appConfig: {
        url: {
            dev: 'http://192.168.1.59/PandemikDebug/api/', 
            prod: 'http://192.168.1.59/Pandemik/api/' //http://192.168.1.59/PandemikDebug/api/
        }, 
        headers :{
            dev: new Headers({'Content-Type': 'application/json;charset=UTF-8'}),
            prod: ''
        },
        images :{
            local: require('../public/PandemikLogo.png'),
            local2: require('../public/PandemikLogo_S.png'),
            api: 'http://192.168.1.59/PandemikDebug/api/resources/images' //http://192.168.1.59/PandemikDebug/api/resources/images?img={img}
        },
        videos :{
            local: process.env.PUBLIC_URL,
            api: 'http://192.168.1.24:8000/videos/'
        }
    }
};