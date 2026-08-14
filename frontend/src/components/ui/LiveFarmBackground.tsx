'use client';

import React, { useEffect, useRef } from 'react';

interface LiveFarmBackgroundProps {
  weatherCondition?: 'RAIN' | 'SUNNY' | 'CLOUDY' | 'STORM' | 'NIGHT';
}

export const LiveFarmBackground: React.FC<LiveFarmBackgroundProps> = ({
  weatherCondition = 'SUNNY',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Floating golden pollen & dust particles
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.2) * 0.4,
      speedY: -Math.random() * 0.5 - 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * 0.05,
    }));

    // Raindrops for RAIN / STORM conditions
    const raindrops = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 12 + Math.random() * 15,
      speedY: 10 + Math.random() * 8,
      opacity: 0.3 + Math.random() * 0.4,
    }));

    // Wind wave lines mimicking breeze over green crops
    const windWaves = Array.from({ length: 6 }, (_, i) => ({
      y: height * 0.35 + i * 90,
      amplitude: 15 + Math.random() * 10,
      frequency: 0.005 + Math.random() * 0.003,
      speed: 0.02 + Math.random() * 0.015,
      phase: Math.random() * Math.PI * 2,
    }));

    // Drifting atmospheric clouds
    const clouds = Array.from({ length: 5 }, (_, i) => ({
      x: i * (width / 4) - 100,
      y: 30 + Math.random() * 80,
      scale: 0.8 + Math.random() * 0.7,
      speed: 0.15 + Math.random() * 0.1,
      opacity: weatherCondition === 'RAIN' || weatherCondition === 'STORM' ? 0.25 : 0.08,
    }));

    let time = 0;

    const drawCloud = (x: number, y: number, scale: number, opacity: number) => {
      ctx.save();
      ctx.fillStyle = `rgba(241, 245, 249, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, 40 * scale, Math.PI * 0.5, Math.PI * 1.5);
      ctx.arc(x + 50 * scale, y - 25 * scale, 45 * scale, Math.PI * 1, Math.PI * 1.85);
      ctx.arc(x + 110 * scale, y - 20 * scale, 35 * scale, Math.PI * 1.3, Math.PI * 1.91);
      ctx.arc(x + 150 * scale, y, 30 * scale, Math.PI * 1.5, Math.PI * 0.5);
      ctx.moveTo(x + 150 * scale, y + 20 * scale);
      ctx.lineTo(x, y + 20 * scale);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Sunlight Beams (for SUNNY condition)
      if (weatherCondition === 'SUNNY') {
        const sunGradient = ctx.createRadialGradient(
          width * 0.8 + Math.sin(time * 0.5) * 40,
          height * 0.1,
          20,
          width * 0.8,
          height * 0.1,
          width * 0.7
        );
        sunGradient.addColorStop(0, 'rgba(250, 204, 21, 0.16)');
        sunGradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.08)');
        sunGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = sunGradient;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Draw Drifting Clouds
      clouds.forEach((cloud) => {
        cloud.x += cloud.speed;
        if (cloud.x > width + 200) cloud.x = -200;
        drawCloud(cloud.x, cloud.y, cloud.scale, cloud.opacity);
      });

      // 3. Draw Raindrops if RAIN or STORM
      if (weatherCondition === 'RAIN' || weatherCondition === 'STORM') {
        ctx.lineWidth = 1.2;
        raindrops.forEach((r) => {
          r.y += r.speedY;
          if (r.y > height) {
            r.y = -20;
            r.x = Math.random() * width;
          }
          ctx.beginPath();
          ctx.strokeStyle = `rgba(186, 230, 253, ${r.opacity})`;
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x - 2, r.y + r.length);
          ctx.stroke();
        });
      }

      // 4. Draw Wind Wave Currents
      ctx.lineWidth = 1.5;
      windWaves.forEach((wave, idx) => {
        ctx.beginPath();
        const waveGradient = ctx.createLinearGradient(0, 0, width, 0);
        waveGradient.addColorStop(0, 'rgba(74, 222, 128, 0)');
        waveGradient.addColorStop(0.5, `rgba(74, 222, 128, ${0.08 + idx * 0.015})`);
        waveGradient.addColorStop(1, 'rgba(74, 222, 128, 0)');
        ctx.strokeStyle = waveGradient;

        for (let x = 0; x < width; x += 15) {
          const y = wave.y + Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // 5. Draw Floating Pollen & Dust Particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += Math.sin(time * 2) * p.pulse * 0.1;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(187, 247, 208, ${Math.max(0.1, Math.min(0.8, p.opacity))})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(74, 222, 128, 0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weatherCondition, mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background High-Res Aerial Farm Field Image */}
      <div
        className="absolute inset-0 bg-cover bg-center filter saturate-[1.3] brightness-90 animate-subtle-pulse transition-all duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920')`,
          opacity: weatherCondition === 'NIGHT' ? 0.2 : 0.45,
        }}
      />

      {/* Weather-Responsive Gradient Backdrop Overlay */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          weatherCondition === 'RAIN' || weatherCondition === 'STORM'
            ? 'bg-gradient-to-b from-slate-950/90 via-slate-900/80 to-slate-950/90'
            : weatherCondition === 'NIGHT'
            ? 'bg-gradient-to-b from-slate-950/95 via-indigo-950/60 to-slate-950/95'
            : 'bg-gradient-to-tr from-slate-950/80 via-slate-950/60 to-farm-950/40'
        }`}
      />

      {/* Dynamic Animated Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
