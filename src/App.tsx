import React, { Suspense, lazy } from 'react';
import { Github, Linkedin, Mail, Code, Terminal, Layout, Rocket, ChevronRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';


const Spline = lazy(() => import('@splinetool/react-spline'));

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-6 glass-dark mx-auto max-w-7xl mt-4 rounded-full">
    <div className="text-xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
      AK.
    </div>
    <div className="hidden md:flex gap-8 text-sm font-medium text-white/70">
      <a href="#about" className="hover:text-white transition-colors">About</a>
      <a href="#projects" className="hover:text-white transition-colors">Projects</a>
      <a href="#skills" className="hover:text-white transition-colors">Skills</a>
      <a href="#contact" className="hover:text-white transition-colors">Contact</a>
    </div>
    <MagneticButton className="px-5 py-2 rounded-full bg-accent-primary text-white text-sm font-semibold hover:bg-accent-primary/80 transition-all glow-primary">
      Hire Me
    </MagneticButton>
  </nav>
);

const SectionHeading = ({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) => (
  <div className="mb-12">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-4xl md:text-5xl font-bold mb-4"
    >
      {children}
    </motion.h2>
    {subtitle && (
      <p className="text-white/50 max-w-2xl px-1">
        {subtitle}
      </p>
    )}
  </div>
);

class ErrorBoundary extends React.Component<{ children: React.ReactNode, fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode, fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}


const MagneticButton = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) * 0.4);
    mouseY.set((e.clientY - centerY) * 0.4);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

const TiltCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(rotateX, springConfig);
  const springY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const curX = e.clientX - rect.left - rect.width / 2;
    const curY = e.clientY - rect.top - rect.height / 2;
    x.set(curX);
    y.set(curY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
      className={className}
    >
      <div style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

const LiquidBlob = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 40 -12"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="w-full h-full" style={{ filter: 'url(#goo)' }}>
        {/* Animated Background Blobs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 300 + i * 50,
              height: 300 + i * 50,
              background: i % 2 === 0 ? 'var(--color-accent-primary)' : 'var(--color-accent-secondary)',
              opacity: 0.1,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
              filter: 'blur(80px)',
            }}
            animate={{
              x: [0, 50, -50, 0],
              y: [0, -70, 70, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Mouse Following Liquid Blob */}
        <motion.div
          className="absolute rounded-full bg-gradient-to-br from-accent-primary/40 to-accent-secondary/40 backdrop-blur-3xl"
          style={{
            width: 450,
            height: 450,
            x: springX,
            y: springY,
            translateX: '-50%',
            translateY: '-50%',
            boxShadow: '0 0 100px var(--color-accent-primary)',
          }}
        />

        {/* Additional Floating Liquid Elements */}
        <motion.div
          className="absolute rounded-full bg-accent-primary/20"
          style={{
            width: 200,
            height: 200,
            x: useTransform(springX, (v) => v * 0.5),
            y: useTransform(springY, (v) => v * 0.5),
            translateX: '100%',
            translateY: '100%',
          }}
        />
      </div>
    </div>
  );
};

const SunsetBar = ({ initialPos, color, length, speed, rotationZ }: { initialPos: THREE.Vector3, color: string, length: number, speed: number, rotationZ: number }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // Random diagonal movement with wrapping
    meshRef.current.position.x += speed * 0.1;
    meshRef.current.position.y -= speed * 0.06;

    // Boundary check and wrap
    if (meshRef.current.position.x > 15) meshRef.current.position.x = -15;
    if (meshRef.current.position.y < -10) meshRef.current.position.y = 10;

    // Small orbital drift
    meshRef.current.position.z = initialPos.z + Math.sin(time * 0.5 + initialPos.x) * 0.5;

    // Rotation
    meshRef.current.rotation.x += 0.001;
    meshRef.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={meshRef} position={initialPos} rotation={[0, 0, rotationZ]}>
      <boxGeometry args={[length, 0.25, 0.15]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        roughness={0.3}
        metalness={0.5}
      />
    </mesh>
  );
};

const MovingRoad = ({ scrollY }: { scrollY: number }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const materialRef = React.useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (!materialRef.current) return;
    const time = state.clock.getElapsedTime();
    // Move texture for "infinite road" effect
    materialRef.current.map!.offset.y = -(time * 0.4 + scrollY * 0.005) % 1;
  });

  // Create a grid texture for the road
  const texture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;

    // Horizontal lines
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * 51.2);
      ctx.lineTo(512, i * 51.2);
      ctx.stroke();
    }

    // Vertical lines
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 51.2, 0);
      ctx.lineTo(i * 51.2, 512);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.1, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[40, 60, 32, 32]} />
      <meshStandardMaterial
        ref={materialRef}
        map={texture}
        color="#111"
        emissive="#000"
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.8}
      />
      {/* Central Light Lane */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[0.15, 60]} />
        <meshStandardMaterial color="#ff7a30" emissive="#ff7a30" emissiveIntensity={5} />
      </mesh>
    </mesh>
  );
};

const Scene = ({ scrollY }: { scrollY: number }) => {
  const { camera, mouse } = useThree();

  useFrame(() => {
    // Mouse parallax
    const targetX = mouse.x * 0.4;
    const targetY = mouse.y * 0.2 + (scrollY * 0.001);

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, 0, -5);
  });

  const bars = React.useMemo(() => {
    const colors = ["#ff3c2f", "#ff5a2f", "#ff7a30", "#ffa23b", "#ff6a2f", "#ffcc33"];
    return Array.from({ length: 15 }).map((_, i) => ({
      initialPos: new THREE.Vector3(
        (Math.random() - 0.5) * 30, // Random X across screen
        (Math.random() - 0.5) * 20, // Random Y across screen
        (Math.random() - 0.5) * 5   // Random Z depth
      ),
      color: colors[Math.floor(Math.random() * colors.length)],
      length: 2.5 + Math.random() * 3.5,
      speed: 0.2 + Math.random() * 0.5,
      rotationZ: -Math.PI * (25 + Math.random() * 20) / 180
    }));
  }, []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} />

      <MovingRoad scrollY={scrollY} />

      {bars.map((bar, i) => (
        <SunsetBar
          key={i}
          initialPos={bar.initialPos}
          color={bar.color}
          length={bar.length}
          speed={bar.speed}
          rotationZ={bar.rotationZ}
        />
      ))}

      <EffectComposer>
        <Bloom
          strength={1.2}
          radius={0.8}
          luminanceThreshold={0.1}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
};

const SunsetStreaks = () => {
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      // Use requestAnimationFrame for smoother scroll updates in Three.js
      window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-[#0b0b0b]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Scene scrollY={scrollY} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0b]/0 via-transparent to-[#0b0b0b]" />
    </div>
  );
};

const App = () => {

  const [show3D, setShow3D] = React.useState(true);
  const [loadError, setLoadError] = React.useState(false);


  return (
    <div className="min-h-screen bg-transparent text-foreground selection:bg-accent-primary/30">
      <SunsetStreaks />
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <LiquidBlob />
          {(show3D && !loadError) && (
            <ErrorBoundary fallback={null}>
              <Suspense fallback={null}>
                <Spline
                  scene="https://prod.spline.design/6Wq1Q7YIn9sZ2Ym6/scene.splinecode"
                  className="w-full h-full opacity-60 pointer-events-none"
                  onError={() => setLoadError(true)}
                />
              </Suspense>
            </ErrorBoundary>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0b0b0b]" />
        </div>

        {/* Perf Toggle */}
        <button
          onClick={() => setShow3D(!show3D)}
          className="absolute bottom-10 right-10 z-20 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] uppercase tracking-widest text-white/40 transition-all font-bold backdrop-blur-md"
        >
          {show3D ? "Disable 3D (Fast Mode)" : "Enable 3D (Visual Mode)"}
        </button>

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
              AYUSH <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">KUMAR</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/60 mb-8 max-w-3xl mx-auto font-medium">
              Full Stack Web Developer & Electronics Engineering Student
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticButton className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-white/90 transition-all">
                View Projects
              </MagneticButton>
              <MagneticButton className="px-8 py-4 rounded-full glass font-bold hover:bg-white/10 transition-all flex items-center gap-2">
                Contact Me <ChevronRight size={20} />
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Brief Section */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading subtitle="I build modern, fast, and scalable web applications using React, Node.js, and modern web technologies.">
              About Me
            </SectionHeading>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              I am a Full Stack Web Developer currently pursuing a degree in Electronics and Communication Engineering. I enjoy building modern web applications and solving real-world problems through code. My work focuses on full stack development, UI/UX design, and building scalable web systems.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-white/5">
                <div className="text-3xl font-bold mb-1 text-white">Freelance</div>
                <div className="text-white/40 text-sm">Experience</div>
              </div>
              <div className="p-6 rounded-2xl border border-white/5">
                <div className="text-3xl font-bold mb-1 text-white">Hackathons</div>
                <div className="text-white/40 text-sm">Winner/Participant</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-end">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/20 blur-[100px]" />
              <Code size={48} className="text-accent-primary mb-6" />
              <h3 className="text-3xl font-bold mb-4">Problem Solver</h3>
              <p className="text-white/60">Constantly learning and improving my ability to build efficient, scalable, and user-friendly applications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <SectionHeading subtitle="My core stack and tools that I use to bring ideas to life.">
            Technologies I Work With
          </SectionHeading>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Layout, title: "Frontend", tools: ["React", "Next.js", "Tailwind CSS", "JavaScript"] },
              { icon: Terminal, title: "Backend", tools: ["Node.js", "Express.js", "MongoDB", "REST APIs"] },
              { icon: Code, title: "Programming", tools: ["JavaScript", "Python", "C"] },
              { icon: Rocket, title: "Tools", tools: ["Git", "GitHub", "Vercel", "Figma"] }
            ].map((cat, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl glass text-left hover:border-accent-primary/50 transition-colors"
              >
                <cat.icon className="text-accent-primary mb-6" size={32} />
                <h4 className="text-xl font-bold mb-4">{cat.title}</h4>
                <ul className="space-y-2 text-white/50 text-sm">
                  {cat.tools.map((t, ti) => <li key={ti}>{t}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 max-w-7xl mx-auto">
        <SectionHeading subtitle="Selection of my best work and experimental projects.">
          Featured Projects
        </SectionHeading>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Hackathon Web Application",
              desc: "Built a full stack web application during a hackathon to solve real-world problems.",
              tags: ["React", "Node.js", "MongoDB"]
            },
            {
              title: "Freelance Client Website",
              desc: "Designed and developed a complete website for a freelance client.",
              tags: ["HTML", "CSS", "JS"]
            },
            {
              title: "Personal Web Projects",
              desc: "Built several experimental projects while learning modern web technologies.",
              tags: ["React", "APIs", "UI/UX"]
            }
          ].map((proj, i) => (
            <TiltCard
              key={i}
              className="group glass rounded-3xl p-8 relative overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-2xl font-bold mb-4">{proj.title}</h3>
              <p className="text-white/60 mb-6 text-sm leading-relaxed">{proj.desc}</p>
              <div className="flex flex-wrap gap-2">
                {proj.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 uppercase tracking-wider">{tag}</span>
                ))}
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-secondary/10 blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <SectionHeading subtitle="If you're looking for a developer to build web applications, user interfaces, or backend systems, feel free to reach out.">
            Let's Build Something
          </SectionHeading>

          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {[
              { icon: Github, label: "GitHub", href: "#" },
              { icon: Linkedin, label: "LinkedIn", href: "#" },
              { icon: Mail, label: "Email", href: "mailto:ayush@example.com" }
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="flex items-center gap-3 px-8 py-4 rounded-full glass hover:bg-white/10 transition-all text-lg font-medium"
              >
                <link.icon size={24} />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center text-white/20 text-sm relative z-10 backdrop-blur-sm bg-black/10">
        <p>© 2026 Ayush Kumar. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
