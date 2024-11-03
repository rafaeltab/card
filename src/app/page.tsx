"use client"
import * as THREE from 'three'
import React, { useMemo, useRef } from 'react'
import { Canvas, ThreeElements, useLoader } from '@react-three/fiber'
import { useMousePosition } from './hooks/use_mouse_position';
import { useCardSize } from './hooks/use_card_size';
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

export default function Home() {

    return (
        <div className="flex justify-center items-center h-screen">
            <Canvas className="h-screen w-screen">
                <spotLight position={[3, 3, 5]} angle={1} penumbra={0} decay={0} intensity={Math.PI * 1} />
                <Box />
            </Canvas>
        </div>
    );
}

function Box(props: ThreeElements['mesh']) {
    const texture = useLoader(THREE.TextureLoader, 'texture.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(0.2, 0.2)
    texture.offset.set(0.5, 0.5)

    const groupRef = useRef<THREE.Group>(null!)
    const vec = useMousePosition();
    const cardSize = useCardSize();
    groupRef.current?.lookAt(vec.setZ(0.2));
    // <planeGeometry args={[cardSize.width, cardSize.height]} />
    const geometry = useGeometry(cardSize.width, cardSize.height, cardSize.thickness);
    const textGeometry = useTextGeometry();
    return (
        <group
            ref={groupRef}
        >
            <mesh
                {...props}
                geometry={geometry}>
                <meshStandardMaterial
                    map={texture}
                    color={'orange'} metalness={0} />

            </mesh >

            <mesh
                {...props}
                geometry={textGeometry}>
                <meshStandardMaterial
                    color={'red'} metalness={2} />

            </mesh >
        </group>
    )
}

function useTextGeometry() {
    const font = useLoader(FontLoader, 'typeface.json');
    const cardSize = useCardSize();
    const textGeometry = useMemo(() => {
        const textGeo = new TextGeometry('Credit Card', {
            font,
            size: 0.10,
            height: 0.00,
            curveSegments: 12,
        });
        textGeo.center();
        const positionX = 0.2;
        const positionY = 0.1;

        const xStart = cardSize.height / 2;
        const xEnd = -cardSize.height / 2;

        const yStart = cardSize.width / 2;
        const yEnd = -cardSize.width / 2;

        const actualX = lerp(xStart, xEnd, positionX);
        const actualY = lerp(yStart, yEnd, positionY);

        textGeo.rotateZ(Math.PI * 1.5);
        textGeo.translate(actualY, actualX, 0.1); // Position text slightly above the card

        return textGeo;
    }, [font, cardSize]);
    return textGeometry;
}

function useGeometry(width: number, height: number, thickness: number) {

    const shape = React.useMemo(() => {
        const shape = new THREE.Shape();
        const radius = 0.1; // Radius of the rounded corners (on X-axis)

        // Draw a rounded rectangle shape with rounded corners only horizontally
        shape.moveTo(-width / 2 + radius, -height / 2); // Bottom left start
        shape.lineTo(width / 2 - radius, -height / 2); // Bottom line
        shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius); // Bottom-right corner
        shape.lineTo(width / 2, height / 2 - radius); // Right line
        shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2); // Top-right corner
        shape.lineTo(-width / 2 + radius, height / 2); // Top line
        shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius); // Top-left corner
        shape.lineTo(-width / 2, -height / 2 + radius); // Left line
        shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2); // Bottom-left corner

        return shape;
    }, [height, width]);

    // Extrude the shape to give it depth
    const geometry = React.useMemo(() => {
        return new THREE.ExtrudeGeometry(shape, {
            depth: thickness, // Thickness of the card
            bevelEnabled: false, // Disable additional bevel for edges
        });
    }, [shape, thickness]);
    return geometry;
}
function lerp(a: number, b: number, t: number) {
    return (1 - t) * a + t * b;
}
