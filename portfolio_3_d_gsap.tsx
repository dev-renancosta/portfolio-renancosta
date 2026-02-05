// Full React + Three.js + GSAP portfolio scaffold
// HERO: partículas formam o nome "RENAN COSTA" de forma LIMPA e LEGÍVEL
// Versão corrigida: texto não distorce, não quebra e não se mistura

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // ===== SCENE =====
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f5f5f5");

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ===== LIGHTS =====
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(4, 6, 6);
    scene.add(dir);

    // ===== PARTICLES =====
    const COUNT = 6500; // MAIS DENSIDADE = TEXTO LIMPO
    const geometry = new THREE.SphereGeometry(0.065, 10, 10);
    const material = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const mesh = new THREE.InstancedMesh(geometry, material, COUNT);
    const dummy = new THREE.Object3D();

    const startPositions: THREE.Vector3[] = [];
    const textPositions: THREE.Vector3[] = [];

    // CAOS INICIAL CONTROLADO
    for (let i = 0; i < COUNT; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 6
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      startPositions.push(dummy.position.clone());
    }

    // ===== TEXT CANVAS (CORRETO) =====
    const textCanvas = document.createElement("canvas");
    const ctx = textCanvas.getContext("2d");
    if (!ctx) return;

    textCanvas.width = 2400;
    textCanvas.height = 600;

    ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "900 240px Arial Black, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("RENAN COSTA", textCanvas.width / 2, textCanvas.height / 2);

    const img = ctx.getImageData(0, 0, textCanvas.width, textCanvas.height).data;

    // AMOSTRAGEM MAIS DENSA E PROPORCIONAL
    for (let y = 0; y < textCanvas.height; y += 2) {
      for (let x = 0; x < textCanvas.width; x += 2) {
        const i = (y * textCanvas.width + x) * 4;
        if (img[i + 3] > 140 && textPositions.length < COUNT) {
          textPositions.push(
            new THREE.Vector3(
              (x / textCanvas.width - 0.5) * 12, // LARGURA REAL
              -(y / textCanvas.height - 0.5) * 3.5, // ALTURA REAL
              0
            )
          );
        }
      }
    }

    // GARANTIA ABSOLUTA
    while (textPositions.length < COUNT) {
      textPositions.push(textPositions[textPositions.length % textPositions.length].clone());
    }

    scene.add(mesh);

    // ===== SCROLL =====
    const progress = { value: 0 };
    const idle = { value: 0 };

    gsap.to(progress, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero-spacer",
        start: "top top",
        end: "70% top",
        scrub: true,
        pin: true,
      },
    });

    // ===== RENDER LOOP =====
    const animate = () => {
      idle.value += 0.008;

      for (let i = 0; i < COUNT; i++) {
        const from = startPositions[i];
        const to = textPositions[i];

        dummy.position.lerpVectors(from, to, progress.value);

        // CAOS SÓ NO COMEÇO
        if (progress.value < 0.25) {
          dummy.position.x += Math.sin(idle.value + i) * 0.015;
          dummy.position.y += Math.cos(idle.value + i) * 0.015;
        }

        // MICRO VIDA SEM QUEBRAR A LETRA
        if (progress.value > 0.95) {
          dummy.position.x += Math.sin(idle.value + i) * 0.0015;
          dummy.position.y += Math.cos(idle.value + i) * 0.0015;
        }

        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    // ===== RESIZE =====
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ScrollTrigger.killAll();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
        }}
      />

      <main>
        <section id="hero-spacer" style={{ height: "220vh" }} />
        <section style={{ height: "100vh" }} />
      </main>
    </>
  );
}
