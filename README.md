# sta_anxin
安装步骤：
1. 安装node
2. 安装npm
3. 安装grunt-cli
4. npm install -d
//ok。安装完成。

//nginx配置文件示例：
server {
    listen 80;
    server_name s1.anxinsta.com *.anxinsta.com;

    #error_log /var/log/nginx/anxinsta.error.log;

    location ~ '^/(.*?)(\.__\d*__)(\..*)$' {
        #有版本号的文件保存7天过期
        expires 7d;
        alias /data/www/sta_anxin2/build/$1$3;
    }

    location / {
        #没有版本号的、不缓存
        root /data/www/sta_anxin2/build;
        expires -1;
    }
    add_header Access-Control-Allow-Origin *;
}
