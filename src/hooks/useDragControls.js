import { useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const useDragControls = (onDrag, onDragEnd) => {
  const { camera, raycaster, mouse, scene } = useThree();
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const dragOffset = useRef(new THREE.Vector3());
  const isDragging = useRef(false);
  const draggedObject = useRef(null);

  const getIntersectionPoint = useCallback((event, plane = dragPlane.current) => {
    const rect = event.target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    mouse.set(x, y);
    raycaster.setFromCamera(mouse, camera);
    
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);
    
    return intersection;
  }, [camera, raycaster, mouse]);

  const handlePointerDown = useCallback((event, object) => {
    event.stopPropagation();
    
    const intersection = getIntersectionPoint(event);
    if (intersection) {
      draggedObject.current = object;
      dragOffset.current.copy(intersection).sub(new THREE.Vector3(...object.position));
      isDragging.current = true;
      
      // Atualizar o plano de arraste para a altura do objeto
      dragPlane.current.setFromNormalAndCoplanarPoint(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, object.position[1], 0)
      );
    }
  }, [getIntersectionPoint]);

  const handlePointerMove = useCallback((event) => {
    if (!isDragging.current || !draggedObject.current) return;
    
    const intersection = getIntersectionPoint(event);
    if (intersection && onDrag) {
      const newPosition = intersection.sub(dragOffset.current);
      onDrag(draggedObject.current, newPosition);
    }
  }, [getIntersectionPoint, onDrag]);

  const handlePointerUp = useCallback((event) => {
    if (isDragging.current && draggedObject.current && onDragEnd) {
      onDragEnd(draggedObject.current);
    }
    
    isDragging.current = false;
    draggedObject.current = null;
  }, [onDragEnd]);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    isDragging: isDragging.current,
  };
};
