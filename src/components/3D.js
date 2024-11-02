// App.js
import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useMemo } from "react";

function flatten3DArray(array) {
  if (
    !Array.isArray(array) ||
    array.length !== 5 ||
    !array.every(
      (layer) =>
        Array.isArray(layer) &&
        layer.length === 5 &&
        layer.every((row) => Array.isArray(row) && row.length === 5)
    )
  ) {
    throw new Error("Invalid input: must be a 5x5x5 array.");
  }

  const flatArray = [];

  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      for (let z = 0; z < 5; z++) {
        flatArray.push(array[x][y][z]);
      }
    }
  }

  return flatArray;
}

function NumberedBox({ position, number }) {
  const mesh = useRef();

  useEffect(() => {
    const fontLoader = new FontLoader();

    fontLoader.load("/Roboto_Regular.json", (font) => {
      const positions = [
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1, 0),
      ];

      const rotations = [
        new THREE.Euler(0, 0, 0),
        new THREE.Euler(0, Math.PI, 0),
        new THREE.Euler(0, Math.PI / 2, 0),
        new THREE.Euler(0, -Math.PI / 2, 0),
        new THREE.Euler(-Math.PI / 2, 0, 0),
        new THREE.Euler(Math.PI / 2, 0, 0),
      ];

      positions.forEach((position, index) => {
        const geometry = new TextGeometry(number.toString(), {
          font: font,
          size: 0.5,
          height: 0.1,
          curveSegments: 12,
          bevelEnabled: false,
        });
        geometry.center();
        const material = new THREE.MeshStandardMaterial({ color: "black" });
        const textMesh = new THREE.Mesh(geometry, material);
        textMesh.position.copy(position);
        textMesh.rotation.copy(rotations[index]);
        mesh.current.add(textMesh);
      });
    });

    return () => {
      while (mesh.current && mesh.current.children.length) {
        mesh.current.remove(mesh.current.children[0]);
      }
    };
  }, []);

  return (
    <group position={position} ref={mesh}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>
    </group>
  );
}

function CubeGrid({ array }) {
  const boxes = useMemo(() => {
    const boxesArray = [];

    for (let i = 0; i < array.length; i++) {
      const x = i % 5;
      const y = Math.floor((i % 25) / 5);
      const z = Math.floor(i / 25);

      // console.log(typeof(array[i]));

      boxesArray.push(
        <NumberedBox
          key={i}
          position={[(x - 2) * 4, (-y + 2) * 4, (-z + 2) * 4]}
          number={array[i]}
        />
      );
    }

    return boxesArray;
  }, [array]);

  return <>{boxes}</>;
}

function CubeGrid2({ array }) {
  const boxes = useMemo(() => {
    const boxesArray = [];

    for (let i = 0; i < array.length; i++) {
      const x = i % 5;
      const y = Math.floor((i % 25) / 5);
      const z = Math.floor(i / 25);

      // console.log(typeof(array[i]));

      boxesArray.push(
        <NumberedBox
          key={i}
          position={[(x - 2) * 2, (-y + 2) * 2, (-z + 2) * 2]}
          number={array[i]}
        />
      );
    }

    return boxesArray;
  }, [array]);

  return <>{boxes}</>;
}

const D3 = ({ array }) => {
  // const nextArray = flatten3DArray(array);
  const nextArray = array;
  return (
    <div className="w-full h-full">
      <Canvas
        className="h-full w-full rounded-3xl"
        style={{ backgroundColor: "black" }}
        camera={{ position: [0, 0, 25], fov: 90 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 1]} intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <CubeGrid array={nextArray} />
        <OrbitControls />
      </Canvas>

      {/* <Canvas
        className="h-full w-full"
        style={{ backgroundColor: "black" }}
        camera={{ position: [0, 0, 15], fov: 90 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 1]} intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <CubeGrid2 array={nextArray} />
        <OrbitControls />
      </Canvas> */}
    </div>
  );
};

export default D3;
