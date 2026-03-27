import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bot, MessageSquare, Zap, Shield, Settings,
    Save, Play, Pause, RefreshCw, Sliders, Brain,
    CheckCircle2, ChevronDown, ChevronUp, Send,
    Loader2, AlertCircle, Eye, EyeOff, Star, Globe, Cpu,
    X, Database, MessageCircle, Globe2, BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppConfigStore } from '@/store/useAppConfigStore'
import { config } from '@/shared/config/env'

// ─── Static fallback model list (used when API key not set or fetch fails) ────
// Keep IDs verified against https://openrouter.ai/models?q=free

const FALLBACK_FREE_MODELS = [
    {
        id: 'meta-llama/llama-3.1-8b-instruct:free',
        name: 'Llama 3.1 8B',
        provider: 'Meta',
        context: '131K',
        languages: 'EN / RU / PL',
        badge: 'Fast & Reliable',
        badgeColor: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
        description: 'Fast and reliable. Good for most tasks with lower rate-limit risk.',
        toolUse: true,
    },
    {
        id: 'meta-llama/llama-3.3-70b-instruct:free',
        name: 'Llama 3.3 70B',
        provider: 'Meta',
        context: '131K',
        languages: 'EN / RU / PL',
        badge: 'Recommended',
        badgeColor: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
        description: 'Best quality free model. May hit rate limits on heavy usage.',
        toolUse: true,
    },
    {
        id: 'google/gemma-3-27b-it:free',
        name: 'Gemma 3 27B',
        provider: 'Google',
        context: '131K',
        languages: 'EN / multilingual',
        badge: 'Balanced',
        badgeColor: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
        description: 'Google\'s open model. Good multilingual support and fast responses.',
        toolUse: false,
    },
    {
        id: 'mistralai/mistral-7b-instruct:free',
        name: 'Mistral 7B',
        provider: 'Mistral',
        context: '32K',
        languages: 'EN / FR / multilingual',
        badge: 'Reliable',
        badgeColor: 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400',
        description: 'Consistently available. Great for simple queries and fast responses.',
        toolUse: false,
    },
    {
        id: 'deepseek/deepseek-r1-distill-llama-70b:free',
        name: 'DeepSeek R1 Distill 70B',
        provider: 'DeepSeek',
        context: '131K',
        languages: 'EN / ZH',
        badge: 'Reasoning',
        badgeColor: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400',
        description: 'Distilled reasoning model. Better availability than full R1.',
        toolUse: false,
    },
]

// ─── Helper: parse OpenRouter model list into our format ─────────────────────

const PROVIDER_MAP = {
    'meta-llama': 'Meta', 'google': 'Google', 'mistralai': 'Mistral',
    'deepseek': 'DeepSeek', 'qwen': 'Alibaba', 'openai': 'OpenAI',
    'microsoft': 'Microsoft', 'nousresearch': 'NousResearch',
    'anthropic': 'Anthropic', 'cohere': 'Cohere',
}

const BADGE_COLORS = [
    'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
    'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
    'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400',
    'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400',
]

function parseOpenRouterModels(data) {
    return (data?.data ?? [])
        .filter(m => m.id?.endsWith(':free') && m.context_length)
        .map((m, i) => {
            const [org] = m.id.split('/')
            const ctxK = m.context_length >= 1000
                ? `${Math.round(m.context_length / 1024)}K`
                : String(m.context_length)
            const hasTools = Array.isArray(m.supported_parameters)
                ? m.supported_parameters.includes('tools')
                : false
            const cleanName = (m.name ?? m.id)
                .replace(/\(free\)/gi, '').replace(/:free$/i, '').trim()
            return {
                id: m.id,
                name: cleanName,
                provider: PROVIDER_MAP[org] ?? org,
                context: ctxK,
                languages: 'multilingual',
                badge: hasTools ? 'Tool Use' : 'Free',
                badgeColor: BADGE_COLORS[i % BADGE_COLORS.length],
                description: m.description ?? `${cleanName} — free tier on OpenRouter.`,
                toolUse: hasTools,
            }
        })
        .sort((a, b) => {
            // Sort: tool-use first, then by context window size (larger = better)
            if (a.toolUse !== b.toolUse) return a.toolUse ? -1 : 1
            return parseInt(b.context) - parseInt(a.context)
        })
}

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

// ─── Model card ──────────────────────────────────────────────────────────────

const ModelCard = ({ model, selected, onSelect, disabled }) => (
    <button
        onClick={() => !disabled && onSelect(model.id)}
        aria-label={`Select ${model.name}`}
        className={cn(
            'w-full text-left p-4 rounded-2xl border transition-all duration-200',
            selected
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 shadow-md shadow-indigo-500/10'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600',
            disabled && 'opacity-50 cursor-not-allowed'
        )}
    >
        <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 min-w-0">
                <div className={cn(
                    'w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all',
                    selected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 dark:border-slate-600'
                )}>
                    {selected && <div className="w-1.5 h-1.5 bg-white rounded-full m-auto mt-[1px]" />}
                </div>
                <span className="font-bold text-sm text-slate-900 dark:text-white truncate">{model.name}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0">{model.provider}</span>
            </div>
            <span className={cn('text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0', model.badgeColor)}>
                {model.badge}
            </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3 pl-6">{model.description}</p>
        <div className="flex gap-3 pl-6">
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <Cpu size={10} /> {model.context}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <Globe size={10} /> {model.languages}
            </span>
            {model.toolUse && (
                <span className="text-[10px] text-emerald-500 font-bold">✓ Tool Use</span>
            )}
        </div>
    </button>
)

// ─── Agent card ───────────────────────────────────────────────────────────────

const AgentCard = ({ name, role, isActive, onToggle, onSettings, icon: Icon, color, description }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-indigo-500/20 transition-all duration-300">
        <div className={cn('absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 transition-opacity group-hover:opacity-20', color.replace('text-', 'bg-'))} />
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-5">
                <div className={cn('p-4 rounded-2xl bg-opacity-10 dark:bg-opacity-20 shadow-inner', color)}>
                    <Icon size={24} />
                </div>
                <div className={cn(
                    'px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5',
                    isActive ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                )}>
                    <div className={cn('w-1.5 h-1.5 rounded-full', isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-300')} />
                    {isActive ? 'ACTIVE' : 'PAUSED'}
                </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-0.5">{name}</h3>
            <p className="text-[10px] font-bold text-indigo-500/80 uppercase tracking-widest mb-3">{role}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{description}</p>
            <div className="flex gap-2">
                <button
                    onClick={onToggle}
                    aria-label={isActive ? `Stop ${name}` : `Start ${name}`}
                    className={cn(
                        'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-md',
                        isActive ? 'bg-slate-900 dark:bg-slate-800 text-white' : 'bg-indigo-600 text-white shadow-indigo-500/20'
                    )}
                >
                    {isActive ? <Pause size={14} /> : <Play size={14} />}
                    {isActive ? 'STOP' : 'START'}
                </button>
                <button aria-label={`${name} settings`} onClick={onSettings} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all">
                    <Settings size={18} />
                </button>
            </div>
        </div>
    </div>
)

// ─── Main page ────────────────────────────────────────────────────────────────

const AdminAIPage = () => {
    const appConfig = useAppConfigStore()

    // ── Temps
    const [guideTemp, setGuideTemp] = useState(appConfig.aiGuideTemp ?? 0.7)
    const [assistantTemp, setAssistantTemp] = useState(appConfig.aiAssistantTemp ?? 0.4)

    // ── Agents
    const [agentActive, setAgentActive] = useState({
        guide: appConfig.aiGuideActive ?? true,
        assistant: appConfig.aiAssistantActive ?? true,
    })

    // ── Dynamic model list
    const [freeModels, setFreeModels] = useState(FALLBACK_FREE_MODELS)
    const [modelsLoading, setModelsLoading] = useState(false)
    const [modelsError, setModelsError] = useState(null)
    const [modelsLastFetch, setModelsLastFetch] = useState(null)

    // ── Models
    const [primaryModel, setPrimaryModel] = useState(
        appConfig.aiPrimaryModel || 'meta-llama/llama-3.1-8b-instruct:free'
    )
    const [fallbackModel, setFallbackModel] = useState(
        appConfig.aiFallbackModel || 'meta-llama/llama-3.3-70b-instruct:free'
    )

    // ── API key (pre-load from store, then fall back to env var)
    const [apiKey, setApiKey] = useState(appConfig.aiApiKey || config.ai.openRouterKey || '')
    const [showKey, setShowKey] = useState(false)

    // ── UI state
    const [saved, setSaved] = useState(false)
    const [showPrimaryPicker, setShowPrimaryPicker] = useState(false)
    const [showFallbackPicker, setShowFallbackPicker] = useState(false)

    // ── AI Guide settings modal
    const [showGuideSettings, setShowGuideSettings] = useState(false)
    const [guideSystemPrompt, setGuideSystemPrompt] = useState(appConfig.aiGuideSystemPrompt || '')
    const [guideLanguage, setGuideLanguage] = useState(appConfig.aiGuideLanguage || 'auto')
    const [guideResponseStyle, setGuideResponseStyle] = useState(appConfig.aiGuideResponseStyle || 'friendly')
    const [guideDataSources, setGuideDataSources] = useState(appConfig.aiGuideDataSources || {
        locations: true,
        reviews: true,
        insiderTips: true,
        userPreferences: true,
    })
    const [guideFocusTopics, setGuideFocusTopics] = useState(appConfig.aiGuideFocusTopics || 'dining')

    // ── Test panel
    const [testMessage, setTestMessage] = useState('')
    const [testModel, setTestModel] = useState('primary')
    const [testing, setTesting] = useState(false)
    const [testResult, setTestResult] = useState(null) // { ok, text, latency, model }

    const toggleAgent = (key) => setAgentActive(prev => ({ ...prev, [key]: !prev[key] }))

    // ── Fetch live model list from OpenRouter ──────────────────────────────────
    const fetchModels = useCallback(async (key) => {
        const activeKey = key || apiKey || appConfig.aiApiKey || config.ai.openRouterKey
        if (!activeKey) return
        setModelsLoading(true)
        setModelsError(null)
        try {
            const res = await fetch('https://openrouter.ai/api/v1/models', {
                headers: { 'Authorization': `Bearer ${activeKey}` },
            })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()
            const parsed = parseOpenRouterModels(data)
            if (parsed.length > 0) {
                setFreeModels(parsed)
                setModelsLastFetch(new Date().toLocaleTimeString())
            } else {
                setModelsError('No free models returned — showing fallback list.')
            }
        } catch (err) {
            setModelsError(`Could not load live models: ${err.message}. Showing fallback list.`)
        } finally {
            setModelsLoading(false)
        }
    }, [apiKey, appConfig.aiApiKey])

    // Auto-fetch when API key becomes available
    useEffect(() => {
        const key = apiKey || appConfig.aiApiKey || config.ai.openRouterKey
        if (key) fetchModels(key)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getPrimaryInfo = () => freeModels.find(m => m.id === primaryModel) ?? freeModels[0]
    const getFallbackInfo = () => freeModels.find(m => m.id === fallbackModel) ?? freeModels[1]

    const handleSave = () => {
        appConfig.updateSettings({
            aiGuideTemp: guideTemp,
            aiAssistantTemp: assistantTemp,
            aiGuideActive: agentActive.guide,
            aiAssistantActive: agentActive.assistant,
            aiPrimaryModel: primaryModel,
            aiFallbackModel: fallbackModel,
            aiApiKey: apiKey,
            aiGuideSystemPrompt: guideSystemPrompt,
            aiGuideLanguage: guideLanguage,
            aiGuideResponseStyle: guideResponseStyle,
            aiGuideDataSources: guideDataSources,
            aiGuideFocusTopics: guideFocusTopics,
        })
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    // ── Test model call (simple direct fetch, no tool use, just verify connectivity)
    const handleTest = async () => {
        const activeKey = apiKey || appConfig.aiApiKey || config.ai.openRouterKey
        if (!activeKey) {
            setTestResult({ ok: false, text: 'No API key set. Enter your OpenRouter key first.', latency: 0, model: '' })
            return
        }
        const model = testModel === 'primary' ? primaryModel : fallbackModel
        setTesting(true)
        setTestResult(null)

        const t0 = Date.now()
        try {
            const res = await fetch(OPENROUTER_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${activeKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'GastroMap',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are GastroGuide, an AI dining assistant for GastroMap. Be brief and friendly.',
                        },
                        {
                            role: 'user',
                            content: testMessage.trim() || 'Hello! Introduce yourself in one sentence.',
                        },
                    ],
                    max_tokens: 256,
                }),
            })

            const latency = Date.now() - t0
            const body = await res.json().catch(() => null)

            if (!res.ok || body?.error) {
                const errMsg = body?.error?.message
                const errCode = body?.error?.code ?? res.status

                let humanMsg
                if (errCode === 401 || res.status === 401) {
                    humanMsg = 'Invalid API key. Check your key at openrouter.ai/keys.'
                } else if (errCode === 402 || res.status === 402) {
                    humanMsg = 'No credits. Add credits at openrouter.ai/credits.'
                } else if (errCode === 429 || res.status === 429) {
                    humanMsg = 'Rate limit exceeded. Wait a moment and try again.'
                } else if (errMsg && errMsg.toLowerCase().includes('provider returned error')) {
                    humanMsg = `The model provider is temporarily unavailable. Try the fallback model instead.`
                } else {
                    humanMsg = errMsg ?? `HTTP ${res.status} — unknown error`
                }

                setTestResult({ ok: false, text: humanMsg, latency, model })
            } else {
                const text = body?.choices?.[0]?.message?.content ?? '(empty response)'
                setTestResult({ ok: true, text, latency, model })
            }
        } catch (err) {
            const latency = Date.now() - t0
            const msg = err?.message ?? ''
            const humanMsg = msg.includes('fetch') || msg.includes('network') || msg.includes('Failed')
                ? 'Network error — check your internet connection or CORS settings.'
                : msg || 'Unknown network error'
            setTestResult({ ok: false, text: humanMsg, latency, model })
        } finally {
            setTesting(false)
        }
    }

    return (
        <div className="space-y-6 pb-10">

            {/* Save toast */}
            <AnimatePresence>
                {saved && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="fixed top-24 right-8 z-[9999] px-5 py-3 rounded-2xl bg-slate-900/95 text-white text-sm font-semibold shadow-xl border border-white/10 backdrop-blur-md flex items-center gap-2"
                    >
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        AI configuration saved.
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Configure models, agents and test connectivity.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                >
                    <Save size={16} /> Save Configuration
                </button>
            </div>

            {/* ── SECTION: API Key ─────────────────────────────────────────── */}
            <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
                        <Shield size={18} />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900 dark:text-white text-sm">OpenRouter API Key</h2>
                        <p className="text-[11px] text-slate-400">
                            {config.ai.openRouterKey && !appConfig.aiApiKey
                                ? 'Using key from environment variable (.env).'
                                : 'Overrides the environment variable at runtime.'}
                        </p>
                    </div>
                    {(apiKey || config.ai.openRouterKey) && (
                        <span className="ml-auto text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">
                            ● Connected
                        </span>
                    )}
                </div>
                <div className="relative">
                    <input
                        type={showKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                        placeholder="sk-or-v1-..."
                        className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 transition-colors font-mono"
                    />
                    <button
                        onClick={() => setShowKey(v => !v)}
                        aria-label={showKey ? 'Hide key' : 'Show key'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                    >
                        {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                    Get your free key at <span className="text-indigo-500 font-semibold">openrouter.ai/keys</span>
                </p>
            </div>

            {/* ── SECTION: Model Selection ─────────────────────────────────── */}
            <div className="flex items-center justify-between px-1">
                <p className="text-[11px] text-slate-400 font-medium">
                    {modelsLastFetch
                        ? `Live model list loaded at ${modelsLastFetch} · ${freeModels.length} free models`
                        : 'Showing cached model list · click Refresh for live data'}
                </p>
                <button
                    onClick={() => fetchModels()}
                    disabled={modelsLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-500 text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                >
                    <RefreshCw size={12} className={modelsLoading ? 'animate-spin' : ''} />
                    {modelsLoading ? 'Loading…' : 'Refresh'}
                </button>
            </div>
            {modelsError && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 px-1">{modelsError}</p>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Primary model */}
                <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                            <Bot size={18} />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 dark:text-white text-sm">Primary Model</h2>
                            <p className="text-[11px] text-slate-400">Main model for all AI responses.</p>
                        </div>
                    </div>

                    {/* Selected display */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 mb-3">
                        <div>
                            <p className="font-bold text-sm text-indigo-700 dark:text-indigo-300">{getPrimaryInfo().name}</p>
                            <p className="text-[11px] text-indigo-500/80">{getPrimaryInfo().provider} · {getPrimaryInfo().context} ctx</p>
                        </div>
                        <button
                            onClick={() => { setShowPrimaryPicker(v => !v); setShowFallbackPicker(false) }}
                            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"
                        >
                            Change {showPrimaryPicker ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {showPrimaryPicker && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-2"
                            >
                                {freeModels.map(model => (
                                    <ModelCard
                                        key={model.id}
                                        model={model}
                                        selected={primaryModel === model.id}
                                        disabled={fallbackModel === model.id}
                                        onSelect={(id) => { setPrimaryModel(id); setShowPrimaryPicker(false) }}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Fallback model */}
                <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                            <RefreshCw size={18} />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 dark:text-white text-sm">Fallback Model</h2>
                            <p className="text-[11px] text-slate-400">Used automatically when primary hits rate limit.</p>
                        </div>
                    </div>

                    {/* Selected display */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 mb-3">
                        <div>
                            <p className="font-bold text-sm text-slate-700 dark:text-slate-300">{getFallbackInfo().name}</p>
                            <p className="text-[11px] text-slate-400">{getFallbackInfo().provider} · {getFallbackInfo().context} ctx</p>
                        </div>
                        <button
                            onClick={() => { setShowFallbackPicker(v => !v); setShowPrimaryPicker(false) }}
                            className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1"
                        >
                            Change {showFallbackPicker ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {showFallbackPicker && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-2"
                            >
                                {freeModels.map(model => (
                                    <ModelCard
                                        key={model.id}
                                        model={model}
                                        selected={fallbackModel === model.id}
                                        disabled={primaryModel === model.id}
                                        onSelect={(id) => { setFallbackModel(id); setShowFallbackPicker(false) }}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ── SECTION: Test Model ──────────────────────────────────────── */}
            <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <Zap size={18} />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900 dark:text-white text-sm">Test Model Connection</h2>
                        <p className="text-[11px] text-slate-400">Verify API key and model response before saving.</p>
                    </div>
                </div>

                {/* Model selector tabs */}
                <div className="flex gap-2 mb-4">
                    {[
                        { key: 'primary', label: `Primary — ${getPrimaryInfo().name}` },
                        { key: 'fallback', label: `Fallback — ${getFallbackInfo().name}` },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => { setTestModel(tab.key); setTestResult(null) }}
                            className={cn(
                                'px-4 py-2 rounded-xl text-xs font-bold transition-all',
                                testModel === tab.key
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Input row */}
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={testMessage}
                        onChange={e => setTestMessage(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !testing && handleTest()}
                        placeholder='Leave blank for default ping, or type: "recommend a romantic place"'
                        className="flex-1 h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button
                        onClick={handleTest}
                        disabled={testing}
                        aria-label="Run test"
                        className="h-11 px-5 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {testing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        {testing ? 'Testing…' : 'Test'}
                    </button>
                </div>

                {/* Result */}
                <AnimatePresence>
                    {testResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className={cn(
                                'mt-4 p-4 rounded-2xl border text-sm',
                                testResult.ok
                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30'
                                    : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30'
                            )}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {testResult.ok
                                    ? <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                                    : <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                                }
                                <span className={cn('font-bold text-xs', testResult.ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400')}>
                                    {testResult.ok ? 'Success' : 'Error'} · {testResult.latency}ms · {testResult.model}
                                </span>
                            </div>
                            <p className={cn('leading-relaxed', testResult.ok ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300')}>
                                {testResult.text}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── SECTION: Agents ──────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AgentCard
                    name="AI Guide"
                    role="User Support"
                    isActive={agentActive.guide}
                    onToggle={() => toggleAgent('guide')}
                    onSettings={() => setShowGuideSettings(true)}
                    icon={MessageSquare}
                    color="text-indigo-500"
                    description="Answers user questions, matches locations based on preferences, and helps plan dining routes."
                />
                <AgentCard
                    name="AI Assistant"
                    role="Admin Helper"
                    isActive={agentActive.assistant}
                    onToggle={() => toggleAgent('assistant')}
                    onSettings={() => document.getElementById('model-config')?.scrollIntoView({ behavior: 'smooth' })}
                    icon={Brain}
                    color="text-purple-500"
                    description="Analyzes trends, monitors review moderation, alerts on critical events, and supports bulk operations."
                />
            </div>

            {/* ── SECTION: Model Parameters + Status ───────────────────────── */}
            <div id="model-config" className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                            <Sliders size={18} />
                        </div>
                        <h2 className="font-bold text-slate-900 dark:text-white">Model Parameters</h2>
                    </div>
                    <div className="space-y-8">
                        {/* Guide temp */}
                        <div className="bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-[24px] border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">AI Guide Creativity</h4>
                                    <p className="text-xs text-slate-400 mt-0.5">Variety and unpredictability of responses.</p>
                                </div>
                                <span className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl text-xl font-bold text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-700 min-w-[52px] text-center">
                                    {guideTemp}
                                </span>
                            </div>
                            <input type="range" min="0" max="1" step="0.1" value={guideTemp}
                                onChange={e => setGuideTemp(parseFloat(e.target.value))}
                                aria-label="AI Guide temperature"
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700/50 rounded-full appearance-none cursor-pointer accent-indigo-600"
                            />
                            <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">
                                <span>Precise</span><span>Creative</span>
                            </div>
                        </div>
                        {/* Assistant temp */}
                        <div className="bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-[24px] border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">AI Assistant Precision</h4>
                                    <p className="text-xs text-slate-400 mt-0.5">Strictness and accuracy of analytical responses.</p>
                                </div>
                                <span className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl text-xl font-bold text-purple-600 dark:text-purple-400 shadow-sm border border-slate-100 dark:border-slate-700 min-w-[52px] text-center">
                                    {assistantTemp}
                                </span>
                            </div>
                            <input type="range" min="0" max="1" step="0.1" value={assistantTemp}
                                onChange={e => setAssistantTemp(parseFloat(e.target.value))}
                                aria-label="AI Assistant temperature"
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700/50 rounded-full appearance-none cursor-pointer accent-purple-600"
                            />
                            <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">
                                <span>Precise</span><span>Creative</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System status */}
                <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">System Status</h2>
                    <div className="space-y-6 flex-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 text-yellow-500 flex items-center justify-center"><Zap size={16} /></div>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Provider</span>
                            </div>
                            <span className="text-sm font-bold text-indigo-500">OpenRouter</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center"><Bot size={16} /></div>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Primary</span>
                            </div>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 text-right max-w-[120px] truncate">{getPrimaryInfo().name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center"><RefreshCw size={16} /></div>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Fallback</span>
                            </div>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 text-right max-w-[120px] truncate">{getFallbackInfo().name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center"><Shield size={16} /></div>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Agents</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {[agentActive.guide, agentActive.assistant].filter(Boolean).length}/2
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-300 flex items-center justify-center"><Star size={16} /></div>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Cost</span>
                            </div>
                            <span className="text-sm font-bold text-emerald-500">
                                {appConfig.aiApiKey ? 'Pay-as-you-go' : '$0 / mo'}
                            </span>
                        </div>
                    </div>
                    <div className="mt-8 p-5 rounded-[24px] bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                            {agentActive.guide && agentActive.assistant
                                ? '"All systems stable. Both agents operational."'
                                : agentActive.guide
                                    ? '"AI Guide active. AI Assistant is paused."'
                                    : agentActive.assistant
                                        ? '"AI Assistant active. AI Guide is paused."'
                                        : '"All agents are currently paused."'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminAIPage
