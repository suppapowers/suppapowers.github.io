var Colors = [];
    Colors.push( "#888" );
    Colors.push( "#fff" );
    Colors.push( "#0000ff" );
    Colors.push( "#00ff00" );
    Colors.push( "#ff0000" );

var LetterLib = [];

var Letter = function (symbol, variation, x, y) {
    this.px = [];
    this.x = x;
    this.y = y;
    this.tx = x;
    this.ty = y;
    this.dx = 0;
    this.dy = 0;
    this.defAxis = 0;
    this.collides = false;
    this.canvas = null;
    this.ctx = null;
    
    this.stretch = [ [], [] ];
    this.data( symbol.charCodeAt(0), variation );
};

Letter.prototype.data = function (id, variation) {
    if(!LetterLib[id] || LetterLib[id].length<1 || LetterLib[id][variation].length<1) return;
    
    for(var i=0; i<LetterLib[id][variation].length; i++) {
        this.pix( LetterLib[id][variation][i][0], LetterLib[id][variation][i][1], LetterLib[id][variation][i][2] );
    }
/*    if(id==97) {
        this.pix( 0, 0, 3 );
        this.pix( -1, 0, 1 );
        this.pix( -1, -1, 4 );
        this.pix( -1, -2, 1 );
        this.pix( 0, -2, 3 );
        this.pix( 1, -2, 1 );
        this.pix( 1, -1, 4 );
        this.pix( 1, 0, 1 );
        this.pix( 2, 0, 2 );
        this.pix( 1, -4, 4 );
        this.pix( 1, -3, 1 );
        this.pix( 1, -5, 1 );
        this.pix( 0, -5, 3 );
        this.pix( -1, -5, 1 );
        
        this.pix(-1, -6, 0);
        this.pix(0, -6, 0);
        this.pix(1, -6, 0);
        this.pix(2, -6, 0);
        this.pix(2, -5, 0);
        this.pix(2, -4, 0);
        this.pix(2, -3, 0);
        this.pix(2, -2, 0);
        this.pix(2, -1, 0);
        this.pix(2, 1, 0);
        this.pix(1, 1, 0);
        this.pix(0, 1, 0);
        this.pix(-1, 1, 0);
        this.pix(0, -1, 0);
        this.pix(0, -3, 0);
        this.pix(0, -4, 0);
        this.pix(-1, -4, 0);
        this.pix(-1, -3, 0);
    } else if(id==84) {
        this.pix( 0, 0, 4 );
        this.pix( 0, -1, 1 );
        this.pix( 0, -2, 1 );
        this.pix( 0, -3, 1 );
        this.pix( 1, -3, 1 );
        this.pix( 2, -3, 3 );
        this.pix( -1, -2, 3 );
        this.pix( -2, -2, 1 );
        this.pix( -2, -1, 2 );
        
        this.pix( 1, 0, 0 );
        this.pix( 1, -1, 0 );
        this.pix( 1, -2, 0 );
        this.pix( 2, -2, 0 );
        this.pix( 3, -2, 0 );
        this.pix( 3, -3, 0 );
        this.pix( 3, -4, 0 );
        this.pix( 2, -4, 0 );
        this.pix( 1, -4, 0 );
        this.pix( 0, -4, 0 );
        this.pix( -1, -3, 0 );
        this.pix( -2, -3, 0 );
        this.pix( 1, 1, 0 );
        this.pix( 0, 1, 0 );
    }
*/

};

Letter.prototype.pix = function (x, y, val) {
    if(val>2) {
        var id = -1;
        var vl = (val==3)?x:y;
        for(var i=0; i<this.stretch[val-3].length; i++) {
            if( this.stretch[val-3][i]==vl ) { id = i; break; }
        }
        
        if(id<0) this.stretch[val-3].push(vl);
    }
    
    return this.px.push([x, y, val]) - 1;
};

Letter.prototype.shift = function(axis, from, by) {
    if(!by) return;
    var pixx = [];
    for(var i=0; i<this.px.length; i++) {
        var n = pixx.push(this.px[i])-1;
//        var sgn = Math.abs(pixx[n][axis])/pixx[n][axis];
        if( pixx[n][axis]>from ) pixx[n][axis] += 1;
//        if( sgn>0 && pixx[n][axis]>from ) pixx[n][axis] += by;
//        if( sgn<0 && pixx[n][axis]<from ) pixx[n][axis] -= by;
    }
    this.px = pixx;
    
    for(i=0; i<this.stretch[axis].length; i++) {
        if(this.stretch[axis][i]>from) this.stretch[axis][i]++;
    }
};


Letter.prototype.clear = function(axis, line) {
    for(var i=this.px.length-1; i>=0; i--) {
        if(this.px[i][axis]==line) {
            this.px.splice(i, 1);
        }
    }
};

Letter.prototype.duplicate = function(axis, line1, line2) {
    for(var i=0; i<this.px.length; i++) {
        if(this.px[i][axis]==line1) {
            var n = this.pix( this.px[i][0], this.px[i][1], this.px[i][2] );
            this.px[n][axis] = line2;
        }
    }
};


Letter.prototype.scale = function(axis, by) {
    axis = this.defAxis;
    
    if(!by || this.stretch[axis].length<1) return;
    
    for(var i=0; i<Math.abs(by); i++) {
        var n = Math.floor( Math.random(0)*this.stretch[axis].length );
        var line = this.stretch[axis][ n ];
//        var sgn = Math.abs(line)/line;
//        var line = this.stretch[axis][ i%2 ];
        if(by>0) {
            this.shift(axis, line, 1);
            this.duplicate(axis, line, line+1);
            this.stretch[axis].push(line+1);
        } else {
            this.clear(axis, line);
            this.shift(axis, line, -1);
            this.stretch.splice(n, 1);
        }
//        this.clear(axis, line);
    }
};

Letter.prototype.draw = function(ct) {
    for(var i=0; i<this.px.length; i++) {
        ct.fillStyle=Colors[ this.px[i][2] ];
        ct.fillRect(this.x+this.px[i][0], this.y+this.px[i][1], 1, 1);
    }
    
};


Letter.prototype.hits = function(ltr) {
    for(var i=0; i<this.px.length; i++) {
        for(var j=0; j<ltr.px.length; j++) {
            if( this.px[i][0]+this.x==ltr.px[j][0]+ltr.x && this.px[i][1]+this.y==ltr.px[j][1]+ltr.y ) return true;
        }
    }
    return false;
    
};

Letter.prototype.fits = function(xxx, yyy, www, hhh) {
    for(var i=0; i<this.px.length; i++) {
        var xx = this.px[i][0]+this.x;
        var yy = this.px[i][1]+this.y;
        if(xx<xxx) return [1, 0];
        if(xx>=xxx+www) return [-1, 0];
        if(yy<yyy) return [0, 1];
        if(yy>=yyy+hhh) return [0, -1];
    }
    return [0, 0];
}
