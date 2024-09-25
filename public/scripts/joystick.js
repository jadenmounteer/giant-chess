const joystick = document.getElementById('joystick');
const handle = document.getElementById('joystick-handle');
let isDragging = false;
let startX, startY;

joystick.addEventListener('touchstart', function (e) {
  isDragging = true;
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});

document.addEventListener('touchmove', function (e) {
  if (!isDragging) return;
  const touch = e.touches[0];
  const deltaX = touch.clientX - startX;
  const deltaY = touch.clientY - startY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const maxDistance = 50; // Maximum distance the joystick handle can move
  const angle = Math.atan2(deltaY, deltaX);

  // Limit the handle movement to the maximum distance
  const limitedDistance = Math.min(distance, maxDistance);
  const limitedX = Math.cos(angle) * limitedDistance;
  const limitedY = Math.sin(angle) * limitedDistance;

  handle.style.transform = `translate(${limitedX}px, ${limitedY}px)`;

  // Update camera position based on joystick input
  const camera = document.getElementById('camera');
  const position = camera.getAttribute('position');
  const direction = new THREE.Vector3();
  camera.object3D.getWorldDirection(direction);

  // Move the camera forward/backward based on the joystick's Y-axis movement
  position.x += direction.x * (limitedY / maxDistance) * 0.1; // Adjust the movement speed
  position.z += direction.z * (limitedY / maxDistance) * 0.1; // Adjust the movement speed

  // Move the camera left/right based on the joystick's X-axis movement
  const strafeDirection = new THREE.Vector3();
  strafeDirection.crossVectors(camera.object3D.up, direction).normalize();
  position.x += strafeDirection.x * (limitedX / maxDistance) * 0.1; // Adjust the movement speed
  position.z += strafeDirection.z * (limitedX / maxDistance) * 0.1; // Adjust the movement speed

  camera.setAttribute('position', position);
});

document.addEventListener('touchend', function () {
  isDragging = false;
  handle.style.transform = 'translate(0, 0)';
});
