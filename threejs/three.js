// from:three.js\src\Class.js
// http://ejohn.org/blog/simple-javascript-inheritance/

// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  Class = function(){};
  
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" && 
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
    
    return Class;
  };
})();
// from:three.js\src\core\Vector3.js
var Vector3 = Class.extend
({
	x: null, y: null, z: null,
	// sx: null, sy: null, sz: null,
	// userData: null,
	
	dx: null, dy: null, dz: null,
	tx: null, ty: null, tz: null,
	// oll: null,
	
	init: function(x, y, z)
	{
		this.x = x ? x : 0;
		this.y = y ? y : 0;
		this.z = z ? z : 0;
	},

	copy: function(v)
	{
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
	},
	
	addSelf: function(v)
	{
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
	},

	add: function(v1, v2)
	{
		this.x = v1.x + v2.x;
		this.y = v1.y + v2.y;
		this.z = v1.z + v2.z;
	},
	
	subSelf: function(v)
	{
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
	},

	sub: function(v1, v2)
	{
		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;
		this.z = v1.z - v2.z;
	},
	
	cross: function(v)
	{
		this.tx = this.x;
		this.ty = this.y;
		this.tz = this.z;
		
		this.x = this.ty * v.z - this.tz * v.y;
		this.y = this.tz * v.x - this.tx * v.z;
		this.z = this.tx * v.y - this.ty * v.x;
	},
	
	multiply: function(s)
	{
		this.x *= s;
		this.y *= s;
		this.z *= s;
	},
	
	distanceTo: function(v)
	{
		this.dx = this.x - v.x;
		this.dy = this.y - v.y;
		this.dz = this.z - v.z;
		
		return Math.sqrt(this.dx * this.dx + this.dy * this.dy + this.dz * this.dz);
	},
	
	distanceToSquared: function(v)
	{
		this.dx = this.x - v.x;
		this.dy = this.y - v.y;
		this.dz = this.z - v.z;
		
		return this.dx * this.dx + this.dy * this.dy + this.dz * this.dz;
	},
	
	length: function()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	},
	
	lengthSq: function()
	{
		return this.x * this.x + this.y * this.y + this.z * this.z;
	},
	
	negate: function()
	{
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;
	},
	
	normalize: function()
	{
		if (this.length() > 0)
			this.ool = 1.0 / this.length();
		else
			this.ool = 0;
			
		this.x *= this.ool;
		this.y *= this.ool;
		this.z *= this.ool;
		return this;
	},
	
	dot: function(v)
	{
		return this.x * v.x + this.y * v.y + this.z * v.z;
	},
	
	clone: function()
	{
		return new Vector3(this.x, this.y, this.z);
	},	
	
	toString: function()
	{
		return 'Vector3 (' + this.x + ', ' + this.y + ', ' + this.z + ')';
	}
	
});

Vector3.add = function(a, b)
{
	return new Vector3( a.x + b.x, a.y + b.y, a.z + b.z );
}

Vector3.sub = function(a, b)
{
	return new Vector3( a.x - b.x, a.y - b.y, a.z - b.z );
}		

Vector3.multiply = function(a, s)
{
	return new Vector3( a.x * s, a.y * s, a.z * s );
}

Vector3.cross = function(a, b)
{
	return new Vector3( a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x );
}

Vector3.dot = function(a, b)
{
	return a.x * b.x + a.y * b.y + a.z * b.z;
}
// from:three.js\src\core\Color.js
var Color = Class.extend
({
	r: null, g: null, b: null, a: null,
	hex: null,
	
	styleString: null,
	
	
	init: function( hex )
	{
		this.setHex( hex ? hex : 0xff000000 );
	},
	
	setHex: function( hex )
	{
		this.hex = hex;
		this.updateRGBA();
		this.updateStyleString();
	},
	
	setRGBA: function( r, g, b, a )
	{
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
		
		this.updateHex();
		this.updateStyleString();
	},
	
	updateHex: function()
	{
		this.hex = this.a << 24 | this.r << 16 | this.g << 8 | this.b;
	},
	
	updateRGBA: function()
	{
		this.r = this.hex >> 16 & 0xff;
		this.g = this.hex >> 8 & 0xff;
		this.b = this.hex & 0xff;
		this.a = this.hex >> 24 & 0xff;		
	},
	
	updateStyleString: function()
	{
		this.styleString = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + (this.a / 255) + ')';		
	},
	
	toString: function()
	{
		return 'Color ( r: ' + this.r + ', g: ' + this.g + ', b: ' + this.b + ', a: ' + this.a + ', hex: ' + this.hex + ', style: ' + this.styleString + ' )';	
	}
	
});
// from:three.js\src\core\Face3.js
var Face3 = Vector3.extend
({
	a: null, b: null, c: null,
	screen: null,
	uv: null,
	normal: null,
	color: null,

	init: function(a, b, c, uv, normal, color)
	{
		this._super((a.x + b.x + c.x) / 3, (a.y + b.y + c.y) / 3, (a.z + b.z + c.z) / 3);	
	
		this.a = a;
		this.b = b;
		this.c = c;

		this.screen = new Vector3();
		
		this.uv = uv ? uv : [ [0, 0], [0, 0], [0, 0] ];
		this.normal = normal ? normal : new Vector3();

		this.color = color ? color : new Color();
	},

	toString: function()
	{
		return 'Face3 ( ' + this.a + ', ' + this.b + ', ' + this.c + ' )';
	}
});
// from:three.js\src\core\Face4.js
var Face4 = Vector3.extend
({
	a: null, b: null, c: null, d: null,
	normal: null,
	screen: null,
	color: null,

	init: function(a, b, c, d, uv, normal, color)
	{
		this._super((a.x + b.x + c.x + d.x) / 4, (a.y + b.y + c.y + d.y) / 4, (a.z + b.z + c.z + d.z) / 4);
	
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
		
		this.screen = new Vector3();

		this.color = color ? color : new Color();
	},

	toString: function()
	{
		return 'Face4 ( ' + this.a + ', ' + this.b + ', ' + this.c + ', ' + this.d + ' )';
	}
});
// from:three.js\src\core\Geometry.js
var Geometry = Class.extend
({
	vertices: null,
	faces: null,

	init: function()
	{
		this.vertices = new Array();
		this.faces = new Array();
	}
});
// from:three.js\src\core\Matrix3.js
var Matrix3 = Class.extend
({
	n11: null, n12: null, n13: null,
	n21: null, n22: null, n23: null,
	n31: null, n32: null, n33: null,

	init: function()
	{
		this.identity();
	},

	identity: function()
	{
		this.n11 = 1; this.n12 = 0; this.n13 = 0;
		this.n21 = 0; this.n22 = 1; this.n23 = 0;
		this.n31 = 0; this.n32 = 0; this.n33 = 1;
	},

	assign: function(m)
	{
		this.n11 = m.n11; this.n12 = m.n12; this.n13 = m.n13;
		this.n21 = m.n21; this.n22 = m.n22; this.n23 = m.n23;
		this.n31 = m.n31; this.n32 = m.n32; this.n33 = m.n33;
	},

	multiplySelf: function(m)
	{
		var n11 = this.n11, n12 = this.n12, n13 = this.n13, n14 = this.n14;
		var n21 = this.n21, n22 = this.n22, n23 = this.n23, n24 = this.n24;
		var n31 = this.n31, n32 = this.n32, n33 = this.n33, n34 = this.n34;

		this.n11 = n11 * m.n11 + n12 * m.n21 + n13 * m.n31;
		this.n12 = n11 * m.n12 + n12 * m.n22 + n13 * m.n32;
		this.n13 = n11 * m.n13 + n12 * m.n23 + n13 * m.n33;

		this.n21 = n21 * m.n11 + n22 * m.n21 + n23 * m.n31;
		this.n22 = n21 * m.n12 + n22 * m.n22 + n23 * m.n32;
		this.n23 = n21 * m.n13 + n22 * m.n23 + n23 * m.n33;

		this.n31 = n31 * m.n11 + n32 * m.n21 + n33 * m.n31;
		this.n32 = n31 * m.n12 + n32 * m.n22 + n33 * m.n32;
		this.n33 = n31 * m.n13 + n32 * m.n23 + n33 * m.n33;
	},

	inverse: function()
	{
		var n11 = this.n11, n12 = this.n12, n13 = this.n13, n14 = this.n14;
		var n21 = this.n21, n22 = this.n22, n23 = this.n23, n24 = this.n24;
		var n31 = this.n31, n32 = this.n32, n33 = this.n33, n34 = this.n34;

		this.n11 = n11; this.n12 = n21; this.n13 = n31;
		this.n21 = n12; this.n22 = n22; this.n23 = n32;
		this.n31 = n13; this.n32 = n23; this.n33 = n33;
	},

	clone: function()
	{
		var m = new Matrix3();
		m.n11 = this.n11; m.n12 = this.n12; m.n13 = this.n13;
		m.n21 = this.n21; m.n22 = this.n22; m.n23 = this.n23;
		m.n31 = this.n31; m.n32 = this.n32; m.n33 = this.n33;
		return m;
	},
    
	toString: function()
	{
        	return "| " + this.n11 + " " + this.n12 + " " + this.n13 + " |\n" +
                        "| " + this.n21 + " " + this.n22 + " " + this.n23 + " |\n" +
                        "| " + this.n31 + " " + this.n32 + " " + this.n33 + " |";
	}
});
// from:three.js\src\core\Matrix4.js
var Matrix4 = Class.extend
({
	n11: null, n12: null, n13: null, n14: null,
	n21: null, n22: null, n23: null, n24: null,
	n31: null, n32: null, n33: null, n34: null,

	x: null, y: null, z: null,

	init: function()
	{
		this.identity();
	},

	identity: function()
	{
		this.n11 = 1; this.n12 = 0; this.n13 = 0; this.n14 = 0;
		this.n21 = 0; this.n22 = 1; this.n23 = 0; this.n24 = 0;
		this.n31 = 0; this.n32 = 0; this.n33 = 1; this.n34 = 0;
		
		this.x = new Vector3(0,0,0);
		this.y = new Vector3(0,0,0);
		this.z = new Vector3(0,0,0);
	},
    
	lookAt: function(eye, center, up)
	{
		this.z.sub(center, eye);
		this.z.normalize();

		this.x.copy(this.z);
		this.x.cross(up);
		this.x.normalize();

		this.y.copy(this.x);
		this.y.cross(this.z);
		this.y.normalize();
		this.y.negate(); //

		this.n11 = this.x.x;
		this.n12 = this.x.y;
		this.n13 = this.x.z;
		this.n14 = -this.x.dot(eye);
		this.n21 = this.y.x;
		this.n22 = this.y.y;
		this.n23 = this.y.z;
		this.n24 = -this.y.dot(eye);
		this.n31 = this.z.x;
		this.n32 = this.z.y;
		this.n33 = this.z.z;
		this.n34 = -this.z.dot(eye);
	},

	transform: function(v)
	{
        	var vx = v.x, vy = v.y, vz = v.z;
        
		v.x = this.n11 * vx + this.n12 * vy + this.n13 * vz + this.n14;
		v.y = this.n21 * vx + this.n22 * vy + this.n23 * vz + this.n24;
		v.z = this.n31 * vx + this.n32 * vy + this.n33 * vz + this.n34;
	},
    

	multiply: function(a, b)
	{
		this.n11 = a.n11 * b.n11 + a.n12 * b.n21 + a.n13 * b.n31;
		this.n12 = a.n11 * b.n12 + a.n12 * b.n22 + a.n13 * b.n32;
		this.n13 = a.n11 * b.n13 + a.n12 * b.n23 + a.n13 * b.n33;
		this.n14 = a.n11 * b.n14 + a.n12 * b.n24 + a.n13 * b.n34 + a.n14;

		this.n21 = a.n21 * b.n11 + a.n22 * b.n21 + a.n23 * b.n31;
		this.n22 = a.n21 * b.n12 + a.n22 * b.n22 + a.n23 * b.n32;
		this.n23 = a.n21 * b.n13 + a.n22 * b.n23 + a.n23 * b.n33;
		this.n24 = a.n21 * b.n14 + a.n22 * b.n24 + a.n23 * b.n34 + a.n24;

		this.n31 = a.n31 * b.n11 + a.n32 * b.n21 + a.n33 * b.n31;
		this.n32 = a.n31 * b.n12 + a.n32 * b.n22 + a.n33 * b.n32;
		this.n33 = a.n31 * b.n13 + a.n32 * b.n23 + a.n33 * b.n33;
		this.n34 = a.n31 * b.n14 + a.n32 * b.n24 + a.n33 * b.n34 + a.n34;
	},

	multiplySelf: function(m)
	{
		var n11 = this.n11, n12 = this.n12, n13 = this.n13, n14 = this.n14;
		var n21 = this.n21, n22 = this.n22, n23 = this.n23, n24 = this.n24;
		var n31 = this.n31, n32 = this.n32, n33 = this.n33, n34 = this.n34;

		this.n11 = n11 * m.n11 + n12 * m.n21 + n13 * m.n31;
		this.n12 = n11 * m.n12 + n12 * m.n22 + n13 * m.n32;
		this.n13 = n11 * m.n13 + n12 * m.n23 + n13 * m.n33;
		this.n14 = n11 * m.n14 + n12 * m.n24 + n13 * m.n34 + n14;

		this.n21 = n21 * m.n11 + n22 * m.n21 + n23 * m.n31;
		this.n22 = n21 * m.n12 + n22 * m.n22 + n23 * m.n32;
		this.n23 = n21 * m.n13 + n22 * m.n23 + n23 * m.n33;
		this.n24 = n21 * m.n14 + n22 * m.n24 + n23 * m.n34 + n24;

		this.n31 = n31 * m.n11 + n32 * m.n21 + n33 * m.n31;
		this.n32 = n31 * m.n12 + n32 * m.n22 + n33 * m.n32;
		this.n33 = n31 * m.n13 + n32 * m.n23 + n33 * m.n33;
		this.n34 = n31 * m.n14 + n32 * m.n24 + n33 * m.n34 + n34;
	},

	clone: function()
	{
		var m = new Matrix4();
		m.n11 = this.n11; m.n12 = this.n12; m.n13 = this.n13; m.n14 = this.n14;
		m.n21 = this.n21; m.n22 = this.n22; m.n23 = this.n23; m.n24 = this.n24;
		m.n31 = this.n31; m.n32 = this.n32; m.n33 = this.n33; m.n34 = this.n34;
		return m;
	},
    
	toString: function()
	{
        	return "| " + this.n11 + " " + this.n12 + " " + this.n13 + " " + this.n14 + " |\n" +
                        "| " + this.n21 + " " + this.n22 + " " + this.n23 + " " + this.n24 + " |\n" +
                        "| " + this.n31 + " " + this.n32 + " " + this.n33 + " " + this.n34 + " |";
	}
});

Matrix4.translationMatrix = function(x, y, z)
{
	var m = new Matrix4();

	m.n14 = x;
	m.n24 = y;
	m.n34 = z;

	return m;
}

Matrix4.scaleMatrix = function(x, y, z)
{
	var m = new Matrix4();

	m.n11 = x;
	m.n22 = y;
	m.n33 = z;

	return m;
}

Matrix4.rotationXMatrix = function(theta)
{
	var rot = new Matrix4();

	rot.n22 = rot.n33 = Math.cos(theta);
	rot.n32 = Math.sin(theta);
	rot.n23 = -rot.n32;

	return rot;
}

Matrix4.rotationYMatrix = function(theta)
{
	var rot = new Matrix4();

	rot.n11 = rot.n33 = Math.cos(theta);
	rot.n13 = Math.sin(theta);
	rot.n31 = -rot.n13;

	return rot;
}

Matrix4.rotationZMatrix = function(theta)
{
	var rot = new Matrix4();

	rot.n11 = rot.n22 = Math.cos(theta);
	rot.n21 = Math.sin(theta);
	rot.n12 = -rot.n21;

	return rot;
}
// from:three.js\src\core\Vector2.js
var Vector2 = Class.extend
({
	x: null, y: null,
	
	init: function(x, y)
	{
		this.x = x ? x : 0;
		this.y = y ? y : 0;
	},

	copy: function(v)
	{
		this.x = v.x;
		this.y = v.y;
	},
	
	addSelf: function(v)
	{
		this.x += v.x;
		this.y += v.y;
	},

	add: function(v1, v2)
	{
		this.x = v1.x + v2.x;
		this.y = v1.y + v2.y;
	},
	
	subSelf: function(v)
	{
		this.x -= v.x;
		this.y -= v.y;
	},

	sub: function(v1, v2)
	{
		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;
	},
	
	multiply: function(s)
	{
		this.x *= s;
		this.y *= s;
	},
	
	unit: function()
	{
		this.multiply(1 / this.length());
	},
	
	expand: function(v1, v2)
	{
		this.unit( this.sub(v2, v1) );
		v2.addSelf(this);
		// v1.subSelf(this);
	},

	length: function()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},
	
	lengthSq: function()
	{
		return this.x * this.x + this.y * this.y;
	},
	
	negate: function()
	{
		this.x = -this.x;
		this.y = -this.y;
	},
	
	clone: function()
	{
		return new Vector2(this.x, this.y);
	},	
	
	toString: function()
	{
		return 'Vector2 (' + this.x + ', ' + this.y + ')';
	}
	
});

Vector2.add = function(a, b)
{
	return new Vector2( a.x + b.x, a.y + b.y );
}

Vector2.sub = function(a, b)
{
	return new Vector2( a.x - b.x, a.y - b.y );
}		

Vector2.multiply = function(a, s)
{
	return new Vector2( a.x * s, a.y * s );
}
// from:three.js\src\core\Vertex.js
var Vertex = Vector3.extend
({
	u: null, v: null,
	screen: null,
	normal : null,
	visible: null,

	init: function(x, y, z)
	{
		this._super(x, y, z);
		this.screen = new Vector3();
	},

	toString: function()
	{
		return 'Vertex ( ' + this.x + ', ' + this.y + ', ' + this.z + ' )';
	}
});
// from:three.js\src\cameras\Camera.js
var Camera = Vector3.extend
({
	up: null,
	target: null,
	zoom: null,
	focus: null,
	roll: null,
	
	matrix: null,
	
	init: function(x, y, z)
	{
		this._super(x, y, z);
		this.up = new Vector3( 0, 1, 0 );
		this.target = new Vector3( 0, 0, 0 );
		this.zoom = 3;
		this.focus = 500;
		this.roll = 0;
		
		this.matrix = new Matrix4();
		this.updateMatrix();
	},
	
	updateMatrix: function()
	{
		this.matrix.lookAt( this, this.target, this.up );
	},

	toString: function()
	{
		return 'Camera ( ' + this.x + ', ' + this.y + ', ' + this.z + ' )';
	}
});
// from:three.js\src\objects\Object3D.js
var Object3D = Class.extend
({
	position: null,
	rotation: null,
	scale: null,

	matrix: null,
	screen: null,

	init: function()
	{
		this.position = new Vector3(0, 0, 0);
		this.rotation = new Vector3(0, 0, 0);
		this.scale = new Vector3(1, 1, 1);

		this.matrix = new Matrix4();
		this.screen = new Vector3(0, 0, 0);		
	},

	updateMatrix: function()
	{
		this.matrix.identity();
		this.matrix.multiplySelf( Matrix4.translationMatrix( this.position.x, this.position.y, this.position.z) );
		this.matrix.multiplySelf( Matrix4.rotationXMatrix( this.rotation.x ) );
		this.matrix.multiplySelf( Matrix4.rotationYMatrix( this.rotation.y ) );
		this.matrix.multiplySelf( Matrix4.rotationZMatrix( this.rotation.z ) );
		this.matrix.multiplySelf( Matrix4.scaleMatrix( this.scale.x, this.scale.y, this.scale.z ) );
	}
});
// from:three.js\src\objects\Mesh.js
var Mesh = Object3D.extend
({
	geometry: null,
	material: null,
	
	doubleSide: null,

	init: function( geometry, material )
	{
		this._super();
		this.geometry = geometry;
		this.material = material;
	}
});
// from:three.js\src\objects\Particle.js
var Particle = Object3D.extend
({
	size: 1,
	material: null,

	init: function( material )
	{
		this._super();
		this.material = material;
	}
});
// from:three.js\src\objects\primitives\Cube.js
var Cube = Geometry.extend
({
	init: function( width, height, depth )
	{
		this._super();
		
		var width_half = width / 2;
		var height_half = height / 2;
		var depth_half = depth / 2;
		
		this.v(  width_half,  height_half, -depth_half );
		this.v(  width_half, -height_half, -depth_half );
		this.v( -width_half, -height_half, -depth_half );
		this.v( -width_half,  height_half, -depth_half );
		this.v(  width_half,  height_half,  depth_half );
		this.v(  width_half, -height_half,  depth_half );
		this.v( -width_half, -height_half,  depth_half );
		this.v( -width_half,  height_half,  depth_half );
		
		this.f4( 0, 1, 2, 3 );
		this.f4( 4, 7, 6, 5 );
		this.f4( 0, 4, 5, 1 );
		this.f4( 1, 5, 6, 2 );
		this.f4( 2, 6, 7, 3 );
		this.f4( 4, 0, 3, 7 );
	},

	v: function( x, y, z )
	{
		this.vertices.push( new Vertex( x, y, z ) );
	},

	f4: function( a, b, c, d )
	{
		this.faces.push( new Face4( this.vertices[a], this.vertices[b], this.vertices[c], this.vertices[d] ) );
	}	
});
// from:three.js\src\objects\primitives\Plane.js
var Plane = Geometry.extend
({
	init: function( width, height )
	{
		this._super();
		
		var width_half = width / 2;
		var height_half = height / 2;
		
		this.v( -width_half,  height_half, 0 );
		this.v(  width_half,  height_half, 0 );
		this.v(  width_half, -height_half, 0 );
		this.v( -width_half, -height_half, 0 );
		
		this.f4( 0, 1, 2, 3 );
	},
	
	v: function( x, y, z )
	{
		this.vertices.push( new Vertex( x, y, z ) );
	},

	f4: function( a, b, c, d )
	{
		this.faces.push( new Face4( this.vertices[a], this.vertices[b], this.vertices[c], this.vertices[d] ) );
	}	
});
// from:three.js\src\materials\ColorMaterial.js
var ColorMaterial = Class.extend
({
	color: null,

	init: function( hex, opacity )
	{
		this.color = new Color( (opacity ? (opacity * 0xff) << 24 : 0xff000000) | hex );
	}
});
// from:three.js\src\materials\FaceColorMaterial.js
var FaceColorMaterial = Class.extend
({
});
// from:three.js\src\scenes\Scene.js
var Scene = Class.extend
({
	objects: null,

	init: function()
	{
		this.objects = new Array();
	},

	add: function( object )
	{
		this.objects.push( object );
	},

	remove: function( object )
	{
		for(var i = 0; i < this.objects.length; i++)
			if(object == this.objects[i])
				alert("yay");
	},

	toString: function()
	{
		return 'Scene ( ' + this.objects + ' )';
	}
});
// from:three.js\src\renderers\Renderer.js
var Renderer = Class.extend
({
	matrix: null,

	viewport: null,
	renderList: null,

	face3Pool: null,
	face4Pool: null,

	width: null,
	height: null,
	widthHalf: null,
	heightHalf: null,

	init: function()
	{
		this.matrix = new Matrix4();

		this.face3Pool = new Array();
		this.face4Pool = new Array();
	},

	setSize: function( width, height )
	{
		this.width = width;
		this.height = height;

		this.widthHalf = this.width / 2;
		this.heightHalf = this.height / 2;
	},

	sort: function(a, b)
	{
		return a.screen.z - b.screen.z;
	},

	render: function( scene, camera )
	{
		var vertex, face, object;
		var face3count = 0, face4count = 0;

		var focuszoom = camera.focus * camera.zoom;

		this.renderList = new Array();

		for (var i = 0; i < scene.objects.length; i++)
		{
			object = scene.objects[i];

			if (object instanceof Mesh)
			{
				this.matrix.multiply( camera.matrix, object.matrix );

				// vertices

				for (var j = 0; j < object.geometry.vertices.length; j++)
				{
					vertex = object.geometry.vertices[j];

					vertex.screen.copy( vertex );

					this.matrix.transform( vertex.screen );

					vertex.screen.z = focuszoom / (camera.focus + vertex.screen.z);

					vertex.visible = vertex.screen.z > 0;					

					vertex.screen.x *= vertex.screen.z;
					vertex.screen.y *= vertex.screen.z; 
				}

				// faces

				for (j = 0; j < object.geometry.faces.length; j++)
				{
					face = object.geometry.faces[j];
					
					// TODO: Use normals for culling

					if (face instanceof Face3)
					{
						if (face.a.visible && face.b.visible && face.c.visible && (object.doubleSided ||
						   (face.c.screen.x - face.a.screen.x) * (face.b.screen.y - face.a.screen.y) -
						   (face.c.screen.y - face.a.screen.y) * (face.b.screen.x - face.a.screen.x) > 0) )
						{
							face.screen.z = (face.a.screen.z + face.b.screen.z + face.c.screen.z) * 0.3;
							
							if (this.face3Pool[face3count] == null)
								this.face3Pool[face3count] = new Face3(new Vertex(), new Vertex(), new Vertex());

							this.face3Pool[face3count].a.screen.copy(face.a.screen);
							this.face3Pool[face3count].b.screen.copy(face.b.screen);
							this.face3Pool[face3count].c.screen.copy(face.c.screen);
							this.face3Pool[face3count].screen.z = face.screen.z;
							this.face3Pool[face3count].color = face.color;
							this.face3Pool[face3count].material = object.material;

							this.renderList.push( this.face3Pool[face3count] );

							face3count++;
						}
					}
					else if (face instanceof Face4)
					{
						if (face.a.visible && face.b.visible && face.c.visible && (object.doubleSided ||
						   ((face.d.screen.x - face.a.screen.x) * (face.b.screen.y - face.a.screen.y) -
						   (face.d.screen.y - face.a.screen.y) * (face.b.screen.x - face.a.screen.x) > 0 ||
						   (face.b.screen.x - face.c.screen.x) * (face.d.screen.y - face.c.screen.y) -
						   (face.b.screen.y - face.c.screen.y) * (face.d.screen.x - face.c.screen.x) > 0)) )
						{
							face.screen.z = (face.a.screen.z + face.b.screen.z + face.c.screen.z + face.d.screen.z) * 0.25;

							if (this.face4Pool[face4count] == null)
								this.face4Pool[face4count] = new Face4(new Vertex(), new Vertex(), new Vertex(), new Vertex());

							this.face4Pool[face4count].a.screen.copy(face.a.screen);
							this.face4Pool[face4count].b.screen.copy(face.b.screen);
							this.face4Pool[face4count].c.screen.copy(face.c.screen);
							this.face4Pool[face4count].d.screen.copy(face.d.screen);
							this.face4Pool[face4count].screen.z = face.screen.z;
							this.face4Pool[face4count].color = face.color;
							this.face4Pool[face4count].material = object.material;

							this.renderList.push( this.face4Pool[face4count] );

							face4count++;
						}						
					}
				}
			}
			else if (object instanceof Particle)
			{
				object.screen.copy(object.position);

				camera.matrix.transform( object.screen );

				object.screen.z = focuszoom / (camera.focus + object.screen.z);

				if (object.screen.z < 0)
					continue;					

				object.screen.x *= object.screen.z;
				object.screen.y *= object.screen.z;

				this.renderList.push( object );
			}
		}

		this.renderList.sort(this.sort);
	}
});
// from:three.js\src\renderers\CanvasRenderer.js
var CanvasRenderer = Renderer.extend
({
	context: null,

	init: function()
	{
		this._super();

		this.viewport = document.createElement("canvas");
		this.viewport.style.position = "absolute";

		this.context = this.viewport.getContext("2d");
	},

	setSize: function( width, height )
	{
		this._super( width, height );

		this.viewport.width = this.width;
		this.viewport.height = this.height;
		
		this.context.setTransform(1, 0, 0, 1, this.widthHalf, this.heightHalf);
	},

	render: function( scene, camera )
	{
		this._super( scene, camera );

		var element , pi2 = Math.PI * 2;

		this.context.clearRect (-this.widthHalf, -this.heightHalf, this.width, this.height);
		
		for (j = 0; j < this.renderList.length; j++)
		{
			element = this.renderList[j];
			
			if (element.material instanceof ColorMaterial)
			{
				this.context.fillStyle = element.material.color.styleString;
			}
			else if (element.material instanceof FaceColorMaterial)
			{
				this.context.fillStyle = element.color.styleString;
			}
			
			if (element instanceof Face3)
			{
				this.context.beginPath();
				this.context.moveTo(element.a.screen.x, element.a.screen.y);
				this.context.lineTo(element.b.screen.x, element.b.screen.y);
				this.context.lineTo(element.c.screen.x, element.c.screen.y);
				this.context.fill();
				this.context.closePath();
			}
			else if (element instanceof Face4)
			{
				this.context.beginPath();
				this.context.moveTo(element.a.screen.x, element.a.screen.y);
				this.context.lineTo(element.b.screen.x, element.b.screen.y);
				this.context.lineTo(element.c.screen.x, element.c.screen.y);
				this.context.lineTo(element.d.screen.x, element.d.screen.y);
				this.context.fill();
				this.context.closePath();
			}
			else if (element instanceof Particle)
			{
				this.context.beginPath();
				this.context.arc(element.screen.x, element.screen.y, element.size * element.screen.z, 0, pi2, true);
				this.context.fill();
				this.context.closePath();				
			}
			
		}
	}
});
// from:three.js\src\renderers\SVGRenderer.js
var SVGRenderer = Renderer.extend
({
	svgPathPool: null,
	svgCirclePool: null,

	init: function()
	{
		this._super();

		this.viewport = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.viewport.style.position = "absolute";

		this.svgPathPool = new Array();
		this.svgCirclePool = new Array();
	},

	setSize: function( width, height )
	{
		this.viewport.setAttribute('viewBox', (-width / 2) + ' ' + (-height / 2) + ' ' + width + ' ' + height );
		this.viewport.setAttribute('width', width);
		this.viewport.setAttribute('height', height);
	},
	
	render: function( scene, camera )
	{
		this._super( scene, camera );

		while (this.viewport.childNodes.length > 0)
		{
			this.viewport.removeChild(this.viewport.childNodes[0]);
		}
		
		var pathCount = 0, circleCount = 0, svgNode;
		
		for (j = 0; j < this.renderList.length; j++)
		{
			element = this.renderList[j];

			if (element instanceof Face3)
			{
				svgNode = this.getPathNode(pathCount++);
				svgNode.setAttribute('d', 'M ' + element.a.screen.x + ' ' + element.a.screen.y + ' L ' + element.b.screen.x + ' ' + element.b.screen.y + ' L ' + element.c.screen.x + ',' + element.c.screen.y + 'z');					
			}
			else if (element instanceof Face4)
			{
				svgNode = this.getPathNode(pathCount++);
				svgNode.setAttribute('d', 'M ' + element.a.screen.x + ' ' + element.a.screen.y + ' L ' + element.b.screen.x + ' ' + element.b.screen.y + ' L ' + element.c.screen.x + ',' + element.c.screen.y + ' L ' + element.d.screen.x + ',' + element.d.screen.y + 'z');
			}
			else if (element instanceof Particle)
			{
				svgNode = this.getCircleNode(circleCount++);
				svgNode.setAttribute('cx', element.screen.x);
				svgNode.setAttribute('cy', element.screen.y);
				svgNode.setAttribute('r', element.size * element.screen.z);
			}

			if (element.material instanceof ColorMaterial)
			{
				svgNode.setAttribute('style', 'fill: rgb(' + element.material.color.r + ',' + element.material.color.g + ',' + element.material.color.b + ')');
			}
			else if (element.material instanceof FaceColorMaterial)
			{
				svgNode.setAttribute('style', 'fill: rgb(' + element.color.r + ',' + element.color.g + ',' + element.color.b + ')');
			}

			this.viewport.appendChild(svgNode);
		}
	},
	
	getPathNode: function( id )
	{
		if (this.svgPathPool[id] == null)
		{
			this.svgPathPool[id] = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			// this.svgPathPool[id].setAttribute('shape-rendering', 'crispEdges'); //optimizeSpeed
			return this.svgPathPool[id];
		}
		
		return this.svgPathPool[id];
	},
	
	getCircleNode: function( id )
	{
		if (this.svgCirclePool[id] == null)
		{
			this.svgCirclePool[id] = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			// this.svgCirclePool[id].setAttribute('shape-rendering', 'crispEdges'); //optimizeSpeed
			this.svgCirclePool[id].setAttribute('fill', 'red');
			return this.svgCirclePool[id];
		}
		
		return this.svgCirclePool[id];
	}
});
