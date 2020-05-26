const http  = require("http");
const {URL} = require("url");
const qs    = require("querystring");
const port  = 8000;
function miHandler(request, response) {
    const {method, url, headers, secure} = request;
    const proto = secure ? "https://" : "http://";
    const baseurl = proto + headers.host;
    const urlobj = new URL(url, baseurl); // me genera baseurl+url
    const qsobj = qs.parse(urlobj.searchParams.toString());
    response.writeHead(200, {"Content-Type":"text/plain"});
    //En este punto ya tenemos headers, url, method, protocol y querystring.
    if( ["GET", "DELETE", "OPTIONS"].includes(method) ) {
        //cuando no hay payload
        response.write("Pérame...");
        response.end();
    }else { //POST, PUT o PATCH
        let body = [];
        request.on("error", (err) => {
            console.error(err.stack);
        }).on("data", (chunk) => {
            body.push(chunk);
        }).on("end", () => {
            body = Buffer.concat(body).toString();
            response.write("Enviaste el payload: "+body);
            switch(method) {
                case "POST" :
                    response.write("\nEscogiste POST!");
                    break;
                case "PUT" :
                    response.write("\nEscogiste PUT!");
                    break;
                case "PATCH" :
                    response.write("\nEscogiste PATCH!");
                    break;
                default:
                    response.write("\nEscogiste OTRA COSA!");
                    break;
                //default
            }
            response.end();
        });
    }
}
const server = http.createServer(miHandler);
console.log("escuchando en el puerto "+port+"...");
server.listen(port);
//curl -d '{"hola":"mundo}' -H 'content-type:application/json' -X POST 'localhost:8000/hola/mundo/como/estas?lol=rofl&lmao=zomfg'
