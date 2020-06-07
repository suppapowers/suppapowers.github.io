function loaderLoad(img) {
    var cv = document.createElement('canvas');
    cv.width = img.width;
    cv.height = img.height;
    var ct = cv.getContext('2d')
    ct.drawImage(img, 0, 0, img.width, img.height);
    
    var hor = 10, vert = 12;
    var ascii = 32;
    
    for(var x=0; x<img.width; x+=hor) {
        LetterLib[ascii] = [];
        for(var y=0; y<Math.floor(img.height/vert); y++) {
            LetterLib[ascii][y] = [];
            loaderParse(ascii, y, ct.getImageData(x, y*vert, hor, vert).data, hor, vert);
        }
        ascii++;
    }
};

function loaderParse(ascii, variation, data, w, h) {
    for(var i = 0; i<w*h; i++) {
        var val = loaderGetPixColor(i, data);
        if(val>=0) {
//            console.log(ascii);
            var x = i%w;
            var y = (i-x)/w;
            LetterLib[ascii][variation].push([x-4, y-9, val]);
        }
    }
};


function loaderGetPixColor(n, data) {
//    var n = (y*canvas.width + x)*4;
    n*=4;
    var sum = data[n]+data[n+1]+data[n+2];
    
    if(sum<60) return -1;
    if(sum>700) return 1;
    if(sum>400) return 0;
    if(data[n+2]>200) return 2;
    if(data[n+1]>200) return 3;
    if(data[n]>200) return 4;
}
