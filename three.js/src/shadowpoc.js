(function() {
  var Demo, demo, windowHalfX, windowHalfY;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  Demo = (function() {
    function Demo() {
      this.onDocumentKeyDown = __bind(this.onDocumentKeyDown, this);
      this.onDocumentMouseMove = __bind(this.onDocumentMouseMove, this);
      this.animate = __bind(this.animate, this);      var container, cubeg, mat1, mat2, mesh, p, planeg1, planeg2;
      this.mouseX = this.mouseY = 0;
      container = document.createElement('div');
      p = document.createElement('p');
      p.innerHTML = 'Hit any key to toggle between plane or cube-based ground.';
      p.innerHTML += '<br/>Note that shadow renders oddly for ground with plane geometry.';
      container.appendChild(p);
      document.body.appendChild(container);
      this.scene = new THREE.Scene();
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera = new THREE.Camera(45, window.innerWidth / window.innerHeight, 1, 10000);
      this.camera.position.z = 2350;
      this.seconds = 0;
      this.sprites = [];
      this.planes = [];
      mat1 = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('textures/pavement.png')
      });
      mat2 = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('textures/disturb.jpg')
      });
      cubeg = new THREE.CubeGeometry(200, 200, 200);
      planeg1 = new THREE.CubeGeometry(1000, 1000, 100);
      planeg2 = new THREE.PlaneGeometry(1000, 1000);
      mesh = new THREE.Mesh(cubeg, mat2);
      mesh.position.set(-200, 300, 100);
      mesh.velocity = 300;
      this.scene.addChild(mesh);
      this.sprites.push(mesh);
      new THREE.ShadowVolume(mesh);
      mesh = new THREE.Mesh(cubeg, mat2);
      mesh.position.set(200, 600, -100);
      mesh.velocity = -300;
      this.scene.addChild(mesh);
      this.sprites.push(mesh);
      new THREE.ShadowVolume(mesh);
      mesh = new THREE.Mesh(planeg1, mat1);
      mesh.rotation.x = -90 * Math.PI / 180;
      this.scene.addChild(mesh);
      new THREE.ShadowVolume(mesh);
      this.planes.push(mesh);
      mesh = new THREE.Mesh(planeg2, mat1);
      mesh.rotation.x = -90 * Math.PI / 180;
      new THREE.ShadowVolume(mesh);
      this.planes.push(mesh);
      this.light = new THREE.DirectionalLight(0xffffff);
      this.light.castShadow = true;
      this.light.position.set(0, 1, 0);
      this.scene.addChild(this.light);
      container.appendChild(this.renderer.domElement);
      document.addEventListener('mousemove', this.onDocumentMouseMove);
      document.addEventListener('keydown', this.onDocumentKeyDown);
    }
    Demo.prototype.animate = function() {
      var dt, sprite, _i, _len, _ref;
      requestAnimationFrame(this.animate);
      dt = 0.02;
      _ref = this.sprites;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sprite = _ref[_i];
        sprite.position.x += sprite.velocity * dt;
        if (sprite.position.x >= 400) {
          sprite.position.x = 399;
          sprite.velocity = -300;
        }
        if (sprite.position.x <= -400) {
          sprite.position.x = -399;
          sprite.velocity = 300;
        }
      }
      this.light.position.x = Math.sin(this.seconds);
      this.light.position.y = 1.5;
      this.light.position.z = Math.sin(this.seconds);
      this.camera.position.x += this.mouseX - this.camera.position.x;
      this.camera.position.y += -this.mouseY - this.camera.position.y;
      this.renderer.render(this.scene, this.camera);
      return this.seconds += dt;
    };
    Demo.prototype.onDocumentMouseMove = function(event) {
      this.mouseX = event.clientX - windowHalfX;
      return this.mouseY = event.clientY - windowHalfY;
    };
    Demo.prototype.onDocumentKeyDown = function(event) {
      var plane;
      plane = this.planes.shift();
      this.scene.removeChild(plane);
      this.scene.addChild(this.planes[0]);
      return this.planes.push(plane);
    };
    return Demo;
  })();
  demo = new Demo();
  demo.animate();
  window.demo = demo;
}).call(this);
