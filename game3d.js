			var container, stats;
			var camera, scene, renderer;
			var projector, plane;
			var mouse2D, mouse3D, ray,
			rollOveredFace, isShiftDown = false,
			theta = 45, isCtrlDown = false;

			//init();
			//animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );


				camera = new THREE.Camera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.y = 800;
				camera.target.position.y = 200;

				scene = new THREE.Scene();

				// Grid

				var geometry = new THREE.Geometry();
				geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( - 125, 0, 0 ) ) );
				geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( 125, 0, 0 ) ) );

				var material = new THREE.LineBasicMaterial( { color: 0x333333, opacity: 0.2 } );

				for ( var i = 0; i <= 5; i ++ ) {

					var line = new THREE.Line( geometry, material );
					line.position.z = ( i * 50 ) - 125;
					scene.addObject( line );

					var line = new THREE.Line( geometry, material );
					line.position.x = ( i * 50 ) - 125;
					line.rotation.y = 90 * Math.PI / 180;
					scene.addObject( line );

				}

				projector = new THREE.Projector();

				plane = new THREE.Mesh( new THREE.PlaneGeometry( 250, 250, 5, 5 ), new THREE.MeshFaceMaterial() );
				plane.rotation.x = - 90 * Math.PI / 180;
				scene.addObject( plane );

				mouse2D = new THREE.Vector3( 0, 10000, 1 );
				ray = new THREE.Ray( camera.position, null );

				// Lights

				var ambientLight = new THREE.AmbientLight( 0x606060 );
				scene.addLight( ambientLight );

				var directionalLight = new THREE.DirectionalLight( 0xffffff );
				directionalLight.position.x = Math.random() - 0.5;
				directionalLight.position.y = Math.random() - 0.5;
				directionalLight.position.z = Math.random() - 0.5;
				directionalLight.position.normalize();
				scene.addLight( directionalLight );

				var directionalLight = new THREE.DirectionalLight( 0x808080 );
				directionalLight.position.x = Math.random() - 0.5;
				directionalLight.position.y = Math.random() - 0.5;
				directionalLight.position.z = Math.random() - 0.5;
				directionalLight.position.normalize();
				scene.addLight( directionalLight );

				renderer = new THREE.CanvasRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );

				container.appendChild(renderer.domElement);


				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				//document.addEventListener( 'mousedown', onDocumentMouseDown, false );
				document.addEventListener( 'keydown', onDocumentKeyDown, false );
				//document.addEventListener( 'keyup', onDocumentKeyUp, false );

			}

      function setup(){
        for(x=0;x<5;x++){
          for(y=0;y<5;y++){
            addCube(x,0,y,'cccccc');
          }
        }
      }

			function onDocumentMouseMove( event ) {

				event.preventDefault();

				mouse2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			}
      

      function addCube(x,y,z,color){
            color = '0x' + color;
						var voxel = new THREE.Mesh( new THREE.CubeGeometry( 50, 50, 50 ), [ new THREE.MeshLambertMaterial( { color: color, opacity: 1, shading: THREE.FlatShading } ), new THREE.MeshFaceMaterial() ] );
						voxel.position.x = Math.floor( x ) * 50 - 100;
						voxel.position.y = Math.floor( y ) * 50 + 25;
						voxel.position.z = Math.floor( z ) * 50 - 100;
						voxel.matrixAutoUpdate = false;
						voxel.updateMatrix();
						voxel.overdraw = true;
						scene.addObject( voxel );
      }
      
			function onDocumentKeyDown( event ) {
        //console.log(event.keyCode);
				switch( event.keyCode ) {
				  case 38:
				    camera.position.y += 10;
				    break;
				  case 40:
				    camera.position.y -= 10;
				    break;
          case 39:
            theta += 10;
            break;
          case 37:
            theta -= 10;
            break;  
					case 16: 
            isShiftDown = true;
            break;
					case 17: isCtrlDown = true; break;

				}

			}

			function save() {

				window.open( renderer.domElement.toDataURL('image/png'), 'mywindow' );

			}


			function animate() {
				requestAnimationFrame( animate );
				render();
			}

			function render() {


				mouse3D = projector.unprojectVector( mouse2D.clone(), camera );
				ray.direction = mouse3D.subSelf( camera.position ).normalize();
				camera.position.x = 1400 * Math.sin( theta * Math.PI / 360 );
				camera.position.z = 1400 * Math.cos( theta * Math.PI / 360 );

				renderer.render( scene, camera );

			}


      $(document).ready(function(){
        init();
        animate();
      });