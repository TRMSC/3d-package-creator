/* MIT License */
/* Copyright (c) 2017 Saurabh Bhatia */
/* https://github.com/sbtron/makeglb */

var files=[];
var fileblobs=[];
var gltf;
var remainingfilestoprocess=0;
var glbfilename;

var outputBuffers;
var bufferMap;
var bufferOffset;

function dropInit() {
  var dropZone = document.getElementById('drop_zone');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);
}

function handleDragOver(event) {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

function styleDragOver(event) {
  document.getElementById("drop_zone").style.boxShadow = "0 0 10px";
  document.getElementById("drop_zone").style.background = "#00000033";

}
function styleDragLeave(event) {
  document.getElementById("drop_zone").style.boxShadow = "initial";
  document.getElementById("drop_zone").style.background = "initial";
}


function handleFileSelect(event) {
  document.getElementById("filecheck").classList.remove("checked");
  event.stopPropagation();
  event.preventDefault();
  document.getElementById('list').innerHTML="";
  //addDownloadButton();
  var items = event.dataTransfer.items;
  console.log(items);
  remainingfilestoprocess=items.length;
  for (var i=0; i<items.length; i++) {
    if (items[i].getAsEntry) {
      var entry = items[i].getAsEntry();
      console.log (items[i] + " via getAsEntry()");
    } else if (items[i].webkitGetAsEntry) {
      var entry = items[i].webkitGetAsEntry();
      console.log (items[i] + " via webkitGetAsEntry()");
    }
    if (entry) {
      console.log(entry);
      traverseFileTree(entry);
      var timeout;
      timeout = window.setTimeout(traverseFileTree(entry), 2000);
    }
  }
  console.log(remainingfilestoprocess+ " files");
  console.log(items);
}


function traverseFileTree(item, path) {
  path = path || "";
  if (item.isFile) {
    item.file(function(file) {
        files.push(file);
        var extension = file.name.split('.').pop();
        
        if (extension == "zip") {
          traverseZip2(file);
          return;
        }
        
        var filetype;
        if (file.type == "") { filetype = extension; } 
        else { filetype = file.type; }
        var fileitem = '<li><strong>'+ decodeURIComponent(file.name)+ '</strong> ('+ filetype + ') - '+
                  file.size+ ' bytes ' + '</li>';
        document.getElementById('list').innerHTML += fileitem;

        if ( extension === "glb") {
          console.log ("(makeglb) file is glb");
          openGlb(file);
          return;
        }

        if ( extension === "gltf") {
          console.log ("(makeglb) file is gltf");
          glbfilename=file.name.substr(file.name.lastIndexOf('/')+1,file.name.lastIndexOf('.'));
          var reader = new FileReader();
          reader.readAsText(file);
          reader.onload = function(event) {
            gltf = JSON.parse(event.target.result);
            checkRemaining();
          };
        }

        // --------------------------------------------------

        if ( extension === 'zip' ) {
          traverseZip2(file);
          return;
        }

        // --------------------------------------------------

        if ( extension === 'xyz' ) {
          console.log ("zip loaded");
          /*
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onloadend = function () {
            const data = reader.result;
            console.log ("data is " + data);
            console.log ("data is " + data.length);
          }
          */
          var items = [];
          fileNumber = 0;
          JSZip.loadAsync(file).then((zip) => {
            for (let i in zip.files) {
              console.log(i);
              items[fileNumber] = i;
              //handleFileSelect(i);
              fileNumber++;
            }
            console.log (zip);
            console.log (zip.files) 

            remainingfilestoprocess=fileNumber;
            //checkRemaining();
            console.log(fileNumber + " files");
            console.log(items);

            for (let i in zip.files) {
              console.log(zip.files[i]);
              entry = zip.files[i];  // CONVERT FROM ZIP OBJECT TO FILE ENTRY
              console.log(entry);
              // traverseFileTree(entry);
              traverseZip(entry);
            }
          });
        }

        // --------------------------------------------------

        else{
          var reader = new FileReader();
          reader.onload = (function(theFile) {
          return function(e) {
          fileblobs[theFile.name.toLowerCase()]=(e.target.result);
          checkRemaining();
          };
        })(file);
        reader.readAsArrayBuffer(file);
      }
    },function(error){
        console.log(error);
    });
  } else if (item.isDirectory) {
    var dirReader = item.createReader();
    dirReader.readEntries(function(entries) {
        remainingfilestoprocess+=entries.length;
        checkRemaining();
      for (var i=0; i<entries.length; i++) {
        traverseFileTree(entries[i], path + item.name + "/");
      }
    });
  }
}

// ----------------------------------------------------

function traverseZip(zipObject) {
  // path = path || "";
  if (!zipObject.dir) {
    //zipObject(function(file) {
    //    files.push(file);
    file = zipObject;
        var extension = file.name.split('.').pop();
        var filetype;
        if (file.type == "") { filetype = extension; } 
        else { filetype = file.type; }
        var fileitem = '<li><strong>'+ decodeURIComponent(file.name)+ '</strong> ('+ filetype + ') - '+
                  file.size+ ' bytes ' + '</li>';
        document.getElementById('list').innerHTML += fileitem;

        if ( extension === "glb") {
          console.log(this + " is glb");         
          openGlb(file);
          return;        
        }

        if ( extension === "gltf") {
          console.log(this + " is gltf");
          /*
          glbfilename=file.name.substr(file.name.lastIndexOf('/')+1,file.name.lastIndexOf('.'));
          var reader = new FileReader();
          reader.readAsText(file);
          reader.onload = function(event) {
            gltf = JSON.parse(event.target.result);
            checkRemaining();
          };
          */
        }

        else {
          console.log(this + " is another file");
          /*
          var reader = new FileReader();
          reader.onload = (function(theFile) {
            return function(e) {
              fileblobs[theFile.name.toLowerCase()]=(e.target.result);
              checkRemaining();
            };
          })(file);
          reader.readAsArrayBuffer(file);
          */
        }
    // },function(error){
    //    console.log(error);
    // });
  } 

  else if (zipObject.dir) {
    console.log(this + " is directory");
    /*
    var dirReader = item.createReader();
    dirReader.readEntries(function(entries) {
        remainingfilestoprocess+=entries.length;
        checkRemaining();
      for (var i=0; i<entries.length; i++) {
        traverseFileTree(entries[i], path + item.name + "/");
      }
    });
    */
  }
}

// ----------------------------------------------------

function traverseZip2(file) {
  handleZip(file, (err, result) => {
    if (err) {
        const previewError = document.getElementById("content-error");
        previewError.innerHTML = err === true ? '*Please check the zip file is correct' : err;
        return;
    }
    console.log ("result is " + result);
    window.assetFile = result.split(",")[1];
    window.assetName = 'asset.gltf';
    //checkUserUploadStatus();
    let preview = document.getElementById("content-preview");
    preview.innerHTML = previewModelTemplate(result, file.name);
  })
}

// ----------------------------------------------------

function checkRemaining(){
    remainingfilestoprocess--;
    if(remainingfilestoprocess===0){
      outputBuffers = [];
      bufferMap = new Map();
      bufferOffset = 0;
      processBuffers().then(fileSave);
    }
}

function processBuffers(){
  var pendingBuffers = gltf.buffers.map(function (buffer, bufferIndex) {
    return dataFromUri(buffer)
      .then(function(data) {
        if (data !== undefined) {
          outputBuffers.push(data);
          console.log ("push");
        } else {
          alert ("Bitte erneut laden...");
        }
        delete buffer.uri;
        buffer.byteLength = data.byteLength;
        bufferMap.set(bufferIndex, bufferOffset);
        bufferOffset += alignedLength(data.byteLength);
      });
  });

  return Promise.all(pendingBuffers)
    .then(function() {
        var bufferIndex = gltf.buffers.length;
        var images = gltf.images || [];
        var pendingImages = images.map(function (image) {
          return dataFromUri(image).then(function(data) {
            if (data === undefined) {
                delete image['uri'];
                return;
            }
            var bufferView = {
                buffer: 0,
                byteOffset: bufferOffset,
                byteLength: data.byteLength,
            };
            bufferMap.set(bufferIndex, bufferOffset);
            bufferIndex++;
            bufferOffset += alignedLength(data.byteLength);
            var bufferViewIndex = gltf.bufferViews.length;
            gltf.bufferViews.push(bufferView);
            outputBuffers.push(data);
            image['bufferView'] = bufferViewIndex;
            image['mimeType'] = getMimeType(image.uri);
            delete image['uri'];
          });
        });
        return Promise.all(pendingImages);
    });
}

function fileSave(){
    var Binary = {
        Magic: 0x46546C67
    };

    for (var _i = 0, _a = gltf.bufferViews; _i < _a.length; _i++) {
        var bufferView = _a[_i];
        if(bufferView.byteOffset=== undefined){
            bufferView.byteOffset=0;
        }
        else{
        bufferView.byteOffset = bufferView.byteOffset + bufferMap.get(bufferView.buffer);
      }
        bufferView.buffer = 0;
    }
    var binBufferSize = bufferOffset;
    gltf.buffers = [{
        byteLength: binBufferSize
    }];

    var enc = new TextEncoder();
    var jsonBuffer = enc.encode(JSON.stringify(gltf));
    var jsonAlignedLength = alignedLength(jsonBuffer.length);
    var padding;
    if (jsonAlignedLength !== jsonBuffer.length) {

        padding = jsonAlignedLength- jsonBuffer.length;
    }
    var totalSize = 12 + // file header: magic + version + length
        8 + // json chunk header: json length + type
        jsonAlignedLength +
        8 + // bin chunk header: chunk length + type
        binBufferSize;
    finalBuffer = new ArrayBuffer(totalSize);
    var dataView = new DataView(finalBuffer);
    var bufIndex = 0;
    dataView.setUint32(bufIndex, Binary.Magic, true);
    bufIndex += 4;
    dataView.setUint32(bufIndex, 2, true);
    bufIndex += 4;
    dataView.setUint32(bufIndex, totalSize, true);
    bufIndex += 4;
    // JSON
    dataView.setUint32(bufIndex, jsonAlignedLength, true);
    bufIndex += 4;
    dataView.setUint32(bufIndex, 0x4E4F534A, true);
    bufIndex += 4;

    for (var j=0;j<jsonBuffer.length;j++){
        dataView.setUint8(bufIndex, jsonBuffer[j]);
        bufIndex++;
    }
    if(padding!==undefined){
        for (var j=0;j<padding;j++){
            dataView.setUint8(bufIndex, 0x20);
        bufIndex++;
    }
    }

    // BIN
    dataView.setUint32(bufIndex, binBufferSize, true);
    bufIndex += 4;
    dataView.setUint32(bufIndex, 0x004E4942, true);
    bufIndex += 4;
    for (var i = 0; i < outputBuffers.length; i++) {
      var bufoffset = bufIndex + bufferMap.get(i);
      var buf = new Uint8Array(outputBuffers[i]);
      var thisbufindex=bufoffset;
      for (var j=0;j<buf.byteLength;j++){
        dataView.setUint8(thisbufindex, buf[j]);
        thisbufindex++;
    }
    }
    /*
    var a = document.getElementById("downloadLink");
    var file = new Blob([finalBuffer],{type: 'model/json-binary'})
    a.href = URL.createObjectURL(file);
    a.download = glbfilename+".glb";
    document.getElementById("downloadBtn").disabled=false;
    document.getElementById("downloadBtn").textContent="Download .glb";
    a.click();
    */
    origin = false;
    upload = true;
    handleModelUpload(origin);
    //file = new Blob([finalBuffer],{type: 'model/json-binary'});
    //file2 = URL.createObjectURL(file);
    //handleContentUpload(file);

}


function isBase64(uri) {
    return uri.length < 5 ? false : uri.substr(0, 5) === "data:";
}
function decodeBase64(uri) {
    return fetch(uri).then(function(response) { return response.arrayBuffer(); });
}
function dataFromUri(buffer) {
    if (buffer.uri === undefined) {
      return Promise.resolve(undefined);
    } else if (isBase64(buffer.uri)) {
      return decodeBase64(buffer.uri);
    } else {
      var filename=buffer.uri.substr(buffer.uri.lastIndexOf('/')+1);
      return Promise.resolve(fileblobs[filename.toLowerCase()]);
    }
}
function alignedLength(value) {
    var alignValue = 4;
    if (value == 0) {
        return value;
    }
    var multiple = value % alignValue;
    if (multiple === 0) {
        return value;
    }
    return value + (alignValue - multiple);
}

function getMimeType(filename) {
    for (var mimeType in gltfMimeTypes) {
        for (var extensionIndex in gltfMimeTypes[mimeType]) {
            var extension = gltfMimeTypes[mimeType][extensionIndex];
            if (filename.toLowerCase().endsWith('.' + extension)) {
                return mimeType;
            }
        }
    }
    return 'application/octet-stream';
}

var gltfMimeTypes = {
    'image/png': ['png'],
    'image/jpeg': ['jpg', 'jpeg'],
    'text/plain': ['glsl', 'vert', 'vs', 'frag', 'fs', 'txt'],
    'image/vnd-ms.dds': ['dds']
};