import Route from "./config/Route"

const Routes = [
   {
    url:'/users',
    proxy: {
        target:"http://localhost:3000/", 
        changeOrigin: true,
        pathRewrite: {
            ['^/users']:''
        }
    }
   } as Route,
   {
    url:'/ride',
    proxy: {
        target:"http:localhost:8080/",
        changeOrigin: true,
        pathRewrite: {
            ['^/ride']:''
        }
    }
   } as Route

]

export default Routes