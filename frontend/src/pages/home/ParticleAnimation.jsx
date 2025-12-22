import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Update the ParticleAnimation component to use higher z-index
const ParticleAnimation = ({ isActive, particleCount = 100 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const particles = [];

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle colors
    const colors = [
      "#FFD700",
      "#FFA500",
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
    ];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 6 + 3,
        speed: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.6 + 0.4,
        wobble: Math.random() * 2,
        wobbleSpeed: Math.random() * 0.05 + 0.02,
        shape: Math.random() > 0.5 ? "circle" : "square",
      });
    }

    let animationId;
    let startTime = Date.now();
    const duration = 8000;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.y += particle.speed;
        particle.x += Math.sin(particle.wobble) * 0.8;
        particle.wobble += particle.wobbleSpeed;

        // Reset if below canvas
        if (particle.y > canvas.height) {
          particle.y = -particle.size;
          particle.x = Math.random() * canvas.width;
        }

        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);

        if (particle.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.globalAlpha = particle.opacity * (1 - progress * 0.3);
          ctx.fill();
        } else {
          // Draw confetti rectangle
          ctx.fillStyle = particle.color;
          ctx.globalAlpha = particle.opacity * (1 - progress * 0.3);
          ctx.fillRect(
            -particle.size / 2,
            -particle.size / 4,
            particle.size,
            particle.size / 2
          );
        }

        ctx.restore();
      });

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isActive, particleCount]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50" // Increased z-index to 50
      style={{ background: "transparent" }}
    />
  );
};

export default ParticleAnimation;
