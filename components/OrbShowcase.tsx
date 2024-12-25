"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

interface OrbProps {
  status: 'connected' | 'disconnected' | string;
  conversation: any;
  msgs: any[];
  currentVolume: number;
}

const Orb: React.FC<{ intensity?: number; status: string; currentVolume: number }> = ({ 
  intensity = 6, 
  status, 
  currentVolume 
}) => {
  console.log('ORB RENDER - Status:', status, 'Volume:', currentVolume);
  
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);
  const originalPositionsRef = useRef<any | null>(null);
  const noise = createNoise3D();
 
  useEffect(() => {
    console.log('Orb status:', status);
    console.log('Orb currentVolume:', currentVolume);
  }, [status, currentVolume]);
 
  useEffect(() => {
    initViz();
    window.addEventListener("resize", onWindowResize);
    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);
 
  useEffect(() => {
    if (status === 'connected' && ballRef.current) {
      console.log('Attempting morph with volume:', currentVolume);
      updateBallMorph(ballRef.current, currentVolume);
    } else if (
      status !== 'connected' &&
      ballRef.current &&
      originalPositionsRef.current
    ) {
      resetBallMorph(ballRef.current, originalPositionsRef.current);
    }
  }, [currentVolume, status]);
 
  const initViz = () => {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    const camera = new THREE.PerspectiveCamera(
      20,
      1,
      1,
      100,
    );
    camera.position.set(0, 0, 100);
    camera.lookAt(scene.position);
 
    scene.add(camera);
    sceneRef.current = scene;
    groupRef.current = group;
    cameraRef.current = camera;
 
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const outElement = document.getElementById("out");
    if (outElement) {
      outElement.innerHTML = ""; // Clear any existing renderer
      outElement.appendChild(renderer.domElement);
      
      // Set renderer size to match container width
      const width = outElement.clientWidth;
      renderer.setSize(width, width);
      
      // Style the canvas element to maintain aspect ratio
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.objectFit = 'contain';
    }
 
    rendererRef.current = renderer;
 
    const icosahedronGeometry = new THREE.IcosahedronGeometry(10, 8);
    const lambertMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      wireframe: true,
    });
 
    const ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    ball.position.set(0, 0, 0);
    ballRef.current = ball;
 
    // Store the original positions of the vertices
    originalPositionsRef.current =
      ball.geometry.attributes.position.array.slice();
 
    group.add(ball);
 
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
 
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.intensity = 0.9;
    spotLight.position.set(-10, 40, 20);
    spotLight.lookAt(ball.position);
    spotLight.castShadow = true;
    scene.add(spotLight);
 
    scene.add(group);
 
    render();
  };
 
  const render = () => {
    if (
      !groupRef.current ||
      !ballRef.current ||
      !cameraRef.current ||
      !rendererRef.current ||
      !sceneRef.current
    ) {
      return;
    }
 
    groupRef.current.rotation.y += 0.005;
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    requestAnimationFrame(render);
  };
 
  const onWindowResize = () => {
    if (!cameraRef.current || !rendererRef.current) return;
 
    const outElement = document.getElementById("out");
    if (outElement) {
      const width = outElement.clientWidth;
      rendererRef.current.setSize(width, width);
      
      cameraRef.current.aspect = 1;
      cameraRef.current.updateProjectionMatrix();
    }
  };
 
  const updateBallMorph = (mesh: THREE.Mesh, volume: number) => {
    console.log('UPDATE BALL MORPH - Volume:', volume);
    const geometry = mesh.geometry as THREE.BufferGeometry;
    const positionAttribute = geometry.getAttribute("position");
 
    for (let i = 0; i < positionAttribute.count; i++) {
      const vertex = new THREE.Vector3(
        positionAttribute.getX(i),
        positionAttribute.getY(i),
        positionAttribute.getZ(i),
      );
 
      const offset = 10; // Radius of the icosahedron
      const amp = 2.5; // Dramatic effect
      const time = window.performance.now();
      vertex.normalize();
      const rf = 0.00001;
      const distance =
        offset +
        volume * 4 * intensity + // Apply intensity to volume effect
        noise(
          vertex.x + time * rf * 7,
          vertex.y + time * rf * 8,
          vertex.z + time * rf * 9,
        ) *
          amp *
          volume * intensity; // Apply intensity to noise effect
      vertex.multiplyScalar(distance);
 
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
 
    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
  };
 
  const resetBallMorph = (
    mesh: THREE.Mesh,
    originalPositions: Float32Array,
  ) => {
    const geometry = mesh.geometry as THREE.BufferGeometry;
    const positionAttribute = geometry.getAttribute("position");
 
    for (let i = 0; i < positionAttribute.count; i++) {
      positionAttribute.setXYZ(
        i,
        originalPositions[i * 3],
        originalPositions[i * 3 + 1],
        originalPositions[i * 3 + 2],
      );
    }
 
    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
  };
 
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div
        id="out"
        className="hover:cursor-pointer aspect-square w-full"
      ></div>
    </div>
  );
};
 
const OrbShowcase: React.FC<OrbProps> = ({ status, conversation, msgs, currentVolume }) => {
  return (
    <div className="p-6 w-full justify-center items-center flex flex-col">
      <div className="aspect-square max-h-96">
        <Orb intensity={3} status={status} currentVolume={currentVolume} />
      </div>
      <p className="text-sm text-center">
        {status === 'connected' ? 'Active' : 'Inactive'}
      </p>
    </div>
  );
};
 
export default OrbShowcase;