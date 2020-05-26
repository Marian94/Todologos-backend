//MARIANA: endpoint para alta de un usuario
//PEPE:    endpoint para consulta de una casa
//ANTONIO: endpoint para cambiar (PUT) una película
//KIKE:    endpoint para borrar un alumno (el ID está en la querystring)
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
    response.writeHead(201, {"Content-Type":"text/plain"});
    //En este punto ya tenemos headers, url, method, protocol y querystring.
    if( ["GET", "DELETE", "OPTIONS"].includes(method) ) {
        //cuando no hay payload
        switch(method) {
            case "GET":
                response.write("\nEscogiste GET!");
                //curl
                //-X GET
                //'localhost:8000/casa/pv15'
                if(urlobj.pathname.slice(0,6) === "/casa/") {
                    const idcasa = urlobj.pathname.slice(6);
                    //AQUÍ SE SIMULA LA TRANSACCIÓN EN LA BASE DE DATOS
                    const casaobj = { //objeto simulado
                        "habitaciones" : 1,
                        "domicilio"    : "quinto infierno #666",
                        "cocina"       : "integral"
                    };
                    response.write("\n\nLa casa con el id "+idcasa+" es: "+JSON.stringify(casaobj)+"\n");
                }
                break;
            case "DELETE":
                response.write("\nEscogiste DELETE!");
                const pathelems = urlobj.pathname.split("/");
                if(pathelems[1]==="alumnos") {
                    const idalumno = qsobj.id;
                    //SIMULAR QUE BORRÉ UN ALUMNO DE LA BASE DE DATOS
                    response.write("\n\nEl alumno con id: "+idalumno+" ha sido borrado.");
                }
                break;
            case "OPTIONS":
                response.write("\nEscogiste OPTIONS!");
                break;
            default:
                response.write("\nEscogiste OTRA COSA!");
                break;
            //default
        }
        response.end();
    }else { //POST, PUT o PATCH
        let body = [];
        request.on("error", (err) => {
            console.error(err.stack);
        }).on("data", (chunk) => {
            body.push(chunk);
        }).on("end", () => {
            body = Buffer.concat(body).toString();
            response.write("\n\nEnviaste el payload: "+body);
            switch(method) {
                case "POST" :
                    response.write("\n\nEscogiste POST!");
                    //curl
                    //-d '{"nombre":"mario", "email":"fulanito@aqui.com", "pass":"df46ddhs5"}'
                    //-H 'content-type:application/json'
                    //-X POST
                    //'localhost:8000/usuarios'
                    const newUser = JSON.parse(body);
                    if(urlobj.pathname === "/usuarios") {
                        //AQUÍ SE SIMULA LA TRANSACCIÓN EN LA BASE DE DATOS
                        response.write("\n\nEl usuario "+newUser.nombre+" fue dado de alta.\n");
                    }
​
                    break;
                case "PUT" :
                    response.write("\nEscogiste PUT!");
                    //curl
                    //-d '{"titulo":"joker", "year":2019, "duracion":"120 min."}' -H 'content-type:application/json' -X PUT 'localhost:8000/peliculas/9562'
                    //-H 'content-type:application/json' -X PUT 'localhost:8000/peliculas/9562'
                    //-X PUT 'localhost:8000/peliculas/9562'
                    //'localhost:8000/peliculas/9562'
                    if(urlobj.pathname.slice(0,11) === "/peliculas/") {
                        const idpelicula = urlobj.pathname.slice(11);
                        const peliculaobj = JSON.parse(body);
                        //AQUÍ SE SIMULA LA TRANSACCIÓN EN LA BASE DE DATOS
                        response.write("\n\nLa película con el id "+idpelicula+" ahora es: "+JSON.stringify(peliculaobj)+"\n");
                    }
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