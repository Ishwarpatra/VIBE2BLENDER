import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Copy, Check, Sparkles, Loader2, Code2, KeyRound, MessageSquareCode, Info, X, Play, Sun, Moon, AlertTriangle, ImagePlus } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { GoogleGenAI, Type } from '@google/genai';
import { cleanPythonScript } from './lib/scriptUtils';

// --- Matrix Rain & 3D Geometry Canvas Component ---
const MatrixRain = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const rainCanvasRef = useRef<HTMLCanvasElement>(null);
  const shapesCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const rainCanvas = rainCanvasRef.current;
    const shapesCanvas = shapesCanvasRef.current;
    if (!rainCanvas || !shapesCanvas) return;
    
    const rainCtx = rainCanvas.getContext('2d');
    const shapesCtx = shapesCanvas.getContext('2d');
    if (!rainCtx || !shapesCtx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    rainCanvas.width = shapesCanvas.width = width;
    rainCanvas.height = shapesCanvas.height = height;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブヅエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    let columns = Math.floor(width / fontSize);
    
    // Stagger initial drops off-screen organically
    let drops = Array.from({ length: columns }).map(() => Math.random() * -(height / fontSize));

    // 3D Geometry Setup
    class Shape {
      x: number; y: number; size: number;
      rotX: number; rotY: number; rotZ: number;
      vRotX: number; vRotY: number; vRotZ: number;
      vy: number; vx: number;
      vertices: number[][];
      edges: number[][];

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = (Math.random() * 60) + 40; // 40-100 radius
        this.rotX = Math.random() * Math.PI;
        this.rotY = Math.random() * Math.PI;
        this.rotZ = Math.random() * Math.PI;
        this.vRotX = (Math.random() - 0.5) * 0.02;
        this.vRotY = (Math.random() - 0.5) * 0.02;
        this.vRotZ = (Math.random() - 0.5) * 0.02;
        this.vy = (Math.random() * 0.5) - 0.25;
        this.vx = (Math.random() * 0.5) - 0.25;

        const types = ['cube', 'tetra', 'octa'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'cube') {
          this.vertices = [
            [-1,-1,-1], [1,-1,-1], [1,1,-1], [-1,1,-1],
            [-1,-1,1], [1,-1,1], [1,1,1], [-1,1,1]
          ];
          this.edges = [
            [0,1], [1,2], [2,3], [3,0],
            [4,5], [5,6], [6,7], [7,4],
            [0,4], [1,5], [2,6], [3,7]
          ];
        } else if (type === 'tetra') {
          this.vertices = [[1,1,1], [-1,-1,1], [-1,1,-1], [1,-1,-1]];
          this.edges = [[0,1], [0,2], [0,3], [1,2], [1,3], [2,3]];
        } else {
          this.vertices = [[0,1,0], [0,-1,0], [1,0,0], [-1,0,0], [0,0,1], [0,0,-1]];
          this.edges = [[0,2], [0,3], [0,4], [0,5], [1,2], [1,3], [1,4], [1,5], [2,4], [4,3], [3,5], [5,2]];
        }
      }

      update(w: number, h: number) {
        this.rotX += this.vRotX;
        this.rotY += this.vRotY;
        this.rotZ += this.vRotZ;
        this.x += this.vx;
        this.y += this.vy;
        
        // Wrap around bounds
        if (this.x < -this.size * 2) this.x = w + this.size * 2;
        if (this.x > w + this.size * 2) this.x = -this.size * 2;
        if (this.y < -this.size * 2) this.y = h + this.size * 2;
        if (this.y > h + this.size * 2) this.y = -this.size * 2;
      }

      draw(ctx: CanvasRenderingContext2D, isDark: boolean) {
        const cosX = Math.cos(this.rotX), sinX = Math.sin(this.rotX);
        const cosY = Math.cos(this.rotY), sinY = Math.sin(this.rotY);
        const cosZ = Math.cos(this.rotZ), sinZ = Math.sin(this.rotZ);

        const projected = this.vertices.map(v => {
          let y1 = v[1]*cosX - v[2]*sinX;
          let z1 = v[1]*sinX + v[2]*cosX;
          let x2 = v[0]*cosY + z1*sinY;
          let z2 = -v[0]*sinY + z1*cosY;
          let x3 = x2*cosZ - y1*sinZ;
          let y3 = x2*sinZ + y1*cosZ;
          return [this.x + x3 * this.size, this.y + y3 * this.size];
        });

        // Shape glow/color
        ctx.strokeStyle = isDark ? 'rgba(0, 255, 209, 0.4)' : 'rgba(30, 58, 138, 0.5)'; // Dark blue in light mode
        ctx.lineWidth = isDark ? 1.5 : 2.5; // Bolder lines in light mode
        
        ctx.beginPath();
        this.edges.forEach(edge => {
          ctx.moveTo(projected[edge[0]][0], projected[edge[0]][1]);
          ctx.lineTo(projected[edge[1]][0], projected[edge[1]][1]);
        });
        ctx.stroke();

        ctx.fillStyle = isDark ? 'rgba(0, 255, 209, 0.6)' : 'rgba(30, 58, 138, 0.8)';
        projected.forEach(p => {
          ctx.fillRect(p[0]-2, p[1]-2, 4, 4);
        });
      }
    }

    let shapes = Array.from({ length: 10 }).map(() => new Shape(width, height));

    const draw = () => {
      // 1. Render fading Matrix Rain
      rainCtx.fillStyle = isDarkMode ? 'rgba(5, 5, 5, 0.05)' : 'rgba(250, 250, 250, 0.05)';
      rainCtx.fillRect(0, 0, width, height);

      rainCtx.fillStyle = isDarkMode ? '#00FFD1' : '#1e3a8a'; // Deep dark blue for high contrast
      rainCtx.font = (isDarkMode ? '' : 'bold ') + fontSize + 'px monospace'; // Bolster font in light mode

      for (let i = 0; i < drops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        rainCtx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      // 2. Render Floating 3D Shapes on clean canvas
      shapesCtx.clearRect(0, 0, width, height);
      shapes.forEach(shape => {
        shape.update(width, height);
        shape.draw(shapesCtx, isDarkMode);
      });
    };

    const interval = setInterval(draw, 33);
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      rainCanvas.width = shapesCanvas.width = width;
      rainCanvas.height = shapesCanvas.height = height;
      columns = Math.floor(width / fontSize);
      drops = Array.from({ length: columns }).map(() => Math.random() * -(height / fontSize));
      // Readjust shape bounds slightly but don't respawn all of them so it doesn't blink
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDarkMode]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <canvas ref={shapesCanvasRef} className="absolute inset-0 opacity-40 mix-blend-screen" />
      <canvas ref={rainCanvasRef} className="absolute inset-0 opacity-80" />
    </div>
  );
};

// --- Main Application Component ---
export default function App() {
  const [vibe, setVibe] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [review, setReview] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g. max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size shouldn't exceed 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async (isRetry = false) => {
    if (!vibe.trim()) return;
    
    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      setError('Error: API key is missing. Please provide your Gemini API key (or compatible alternative).');
      return;
    }
    if (trimmedKey.length < 10) {
      setError('Error: The provided API key seems too short. Please provide a valid API key.');
      return;
    }
    
    setIsGenerating(true);
    setCopied(false);
    if (!isRetry) {
      setError(null);
    }
    setValidationWarning(null);
    setGeneratedScript('');
    setReview('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
      
      let promptContents: any = vibe;
      
      if (imagePreview) {
        const [meta, base64] = imagePreview.split(',');
        const mimeType = meta.split(':')[1].split(';')[0];
        
        promptContents = [
          {
            inlineData: {
              data: base64,
              mimeType: mimeType
            }
          },
          vibe
        ];
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: promptContents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              script: { type: Type.STRING },
              review: { type: Type.STRING }
            },
            required: ["script", "review"]
          },
          systemInstruction: "You are Vibe2Blender. Translate descriptions into functional Blender Python scripts using the bpy module. Start by deleting default objects. You must use Blender 4.0+ syntax. For clearing the scene, use bpy.ops.object.select_all(action='SELECT') followed by bpy.ops.object.delete(). Never use the legacy action='ALL'. Configure Camera/Light. Apply materials.\nYou MUST respond with a raw JSON object containing exactly two keys: 'script' (the Python code) and 'review' (explanation of the code)."
        }
      });
      
      const jsonStr = response.text || "{}";
      const parsed = JSON.parse(jsonStr);
      
      const scripttext = cleanPythonScript(parsed.script);
      
      // Client-Side Validation Step
      let issues = [];
      if (!scripttext.includes('import bpy')) {
        issues.push("Missing 'import bpy'.");
      }
      if (scripttext.match(/action=['"]ALL['"]/)) {
        issues.push("Detected legacy action='ALL', change to action='SELECT'.");
      }
      if (scripttext.includes('.active =')) {
        issues.push("Detected deprecated '.active' assignment. Use 'bpy.context.view_layer.objects.active' for Blender 2.8+.");
      }

      if (issues.length > 0) {
        setValidationWarning(issues.join(' '));
      }

      setGeneratedScript(scripttext.trim());
      setReview(parsed.review || '');
      setIsGenerating(false);
    } catch (err: any) {
      if (err?.status === 503 || (err?.message && String(err.message).includes('503'))) {
        setError('Servers are busy! Automatically retrying in 5 seconds...');
        setTimeout(() => {
          handleGenerate(true);
        }, 5000);
      } else {
        setError(err?.message || 'Generation failed. Please verify your API key and input.');
        setIsGenerating(false);
      }
    }
  };

  const copyToClipboard = () => {
    if (!generatedScript) return;
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Theming configuration
  const globalClasses = `min-h-screen relative flex flex-col font-sans transition-colors duration-300 ${
    isDarkMode ? 'bg-[#050505] text-[#e0e0e0] selection:bg-[#00FFD1]/30' : 'bg-gray-50 text-gray-800 selection:bg-teal-500/30'
  }`;
  
  const headerClasses = `flex-shrink-0 flex items-center justify-between px-6 py-4 border-b z-20 backdrop-blur-md transition-colors ${
    isDarkMode ? 'border-white/10 bg-[#050505]/90' : 'border-gray-200 bg-white/90'
  }`;

  const panelClasses = `relative z-10 p-6 lg:p-8 flex flex-col backdrop-blur-sm transition-colors overflow-y-auto custom-scrollbar ${
    isDarkMode ? 'bg-[#050505]/80' : 'bg-white/80'
  }`;

  const accentColor = isDarkMode ? '#00FFD1' : '#008080';
  const highlightText = isDarkMode ? 'text-[#00FFD1]' : 'text-teal-600';
  const highlightBg = isDarkMode ? 'bg-[#00FFD1]' : 'bg-teal-600';

  return (
    <div className={globalClasses}>
      
      <MatrixRain isDarkMode={isDarkMode} />
      
      <div className="relative z-10 flex flex-col h-screen overflow-hidden">
        
        {/* --- Top Navigation Header --- */}
        <header className={headerClasses}>
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-sm flex items-center justify-center rotate-45 flex-shrink-0 ${highlightBg}`}>
              <div className={`-rotate-45 font-black text-lg ${isDarkMode ? 'text-black' : 'text-white'}`}>V2</div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">
                Vibe<span className={highlightText}>2</span>Blender
              </h1>
              <p className={`text-[10px] uppercase tracking-[0.2em] hidden sm:block ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
                Neural Geometry Synthesis
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title="Toggle Theme"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        </header>

        {/* --- Main Application Layout --- */}
        <div className="flex-1 lg:grid lg:grid-cols-12 min-h-0 overflow-hidden">
          
          {/* Left Column: Input Control Panel */}
          <div className={`${panelClasses} lg:col-span-5 border-b lg:border-b-0 lg:border-r ${isDarkMode ? 'border-white/10' : 'border-gray-200'} gap-6`}>
            
            <div className="flex-grow flex flex-col gap-4">
              {/* API Key Input */}
              <div className={`border rounded-lg p-4 transition-colors ${
                isDarkMode ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200 shadow-sm'
              }`}>
                <label className={`flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider mb-2 ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>
                  <KeyRound className="w-3 h-3" />
                  Authentication Core
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your Gemini or compatible API Key..."
                  className={`w-full border rounded px-3 py-2 text-sm font-mono focus:outline-none transition-colors ${
                    isDarkMode 
                    ? 'bg-white/5 border-white/5 focus:border-[#00FFD1]/50 focus:text-[#00FFD1] placeholder:text-white/20' 
                    : 'bg-white border-gray-300 focus:border-teal-500 focus:text-teal-700 placeholder:text-gray-400'
                  }`}
                />
              </div>

              {/* Vibe Prompt Input & Image Upload */}
              <div className="flex-1 flex flex-col gap-2 relative">
                <div className="flex justify-between items-center px-1">
                  <label className={`text-[11px] uppercase font-bold tracking-wider ${highlightText}`}>
                    Prompt Input v1.2
                  </label>
                  <span className={`text-[10px] font-mono ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
                    BLENDER_API_V3.6
                  </span>
                </div>
                
                <div className="relative flex-1 flex flex-col min-h-[160px]">
                  <textarea
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    placeholder="e.g., A sprawling neon cityscape with rain-slicked pavement and low-poly flying vehicles..."
                    className={`absolute inset-0 w-full h-full border rounded-lg p-5 pb-16 text-lg font-light leading-relaxed focus:outline-none transition-colors resize-none ${
                      isDarkMode 
                      ? 'bg-white/5 border-white/10 focus:border-[#00FFD1]/50 placeholder:text-white/10' 
                      : 'bg-white border-gray-300 focus:border-teal-500 placeholder:text-gray-300 shadow-inner'
                    }`}
                  />
                  
                  {/* Image Preview & Upload Button inside textarea area */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
                    <div className="flex items-center gap-2 pointer-events-auto">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/png, image/jpeg, image/webp" 
                        className="hidden" 
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        title="Upload Reference Image"
                        aria-label="Upload reference image"
                        className={`p-2 rounded-lg border transition-all ${
                          isDarkMode 
                          ? 'bg-black/60 border-white/20 text-white/70 hover:text-white hover:border-[#00FFD1]/50' 
                          : 'bg-white/80 border-gray-300 text-gray-600 hover:text-teal-600 hover:border-teal-400'
                        } backdrop-blur-sm`}
                      >
                        <ImagePlus className="w-5 h-5" />
                      </button>
                      
                      {imagePreview && (
                        <div className={`relative group rounded-lg overflow-hidden border ${isDarkMode ? 'border-white/20' : 'border-gray-300'}`}>
                          <img 
                            src={imagePreview} 
                            alt="Reference upload" 
                            className="w-10 h-10 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button 
                            onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}
                            aria-label="Remove image"
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Area */}
            <div className="flex flex-col gap-3 mt-2">
              {error && (
                <div className="text-red-500 text-xs font-mono border border-red-500/20 bg-red-500/10 p-3 rounded-lg flex items-start gap-2">
                  <X className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleGenerate()}
                  disabled={isGenerating || !vibe.trim() || !apiKey.trim()}
                  aria-label="Generate 3D script"
                  className={`font-black uppercase text-xs px-4 py-4 rounded tracking-widest transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    isDarkMode ? 'bg-[#00FFD1] text-black hover:bg-white' : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md'
                  }`}
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate 3D Script
                </button>
                
                <button
                  onClick={() => setShowInstructions(true)}
                  className={`font-bold uppercase text-xs px-4 py-4 rounded tracking-widest transition-all flex items-center justify-center gap-2 border ${
                    isDarkMode 
                    ? 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:text-white' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900 shadow-sm'
                  }`}
                >
                  <Info className="w-4 h-4" /> How to Run
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Output Panel */}
          <div className={`relative z-10 lg:col-span-7 flex flex-col h-[600px] lg:h-full min-h-0 transition-colors ${
            isDarkMode ? 'bg-[#070708]/90' : 'bg-white/90'
          }`}>
            
            {/* Output Header */}
            <div className="flex items-center justify-between p-4 flex-shrink-0 border-b border-black/5 dark:border-white/5">
              <div className="flex gap-2">
                <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`}></div>
                <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`}></div>
                <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`}></div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[11px] uppercase tracking-widest font-mono hidden sm:inline-block ${
                  isDarkMode ? 'text-white/30' : 'text-gray-400'
                }`}>
                  generated_script.py
                </span>
                <button
                  onClick={copyToClipboard}
                  disabled={!generatedScript}
                  aria-label="Copy generated Python script to clipboard"
                  className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded border transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px] gap-2 ${
                    isDarkMode 
                    ? 'text-[#00FFD1] bg-[#00FFD1]/10 border-[#00FFD1]/20 hover:bg-[#00FFD1]/20' 
                    : 'text-teal-700 bg-teal-50 border-teal-200 hover:bg-teal-100'
                  }`}
                >
                  {copied ? (
                    <><Check className="w-3 h-3" /> Copied</>
                  ) : (
                    <><Copy className="w-3 h-3" /> Copy Code</>
                  )}
                </button>
              </div>
            </div>

            {/* Output Content */}
            <div className={`flex-1 flex flex-col h-full overflow-hidden min-h-0 ${isDarkMode ? 'font-mono' : ''}`}>
              {!generatedScript && !isGenerating ? (
                <div className={`flex-1 flex flex-col items-center justify-center text-center p-6 ${isDarkMode ? 'opacity-40' : 'opacity-60'}`}>
                  <Terminal className={`w-12 h-12 mb-4 ${highlightText}`} />
                  <p className={`uppercase tracking-widest text-xs font-bold ${highlightText}`}>System Idle</p>
                  <p className={`text-xs mt-2 ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>Awaiting prompt variables...</p>
                </div>
              ) : isGenerating ? (
                <div className="flex-1 p-8 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  <span className={isDarkMode ? 'text-white/30' : 'text-gray-400'}>
                    // Establishing Neural Link...<br/>
                    // Transmitting JSON payload to Gemini Engine...<br/>
                    // Formatting geometry syntax...
                  </span>
                  <div className="mt-6 flex items-center gap-3">
                    <Loader2 className={`w-5 h-5 animate-spin ${isDarkMode ? 'text-yellow-500' : 'text-orange-500'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDarkMode ? 'text-yellow-500' : 'text-orange-500'}`}>
                      Synthesizing Assets...
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Code Block Context */}
                  <div className={`flex-1 overflow-auto custom-scrollbar border-b flex flex-col ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                    
                    {validationWarning && (
                      <div className={`m-4 p-4 rounded-lg flex items-start gap-3 border flex-shrink-0 ${
                        isDarkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-orange-50 border-orange-200 text-orange-700'
                      }`}>
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold uppercase tracking-widest text-[10px] mb-1">Code Validation Warning</h4>
                          <p className={`font-mono text-xs ${isDarkMode ? 'text-amber-500/80' : 'text-orange-800'}`}>
                            {validationWarning}
                          </p>
                        </div>
                      </div>
                    )}

                    <SyntaxHighlighter
                      language="python"
                      style={isDarkMode ? vscDarkPlus : prism}
                      customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        background: 'transparent',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        fontFamily: 'var(--font-mono)',
                      }}
                      wrapLines={true}
                    >
                      {generatedScript}
                    </SyntaxHighlighter>
                  </div>
                  
                  {/* Code Review Panel */}
                  {review && (
                    <div className={`h-1/3 min-h-[180px] p-6 lg:p-8 overflow-auto custom-scrollbar flex flex-col gap-3 font-sans transition-colors ${
                      isDarkMode ? 'bg-black/40' : 'bg-gray-50'
                    }`}>
                      <div className={`flex items-center gap-2 ${highlightText}`}>
                        <MessageSquareCode className="w-5 h-5" />
                        <h3 className="text-xs uppercase tracking-widest font-black">Code Review & Analysis</h3>
                      </div>
                      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/70' : 'text-gray-700'}`}>
                        {review}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- How to Run Modal Overlay --- */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity">
          <div className={`w-full max-w-2xl rounded-xl overflow-hidden flex flex-col shadow-2xl transition-all ${
            isDarkMode 
            ? 'bg-[#050505] border border-[#00FFD1]/30 shadow-[0_0_40px_rgba(0,255,209,0.15)]' 
            : 'bg-white border border-gray-200 shadow-teal-900/10'
          }`}>
            <div className={`flex items-center justify-between p-6 border-b ${
              isDarkMode ? 'border-white/10 bg-black/40' : 'border-gray-100 bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded flex items-center justify-center border ${
                  isDarkMode ? 'bg-[#00FFD1]/10 border-[#00FFD1]/30 text-[#00FFD1]' : 'bg-teal-50 border-teal-200 text-teal-600'
                }`}>
                  <Info className="w-4 h-4" />
                </div>
                <h2 className={`text-lg font-black tracking-widest uppercase ${
                  isDarkMode ? 'text-white glow-text' : 'text-gray-900'
                }`}>How to Run in Blender</h2>
              </div>
              <button 
                onClick={() => setShowInstructions(false)}
                aria-label="Close instructions panel"
                className={`p-1 rounded transition-colors ${
                  isDarkMode ? 'text-white/50 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-200'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className={`p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto max-h-[70vh] custom-scrollbar text-sm ${
              isDarkMode ? 'text-white/80' : 'text-gray-700'
            }`}>
              <div className="space-y-5 font-sans">
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                    isDarkMode ? 'bg-[#00FFD1]/20 text-[#00FFD1] border-[#00FFD1]/40' : 'bg-teal-100 text-teal-700 border-teal-300'
                  }`}>1</div>
                  <p>Open <strong className={isDarkMode ? 'text-white' : 'text-black'}>Blender</strong> and navigate to the <strong className={highlightText}>Scripting</strong> tab at the very top of the interface.</p>
                </div>
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                    isDarkMode ? 'bg-[#00FFD1]/20 text-[#00FFD1] border-[#00FFD1]/40' : 'bg-teal-100 text-teal-700 border-teal-300'
                  }`}>2</div>
                  <p>Click <strong className={isDarkMode ? 'text-white' : 'text-black'}>+ New</strong> in the text editor header to create a new text block.</p>
                </div>
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                    isDarkMode ? 'bg-[#00FFD1]/20 text-[#00FFD1] border-[#00FFD1]/40' : 'bg-teal-100 text-teal-700 border-teal-300'
                  }`}>3</div>
                  <p><strong>Paste</strong> your generated script into the text editor.</p>
                </div>
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                    isDarkMode ? 'bg-[#00FFD1]/20 text-[#00FFD1] border-[#00FFD1]/40' : 'bg-teal-100 text-teal-700 border-teal-300'
                  }`}>4</div>
                  <p className="flex items-center gap-1 flex-wrap">
                    Click the <strong className={isDarkMode ? 'text-white' : 'text-black'}>Run Script</strong> button 
                    (<Play className={`w-3 h-3 inline fill-current ${isDarkMode ? 'text-white' : 'text-black'}`} /> icon) 
                    in the top right of the text editor header.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                    isDarkMode ? 'bg-[#00FFD1]/20 text-[#00FFD1] border-[#00FFD1]/40' : 'bg-teal-100 text-teal-700 border-teal-300'
                  }`}>5</div>
                  <p>Switch your 3D Viewport to <strong className={highlightText}>"Rendered"</strong> mode to see the materials!</p>
                </div>
              </div>

              {/* Warning Context */}
              <div className={`mt-4 p-5 rounded-lg flex flex-col gap-2 border ${
                isDarkMode ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-amber-300 bg-amber-50'
              }`}>
                <h3 className={`font-bold uppercase tracking-widest text-[11px] flex items-center gap-2 ${
                  isDarkMode ? 'text-yellow-500' : 'text-amber-700'
                }`}>
                  <Code2 className="w-4 h-4" /> Dependencies & Built-in Engine
                </h3>
                <p className={`font-mono text-xs leading-relaxed uppercase ${
                  isDarkMode ? 'text-yellow-500/80' : 'text-amber-800'
                }`}>
                  Note: You <strong className={isDarkMode ? 'text-yellow-400' : 'text-amber-600'}>DO NOT</strong> run <code className={`px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-black/50 text-yellow-300' : 'bg-amber-100 text-amber-900 font-bold'}`}>pip install bpy</code>. 
                  The Blender Python module (<code className={isDarkMode ? 'text-yellow-300' : 'text-amber-900 font-bold'}>bpy</code>) is built natively into Blender's internal engine. Just paste and play!
                </p>
              </div>
            </div>
            
            <div className={`p-6 border-t flex justify-end ${
              isDarkMode ? 'border-white/5 bg-[#0A0A0C]' : 'border-gray-100 bg-gray-50'
            }`}>
              <button 
                onClick={() => setShowInstructions(false)}
                className={`font-bold uppercase text-xs px-6 py-2.5 rounded tracking-widest transition-all ${
                  isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md'
                }`}
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
