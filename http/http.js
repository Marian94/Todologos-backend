const http  = require("http");
const {URL} = require("url");
const qs    = require("querystring");
const port  = 8000;
function miHandler(request, response) {
    const {method, url, headers, secure} = request;
    let body = [];
    request.on("error", (err) => {
        console.error(err.stack);
    }).on("data", (chunk) => {
        body.push(chunk);
    }).on("end", () => {
        body = Buffer.concat(body).toString();
        const proto = secure ? "https://" : "http://";
        const baseurl = proto+headers.host;
        const urlobj = new URL(url, baseurl);
        const qsobj = qs.parse(urlobj.searchParams.toString());
        response.writeHead(200, {"Content-Type":"text/plain"});
        //En este punto ya tenemos headers, url, method, protocol, querystring y body.
        response.write("\nUsaste el protocolo: "+proto);
        response.write("\nEntraste a la ruta: "+urlobj.pathname);
        response.write("\nUsaste el verbo: "+method);
        response.write("\nEnviaste la querystring:");
        for(q in qsobj) {
            response.write("\n    "+q+" : "+qsobj[q]+",");
        }
        response.write("\nEnviaste los headers:");
        for(h in headers) {
            response.write("\n    "+h+" : "+headers[h]+",");
        }
        response.write("\nEnviaste el body: "+body);
        response.end();
    });
}
const server = http.createServer(miHandler);
console.log("escuchando en el puerto "+port+"...");
server.listen(port);
//curl -d '{"hola":"mundo}' -H 'content-type:application/json' -X POST 'localhost:8000/hola/mundo/como/estas?lol=rofl&lmao=zomfg'
