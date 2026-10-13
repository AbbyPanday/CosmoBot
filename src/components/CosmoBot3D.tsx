import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type BotEmotion = 'happy' | 'heart' | 'star' | 'think' | 'laugh';

export interface PhysicsParams {
  orbitSpeed: number;
  asteroidDensity: number;
  gravityWell: number;
  zeroGActive: boolean;
}

interface CosmoBot3DProps {
  emotion: BotEmotion;
  physics: PhysicsParams;
  onRobotClick?: () => void;
  className?: string;
}

export const CosmoBot3D: React.FC<CosmoBot3DProps> = ({
  emotion,
  physics,
  onRobotClick,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const emotionRef = useRef<BotEmotion>(emotion);
  const physicsRef = useRef<PhysicsParams>(physics);

  // References to dynamic objects inside Three.js scene
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    robotRoot: THREE.Group;
    headGroup: THREE.Group;
    torsoGroup: THREE.Group;
    rightArmGroup: THREE.Group;
    handRGroup: THREE.Group;
    leftArmGroup: THREE.Group;
    ring1Mesh: THREE.Mesh;
    ring2Mesh: THREE.Mesh;
    starGroup: THREE.Group;
    asteroidMesh: THREE.Mesh;
    particles: THREE.Points;
    faceTexture: THREE.CanvasTexture;
    faceCanvas: HTMLCanvasElement;
    faceCtx: CanvasRenderingContext2D;
    clock: THREE.Clock;
    mouse: { x: number; y: number; targetX: number; targetY: number };
    recoilTimer: number;
    blinkTimer: number;
    isBlinking: boolean;
  } | null>(null);

  // Keep ref up to date
  useEffect(() => {
    emotionRef.current = emotion;
    if (sceneRef.current) {
      drawVisorFace(emotion);
    }
  }, [emotion]);

  useEffect(() => {
    physicsRef.current = physics;
  }, [physics]);

  const drawVisorFace = (mood: BotEmotion, blink = false) => {
    const s = sceneRef.current;
    if (!s) return;
    const { faceCtx, faceTexture } = s;

    faceCtx.clearRect(0, 0, 512, 256);
    faceCtx.shadowColor = '#00f0ff';
    faceCtx.shadowBlur = 18;
    faceCtx.fillStyle = '#00f0ff';
    faceCtx.strokeStyle = '#00f0ff';

    if (blink) {
      // Blinking eyes: simple horizontal cyan bars
      faceCtx.lineWidth = 10;
      faceCtx.lineCap = 'round';
      faceCtx.beginPath();
      faceCtx.moveTo(110, 130);
      faceCtx.lineTo(180, 130);
      faceCtx.moveTo(330, 130);
      faceCtx.lineTo(400, 130);
      faceCtx.stroke();
      faceTexture.needsUpdate = true;
      return;
    }

    if (mood === 'happy') {
      faceCtx.lineWidth = 26;
      faceCtx.lineCap = 'round';

      // Left eye arch
      faceCtx.beginPath();
      faceCtx.arc(145, 130, 52, Math.PI * 1.08, Math.PI * 1.92, false);
      faceCtx.stroke();

      // Right eye arch
      faceCtx.beginPath();
      faceCtx.arc(367, 130, 52, Math.PI * 1.08, Math.PI * 1.92, false);
      faceCtx.stroke();

      // Pink pixel blush
      faceCtx.shadowColor = '#ff2a6d';
      faceCtx.shadowBlur = 14;
      faceCtx.fillStyle = '#ff2a6d';
      for (let i = 0; i < 4; i++) {
        faceCtx.fillRect(95 + i * 14, 168 + (i % 2) * 5, 10, 10);
        faceCtx.fillRect(360 + i * 14, 168 + (i % 2) * 5, 10, 10);
      }
    } else if (mood === 'heart') {
      faceCtx.shadowColor = '#00f0ff';
      faceCtx.shadowBlur = 24;
      faceCtx.fillStyle = '#00f0ff';

      const drawHeart = (cx: number, cy: number, sz: number) => {
        faceCtx.beginPath();
        faceCtx.moveTo(cx, cy);
        faceCtx.bezierCurveTo(cx - sz, cy - sz, cx - sz * 1.5, cy + sz * 0.45, cx, cy + sz * 1.4);
        faceCtx.bezierCurveTo(cx + sz * 1.5, cy + sz * 0.45, cx + sz, cy - sz, cx, cy);
        faceCtx.fill();
      };
      drawHeart(145, 96, 38);
      drawHeart(367, 96, 38);

      faceCtx.shadowColor = '#ff2a6d';
      faceCtx.fillStyle = '#ff2a6d';
      for (let i = 0; i < 4; i++) {
        faceCtx.fillRect(95 + i * 14, 172, 11, 11);
        faceCtx.fillRect(360 + i * 14, 172, 11, 11);
      }
    } else if (mood === 'star') {
      faceCtx.shadowColor = '#ffe600';
      faceCtx.shadowBlur = 25;
      faceCtx.fillStyle = '#ffea00';

      const drawStar = (cx: number, cy: number, spikes: number, outerR: number, innerR: number) => {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        faceCtx.beginPath();
        faceCtx.moveTo(cx, cy - outerR);
        for (let i = 0; i < spikes; i++) {
          x = cx + Math.cos(rot) * outerR;
          y = cy + Math.sin(rot) * outerR;
          faceCtx.lineTo(x, y);
          rot += step;
          x = cx + Math.cos(rot) * innerR;
          y = cy + Math.sin(rot) * innerR;
          faceCtx.lineTo(x, y);
          rot += step;
        }
        faceCtx.lineTo(cx, cy - outerR);
        faceCtx.closePath();
        faceCtx.fill();
      };
      drawStar(145, 120, 5, 52, 25);
      drawStar(367, 120, 5, 52, 25);

      faceCtx.lineWidth = 18;
      faceCtx.strokeStyle = '#00f0ff';
      faceCtx.beginPath();
      faceCtx.arc(256, 155, 38, 0.2, Math.PI - 0.2, false);
      faceCtx.stroke();
    } else if (mood === 'think') {
      faceCtx.lineWidth = 14;
      faceCtx.strokeStyle = '#00f0ff';
      faceCtx.beginPath();
      faceCtx.arc(256, 120, 48, 0, Math.PI * 1.6);
      faceCtx.stroke();

      faceCtx.fillStyle = '#00f0ff';
      faceCtx.beginPath();
      faceCtx.arc(145, 125, 24, 0, Math.PI * 2);
      faceCtx.arc(367, 125, 24, 0, Math.PI * 2);
      faceCtx.fill();

      // HUD crosshair
      faceCtx.lineWidth = 4;
      faceCtx.beginPath();
      faceCtx.moveTo(256, 60);
      faceCtx.lineTo(256, 180);
      faceCtx.moveTo(196, 120);
      faceCtx.lineTo(316, 120);
      faceCtx.stroke();
    } else if (mood === 'laugh') {
      faceCtx.lineWidth = 24;
      faceCtx.lineCap = 'round';

      // Closed crescent laugh eyes
      faceCtx.beginPath();
      faceCtx.arc(145, 115, 46, Math.PI * 0.1, Math.PI * 0.9, false);
      faceCtx.stroke();

      faceCtx.beginPath();
      faceCtx.arc(367, 115, 46, Math.PI * 0.1, Math.PI * 0.9, false);
      faceCtx.stroke();

      // Laughing mouth
      faceCtx.lineWidth = 16;
      faceCtx.beginPath();
      faceCtx.arc(256, 145, 42, 0.1, Math.PI - 0.1, false);
      faceCtx.stroke();

      // Blush
      faceCtx.shadowColor = '#ff2a6d';
      faceCtx.fillStyle = '#ff2a6d';
      faceCtx.fillRect(95, 165, 35, 12);
      faceCtx.fillRect(380, 165, 35, 12);
    }

    faceTexture.needsUpdate = true;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // LIGHTING RIG
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe8f4ff, 2.2);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);

    const cyanRim = new THREE.DirectionalLight(0x00f0ff, 2.8);
    cyanRim.position.set(-6, -2, -3);
    scene.add(cyanRim);

    const warmBounce = new THREE.DirectionalLight(0xff9944, 1.4);
    warmBounce.position.set(0, -6, 2);
    scene.add(warmBounce);

    const chestPointLight = new THREE.PointLight(0x00f0ff, 2.2, 7);
    chestPointLight.position.set(0, -0.4, 1.5);
    scene.add(chestPointLight);

    // MATERIALS
    const whiteCeramicMat = new THREE.MeshPhongMaterial({
      color: 0xf3f7fa,
      specular: 0xddeeff,
      shininess: 95,
    });

    const tealBodyMat = new THREE.MeshPhongMaterial({
      color: 0x1d9fb3,
      specular: 0x66e5f5,
      shininess: 85,
    });

    const darkVisorMat = new THREE.MeshPhongMaterial({
      color: 0x050811,
      specular: 0x00f0ff,
      shininess: 100,
    });

    const glowingJointAmber = new THREE.MeshBasicMaterial({
      color: 0xff7700,
    });

    const glowCyanMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
    });

    const rubberDarkMat = new THREE.MeshPhongMaterial({
      color: 0x1c202a,
      specular: 0x333b4d,
      shininess: 30,
    });

    // ROBOT ROOT
    const robotRoot = new THREE.Group();
    scene.add(robotRoot);

    // 1. HEAD & VISOR ASSEMBLY
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.65, 0);
    robotRoot.add(headGroup);

    // Helmet outer shell
    const helmetGeo = new THREE.SphereGeometry(1.2, 36, 36);
    helmetGeo.scale(1.28, 1.05, 1.08);
    const helmetMesh = new THREE.Mesh(helmetGeo, whiteCeramicMat);
    headGroup.add(helmetMesh);

    // Teal top crown accent
    const tealCrownGeo = new THREE.SphereGeometry(1.21, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.35);
    tealCrownGeo.scale(1.28, 1.05, 1.08);
    const tealCrown = new THREE.Mesh(tealCrownGeo, tealBodyMat);
    tealCrown.rotation.x = -0.15;
    headGroup.add(tealCrown);

    // Visor bezel ring
    const visorBezelGeo = new THREE.TorusGeometry(0.85, 0.08, 16, 36);
    visorBezelGeo.scale(1.22, 0.88, 0.5);
    const visorBezel = new THREE.Mesh(visorBezelGeo, tealBodyMat);
    visorBezel.position.set(0, 0.02, 0.72);
    headGroup.add(visorBezel);

    // Visor dark OLED dome
    const visorGeo = new THREE.SphereGeometry(1.05, 36, 36);
    visorGeo.scale(1.15, 0.82, 0.65);
    const visorMesh = new THREE.Mesh(visorGeo, darkVisorMat);
    visorMesh.position.set(0, 0.02, 0.52);
    headGroup.add(visorMesh);

    // Pixel Face Canvas
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = 512;
    faceCanvas.height = 256;
    const faceCtx = faceCanvas.getContext('2d')!;
    const faceTexture = new THREE.CanvasTexture(faceCanvas);

    const facePlaneGeo = new THREE.PlaneGeometry(1.7, 0.85);
    const facePlane = new THREE.Mesh(
      facePlaneGeo,
      new THREE.MeshBasicMaterial({ map: faceTexture, transparent: true, opacity: 0.98 })
    );
    facePlane.position.set(0, 0.05, 1.15);
    headGroup.add(facePlane);

    // Antenna Ears
    const createAntennaFin = (isLeft: boolean) => {
      const finGroup = new THREE.Group();
      const sign = isLeft ? -1 : 1;
      finGroup.position.set(sign * 1.25, 0.48, -0.05);
      finGroup.rotation.z = sign * 0.45;
      finGroup.rotation.y = sign * 0.15;

      const cupGeo = new THREE.CylinderGeometry(0.24, 0.2, 0.25, 20);
      const cup = new THREE.Mesh(cupGeo, tealBodyMat);
      cup.rotation.z = Math.PI / 2;
      finGroup.add(cup);

      const glowRingGeo = new THREE.TorusGeometry(0.25, 0.05, 12, 24);
      const glowRing = new THREE.Mesh(glowRingGeo, glowingJointAmber);
      glowRing.position.set(sign * 0.12, 0, 0);
      glowRing.rotation.y = Math.PI / 2;
      finGroup.add(glowRing);

      const finBladeGeo = new THREE.CylinderGeometry(0.16, 0.22, 0.72, 20);
      finBladeGeo.scale(0.85, 1, 1.4);
      const finBlade = new THREE.Mesh(finBladeGeo, whiteCeramicMat);
      finBlade.position.set(sign * 0.18, 0.35, 0);
      finBlade.rotation.z = sign * -0.2;
      finGroup.add(finBlade);

      return finGroup;
    };

    headGroup.add(createAntennaFin(true));
    headGroup.add(createAntennaFin(false));

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.48, 0.52, 0.25, 20);
    const neckMesh = new THREE.Mesh(neckGeo, tealBodyMat);
    neckMesh.position.set(0, -0.45, 0);
    headGroup.add(neckMesh);

    // 2. TORSO
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, -0.62, 0);
    robotRoot.add(torsoGroup);

    const chestGeo = new THREE.SphereGeometry(0.96, 30, 30);
    chestGeo.scale(1.15, 0.88, 1.0);
    const chestMesh = new THREE.Mesh(chestGeo, whiteCeramicMat);
    chestMesh.position.set(0, 0.08, 0);
    torsoGroup.add(chestMesh);

    const bellyGeo = new THREE.CylinderGeometry(0.85, 0.92, 0.65, 24);
    bellyGeo.scale(1.12, 1.0, 0.95);
    const bellyMesh = new THREE.Mesh(bellyGeo, tealBodyMat);
    bellyMesh.position.set(0, -0.32, 0);
    torsoGroup.add(bellyMesh);

    const coreFrameGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.08, 24);
    const coreFrame = new THREE.Mesh(coreFrameGeo, darkVisorMat);
    coreFrame.rotation.x = Math.PI / 2;
    coreFrame.position.set(0, 0.15, 0.98);
    torsoGroup.add(coreFrame);

    const coreGlowGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.09, 24);
    const coreGlow = new THREE.Mesh(coreGlowGeo, glowCyanMat);
    coreGlow.rotation.x = Math.PI / 2;
    coreGlow.position.set(0, 0.15, 0.99);
    torsoGroup.add(coreGlow);

    // 3. ARMS
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-1.08, 0.18, 0);
    torsoGroup.add(leftArmGroup);

    const shoulderBallL = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 18), tealBodyMat);
    leftArmGroup.add(shoulderBallL);

    const jointRingL1 = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.05, 12, 20), glowingJointAmber);
    jointRingL1.position.set(-0.15, -0.15, 0);
    leftArmGroup.add(jointRingL1);

    const bicepL = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.55, 16), whiteCeramicMat);
    bicepL.position.set(-0.25, -0.42, 0.12);
    bicepL.rotation.z = 0.5;
    bicepL.rotation.x = -0.2;
    leftArmGroup.add(bicepL);

    const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.18, 0.48, 16), tealBodyMat);
    forearmL.position.set(-0.45, -0.82, 0.32);
    forearmL.rotation.z = 0.7;
    forearmL.rotation.x = -0.4;
    leftArmGroup.add(forearmL);

    const handLGroup = new THREE.Group();
    handLGroup.position.set(-0.62, -1.05, 0.48);
    leftArmGroup.add(handLGroup);

    const palmL = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), whiteCeramicMat);
    handLGroup.add(palmL);

    for (let f = 0; f < 3; f++) {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.25, 10), tealBodyMat);
      finger.position.set((f - 1) * 0.14, -0.2, 0.08);
      finger.rotation.x = 0.6;
      handLGroup.add(finger);
    }

    // Right Arm (Friendly waving pose)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(1.08, 0.18, 0);
    torsoGroup.add(rightArmGroup);

    const shoulderBallR = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 18), tealBodyMat);
    rightArmGroup.add(shoulderBallR);

    const jointRingR1 = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.05, 12, 20), glowingJointAmber);
    jointRingR1.position.set(0.15, 0.15, 0);
    rightArmGroup.add(jointRingR1);

    const bicepR = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.55, 16), whiteCeramicMat);
    bicepR.position.set(0.3, 0.35, 0.1);
    bicepR.rotation.z = -1.1;
    rightArmGroup.add(bicepR);

    const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.18, 0.5, 16), tealBodyMat);
    forearmR.position.set(0.68, 0.72, 0.18);
    forearmR.rotation.z = -0.55;
    rightArmGroup.add(forearmR);

    const handRGroup = new THREE.Group();
    handRGroup.position.set(0.85, 1.05, 0.24);
    rightArmGroup.add(handRGroup);

    const palmR = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), whiteCeramicMat);
    handRGroup.add(palmR);

    for (let f = 0; f < 3; f++) {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.26, 10), tealBodyMat);
      finger.position.set((f - 1) * 0.14, 0.22, 0);
      finger.rotation.z = (f - 1) * -0.25;
      handRGroup.add(finger);
    }

    // 4. LOWER CHASSIS & ZERO-G RINGS
    const baseGroup = new THREE.Group();
    baseGroup.position.set(0, -1.25, 0);
    robotRoot.add(baseGroup);

    const treadHousingGeo = new THREE.BoxGeometry(1.65, 0.52, 1.25);
    const treadHousing = new THREE.Mesh(treadHousingGeo, whiteCeramicMat);
    baseGroup.add(treadHousing);

    const treadBeltGeo = new THREE.BoxGeometry(0.36, 0.46, 1.45);
    const treadLeft = new THREE.Mesh(treadBeltGeo, rubberDarkMat);
    treadLeft.position.set(-0.76, -0.06, 0);
    baseGroup.add(treadLeft);

    const treadRight = new THREE.Mesh(treadBeltGeo, rubberDarkMat);
    treadRight.position.set(0.76, -0.06, 0);
    baseGroup.add(treadRight);

    [-0.45, 0, 0.45].forEach((zPos) => {
      [-0.76, 0.76].forEach((xPos) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.4, 14), tealBodyMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(xPos, -0.06, zPos);
        baseGroup.add(wheel);
      });
    });

    // Dual Glowing Orbital Anti-Gravity Rings around base
    const ring1Geo = new THREE.TorusGeometry(1.68, 0.035, 14, 48);
    const ring1Mesh = new THREE.Mesh(ring1Geo, glowCyanMat);
    ring1Mesh.rotation.x = Math.PI / 2.25;
    ring1Mesh.position.set(0, -0.15, 0);
    baseGroup.add(ring1Mesh);

    const ring2Geo = new THREE.TorusGeometry(1.85, 0.025, 14, 48);
    const ring2Mesh = new THREE.Mesh(ring2Geo, glowCyanMat);
    ring2Mesh.rotation.x = Math.PI / 2.4;
    ring2Mesh.rotation.y = 0.2;
    ring2Mesh.position.set(0, -0.22, 0);
    baseGroup.add(ring2Mesh);

    // 5. PROPS: GOLDEN STAR & ASTEROID
    const starGroup = new THREE.Group();
    starGroup.position.set(2.4, 1.35, 0.4);
    scene.add(starGroup);

    const starShape = new THREE.Shape();
    const outerR = 0.46;
    const innerR = 0.23;
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = (i * Math.PI) / 5;
      if (i === 0) starShape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else starShape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    starShape.closePath();

    const starGeo = new THREE.ExtrudeGeometry(starShape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    });
    const starMesh = new THREE.Mesh(
      starGeo,
      new THREE.MeshPhongMaterial({
        color: 0xffd700,
        emissive: 0xffaa00,
        specular: 0xffffff,
        shininess: 90,
      })
    );
    starGroup.add(starMesh);

    // Floating Micro-Asteroid
    const asteroidGeo = new THREE.DodecahedronGeometry(0.52, 1);
    const asteroidMat = new THREE.MeshPhongMaterial({
      color: 0x616e80,
      specular: 0x222a35,
      flatShading: true,
      shininess: 20,
    });
    const asteroidMesh = new THREE.Mesh(asteroidGeo, asteroidMat);
    asteroidMesh.position.set(-2.55, 0.95, -0.2);
    scene.add(asteroidMesh);

    // Cosmic Dust Particles
    const pCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 18;
      pPos[i + 1] = (Math.random() - 0.5) * 14;
      pPos[i + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ color: 0x00f0ff, size: 0.05, transparent: true, opacity: 0.65 })
    );
    scene.add(particles);

    // MOUSE TRACKING
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const rawX = (e.clientX - rect.left) / (rect.width || 1);
      const rawY = (e.clientY - rect.top) / (rect.height || 1);
      mouse.targetX = (rawX - 0.5) * 2;
      mouse.targetY = -(rawY - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // SAVE STATE TO REF
    sceneRef.current = {
      renderer,
      scene,
      camera,
      robotRoot,
      headGroup,
      torsoGroup,
      rightArmGroup,
      handRGroup,
      leftArmGroup,
      ring1Mesh,
      ring2Mesh,
      starGroup,
      asteroidMesh,
      particles,
      faceTexture,
      faceCanvas,
      faceCtx,
      clock: new THREE.Clock(),
      mouse,
      recoilTimer: 0,
      blinkTimer: 3.5,
      isBlinking: false,
    };

    // Draw initial face
    drawVisorFace(emotionRef.current);

    // CLICK RECOIL WOBBLE INTERACTION
    const handlePointerDown = () => {
      if (sceneRef.current) {
        sceneRef.current.recoilTimer = 1.2;
      }
      if (onRobotClick) {
        onRobotClick();
      }
    };
    container.addEventListener('pointerdown', handlePointerDown);

    // RESIZE
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ANIMATION LOOP
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const s = sceneRef.current;
      if (!s) return;

      const dt = s.clock.getDelta();
      const t = s.clock.getElapsedTime();
      const phys = physicsRef.current;

      // Mouse gaze interpolation
      s.mouse.x += (s.mouse.targetX - s.mouse.x) * 0.06;
      s.mouse.y += (s.mouse.targetY - s.mouse.y) * 0.06;

      // Physics factors
      const speedMult = phys.orbitSpeed;
      const zeroGMult = phys.zeroGActive ? 1.0 : 0.2;
      const gravFactor = Math.max(0.2, phys.gravityWell);

      // Zero-G floating bobbing and tilt
      const floatY = Math.sin(t * 1.6 * speedMult) * (0.16 * zeroGMult / gravFactor);
      const floatRoll = Math.sin(t * 1.1 * speedMult) * (0.06 * zeroGMult);

      s.robotRoot.position.y = floatY;
      s.robotRoot.rotation.z = floatRoll + s.mouse.x * -0.08;
      s.robotRoot.rotation.x = -s.mouse.y * 0.12;
      s.robotRoot.rotation.y = s.mouse.x * 0.22;

      // Head tracks mouse gaze directly
      s.headGroup.rotation.y = s.mouse.x * 0.45;
      s.headGroup.rotation.x = -s.mouse.y * 0.32;

      // Waving hand
      s.handRGroup.rotation.z = Math.sin(t * 5.5 * speedMult) * 0.28;
      s.rightArmGroup.position.y = 0.18 + Math.sin(t * 3.5 * speedMult) * 0.05;

      // Left arm floating gently
      s.leftArmGroup.rotation.z = Math.sin(t * 1.8 * speedMult) * 0.08;

      // Dual anti-gravity rings spinning
      s.ring1Mesh.rotation.z = t * 1.8 * speedMult;
      s.ring2Mesh.rotation.z = -t * 1.4 * speedMult;

      // Props orbit & tumble
      s.starGroup.position.y = 1.35 + Math.sin(t * 2.2 * speedMult) * 0.22;
      s.starGroup.rotation.y = t * 1.6 * speedMult;
      s.starGroup.rotation.x = Math.sin(t * 1.4 * speedMult) * 0.25;

      s.asteroidMesh.position.y = 0.95 + Math.sin(t * 1.5 * speedMult) * 0.18;
      s.asteroidMesh.rotation.x = t * 0.45 * speedMult;
      s.asteroidMesh.rotation.y = t * 0.65 * speedMult;

      // Blinking logic when in happy or idle state
      if (emotionRef.current === 'happy') {
        s.blinkTimer -= dt;
        if (s.blinkTimer <= 0) {
          if (!s.isBlinking) {
            s.isBlinking = true;
            drawVisorFace('happy', true);
            s.blinkTimer = 0.15; // blink duration
          } else {
            s.isBlinking = false;
            drawVisorFace('happy', false);
            s.blinkTimer = 3.0 + Math.random() * 3.0; // next blink
          }
        }
      }

      // Springy tactile recoil wobble when poked
      if (s.recoilTimer > 0) {
        s.recoilTimer -= dt;
        s.robotRoot.position.z = Math.sin(t * 28) * 0.12 * (s.recoilTimer / 1.2);
        s.headGroup.rotation.z = Math.sin(t * 24) * 0.18 * (s.recoilTimer / 1.2);
      }

      // Cosmic dust drift
      s.particles.rotation.y = t * 0.025 * speedMult;

      s.renderer.render(s.scene, s.camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', handlePointerDown);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sceneRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full cursor-grab active:cursor-grabbing ${className}`}
    />
  );
};
