
			var SCREEN_WIDTH = window.innerWidth;
			var SCREEN_HEIGHT = window.innerHeight;

			var container;
			var stats;

			var camera;
			var scene;
			var renderer;

			var cube, plane;
			
			var targetRotation = 0;
			var targetRotationOnMouseDown = 0;

			var mouseX = 0;
			var mouseXOnMouseDown = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			init();
			setInterval(loop, 1000/60);

			function init()
			{
				container = document.createElement('div');
				document.body.appendChild(container);
				
				var info = document.createElement('div');
				info.style.position = 'absolute';
				info.style.top = '10px';
				info.style.width = '100%';
				info.style.textAlign = 'center';
				info.innerHTML = 'Drag to spin the cube';
				container.appendChild(info);
			
				camera = new Camera(0, 150, 400);
				camera.focus = 300;
				camera.target.y = 150;
				camera.updateMatrix();

				scene = new Scene();

				// Cube

				geometry = new Cube(200, 200, 200);

				for (var i = 0; i < geometry.faces.length; i++)
					geometry.faces[i].color.setRGBA( Math.floor( Math.random() * 128), Math.floor( Math.random() * 128 + 128), Math.floor( Math.random() * 128 + 128), 255 );
								
				cube = new Mesh(geometry, new FaceColorMaterial());
				cube.position.y = 150;
				cube.updateMatrix();
				scene.add(cube);
				
				// Plane
				
				plane = new Mesh(new Plane(200, 200), new ColorMaterial(0xe0e0e0));
				plane.rotation.x = 90 * (Math.PI / 180);
				plane.updateMatrix();
				scene.add(plane);
				
				renderer = new CanvasRenderer();
				renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

				container.appendChild(renderer.viewport);

				stats = new Stats();
				container.appendChild(stats.getDisplayElement());
				
				document.addEventListener('mousedown', onDocumentMouseDown, false);
				document.addEventListener('touchstart', onDocumentTouchStart, false);
				document.addEventListener('touchmove', onDocumentTouchMove, false);
			}

			//

			function onDocumentMouseDown( event )
			{
				event.preventDefault();
				
				document.addEventListener('mousemove', onDocumentMouseMove, false);
				document.addEventListener('mouseup', onDocumentMouseUp, false);
				document.addEventListener('mouseout', onDocumentMouseOut, false);
				
				mouseXOnMouseDown = event.clientX - windowHalfX;
				targetRotationOnMouseDown = targetRotation;
			}

			function onDocumentMouseMove( event )
			{
				mouseX = event.clientX - windowHalfX;
				
				targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
			}
			
			function onDocumentMouseUp( event )
			{
				document.removeEventListener('mousemove', onDocumentMouseMove, false);
				document.removeEventListener('mouseup', onDocumentMouseUp, false);
				document.removeEventListener('mouseout', onDocumentMouseOut, false);
			}
			
			function onDocumentMouseOut( event )
			{
				document.removeEventListener('mousemove', onDocumentMouseMove, false);
				document.removeEventListener('mouseup', onDocumentMouseUp, false);
				document.removeEventListener('mouseout', onDocumentMouseOut, false);
			}
			
			function onDocumentTouchStart( event )
			{
				if(event.touches.length == 1)
				{
					event.preventDefault();

					mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
					targetRotationOnMouseDown = targetRotation;
				}
			}

			function onDocumentTouchMove( event )
			{
				if(event.touches.length == 1)
				{
					event.preventDefault();
					
					mouseX = event.touches[0].pageX - windowHalfX;
					
					targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;
				}
			}
			
			//

			function loop()
			{
				cube.rotation.y += (targetRotation - cube.rotation.y) * 0.05;
				cube.updateMatrix();
				
				plane.rotation.z = -cube.rotation.y;
				plane.updateMatrix();
				
				renderer.render(scene, camera);
				stats.update();
			}
