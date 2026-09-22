import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MilashAnimash } from './MilashAnimash';
import { Play, Pause, RotateCcw, Sparkles, Layers, Trash2, Download, ChevronLeft, ChevronRight, PenTool } from 'lucide-react';

const TOTAL_FRAMES = 11;

export const FlipbookMiniStudio: React.FC = () => {
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(11);
  const [onionSkin, setOnionSkin] = useState<boolean>(true);
  const [brushColor, setBrushColor] = useState<string>('#00F0FF');
  const [brushSize, setBrushSize] = useState<number>(6);
  const [isErasing, setIsErasing] = useState<boolean>(false);
  
  // 11 canvas data frames as image data URLs
  const [frames, setFrames] = useState<string[]>(() => Array(TOTAL_FRAMES).fill(''));

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const colors = [
    { label: 'Циан', value: '#00F0FF' },
    { label: 'Маджента', value: '#FF007A' },
    { label: 'Желтый', value: '#FFD600' },
    { label: 'Оранжевый', value: '#FF7A00' },
    { label: 'Синий', value: '#3B82F6' },
    { label: 'Белый', value: '#FFFFFF' },
  ];

  // Load a preset animation into 11 frames
  const loadPreset = (presetName: 'bouncingBall' | 'blinkingEye' | 'starBurst') => {
    setIsPlaying(false);
    const newFrames: string[] = [];
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 400;
    tempCanvas.height = 400;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      ctx.clearRect(0, 0, 400, 400);
      ctx.fillStyle = '#101322';
      ctx.fillRect(0, 0, 400, 400);

      // Draw border box
      ctx.strokeStyle = '#25284b';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, 380, 380);

      if (presetName === 'bouncingBall') {
        // Parabolic bounce over 11 frames
        const t = i / (TOTAL_FRAMES - 1);
        const x = 50 + t * 300;
        const height = Math.abs(Math.sin(t * Math.PI)) * 220;
        const y = 330 - height;
        const squash = y > 300 ? 1.4 : 1.0;
        const stretch = y > 300 ? 0.7 : 1.0;

        ctx.fillStyle = '#FF007A';
        ctx.beginPath();
        ctx.ellipse(x, y, 24 * squash, 24 * stretch, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFD600';
        ctx.beginPath();
        ctx.arc(x - 6, y - 6, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Ground shadow
        ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
        ctx.beginPath();
        ctx.ellipse(x, 350, Math.max(10, 36 - height * 0.1), 8, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (presetName === 'blinkingEye') {
        const openness = i <= 5 ? Math.sin((i / 5) * (Math.PI / 2)) : Math.sin(((10 - i) / 5) * (Math.PI / 2));
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        
        // Eye shape
        ctx.beginPath();
        ctx.moveTo(80, 200);
        ctx.quadraticCurveTo(200, 200 - 90 * openness, 320, 200);
        ctx.quadraticCurveTo(200, 200 + 90 * openness, 80, 200);
        ctx.stroke();

        // Iris
        if (openness > 0.2) {
          ctx.fillStyle = '#FF007A';
          ctx.beginPath();
          ctx.arc(200 + Math.sin(i * 0.6) * 30, 200, 35 * openness, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFD600';
          ctx.beginPath();
          ctx.arc(200 + Math.sin(i * 0.6) * 30, 200, 16 * openness, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (presetName === 'starBurst') {
        const scale = 0.3 + (i / 10) * 1.2;
        const rot = (i / 10) * Math.PI * 2;
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(rot);
        ctx.fillStyle = i % 2 === 0 ? '#FFD600' : '#FF007A';
        
        // 5 point star
        ctx.beginPath();
        for (let s = 0; s < 5; s++) {
          const a1 = (s * 4 * Math.PI) / 5 - Math.PI / 2;
          const a2 = ((s + 0.5) * 4 * Math.PI) / 5 - Math.PI / 2;
          const r1 = 80 * scale;
          const r2 = 35 * scale;
          if (s === 0) ctx.moveTo(Math.cos(a1) * r1, Math.sin(a1) * r1);
          else ctx.lineTo(Math.cos(a1) * r1, Math.sin(a1) * r1);
          ctx.lineTo(Math.cos(a2) * r2, Math.sin(a2) * r2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      newFrames.push(tempCanvas.toDataURL());
    }

    setFrames(newFrames);
    setCurrentFrame(0);
  };

  // Draw current frame to active canvas
  const renderActiveCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#0e1122';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid guide
    ctx.strokeStyle = '#181c33';
    ctx.lineWidth = 1;
    for (let x = 40; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 40; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Onion Skinning: Draw previous frame with low opacity
    if (onionSkin && !isPlaying) {
      const prevIdx = (currentFrame - 1 + TOTAL_FRAMES) % TOTAL_FRAMES;
      const prevData = frames[prevIdx];
      if (prevData) {
        const imgPrev = new Image();
        imgPrev.src = prevData;
        imgPrev.onload = () => {
          ctx.globalAlpha = 0.25;
          ctx.drawImage(imgPrev, 0, 0);
          ctx.globalAlpha = 1.0;
          // Draw current frame on top
          drawCurrentLayer(ctx);
        };
        return;
      }
    }

    drawCurrentLayer(ctx);
  }, [currentFrame, frames, onionSkin, isPlaying]);

  const drawCurrentLayer = (ctx: CanvasRenderingContext2D) => {
    const currentData = frames[currentFrame];
    if (currentData) {
      const img = new Image();
      img.src = currentData;
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
    }
  };

  useEffect(() => {
    renderActiveCanvas();
  }, [currentFrame, renderActiveCanvas]);

  // Handle Animation Playback Loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % TOTAL_FRAMES);
      }, 1000 / fps);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, fps]);

  // Save current canvas to frames state
  const saveCurrentFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    setFrames((prev) => {
      const next = [...prev];
      next[currentFrame] = dataUrl;
      return next;
    });
  };

  // Drawing event handlers
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isPlaying) return;
    isDrawingRef.current = true;
    const { x, y } = getCoordinates(e);
    lastPointRef.current = { x, y };

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(x, y, (isErasing ? brushSize * 2 : brushSize) / 2, 0, Math.PI * 2);
    ctx.fillStyle = isErasing ? '#0e1122' : brushColor;
    ctx.fill();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || isPlaying) return;
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = isErasing ? brushSize * 2 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isErasing ? '#0e1122' : brushColor;

    ctx.beginPath();
    if (lastPointRef.current) {
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    } else {
      ctx.moveTo(x, y);
    }
    ctx.lineTo(x, y);
    ctx.stroke();

    lastPointRef.current = { x, y };
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    saveCurrentFrame();
  };

  const clearCurrentFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0e1122';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveCurrentFrame();
  };

  const clearAllFrames = () => {
    setIsPlaying(false);
    setFrames(Array(TOTAL_FRAMES).fill(''));
    setCurrentFrame(0);
  };

  // Download current frame as PNG
  const downloadFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `11kadrov_frame_${currentFrame + 1}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="bg-[#121528] border border-[#262b50] rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden" id="mini-studio">
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FF007A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#262b50] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF007A]/20 border border-[#FF007A]/40 text-[#FF007A] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Интерактивная зона
          </div>
          <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Лаборатория «11 кадров»
          </h3>
          <p className="text-gray-300 text-sm mt-1 max-w-xl">
            Попробуйте себя в роли мультипликатора! Нарисуйте 11 ключевых кадров или запустите готовые шаблоны, чтобы понять магию движения.
          </p>
        </div>

        {/* Preset quick buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-400">Шаблоны:</span>
          <button
            onClick={() => loadPreset('bouncingBall')}
            className="px-3 py-1.5 rounded-lg bg-[#1c2242] hover:bg-[#283160] text-xs font-semibold text-[#00F0FF] border border-[#00F0FF]/30 transition-colors"
          >
            Мячик (Physics)
          </button>
          <button
            onClick={() => loadPreset('blinkingEye')}
            className="px-3 py-1.5 rounded-lg bg-[#1c2242] hover:bg-[#283160] text-xs font-semibold text-[#FF007A] border border-[#FF007A]/30 transition-colors"
          >
            Взгляд (Eye)
          </button>
          <button
            onClick={() => loadPreset('starBurst')}
            className="px-3 py-1.5 rounded-lg bg-[#1c2242] hover:bg-[#283160] text-xs font-semibold text-[#FFD600] border border-[#FFD600]/30 transition-colors"
          >
            Звезда (FX)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {/* Main Stage */}
          <div className="relative w-full max-w-[440px] aspect-square rounded-2xl overflow-hidden border-2 border-[#333a69] shadow-inner bg-[#0e1122]">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full cursor-crosshair touch-none select-none"
            />

            {/* Frame Indicator Overlay */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-black tracking-wider text-white">
              КАДР <span className="text-[#00F0FF]">{currentFrame + 1}</span> / {TOTAL_FRAMES}
            </div>

            {isPlaying && (
              <div className="absolute top-3 right-3 bg-[#FF007A]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" /> PLAY ({fps} FPS)
              </div>
            )}
          </div>

          {/* Timeline Bar: 11 Frame Strips */}
          <div className="w-full mt-5">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-2">
              <span>Лента кадров (Таймлайн 11 FPS)</span>
              <span className="text-[#FFD600]">Кликните на кадр для редактирования</span>
            </div>
            
            <div className="grid grid-cols-11 gap-1.5 p-2 bg-[#090b16] rounded-xl border border-[#252a4e]">
              {Array.from({ length: TOTAL_FRAMES }).map((_, idx) => {
                const hasContent = !!frames[idx];
                const isActive = currentFrame === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentFrame(idx);
                    }}
                    className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-black transition-all overflow-hidden border ${
                      isActive
                        ? 'border-[#00F0FF] bg-[#00F0FF]/20 text-white ring-2 ring-[#00F0FF]/50 scale-105 z-10'
                        : hasContent
                        ? 'border-[#384074] bg-[#161a33] text-gray-300 hover:border-gray-400'
                        : 'border-[#1b203a] bg-[#0d1020] text-gray-600 hover:bg-[#151930]'
                    }`}
                  >
                    {hasContent ? (
                      <img src={frames[idx]} alt={`Frame ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                    ) : null}
                    <span className="relative z-10 drop-shadow-md">{idx + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Milash-Animash Animator Helper */}
          <div className="w-full mt-4">
            <MilashAnimash
              variant="helper"
              size="sm"
              speechText={`Кадр ${currentFrame + 1} в работе! ${
                onionSkin
                  ? 'Калька (Onion Skin) включена — ориентируйся на контур прошлого кадра для плавности.'
                  : 'Попробуй включить кальку справа, чтобы видеть предыдущую позу!'
              }`}
            />
          </div>
        </div>

        {/* Right Sidebar: Tools & Playback Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4 w-full">
          {/* Playback Controls Card */}
          <div className="bg-[#171b36] border border-[#2c3360] rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Воспроизведение</h4>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isPlaying
                    ? 'bg-[#FF007A] hover:bg-[#d90067] text-white ring-2 ring-[#FF007A]/50'
                    : 'bg-[#00F0FF] hover:bg-[#00d6e4] text-[#0b0c16]'
                }`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                {isPlaying ? 'Пауза' : 'Запустить (Loop)'}
              </button>

              <button
                disabled={isPlaying}
                onClick={() => setCurrentFrame((prev) => (prev - 1 + TOTAL_FRAMES) % TOTAL_FRAMES)}
                className="p-3 rounded-xl bg-[#21274c] hover:bg-[#2c3465] text-white disabled:opacity-40 transition-colors"
                title="Предыдущий кадр"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                disabled={isPlaying}
                onClick={() => setCurrentFrame((prev) => (prev + 1) % TOTAL_FRAMES)}
                className="p-3 rounded-xl bg-[#21274c] hover:bg-[#2c3465] text-white disabled:opacity-40 transition-colors"
                title="Следующий кадр"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* FPS Selector */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-300 mb-1">
                <span>Скорость:</span>
                <span className="text-[#FFD600] font-bold">{fps} кадров/сек</span>
              </div>
              <input
                type="range"
                min="4"
                max="24"
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="w-full accent-[#00F0FF] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                <span>4 FPS (Медленно)</span>
                <span className="text-[#00F0FF]">11 FPS (Фирменный)</span>
                <span>24 FPS (Кино)</span>
              </div>
            </div>

            {/* Onion Skinning Toggle */}
            <div className="mt-4 pt-3 border-t border-[#262c52] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-200">
                <Layers className="w-4 h-4 text-[#00F0FF]" />
                <span>Калька (Onion Skin)</span>
              </div>
              <button
                onClick={() => setOnionSkin(!onionSkin)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  onionSkin ? 'bg-[#00F0FF]' : 'bg-[#2b3154]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    onionSkin ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Drawing Tools Card */}
          <div className="bg-[#171b36] border border-[#2c3360] rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Инструменты рисования</h4>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => setIsErasing(false)}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  !isErasing ? 'bg-[#00F0FF] text-black shadow-md' : 'bg-[#21274c] text-gray-300 hover:bg-[#2c3465]'
                }`}
              >
                <PenTool className="w-4 h-4" /> Кисть
              </button>
              <button
                onClick={() => setIsErasing(true)}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isErasing ? 'bg-[#FF007A] text-white shadow-md' : 'bg-[#21274c] text-gray-300 hover:bg-[#2c3465]'
                }`}
              >
                <Trash2 className="w-4 h-4" /> Ластик
              </button>
            </div>

            {/* Palette */}
            {!isErasing && (
              <div className="mb-3">
                <span className="text-[11px] font-semibold text-gray-400 block mb-2">Цветовая палитра фестиваля:</span>
                <div className="flex items-center gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setBrushColor(c.value)}
                      style={{ backgroundColor: c.value }}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        brushColor === c.value ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-80 hover:opacity-100'
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Brush Size */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 mb-1">
                <span>Размер штриха:</span>
                <span className="text-white">{brushSize} px</span>
              </div>
              <input
                type="range"
                min="2"
                max="24"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full accent-[#00F0FF] cursor-pointer"
              />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#262c52]">
              <button
                onClick={clearCurrentFrame}
                className="py-1.5 px-2 rounded-lg bg-[#21274c] hover:bg-[#2b3363] text-xs font-semibold text-gray-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Стереть кадр
              </button>
              <button
                onClick={clearAllFrames}
                className="py-1.5 px-2 rounded-lg bg-[#2c1d28] hover:bg-[#3d2436] text-xs font-semibold text-[#ff6b8b] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Очистить всё
              </button>
            </div>

            <button
              onClick={downloadFrame}
              className="w-full mt-2 py-2 px-3 rounded-lg bg-[#21274c] hover:bg-[#2d3668] text-xs font-semibold text-[#00F0FF] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" /> Сохранить кадр (PNG)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
