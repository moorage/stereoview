var http = require("http"),
  url = require("url"),
  path = require("path"),
  fs = require("fs"),
  mime   = require('mime');

var STATIC_DIR = "public";
var POINTCLOUD_PATH = "/js/scene/cloud.js";

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

function renderViewer(response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<!DOCTYPE \"html\">");
  response.write("<html>");
  response.write("<head>");
  response.write("<title>3d Viewer</title>");
  response.write('<link rel="stylesheet" type="text/css" href="/css/application.css">');
  response.write("</head>");
  response.write("<body><div></div>");
  response.write('<script src="/js/potree/libs/three.js/build/three.js"></script>');
  response.write('<script src="/js/potree/libs/other/OrbitControls.js"></script>');
  response.write('<script src="/js/potree/src/Potree.js"></script>');
  response.write('<script src="/js/potree/src/PointCloudOctreeGeometry.js"></script>');
  response.write('<script src="/js/potree/src/PointCloudOctree.js"></script>');
  response.write('<script src="/js/potree/src/loader/POCLoader.js"></script>');
  response.write('<script src="/js/potree/src/loader/PointAttributes.js"></script>');
  response.write('<script src="/js/potree/src/utils.js"></script>');
  response.write('<script src="/js/potree/src/LRU.js"></script>');
  response.write('<script src="/js/loader.js"></script>');
  response.write("</body>");
  response.write("</html>");
  response.end();
}

var server = http.createServer(function(request, response) {

  var url_parts = url.parse(request.url, true)
    , uri = url_parts.pathname
    , params = url_parts.query
    , filename = path.join(process.cwd(), STATIC_DIR, uri);
  
  // console.log("uri: " + uri, "   pathname: " + url.parse(request.url).pathname)
  
  // base url
  if (uri == "/") {
    // console.log("    -> renderViewer(...)")
    renderViewer(response);
    return;
  }
  
  // long poll
  else if (uri == "/reloader.json") {
    console.log("refreshing!  params:", params);
    pointcloudFilename = path.join(process.cwd(), STATIC_DIR, POINTCLOUD_PATH);
    fs.stat(pointcloudFilename, function(err, stats) {
      response.writeHead(200, {"Content-Type": 'application/json'});
      response.write('{"lastUpdated":"'+stats.mtime+'", "pointcloudPath": "'+POINTCLOUD_PATH+'"}');
      response.end();
    });
  }
  
  else {
    fs.exists(filename, function(exists) {
      if(!exists) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write(filename + " not found\n");
        response.end();
        console.log(request.url + " -> 404 not found")
        return;
      }
 
      if (fs.statSync(filename).isDirectory()) filename += '/index.html';
 
    
      fs.readFile(filename, "binary", function(err, file) {
        if(err) {        
          response.writeHead(500, {"Content-Type": "text/plain"});
          response.write(err + "\n");
          response.end();
          return;
        }
 
        var contentType = 'application/octet-stream';
        if (filename.endsWith('.css')) {
          contentType = 'text/css';
        } else if (filename.endsWith('.js')) {
          contentType = 'application/javascript';
        } else if (filename.endsWith('.json')) {
          contentType = 'application/json';
        } else if (filename.endsWith('.html')) {
          contentType = 'text/html';
        }
      

        // console.log("    -> 'Content-Type': " + contentType);
        response.writeHead(200, {"Content-Type": contentType});
        response.write(file, "binary");
        response.end();
      });
    });
  }
});
 
server.listen(8000);
console.log("Server is listening on localhost:8000");