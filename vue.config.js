const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    //proxy: 'https://apiapporderseg.appconmiciv.com/',
    /*allowedHosts: "all",
       client: {
            webSocketURL: 'https://9770-190-236-202-32.ngrok-free.app/'
       }*/

  }
})
