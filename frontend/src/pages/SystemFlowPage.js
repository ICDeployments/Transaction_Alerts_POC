import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Activity, Shield, Database, Cpu, FileCheck, Brain, CheckCircle, Server, Network, Eye, PlayCircle, PauseCircle, Layers, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
const flowSteps = [
    {
        id: 1,
        phase: 'Intelligence',
        title: 'Vector DB Population',
        desc: 'Falcon Core rules are vectorized and loaded into the Vector DB, with periodic updates when new rules are added.',
        action: 'VECTOR_POPULATION',
        nodes: ['falcon', 'vector-db'],
        connections: [
            { from: 'falcon', to: 'vector-db' }
        ],
        details: ['Rules Vectorized', 'DB Populated', 'Periodic Sync Active'],
        metric: { label: 'Rules Indexed', value: '1,847' }
    },
    {
        id: 2,
        phase: 'Detection',
        title: 'Falcon Surveillance',
        desc: 'Heuristic engine identifies anomalous pattern in transaction stream using advanced behavioral analytics.',
        action: 'THREAT_DETECTED',
        nodes: ['falcon'],
        connections: [],
        details: ['Pattern Recognition Active', 'Behavioral Analysis Running', 'Risk Scoring Initiated'],
        metric: { label: 'Detection Latency', value: '< 50ms' }
    },
    {
        id: 3,
        phase: 'Detection',
        title: 'Case Indexing',
        desc: 'Actimize creates a formal Case ID and initializes the investigation audit trail with full compliance metadata.',
        action: 'CASE_CREATED',
        nodes: ['falcon', 'actimize'],
        connections: [{ from: 'falcon', to: 'actimize' }],
        details: ['Case ID Generated', 'Audit Trail Initialized', 'Compliance Flags Set'],
        metric: { label: 'Cases Today', value: '1,247' }
    },
    {
        id: 4,
        phase: 'Orchestration',
        title: 'API Handshake',
        desc: 'Advisory API Layer authenticates the request using OAuth 2.0 and prepares normalized data schema.',
        action: 'API_CALL',
        nodes: ['actimize', 'api'],
        connections: [{ from: 'actimize', to: 'api' }],
        details: ['OAuth Token Validated', 'Schema Normalization', 'Rate Limiting Check'],
        metric: { label: 'API Latency', value: '12ms' }
    },
    {
        id: 5,
        phase: 'Orchestration',
        title: 'Context Routing',
        desc: 'Orchestrator resolves dependencies and initializes parallel enrichment pipeline with smart caching.',
        action: 'ROUTING',
        nodes: ['api', 'orchestrator'],
        connections: [{ from: 'api', to: 'orchestrator' }],
        details: ['Dependency Graph Built', 'Cache Lookup', 'Pipeline Initialized'],
        metric: { label: 'Cache Hit Rate', value: '94.2%' }
    },
    {
        id: 6,
        phase: 'Orchestration',
        title: 'State Persistence',
        desc: 'Checkpoint created in Advisory DB to ensure process resilience and enable transaction replay.',
        action: 'DB_WRITE',
        nodes: ['orchestrator', 'advisory-db'],
        connections: [{ from: 'orchestrator', to: 'advisory-db' }],
        details: ['Checkpoint Created', 'State Serialized', 'Recovery Point Set'],
        metric: { label: 'Durability', value: '99.999%' }
    },
    {
        id: 7,
        phase: 'Intelligence',
        title: 'RAG Rule Retrieval',
        desc: 'Vector search retrieves high-dimensional regulatory matches using semantic similarity algorithms.',
        action: 'VECTOR_SEARCH',
        nodes: ['orchestrator', 'rule-retriever', 'vector-db'],
        connections: [
            { from: 'orchestrator', to: 'rule-retriever' },
            { from: 'rule-retriever', to: 'vector-db' }
        ],
        details: ['Embedding Generated', 'Similarity Search', 'Top-K Retrieval'],
        metric: { label: 'Rules Matched', value: '23' }
    },
    {
        id: 8,
        phase: 'Intelligence',
        title: 'Context Injection',
        desc: 'Data packets are bundled into a prompt-engineered context window with regulatory grounding.',
        action: 'GATEWAY_PUSH',
        nodes: ['orchestrator', 'slm-gateway'],
        connections: [{ from: 'orchestrator', to: 'slm-gateway' }],
        details: ['Context Window Built', 'Prompt Engineering', 'Token Optimization'],
        metric: { label: 'Context Tokens', value: '4,096' }
    },
    {
        id: 9,
        phase: 'Intelligence',
        title: 'Neural Synthesis',
        desc: 'SLM generates human-readable reasoning and calibrated risk assessments with explainable AI.',
        action: 'AI_REASONING',
        nodes: ['slm-gateway', 'slm'],
        connections: [{ from: 'slm-gateway', to: 'slm' }],
        details: ['Inference Running', 'Reasoning Chain', 'Confidence Scoring'],
        metric: { label: 'Inference Time', value: '1.2s' }
    },
    {
        id: 10,
        phase: 'Presentation',
        title: 'UI Enrichment',
        desc: 'Enriched context pushed back to Actimize for analyst consumption with interactive visualizations.',
        action: 'DATA_SYNC',
        nodes: ['slm', 'slm-gateway', 'orchestrator', 'actimize'],
        connections: [
            { from: 'slm', to: 'slm-gateway' },
            { from: 'slm-gateway', to: 'orchestrator' },
            { from: 'orchestrator', to: 'actimize' }
        ],
        details: ['Response Formatted', 'UI Components Built', 'Real-time Push'],
        metric: { label: 'Data Points', value: '847' }
    },
    {
        id: 11,
        phase: 'Presentation',
        title: 'Analyst Review',
        desc: 'Human-in-the-loop review of AI-generated disposition logic with full audit transparency.',
        action: 'HUMAN_REVIEW',
        nodes: ['actimize', 'analyst'],
        connections: [{ from: 'actimize', to: 'analyst' }],
        details: ['Review Queue', 'AI Suggestions', 'Decision Pending'],
        metric: { label: 'Avg Review Time', value: '4.2 min' }
    },
    {
        id: 12,
        phase: 'Persistence',
        title: 'Final Disposition',
        desc: 'Decision finalized and stored in the system of record with cryptographic attestation.',
        action: 'FINAL_SAVE',
        nodes: ['analyst', 'actimize', 'advisory-db'],
        connections: [
            { from: 'analyst', to: 'actimize' },
            { from: 'actimize', to: 'advisory-db' }
        ],
        details: ['Decision Locked', 'DB Sync', 'Attestation Signed'],
        metric: { label: 'Sync Status', value: 'Complete' }
    },
    {
        id: 13,
        phase: 'Persistence',
        title: 'Model Alignment',
        desc: 'Closed-loop feedback improves future SLM reasoning accuracy through reinforcement learning.',
        action: 'RELEARNING',
        nodes: ['advisory-db', 'slm'],
        connections: [
            { from: 'advisory-db', to: 'slm' }
        ],
        details: ['Feedback Collected', 'Model Fine-tuning', 'Accuracy Improved'],
        metric: { label: 'Model Accuracy', value: '+2.3%' }
    }
];
// Improved node positions for better visual flow
const NODE_MAP = {
    falcon: { x: 12, y: 15, color: 'rose', label: 'Falcon Core', icon: Shield, tier: 'Ingestion', description: 'Real-time surveillance engine' },
    actimize: { x: 35, y: 15, color: 'emerald', label: 'Actimize', icon: Activity, tier: 'Case Management', description: 'Investigation platform' },
    analyst: { x: 88, y: 15, color: 'amber', label: 'Analyst', icon: Eye, tier: 'Human Review', description: 'Expert decision maker' },
    api: { x: 20, y: 38, color: 'blue', label: 'API Layer', icon: Server, tier: 'Interface', description: 'RESTful gateway' },
    orchestrator: { x: 50, y: 50, color: 'indigo', label: 'Orchestrator', icon: Network, tier: 'Core Engine', description: 'Workflow coordinator' },
    'rule-retriever': { x: 25, y: 62, color: 'purple', label: 'RAG Engine', icon: FileCheck, tier: 'Intelligence', description: 'Regulatory retrieval' },
    'vector-db': { x: 12, y: 78, color: 'purple', label: 'Vector DB', icon: Database, tier: 'Storage', description: 'Embedding store' },
    'slm-gateway': { x: 72, y: 50, color: 'cyan', label: 'SLM Gateway', icon: Brain, tier: 'AI Interface', description: 'Model orchestration' },
    slm: { x: 88, y: 50, color: 'cyan', label: 'SLM Engine', icon: Cpu, tier: 'AI Core', description: 'Llama-3 inference' },
    'advisory-db': { x: 50, y: 85, color: 'violet', label: 'Advisory DB', icon: Layers, tier: 'Persistence', description: 'State storage' },
};
const phaseColors = {
    'Detection': 'from-rose-500 to-orange-500',
    'Orchestration': 'from-blue-500 to-indigo-500',
    'Intelligence': 'from-purple-500 to-cyan-500',
    'Presentation': 'from-emerald-500 to-teal-500',
    'Persistence': 'from-violet-500 to-purple-500',
};
// --- MAIN COMPONENT ---
const SystemFlowPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [_showDetails] = useState(true);
    const [hoveredNode, setHoveredNode] = useState(null);
    const [showFullSystem, setShowFullSystem] = useState(false);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const progressValue = useMotionValue(0);
    const currentStep = flowSteps[activeStep];
    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                setActiveStep(prev => (prev === flowSteps.length - 1 ? 0 : prev + 1));
                setIsPlaying(false);
            }
            else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setActiveStep(prev => (prev === 0 ? flowSteps.length - 1 : prev - 1));
                setIsPlaying(false);
            }
            else if (e.key === 'p' || e.key === 'P') {
                setIsPlaying(prev => !prev);
            }
            else if (e.key === 'r' || e.key === 'R') {
                setActiveStep(0);
                setIsPlaying(true);
            }
            else if (e.key === 'f' || e.key === 'F') {
                setShowFullSystem(prev => !prev);
                setIsPlaying(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);
    useEffect(() => {
        progressValue.set(0);
        if (!isPlaying)
            return;
        const duration = 6000;
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            progressValue.set(progress);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        const animationFrame = requestAnimationFrame(animate);
        const timer = setTimeout(() => {
            setActiveStep(prev => (prev === flowSteps.length - 1 ? 0 : prev + 1));
        }, duration);
        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(animationFrame);
        };
    }, [isPlaying, activeStep, progressValue]);
    const isHighlighted = (nodeId) => showFullSystem || currentStep.nodes.includes(nodeId);
    const goToStep = useCallback((step) => {
        setActiveStep(step);
        setIsPlaying(false);
        setShowFullSystem(false);
    }, []);
    const progressWidth = useTransform(progressValue, [0, 1], ['0%', '100%']);
    return (_jsxs("div", { className: "flex h-screen bg-[#030712] text-slate-100 font-sans overflow-hidden", children: [_jsxs("div", { className: "fixed inset-0 z-0", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-slate-950 via-[#030712] to-slate-950" }), _jsx("div", { className: "absolute inset-0 opacity-30", children: _jsx("div", { className: "absolute inset-0", style: {
                                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`,
                            } }) }), _jsx(GridPattern, {})] }), _jsxs("aside", { className: "w-80 bg-slate-900/60 border-r border-white/5 backdrop-blur-2xl z-30 flex flex-col relative", children: [_jsx("div", { className: "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" }), _jsxs("div", { className: "p-5 border-b border-white/5", children: [_jsxs("div", { className: "mb-4 p-3 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-white/5", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest", children: "Current Phase" }), _jsx("span", { className: `text-xs font-bold bg-gradient-to-r ${phaseColors[currentStep.phase]} bg-clip-text text-transparent`, children: currentStep.phase })] }), _jsx("div", { className: "flex gap-1", children: ['Detection', 'Orchestration', 'Intelligence', 'Presentation', 'Persistence'].map((phase, idx) => (_jsx("div", { className: `flex-1 h-1.5 rounded-full transition-all duration-500 ${phase === currentStep.phase
                                                ? `bg-gradient-to-r ${phaseColors[phase]} shadow-lg`
                                                : idx < ['Detection', 'Orchestration', 'Intelligence', 'Presentation', 'Persistence'].indexOf(currentStep.phase)
                                                    ? 'bg-slate-600'
                                                    : 'bg-slate-800'}` }, phase))) })] }), _jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest", children: "Step Progress" }), _jsxs("span", { className: "text-sm font-mono text-blue-400 font-bold tabular-nums", children: [String(activeStep + 1).padStart(2, '0'), " / ", String(flowSteps.length).padStart(2, '0')] })] }), _jsxs("div", { className: "h-2 w-full bg-slate-800/80 rounded-full overflow-hidden mb-4 relative", children: [_jsx(motion.div, { className: "absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500", style: { width: `${((activeStep + 1) / flowSteps.length) * 100}%` }, transition: { duration: 0.5, ease: "easeOut" } }), isPlaying && (_jsx(motion.div, { className: "absolute inset-y-0 left-0 bg-white/20", style: { width: progressWidth } }))] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => goToStep(activeStep === 0 ? flowSteps.length - 1 : activeStep - 1), className: "flex-1 py-2.5 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-700/50 hover:border-white/10 transition-all flex items-center justify-center gap-1", children: _jsx(ChevronLeft, { size: 16, className: "text-slate-400" }) }), _jsxs("button", { onClick: () => setIsPlaying(!isPlaying), className: `flex-[2] py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-[10px] tracking-widest transition-all ${isPlaying
                                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'}`, children: [isPlaying ? _jsx(PauseCircle, { size: 16 }) : _jsx(PlayCircle, { size: 16 }), isPlaying ? 'PAUSE' : 'PLAY'] }), _jsx("button", { onClick: () => goToStep(activeStep === flowSteps.length - 1 ? 0 : activeStep + 1), className: "flex-1 py-2.5 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-700/50 hover:border-white/10 transition-all flex items-center justify-center gap-1", children: _jsx(ChevronRight, { size: 16, className: "text-slate-400" }) })] }), _jsxs("div", { className: "flex gap-2 mt-2", children: [_jsxs("button", { onClick: () => { setActiveStep(0); setIsPlaying(true); setShowFullSystem(false); }, className: "flex-1 py-2 rounded-xl bg-slate-800/30 border border-white/5 hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 text-slate-500 hover:text-slate-300", children: [_jsx(RotateCcw, { size: 12 }), _jsx("span", { className: "text-[10px] font-bold tracking-widest uppercase", children: "Reset" })] }), _jsxs("button", { onClick: () => { setShowFullSystem(!showFullSystem); setIsPlaying(false); }, className: `flex-1 py-2 rounded-xl flex items-center justify-center gap-2 font-bold text-[10px] tracking-widest uppercase transition-all ${showFullSystem
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 border border-transparent'
                                            : 'bg-slate-800/30 border border-white/5 text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}`, children: [_jsx(Layers, { size: 12 }), "Full View"] })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1.5", children: flowSteps.map((step, idx) => (_jsxs(motion.div, { onClick: () => goToStep(idx), whileHover: { x: 4 }, className: `p-3 rounded-xl border transition-all cursor-pointer relative group overflow-hidden ${activeStep === idx
                                ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/30'
                                : 'bg-slate-800/20 border-transparent hover:bg-slate-800/40 hover:border-white/5'}`, children: [_jsxs("div", { className: "flex gap-3 items-center relative z-10", children: [_jsx("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold shrink-0 transition-all ${activeStep === idx
                                                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                                                : idx < activeStep
                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                    : 'bg-slate-800 text-slate-500 border border-white/5'}`, children: idx < activeStep ? _jsx(CheckCircle, { size: 14 }) : String(idx + 1).padStart(2, '0') }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: `text-[9px] font-bold uppercase tracking-widest mb-0.5 ${activeStep === idx ? `bg-gradient-to-r ${phaseColors[step.phase]} bg-clip-text text-transparent` : 'text-slate-500'}`, children: step.phase }), _jsx("h3", { className: `font-semibold text-xs truncate ${activeStep === idx ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`, children: step.title })] })] }), activeStep === idx && (_jsx(motion.div, { layoutId: "sidebar-active-indicator", className: "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]", transition: { type: "spring", stiffness: 500, damping: 30 } }))] }, step.id))) }), _jsx("div", { className: "p-3 border-t border-white/5 bg-slate-900/40", children: _jsxs("div", { className: "flex items-center justify-center gap-3 text-[9px] text-slate-500", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("kbd", { className: "px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-mono", children: "\u2190" }), _jsx("kbd", { className: "px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-mono", children: "\u2192" }), "Navigate"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("kbd", { className: "px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-mono", children: "P" }), "Play"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("kbd", { className: "px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-mono", children: "F" }), "Full"] })] }) })] }), _jsx("main", { className: "flex-1 relative flex flex-col overflow-hidden", children: _jsxs("div", { className: "flex-1 relative overflow-hidden", ref: containerRef, children: [_jsx(TierLabels, {}), _jsxs("div", { className: "absolute inset-0 p-6 overflow-hidden", children: [_jsxs("svg", { className: "w-full h-full pointer-events-none overflow-visible", children: [_jsxs("defs", { children: [_jsxs("filter", { id: "glow-blue", x: "-50%", y: "-50%", width: "200%", height: "200%", children: [_jsx("feGaussianBlur", { stdDeviation: "4", result: "coloredBlur" }), _jsxs("feMerge", { children: [_jsx("feMergeNode", { in: "coloredBlur" }), _jsx("feMergeNode", { in: "SourceGraphic" })] })] }), _jsxs("linearGradient", { id: "line-gradient", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: "#3b82f6", stopOpacity: "0.6" }), _jsx("stop", { offset: "50%", stopColor: "#3b82f6", stopOpacity: "1" }), _jsx("stop", { offset: "100%", stopColor: "#8b5cf6", stopOpacity: "0.6" })] }), _jsxs("filter", { id: "particle-glow", children: [_jsx("feGaussianBlur", { stdDeviation: "2", result: "blur" }), _jsx("feComposite", { in: "SourceGraphic", in2: "blur", operator: "over" })] })] }), Object.entries(NODE_MAP).map(([id, node]) => {
                                            const connectedNodes = flowSteps.flatMap(step => step.connections
                                                .filter(c => c.from === id || c.to === id)
                                                .map(c => c.from === id ? c.to : c.from));
                                            return [...new Set(connectedNodes)].map(targetId => {
                                                const target = NODE_MAP[targetId];
                                                if (!target)
                                                    return null;
                                                return (_jsx("line", { x1: `${node.x}%`, y1: `${node.y}%`, x2: `${target.x}%`, y2: `${target.y}%`, stroke: "rgba(71, 85, 105, 0.1)", strokeWidth: "1", strokeDasharray: "4 4" }, `bg-${id}-${targetId}`));
                                            });
                                        }), (showFullSystem
                                            ? flowSteps.flatMap(step => step.connections)
                                                .filter((conn, idx, arr) => arr.findIndex(c => c.from === conn.from && c.to === conn.to) === idx)
                                            : currentStep.connections).map((conn, idx) => {
                                            const from = NODE_MAP[conn.from];
                                            const to = NODE_MAP[conn.to];
                                            return (_jsx(ConnectionLine, { from: from, to: to, dimensions: dimensions, delay: idx * 0.2 }, `${activeStep}-${idx}`));
                                        })] }), Object.entries(NODE_MAP).map(([id, props]) => (_jsx(Node, { id: id, ...props, isHighlighted: isHighlighted(id), isActive: currentStep.nodes[currentStep.nodes.length - 1] === id, onHover: setHoveredNode, isHovered: hoveredNode === id }, id))), !showFullSystem && (_jsx(StepInfoPanel, { currentStep: currentStep, activeNodeId: currentStep.nodes[currentStep.nodes.length - 1], nodeConfig: NODE_MAP[currentStep.nodes[currentStep.nodes.length - 1]] })), showFullSystem && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, className: "absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/25 border border-white/10", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Layers, { size: 16, className: "text-white" }), _jsx("span", { className: "text-sm font-bold text-white uppercase tracking-wider", children: "Complete System Architecture" })] }) }))] })] }) })] }));
};
// --- SUB-COMPONENTS ---
const GridPattern = () => (_jsx("div", { className: "absolute inset-0 opacity-[0.03]", style: {
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
    } }));
const TierLabels = () => (_jsx("div", { className: "absolute inset-y-0 left-0 w-2 z-10 flex flex-col justify-around py-20 pointer-events-none", children: ['Detection', 'Integration', 'Intelligence', 'Storage'].map((tier) => (_jsx("div", { className: "flex items-center", style: { transform: 'rotate(-90deg) translateX(-50%)', transformOrigin: 'left center' }, children: _jsx("span", { className: "text-[8px] font-bold text-slate-700 uppercase tracking-[0.3em] whitespace-nowrap", children: tier }) }, tier))) }));
const ConnectionLine = ({ from, to, dimensions, delay = 0 }) => {
    const { width, height } = dimensions;
    if (!width || !height)
        return null;
    const x1 = (from.x / 100) * width;
    const y1 = (from.y / 100) * height;
    const x2 = (to.x / 100) * width;
    const y2 = (to.y / 100) * height;
    // Calculate control points for smooth curves
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const pathD = Math.abs(dy) > Math.abs(dx)
        ? `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`
        : `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
    return (_jsxs("g", { children: [_jsx(motion.path, { d: pathD, stroke: "rgba(59, 130, 246, 0.3)", strokeWidth: "6", fill: "none", filter: "url(#glow-blue)", initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 0.8, delay, ease: "easeOut" } }), _jsx(motion.path, { d: pathD, stroke: "url(#line-gradient)", strokeWidth: "2", fill: "none", initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 0.8, delay, ease: "easeOut" } }), [0, 0.33, 0.66].map((offset, idx) => (_jsxs("g", { children: [_jsx("circle", { r: "5", fill: "#60a5fa", filter: "url(#particle-glow)", children: _jsx("animateMotion", { dur: "2s", repeatCount: "indefinite", begin: `${offset * 2 + delay}s`, path: pathD }) }), _jsx("circle", { r: "2", fill: "#93c5fd", opacity: "0.8", children: _jsx("animateMotion", { dur: "2s", begin: `${offset * 2 + delay + 0.05}s`, repeatCount: "indefinite", path: pathD }) })] }, idx)))] }));
};
const colorMap = {
    rose: { border: 'border-rose-500', bg: 'bg-rose-500/10', text: 'text-rose-400', shadow: 'shadow-rose-500/30', glow: 'rgba(244, 63, 94, 0.4)', gradient: 'from-rose-500 to-orange-500' },
    emerald: { border: 'border-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-400', shadow: 'shadow-emerald-500/30', glow: 'rgba(16, 185, 129, 0.4)', gradient: 'from-emerald-500 to-teal-500' },
    blue: { border: 'border-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-400', shadow: 'shadow-blue-500/30', glow: 'rgba(59, 130, 246, 0.4)', gradient: 'from-blue-500 to-indigo-500' },
    indigo: { border: 'border-indigo-500', bg: 'bg-indigo-500/10', text: 'text-indigo-400', shadow: 'shadow-indigo-500/30', glow: 'rgba(99, 102, 241, 0.4)', gradient: 'from-indigo-500 to-purple-500' },
    purple: { border: 'border-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-400', shadow: 'shadow-purple-500/30', glow: 'rgba(168, 85, 247, 0.4)', gradient: 'from-purple-500 to-pink-500' },
    cyan: { border: 'border-cyan-500', bg: 'bg-cyan-500/10', text: 'text-cyan-400', shadow: 'shadow-cyan-500/30', glow: 'rgba(6, 182, 212, 0.4)', gradient: 'from-cyan-500 to-blue-500' },
    amber: { border: 'border-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-400', shadow: 'shadow-amber-500/30', glow: 'rgba(245, 158, 11, 0.4)', gradient: 'from-amber-500 to-orange-500' },
    violet: { border: 'border-violet-500', bg: 'bg-violet-500/10', text: 'text-violet-400', shadow: 'shadow-violet-500/30', glow: 'rgba(139, 92, 246, 0.4)', gradient: 'from-violet-500 to-purple-500' },
    slate: { border: 'border-slate-500', bg: 'bg-slate-500/10', text: 'text-slate-400', shadow: 'shadow-slate-500/30', glow: 'rgba(100, 116, 139, 0.4)', gradient: 'from-slate-500 to-slate-600' },
};
const StepInfoPanel = ({ currentStep, nodeConfig }) => {
    if (!nodeConfig)
        return null;
    const colors = colorMap[nodeConfig.color];
    const Icon = nodeConfig.icon;
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -20, scale: 0.95 }, transition: { duration: 0.3, ease: "easeOut" }, className: `absolute bottom-4 right-4 bg-slate-900/95 backdrop-blur-2xl rounded-2xl border-2 ${colors.border} shadow-2xl overflow-hidden z-50`, style: {
            boxShadow: `0 0 40px ${colors.glow}, 0 0 80px ${colors.glow}`,
            width: '320px',
            maxWidth: 'calc(100% - 32px)'
        }, children: [_jsxs("div", { className: `p-3 bg-gradient-to-r ${colors.gradient} relative`, children: [_jsx("div", { className: "absolute inset-0 bg-black/20" }), _jsxs("div", { className: "relative z-10 flex items-center gap-3", children: [_jsx("div", { className: `w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center backdrop-blur-sm`, children: _jsx(Icon, { size: 20, className: `${colors.text}` }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-[9px] font-bold uppercase tracking-widest text-white/70", children: nodeConfig.tier }), _jsx("div", { className: "text-sm font-black text-white truncate", children: currentStep.title })] }), _jsx(motion.div, { animate: { scale: [1, 1.2, 1] }, transition: { duration: 1, repeat: Infinity }, className: "w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50" })] })] }), _jsxs("div", { className: "p-3 space-y-3", children: [_jsx("p", { className: "text-slate-300 text-[11px] leading-relaxed", children: currentStep.desc }), currentStep.metric && (_jsxs("div", { className: `flex items-center justify-between p-2 rounded-lg ${colors.bg} border ${colors.border}/30`, children: [_jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider", children: currentStep.metric.label }), _jsx("span", { className: `text-sm font-black ${colors.text}`, children: currentStep.metric.value })] })), currentStep.details && (_jsx("div", { className: "flex flex-wrap gap-1", children: currentStep.details.map((detail, idx) => (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: idx * 0.1 }, className: "flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800/50 border border-white/5", children: [_jsx("div", { className: "w-1 h-1 rounded-full bg-emerald-500 animate-pulse" }), _jsx("span", { className: "text-[9px] font-medium text-slate-300", children: detail })] }, detail))) }))] }), _jsx(motion.div, { className: `h-0.5 bg-gradient-to-r ${colors.gradient}`, initial: { scaleX: 0 }, animate: { scaleX: 1 }, transition: { duration: 0.5, delay: 0.2 }, style: { transformOrigin: 'left' } })] }, currentStep.id));
};
const Node = ({ id, x, y, color, label, icon: Icon, isHighlighted, isActive, tier, description, onHover, isHovered }) => {
    const colors = colorMap[color];
    return (_jsx(motion.div, { onMouseEnter: () => onHover(id), onMouseLeave: () => onHover(null), layout: true, animate: {
            scale: isActive ? 1.15 : isHovered ? 1.05 : 1,
            opacity: isHighlighted ? 1 : 0.3,
            zIndex: isActive ? 50 : isHovered ? 30 : 20,
        }, transition: { duration: 0.4, ease: "easeOut", layout: { duration: 0.4 } }, style: { left: `${x}%`, top: `${y}%` }, className: "absolute cursor-pointer -translate-x-1/2 -translate-y-1/2", children: _jsxs("div", { className: "flex flex-col items-center gap-1.5", children: [_jsx(motion.div, { animate: { opacity: isHighlighted ? 1 : 0.3 }, className: `text-[8px] font-bold uppercase tracking-[0.2em] ${colors.text}`, children: tier }), _jsxs("div", { className: "relative", children: [isActive && (_jsx(motion.div, { animate: { scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }, transition: { repeat: Infinity, duration: 1.5 }, className: `absolute -inset-2 rounded-2xl border-2 ${colors.border}`, style: { boxShadow: `0 0 20px ${colors.glow}` } })), isHighlighted && !isActive && (_jsx(motion.div, { animate: { scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }, transition: { repeat: Infinity, duration: 2 }, className: `absolute inset-0 rounded-2xl ${colors.border} border-2 opacity-30` })), _jsxs(motion.div, { animate: {
                                boxShadow: isActive
                                    ? `0 0 30px ${colors.glow}, 0 0 60px ${colors.glow}`
                                    : isHighlighted
                                        ? `0 0 20px ${colors.glow}`
                                        : 'none'
                            }, className: `w-14 h-14 rounded-2xl border-2 ${colors.border} ${colors.bg} flex items-center justify-center relative backdrop-blur-xl transition-colors duration-300 ${isHighlighted ? 'border-opacity-100' : 'border-opacity-20'}`, children: [_jsx("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" }), _jsx(Icon, { size: 24, className: `relative z-10 ${colors.text}` })] })] }), _jsx(motion.span, { animate: { opacity: isHighlighted ? 1 : 0.4 }, className: `text-[10px] font-bold text-center max-w-[80px] leading-tight ${isHighlighted ? 'text-white' : 'text-slate-500'}`, children: label }), _jsx(AnimatePresence, { children: isHovered && description && (_jsxs(motion.div, { initial: { opacity: 0, y: 5, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 5, scale: 0.95 }, className: "absolute top-full mt-2 px-3 py-2 bg-slate-800/95 backdrop-blur-xl rounded-lg border border-white/10 shadow-xl z-50 whitespace-nowrap", children: [_jsx("div", { className: "text-[11px] font-medium text-slate-300", children: description }), _jsx("div", { className: "absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-l border-t border-white/10 rotate-45" })] })) })] }) }));
};
export default SystemFlowPage;
//# sourceMappingURL=SystemFlowPage.js.map