"use client";

import { useState } from "react";
import { Search, MessageSquare, ChevronRight, BookOpen, Clock, AlertCircle, Globe, ExternalLink, Sparkles, Filter } from "lucide-react";

interface SearchResult {
    chunk_id: number;
    filename: string;
    chunk_index: number;
    content: string;
    similarity: number;
}

interface GoogleSource {
    title: string;
    url: string;
}

interface ToolLog {
    tool: string;
    args: any;
    result: string;
}

interface AskResponse {
    query: string;
    answer: string;
    source_nodes: SearchResult[];
    google_sources?: GoogleSource[];
    tool_logs?: ToolLog[];
}

export default function RagPlaygroundPage() {
    const [query, setQuery] = useState("");
    const [mode, setMode] = useState<"ask" | "search">("ask");
    const [answer, setAnswer] = useState<string | null>(null);
    const [results, setResults] = useState<SearchResult[] | null>(null);
    const [googleSources, setGoogleSources] = useState<GoogleSource[] | null>(null);
    const [toolLogs, setToolLogs] = useState<ToolLog[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const RAG_API_URL = "/api/rag";

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        setAnswer(null);
        setResults(null);
        setGoogleSources(null);
        setToolLogs(null);

        try {
            const endpoint = mode === "ask" ? "ask" : "search";
            const res = await fetch(`${RAG_API_URL}/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            if (res.ok) {
                const data = await res.json();
                if (mode === "ask") {
                    const askData = data as AskResponse;
                    setAnswer(askData.answer);
                    setResults(askData.source_nodes);
                    setGoogleSources(askData.google_sources || []);
                    setToolLogs(askData.tool_logs || []);
                } else {
                    setResults(data as SearchResult[]);
                }
            } else {
                setError("질문 처리 중 오류가 발생했습니다. 서버 상태를 확인해주세요.");
            }
        } catch (err) {
            console.error(err);
            setError("백엔드 서버(FastAPI)와 연결할 수 없습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-24 animate-in fade-in duration-700">
            {/* 헤더 섹션 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Experimental</span>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">지식 플레이그라운드</h1>
                    </div>
                    <p className="text-gray-500 text-lg">사내 문서(RAG)와 실시간 웹(Google Search)을 결합한 하이브리드 AI 에이전트입니다.</p>
                </div>
                
                <div className="flex bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200 backdrop-blur-sm">
                    <button
                        onClick={() => setMode("ask")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${mode === 'ask' ? 'bg-white text-orange-600 shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <MessageSquare size={18} /> AI 에이전트
                    </button>
                    <button
                        onClick={() => setMode("search")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${mode === 'search' ? 'bg-white text-orange-600 shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Search size={18} /> 지식 검색
                    </button>
                </div>
            </div>

            {/* 검색창 섹션 */}
            <div className={`relative bg-white rounded-[2.5rem] shadow-2xl transition-all duration-500 border-2 ${isLoading ? 'border-orange-200' : 'border-gray-50'}`}>
                <form onSubmit={handleAsk} className="p-3 flex items-center gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={mode === 'ask' ? "지식베이스나 웹 검색에 대해 물어보세요..." : "유사한 지식 조각을 찾을 키워드를 입력하세요..."}
                            className="w-full border-none p-6 pl-16 rounded-[2rem] text-xl focus:ring-0 bg-transparent placeholder-gray-300 font-medium text-gray-800"
                        />
                        <div className={`absolute left-7 top-1/2 -translate-y-1/2 transition-colors ${isLoading ? 'text-orange-500' : 'text-gray-400'}`}>
                            {mode === 'ask' ? <Sparkles size={28} /> : <Search size={28} />}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="bg-gray-900 hover:bg-orange-600 text-white p-5 rounded-[1.75rem] transition-all active:scale-95 disabled:opacity-30 disabled:grayscale shadow-xl hover:shadow-orange-200 group"
                    >
                        {isLoading ? (
                            <div className="w-8 h-8 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <ChevronRight size={32} className="group-hover:translate-x-0.5 transition-transform" />
                        )}
                    </button>
                </form>
            </div>

            {error && (
                <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-700 animate-in slide-in-from-top-4 duration-500">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="font-bold">연결 분석 오류</p>
                        <p className="text-sm opacity-80">{error}</p>
                    </div>
                </div>
            )}

            {/* AI 답변 영역 */}
            {mode === 'ask' && answer && (
                <div className="mt-16 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    {/* 도구 실행 로그 */}
                    {toolLogs && toolLogs.length > 0 && (
                        <section className="bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <Search className="text-white" size={120} />
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                                    <Clock size={16} />
                                </div>
                                <h4 className="text-lg font-bold text-white">에이전트 실행 로그 (Tool Activity)</h4>
                            </div>
                            <div className="space-y-4">
                                {toolLogs.map((log: ToolLog, idx: number) => (
                                    <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-orange-400 font-mono text-xs">
                                                CALL
                                            </div>
                                            <div>
                                                <p className="text-white font-bold">{log.tool}({JSON.stringify(log.args)})</p>
                                                <p className="text-gray-500 text-xs mt-1">AI가 정확한 판단을 위해 내부 도구를 호출했습니다.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-0.5 w-8 bg-white/10"></div>
                                            <div className="bg-orange-600/20 text-orange-400 px-4 py-2 rounded-xl text-sm font-black border border-orange-600/30">
                                                RESULT: {log.result}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-2xl">
                                <Sparkles size={24} fill="white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">AI 에이전트 인텔리전스</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Hybrid Knowledge Integration</p>
                            </div>
                        </div>
                        
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/30 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full"></div>
                            <div className="relative text-gray-800 leading-[1.8] text-xl whitespace-pre-wrap font-medium">
                                {answer}
                            </div>
                        </div>
                    </section>

                    {/* 구글 검색 출처 */}
                    {googleSources && googleSources.length > 0 && (
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                            <div className="flex items-center gap-2 mb-6">
                                <Globe size={18} className="text-blue-500" />
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">실시간 웹 검색 소스</h4>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {googleSources.map((source: GoogleSource, idx: number) => (
                                    <a 
                                        key={idx}
                                        href={source.url}
                                        target="_blank"
                                        className="inline-flex items-center gap-2.5 bg-white border border-gray-100 px-5 py-3 rounded-2xl text-sm font-bold text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-lg transition-all group"
                                    >
                                        <div className="w-6 h-6 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <Globe size={12} />
                                        </div>
                                        <span className="max-w-[200px] truncate">{source.title}</span>
                                        <ExternalLink size={14} className="opacity-30 group-hover:opacity-100" />
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}

            {/* 지식 근거 리스트 */}
            {results !== null && (
                <div className={`mt-20 animate-in fade-in slide-in-from-bottom-8 duration-700 ${answer ? 'delay-500' : ''}`}>
                    <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                                <BookOpen size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {mode === 'ask' ? '지식베이스 인용' : '유사 문서 매칭'}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold text-gray-400 border border-gray-100">
                            <Filter size={14} />
                            MATCHED NODES: {results.length}
                        </div>
                    </div>

                    {results.length === 0 ? (
                        <div className="text-center bg-gray-50 py-32 rounded-[3.5rem] border-4 border-dashed border-gray-100">
                            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-gray-200 shadow-inner">
                                <BookOpen size={48} />
                            </div>
                            <p className="text-xl font-bold text-gray-400">학습된 지식베이스에서 정보를 찾지 못했습니다.</p>
                            <p className="text-gray-400 mt-2">이 경우 AI는 웹 검색 결과를 바탕으로 답변을 구성합니다.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8">
                            {results.map((item: SearchResult, index: number) => (
                                <div 
                                    key={item.chunk_id} 
                                    className="group bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-2xl hover:border-orange-100 transition-all duration-500 overflow-hidden relative"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] -rotate-12 translate-x-4 -translate-y-4 group-hover:rotate-0 group-hover:scale-125 transition-all duration-700">
                                        <BookOpen size={160} />
                                    </div>
                                    
                                    <div className="relative">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 bg-gray-50 group-hover:bg-orange-600 group-hover:text-white text-gray-300 rounded-3xl flex items-center justify-center font-black text-2xl transition-all duration-300 shadow-inner">
                                                    {(index + 1).toString().padStart(2, '0')}
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{item.filename}</h4>
                                                    <div className="flex items-center gap-4 text-[11px] text-gray-400 mt-1.5 font-bold uppercase tracking-wider">
                                                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-orange-300" /> Chunk #{item.chunk_index}</span>
                                                        <span className="w-1.5 h-1.5 bg-gray-100 rounded-full"></span>
                                                        <span>ID: {item.chunk_id}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2 bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-black text-orange-600 italic">{(item.similarity * 100).toFixed(1)}%</span>
                                                    <div className="w-32 h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                                        <div 
                                                            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-lg transition-all duration-1000 ease-out" 
                                                            style={{ width: `${item.similarity * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">Context Relevance</span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-8 rounded-[2rem] text-gray-700 text-lg leading-relaxed group-hover:bg-orange-50/30 transition-colors border-l-[6px] border-orange-200 font-medium">
                                            "{item.content}"
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
