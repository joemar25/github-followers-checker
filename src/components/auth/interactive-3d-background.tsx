"use client";

import { useEffect, useRef } from "react";

// Interactive 3D Nodes Canvas Component with Linkin Park Industrial Glitch & Audio UI Vibes
export function InteractiveThreeDBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = canvas.width = container.offsetWidth;
        let height = canvas.height = container.offsetHeight;

        let activeColor = { r: 120, g: 120, b: 120 };
        const updateColor = () => {
            if (typeof document === "undefined") return;
            const temp = document.createElement("div");
            temp.style.color = "hsl(var(--primary))";
            document.body.appendChild(temp);
            const rgb = getComputedStyle(temp).color;
            document.body.removeChild(temp);
            const match = rgb.match(/\d+/g);
            if (match && match.length >= 3) {
                activeColor = { r: parseInt(match[0]), g: parseInt(match[1]), b: parseInt(match[2]) };
            }
        };
        updateColor();

        const observer = new MutationObserver(updateColor);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

        // Particle model in 3D coordinates (glitch pixel theme)
        class Particle {
            x: number;
            y: number;
            z: number;
            px: number = 0;
            py: number = 0;
            opacity: number;
            originalDistance: number;

            constructor() {
                // Sphere coordinates
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);
                const distance = 90 + Math.random() * 110;
                this.originalDistance = distance;

                this.x = distance * Math.sin(phi) * Math.cos(theta);
                this.y = distance * Math.sin(phi) * Math.sin(theta);
                this.z = distance * Math.cos(phi);
                this.opacity = 0.25 + Math.random() * 0.5;
            }

            update(angleX: number, angleY: number, time: number) {
                // Rotate around Y-axis
                const cosY = Math.cos(angleY);
                const sinY = Math.sin(angleY);
                const x1 = this.x * cosY - this.z * sinY;
                const z1 = this.z * cosY + this.x * sinY;

                // Rotate around X-axis
                const cosX = Math.cos(angleX);
                const sinX = Math.sin(angleX);
                const y1 = this.y * cosX - z1 * sinX;
                const z2 = z1 * cosX + this.y * sinX;

                this.x = x1;
                this.y = y1;
                this.z = z2;

                // 3D Perspective Projection + audio wave pulses
                const wave = Math.sin(time * 0.05 + this.originalDistance * 0.08) * 10;
                const focalLength = 340;
                const scale = focalLength / (focalLength + z2 + wave);
                
                // Centered 3D projection center
                this.px = width * 0.50 + x1 * scale;
                this.py = height * 0.50 + y1 * scale;
            }

            draw(context: CanvasRenderingContext2D, glitchActive: boolean) {
                const size = (this.z < 0) ? 2.8 : 1.4;
                context.fillStyle = `rgba(${activeColor.r}, ${activeColor.g}, ${activeColor.b}, ${glitchActive ? this.opacity * 1.5 : this.opacity})`;
                
                // Glitch horizontal offset
                const offset = glitchActive ? (Math.random() - 0.5) * 16 : 0;
                context.fillRect(this.px + offset, this.py, size, size);
            }
        }

        const particles: Particle[] = [];
        for (let i = 0; i < 90; i++) {
            particles.push(new Particle());
        }

        let mouseX = 0;
        let mouseY = 0;
        let targetSpeedX = 0.0012;
        let targetSpeedY = 0.0012;
        let currentSpeedX = 0.0012;
        let currentSpeedY = 0.0012;
        let time = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;

            const nx = (mouseX / width) - 0.5;
            const ny = (mouseY / height) - 0.5;

            targetSpeedY = nx * 0.015;
            targetSpeedX = -ny * 0.015;
        };

        const handleMouseLeave = () => {
            targetSpeedX = 0.0012;
            targetSpeedY = 0.0012;
        };

        const handleResize = () => {
            if (!container || !canvas) return;
            width = canvas.width = container.offsetWidth;
            height = canvas.height = container.offsetHeight;
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("resize", handleResize);

        const render = () => {
            time++;
            ctx.clearRect(0, 0, width, height);

            // Audio-grid and scanline glitch triggers
            const glitchActive = Math.random() < 0.03 && time % 12 === 0;

            // Draw industrial background layout grid
            ctx.strokeStyle = `rgba(${activeColor.r}, ${activeColor.g}, ${activeColor.b}, 0.03)`;
            ctx.lineWidth = 0.5;
            for (let x = 40; x < width; x += 60) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
            }
            for (let y = 40; y < height; y += 60) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
            }

            // Draw HUD Info overlays on the top-right to avoid overlapping title/logo
            ctx.font = "9px monospace";
            ctx.fillStyle = `rgba(${activeColor.r}, ${activeColor.g}, ${activeColor.b}, 0.4)`;
            const hudX = width - 210;
            ctx.fillText(`SYS_STATUS: ACTIVE // SYSTEM: OK`, hudX, 40);
            ctx.fillText(`TARGET: GHOST_FOLLOWERS`, hudX, 52);
            ctx.fillText(`COORD_V: [${currentSpeedX.toFixed(5)} , ${currentSpeedY.toFixed(5)}]`, hudX, 64);
            ctx.fillText(`GLITCH_F: ${glitchActive ? "ON" : "OFF"}`, hudX, 76);

            // Interpolate speeds
            currentSpeedX += (targetSpeedX - currentSpeedX) * 0.05;
            currentSpeedY += (targetSpeedY - currentSpeedY) * 0.05;

            // Update particle matrices
            particles.forEach((p) => {
                p.update(currentSpeedX, currentSpeedY, time);
            });

            // Draw wireframe connecting links
            ctx.lineWidth = 0.55;
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const distSq = Math.pow(p1.px - p2.px, 2) + Math.pow(p1.py - p2.py, 2);
                    if (distSq < 3200) {
                        const alpha = (1 - Math.sqrt(distSq) / Math.sqrt(3200)) * (glitchActive ? 0.35 : 0.15);
                        ctx.strokeStyle = `rgba(${activeColor.r}, ${activeColor.g}, ${activeColor.b}, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(p1.px, p1.py);
                        ctx.lineTo(p2.px, p2.py);
                        ctx.stroke();
                    }
                }
            }

            // Draw individual pixels
            particles.forEach((p) => p.draw(ctx, glitchActive));

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-default select-none">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-70" />
        </div>
    );
}
