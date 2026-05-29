import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { MathUtils } from "three";
import { cn } from "@/lib/utils";

const COUNT = 70; // จำนวนจุด (node)
const MAX_DIST = 2.3; // ระยะที่จะลากเส้นเชื่อม
const SPREAD = { x: 9, y: 5, z: 3 };
const CAM_Z = 9;
const FOV = 45;

type Node = { x: number; y: number; z: number; vx: number; vy: number; vz: number };

/**
 * โครงข่ายประสาท (neural network): จุดลอยช้าๆ + ลากเส้นเชื่อมจุดที่อยู่ใกล้กัน
 * เมาส์ไปโดน → จุดบริเวณนั้นกระจายหนี · เลื่อนหน้า → ขยับ parallax
 */
function Network() {
  const { size } = useThree();
  const groupRef = useRef<any>(null);
  const pointsRef = useRef<any>(null);
  const linesRef = useRef<any>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const nodes = useMemo<Node[]>(() => {
    // ใช้ seed คงที่ไม่ได้ (Math.random) — สุ่มครั้งเดียวตอน mount ก็พอ
    return Array.from({ length: COUNT }, () => ({
      x: (Math.random() * 2 - 1) * SPREAD.x,
      y: (Math.random() * 2 - 1) * SPREAD.y,
      z: (Math.random() * 2 - 1) * SPREAD.z,
      vx: (Math.random() * 2 - 1) * 0.012,
      vy: (Math.random() * 2 - 1) * 0.012,
      vz: (Math.random() * 2 - 1) * 0.006,
    }));
  }, []);

  const positions = useMemo(() => new Float32Array(COUNT * 3), []);
  // รองรับเส้นสูงสุด COUNT*COUNT คู่ (2 จุด/เส้น × 3 พิกัด)
  const linePositions = useMemo(() => new Float32Array(COUNT * COUNT * 6), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(() => {
    // ตำแหน่งเมาส์โดยประมาณบนระนาบ z=0
    const halfH = Math.tan((FOV * Math.PI) / 180 / 2) * CAM_Z;
    const halfW = halfH * (size.width / Math.max(size.height, 1));
    const mx = mouse.current.x * halfW;
    const my = mouse.current.y * halfH;
    const R = 2.0; // รัศมีที่เมาส์ผลักจุด

    for (let i = 0; i < COUNT; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      n.z += n.vz;
      if (Math.abs(n.x) > SPREAD.x) n.vx *= -1;
      if (Math.abs(n.y) > SPREAD.y) n.vy *= -1;
      if (Math.abs(n.z) > SPREAD.z) n.vz *= -1;

      // เมาส์ผลักจุดให้กระจายหนี
      const dx = n.x - mx;
      const dy = n.y - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < R * R && d2 > 0.0001) {
        const d = Math.sqrt(d2);
        const f = ((R - d) / R) * 0.18;
        n.x += (dx / d) * f;
        n.y += (dy / d) * f;
      }

      positions[i * 3] = n.x;
      positions[i * 3 + 1] = n.y;
      positions[i * 3 + 2] = n.z;
    }

    // ลากเส้นเชื่อมจุดที่อยู่ใกล้กัน
    let p = 0;
    const maxD2 = MAX_DIST * MAX_DIST;
    for (let i = 0; i < COUNT; i++) {
      const ix = positions[i * 3], iy = positions[i * 3 + 1], iz = positions[i * 3 + 2];
      for (let j = i + 1; j < COUNT; j++) {
        const dx = ix - positions[j * 3];
        const dy = iy - positions[j * 3 + 1];
        const dz = iz - positions[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < maxD2) {
          linePositions[p++] = ix;
          linePositions[p++] = iy;
          linePositions[p++] = iz;
          linePositions[p++] = positions[j * 3];
          linePositions[p++] = positions[j * 3 + 1];
          linePositions[p++] = positions[j * 3 + 2];
        }
      }
    }

    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
    if (linesRef.current) {
      linesRef.current.geometry.attributes.position.needsUpdate = true;
      linesRef.current.geometry.setDrawRange(0, p / 3);
    }
    const g = groupRef.current;
    if (g) {
      g.rotation.y = MathUtils.lerp(g.rotation.y, mouse.current.x * 0.15, 0.04);
      g.rotation.x = MathUtils.lerp(g.rotation.x, mouse.current.y * 0.1, 0.04);
      g.position.y = MathUtils.lerp(
        g.position.y,
        (typeof window !== "undefined" ? window.scrollY : 0) * 0.0015,
        0.08,
      );
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.13}
          color="#fb7185"
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#ef4444" transparent opacity={0.22} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

/**
 * พื้นหลัง 3D แบบโครงข่ายประสาท (AI) — อินเทอร์แอกทีฟกับเมาส์ + scroll
 * เลเยอร์ fixed ด้านหลังเนื้อหา · ปิดอัตโนมัติเมื่อ prefers-reduced-motion
 */
export function Hero3DBackground({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div className={cn("pointer-events-none fixed inset-0 z-0", className)} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, CAM_Z], fov: FOV }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <Network />
      </Canvas>
    </div>
  );
}
