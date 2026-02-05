// Full React + Three.js + GSAP portfolio scaffold
// HERO: partículas formam o nome "RENAN COSTA" de forma LIMPA e LEGÍVEL
// Versão corrigida: texto não distorce, não quebra e não se mistura

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContentOverlay } from "./components/ContentOverlay";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const isScrolling = useRef(false);
  const scrollTimeout = useRef<number>(0);
  // Detecta se está scrollando para pausar a "respiração"
  useEffect(() => {
    const handleScroll = () => {
      isScrolling.current = true;

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, 150) as unknown as number;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // ===== SCENE =====
    const scene = new THREE.Scene();
    // scene.background = null; // Removido para usar o CSS atrás

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    // Ajuste responsivo para a câmera:
    // Se a tela for estreita (mobile), afasta a câmera para caber o texto inteiro
    const isMobile = window.innerWidth < 768;
    camera.position.z = isMobile ? 35 : 18; // 35 para mobile, 18 para desktop

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true, // Importante: Permite ver o background do CSS
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ===== LIGHTS =====
    // Luz ambiente mais forte para garantir que o preto não fique "chapado"
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    // Luz direcional para dar volume
    const dir = new THREE.DirectionalLight(0xffffff, 1.5);
    dir.position.set(5, 10, 7);
    scene.add(dir);

    // ===== PARTICLES =====
    const COUNT = 20000;
    const geometry = new THREE.SphereGeometry(0.08, 10, 10);
    // Material "Preto Profundo" para constraste no fundo branco
    const material = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.2,
      metalness: 0.5 // Um pouco de metalness para brilho sutil
    });
    const mesh = new THREE.InstancedMesh(geometry, material, COUNT);
    const dummy = new THREE.Object3D();

    const startPositions: THREE.Vector3[] = [];
    const textPositions: THREE.Vector3[] = [];

    // CAOS ESFÉRICO INICIAL (EXPLOSÃO)
    for (let i = 0; i < COUNT; i++) {
      // Posições ainda mais espalhadas para uma entrada dramática
      dummy.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      startPositions.push(dummy.position.clone());
    }

    // ===== TEXT CANVAS (CORRETO) =====
    const textCanvas = document.createElement("canvas");
    const ctx = textCanvas.getContext("2d");
    if (!ctx) return;

    textCanvas.width = 3000;
    textCanvas.height = 1000;

    ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "900 220px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("RENAN COSTA", textCanvas.width / 2, textCanvas.height / 2);

    const img = ctx.getImageData(0, 0, textCanvas.width, textCanvas.height).data;

    // Passo 4 para manter performance com 20k
    const stepX = 4;
    const stepY = 4;

    const worldWidth = 22;
    const worldHeight = 7.3;

    for (let y = 0; y < textCanvas.height; y += stepY) {
      for (let x = 0; x < textCanvas.width; x += stepX) {
        const i = (y * textCanvas.width + x) * 4;
        const alpha = img[i + 3];

        if (alpha > 50 && textPositions.length < COUNT) {
          textPositions.push(
            new THREE.Vector3(
              (x / textCanvas.width - 0.5) * worldWidth,
              -(y / textCanvas.height - 0.5) * worldHeight,
              0
            )
          );
        }
      }
    }

    while (textPositions.length < COUNT) {
      const randomPos = textPositions[Math.floor(Math.random() * textPositions.length)];
      textPositions.push(randomPos ? randomPos.clone() : new THREE.Vector3());
    }

    scene.add(mesh);

    // ===== SCROLL CONTROL =====
    const progress = { value: 0 };
    const idle = { value: 0 };

    // Restaura o controle via Scroll, mas MAIS RÁPIDO (end: 30%)
    gsap.to(progress, {
      value: 1,
      ease: "power2.out", // Suaviza a chegada
      scrollTrigger: {
        trigger: "#hero-spacer",
        start: "top top",
        end: "80% top", // Completa quase no final do scroll, sincronizado com a subida
        scrub: 1.5,
        pin: true,
      },
    });

    // Animação de SAÍDA (Fade Out) quando o conteúdo sobe
    gsap.to(canvasRef.current, {
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero-spacer",
        start: "60% top", // Começa a sumir um pouco depois da metade
        end: "bottom top",
        scrub: true,
      },
    });

    // ===== RENDER LOOP =====
    const animate = () => {
      // Só evolui o tempo de "vida" se não estiver scrollando
      if (!isScrolling.current) {
        // === CONTROLE DE VELOCIDADE GERAL ===
        // Aumente 0.015 para 0.03 para dobrar a velocidade, ou diminua para 0.005 para ficar lento
        idle.value += 0.005; // Reduzido para movimento bem lento
      }

      for (let i = 0; i < COUNT; i++) {
        const from = startPositions[i];
        const to = textPositions[i];

        // 1. Posição Base (Interpolada pelo scroll)
        dummy.position.lerpVectors(from, to, progress.value);

        // 2. Animação "Respiração" (Idle) - Movimento Orgânico Suave
        // Só acontece se o texto já estiver quase montado (> 0.5)
        // Só acontece se NÃO estiver scrollando violentamente
        if (progress.value > 0.5 && !isScrolling.current) {
          // Usamos funções trigonométricas desencontradas para criar um "flow"
          // i * 0.05 cria uma onda que percorre o texto
          const time = idle.value;

          // Movimento ondulatório suave no eixo Y
          dummy.position.y += Math.sin(time + from.x * 0.5) * 0.03;

          // Leve flutuação no eixo Z para profundidade
          dummy.position.z += Math.cos(time * 0.8 + from.y * 0.5) * 0.03;
        }

        // 3. CAOS VIVO (Quando no topo)
        // Se estiver no início, elas giram em um vórtex caótico
        if (progress.value < 0.3) {
          const time = idle.value;

          // Rotação da nuvem inteira (Vórtex)
          const rotationSpeed = 0.05; // Bem devagar agora
          const theta = time * rotationSpeed + (i * 0.0001); // i adiciona variação para não girar tudo igual

          const px = dummy.position.x;
          const pz = dummy.position.z;

          // Aplica rotação 2D (Eixo Y)
          dummy.position.x = px * Math.cos(theta) - pz * Math.sin(theta);
          dummy.position.z = px * Math.sin(theta) + pz * Math.cos(theta);

          // Adiciona flutuação vertical aleatória
          dummy.position.y += Math.sin(time * 0.5 + i) * 0.1;
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
      const isMobile = window.innerWidth < 768;
      camera.position.z = isMobile ? 35 : 18; // Atualiza ao redimensionar

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

      <ContentOverlay />
    </>
  );
}
