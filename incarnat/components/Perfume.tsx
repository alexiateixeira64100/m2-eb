"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export default function Perfume({ onProgress, onReady, onError }: {
  onProgress: (n: number) => void; onReady: () => void; onError: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    const container = host.current;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" }); }
    catch { onError(); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, .1, 100);
    camera.position.set(0, .05, 8.8);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture;
    room.dispose();
    scene.add(new THREE.AmbientLight(0xffe6d4, .8));
    const key = new THREE.DirectionalLight(0xfff3dd, 2.5);
    key.position.set(-3, 4, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0xff6655, 4);
    rim.position.set(4, 2, -2); scene.add(rim);
    const pivot = new THREE.Group(); scene.add(pivot);
    let alive = true, loaded = false, frame = 0, progress = 0, target = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const disposeModel = (obj: THREE.Object3D) => obj.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        (Array.isArray(child.material) ? child.material : [child.material]).forEach(m => m.dispose());
      }
    });
    new GLTFLoader().load("/parfum.glb", gltf => {
      if (!alive) { disposeModel(gltf.scene); return; }
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      const wrapper = new THREE.Group(); wrapper.add(model);
      wrapper.scale.setScalar(3.7 / Math.max(size.y, size.x, size.z));
      model.traverse(child => {
        if (!(child instanceof THREE.Mesh)) return;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach(mat => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.envMapIntensity = 1.5;
            if (mat.name === "Realistic_Glass") {
              mat.color.set("#96715c"); mat.opacity = 1; mat.roughness = .12; mat.metalness = .15;
              if (mat instanceof THREE.MeshPhysicalMaterial) { mat.transmission = .5; mat.ior = 1.45; mat.thickness = .6; }
            }
          }
        });
      });
      pivot.add(wrapper); loaded = true; onProgress(100); onReady();
    }, event => { if (event.total) onProgress(Math.min(95, event.loaded / event.total * 95)); }, () => { if (alive) onError(); });
    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.position.z = camera.aspect < .7 ? 10.4 : 8.8;
      camera.updateProjectionMatrix();
    };
    const scroll = () => { target = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight); };
    resize(); scroll();
    window.addEventListener("resize", resize); window.addEventListener("scroll", scroll, { passive: true });
    const render = (time: number) => {
      frame = requestAnimationFrame(render);
      progress += (target - progress) * .065;
      pivot.rotation.y = -.3 + progress * Math.PI * 2;
      pivot.rotation.z = -.10 + Math.sin(progress * Math.PI * 2) * .12;
      pivot.rotation.x = .05;
      pivot.position.y = reduced ? 0 : Math.sin(time * .00065) * .045;
      pivot.position.x = window.innerWidth > 760 ? Math.sin(progress * Math.PI) * .8 : 0;
      if (loaded) renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(render);
    return () => {
      alive = false; cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize); window.removeEventListener("scroll", scroll);
      disposeModel(pivot); environment.dispose(); pmrem.dispose(); renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onProgress, onReady, onError]);
  return <div ref={host} className="perfume-canvas" role="img" aria-label="Flacon du parfum en 3D, dont la rotation suit le défilement de la page" />;
}
