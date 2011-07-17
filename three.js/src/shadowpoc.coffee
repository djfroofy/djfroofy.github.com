windowHalfX = window.innerWidth / 2
windowHalfY = window.innerHeight / 2

class Demo

    constructor: () ->
        @mouseX = @mouseY = 0

        container = document.createElement('div')
        p = document.createElement 'p'
        p.innerHTML = 'Hit any key to toggle between plane or cube-based ground.'
        p.innerHTML += '<br/>Note that shadow render oddly for ground with plane geometry.'
        container.appendChild p
        document.body.appendChild container


        @scene = new THREE.Scene()
        @renderer = new THREE.WebGLRenderer()
        @renderer.setSize(window.innerWidth, window.innerHeight)
        @camera = new THREE.Camera(45, window.innerWidth / window.innerHeight, 1, 10000)
        @camera.position.z = 2350
        #@camera.position.y = 700
        #@camera.target.position.y = 200
        @seconds = 0
        @sprites = []
        @planes = []

        mat1 = new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('textures/pavement.png')})
        mat2 = new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('textures/disturb.jpg')})

        cubeg = new THREE.CubeGeometry(200,200,200)
        planeg1 = new THREE.CubeGeometry(1000, 1000, 100)
        planeg2 = new THREE.PlaneGeometry(1000, 1000)

        mesh = new THREE.Mesh(cubeg, mat2)
        mesh.position.set(-200,300,100)
        mesh.velocity = 300
        @scene.addChild mesh
        @sprites.push mesh

        new THREE.ShadowVolume(mesh)

        mesh = new THREE.Mesh(cubeg, mat2)
        mesh.position.set(200,600,-100)
        mesh.velocity = -300
        @scene.addChild mesh
        @sprites.push mesh

        new THREE.ShadowVolume(mesh)

        mesh = new THREE.Mesh(planeg1, mat1)
        mesh.rotation.x = -90 * Math.PI / 180
        @scene.addChild mesh

        new THREE.ShadowVolume(mesh)

        @planes.push mesh

        mesh = new THREE.Mesh(planeg2, mat1)
        mesh.rotation.x = -90 * Math.PI / 180

        new THREE.ShadowVolume(mesh)

        @planes.push mesh

        @light = new THREE.DirectionalLight(0xffffff)
        @light.castShadow = true
        @light.position.set(0,1,0)
        @scene.addChild @light

        container.appendChild @renderer.domElement
        document.addEventListener 'mousemove', @onDocumentMouseMove
        document.addEventListener 'keydown', @onDocumentKeyDown

    animate: () =>
        requestAnimationFrame @animate
        dt = 0.02
        for sprite in @sprites
            sprite.position.x += sprite.velocity * dt
            if sprite.position.x >= 400
                sprite.position.x = 399
                sprite.velocity = -300
            if sprite.position.x <= -400
                sprite.position.x = -399
                sprite.velocity = 300
        @light.position.x = Math.sin(@seconds)
        @light.position.y = 1.5
        @light.position.z = Math.sin(@seconds)
        @camera.position.x += ( @mouseX - @camera.position.x )
        @camera.position.y += ( - @mouseY - @camera.position.y )
        @renderer.render(@scene, @camera)
        @seconds += dt

    onDocumentMouseMove: (event) =>
        @mouseX = ( event.clientX - windowHalfX )
        @mouseY = ( event.clientY - windowHalfY )

    onDocumentKeyDown: (event) =>
        plane = @planes.shift()
        @scene.removeChild plane
        @scene.addChild @planes[0]
        @planes.push plane

demo = new Demo()
demo.animate()
window.demo = demo

