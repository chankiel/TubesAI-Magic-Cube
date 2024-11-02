import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as THREE from "three";

// Register TextGeometry with react-three-fiber
extend({ TextGeometry });

const Cube = () => {
  const mesh = useRef();

  useEffect(() => {
    const fontLoader = new FontLoader();

    // Load the font
    fontLoader.load("/Roboto_Regular.json", (font) => {
      // Create text geometries once the font is loaded
      const positions = [
        new THREE.Vector3(0, 0, 1.1),
        new THREE.Vector3(0, 0, -1.1),
        new THREE.Vector3(1.1, 0, 0),
        new THREE.Vector3(-1.1, 0, 0),
        new THREE.Vector3(0, 1.1, 0),
        new THREE.Vector3(0, -1.1, 0),
      ];

      const rotations = [
        new THREE.Euler(0, 0, 0),
        new THREE.Euler(0, Math.PI, 0),
        new THREE.Euler(0, Math.PI / 2, 0),
        new THREE.Euler(0, -Math.PI / 2, 0),
        new THREE.Euler(Math.PI / 2, 0, 0),
        new THREE.Euler(-Math.PI / 2, 0, 0),
      ];

      positions.forEach((position, index) => {
        const geometry = new TextGeometry("1", {
          font: font,
          size: 0.5,
          height: 0.1,
          curveSegments: 12,
          bevelEnabled: false,
        });
        geometry.center(); // Center the text
        const material = new THREE.MeshStandardMaterial({ color: "black" });
        const textMesh = new THREE.Mesh(geometry, material);
        textMesh.position.copy(position);
        textMesh.rotation.copy(rotations[index]);
        mesh.current.add(textMesh); // Add text mesh to the cube
      });
    });

    return () => {
      // Clean up: Remove all text meshes when the component unmounts
      while (mesh.current && mesh.current.children.length) {
        mesh.current.remove(mesh.current.children[0]);
      }
    };
  }, []);

  // Rotate the cube on every frame
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="lightblue" />
    </mesh>
  );
};

const Tes = () => {
  return (
    <Canvas style={{ height: "100vh" }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Cube />
    </Canvas>
  );
};

export default Tes;
