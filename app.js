let http = require('http');
let formidable = require('formidable');
const challenge1= require('./challenge-neubox-1')

http.createServer(function (req, res) {

  //Create an instance of the form object
  let form = new formidable.IncomingForm();
  //Process the file upload in Node
  form.parse(req, function (error, fields, file) {
    let filepath = file.fileupload.filepath;
    console.log(filepath)
    challenge1.start(filepath)
    res.write('File uploaded, please check the logs');
    res.end();
   
  });

}).listen(3003);