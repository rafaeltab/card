import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three'

export function useMousePosition() {
    const [
        mousePosition,
        setMousePosition
    ] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
    const state = useThree();
    useEffect(() => {
        function updateMousePosition(e: MouseEvent) {
            const vector = new THREE.Vector3();
            vector.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1, 0);
            vector.unproject(state.camera);

            if (!Number.isFinite(vector.x) || !Number.isFinite(vector.y) || !Number.isFinite(vector.z)) return;

            setMousePosition(vector);
        }

        window.addEventListener('mousemove', updateMousePosition);
        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, [state.camera]);

    return mousePosition;
}
