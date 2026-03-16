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
        <div className="max-w-5xl mx-auto pb-24 animate-in fade-in duration-500">
            {/* 헤더 섹션 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-stone-200 pb-4 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest border border-orange-100">Experimental</span>
                        <h1 className="text-2xl font-bold text-stone-800">지식 플레이그라운드</h1>
                    </div>
                    <p className="text-stone-500 text-sm md:text-base">사내 문서(RAG)와 실시간 웹(Google)을 결합한 하이브리드 AI 에이전트입니다.</p>
                </div>
                
                <div className="flex bg-stone-50 p-1 rounded-xl border border-stone-200">
                    <button
                        onClick={() => setMode("ask")}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === 'ask' ? 'bg-white text-orange-600 shadow-sm border border-stone-100' : 'text-stone-500 hover:text-stone-700'}`}
                    >
                        <MessageSquare size={16} /> AI 답변
                    </button>
                    <button
                        onClick={() => setMode("search")}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === 'search' ? 'bg-white text-orange-600 shadow-sm border border-stone-100' : 'text-stone-500 hover:text-stone-700'}`}
                    >
                        <Search size={16} /> 지식 검색
                    </button>
                </div>
            </div>

            {/* 검색창 섹션 */}
            <div className={`relative bg-white rounded-2xl shadow-sm transition-all duration-300 border ${isLoading ? 'border-orange-200 ring-2 ring-orange-50' : 'border-stone-200 group-hover:border-stone-300'}`}>
                <form onSubmit={handleAsk} className="p-2 flex items-center gap-2">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={mode === 'ask' ? "지식베이스나 웹 검색에 대해 물어보세요..." : "유사한 지식 조각을 찾을 키워드를 입력하세요..."}
                            className="w-full border-none p-4 pl-12 rounded-xl text-sm md:text-base focus:ring-0 bg-transparent placeholder-stone-400 font-medium text-stone-800"
                        />
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isLoading ? 'text-orange-500' : 'text-stone-400'}`}>
                            {mode === 'ask' ? <Sparkles size={20} /> : <Search size={20} />}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="bg-stone-800 hover:bg-orange-500 text-white p-3 rounded-xl transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
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
                        <section className="bg-stone-800 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Search className="text-white" size={100} />
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                                    <Clock size={16} />
                                </div>
                                <h4 className="text-base font-bold text-white">에이전트 실행 로그 (Tool Activity)</h4>
                            </div>
                            <div className="space-y-3">
                                {toolLogs.map((log: ToolLog, idx: number) => (
                                    <div key={idx} className="bg-stone-700/50 border border-stone-600/50 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-stone-700 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 shrink-0 bg-stone-900/50 rounded-lg flex items-center justify-center text-orange-400 font-mono text-[10px] font-bold">
                                                CALL
                                            </div>
                                            <div>
                                                <p className="text-stone-100 font-bold text-sm md:text-base break-all">{log.tool}({JSON.stringify(log.args)})</p>
                                                <p className="text-stone-400 text-xs mt-1">AI 툴백엔드 호출 이력</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-14 md:ml-0">
                                            <div className="hidden md:block h-0.5 w-6 bg-stone-600"></div>
                                            <div className="bg-orange-900/30 text-orange-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-orange-800/50 truncate max-w-[200px] md:max-w-xs">
                                                RESULT: {log.result}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="pt-6">
                        <div className="flex items-center gap-3 mb-4 pl-2">
                            <div className="w-10 h-10 bg-stone-100 text-stone-800 rounded-xl flex items-center justify-center border border-stone-200">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-stone-800">AI 에이전트 답변</h3>
                                <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-widest">Hybrid Knowledge Analysis</p>
                            </div>
                        </div>
                        
                        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-50 blur-[80px] -translate-y-1/2 translate-x-1/2 rounded-full"></div>
                            <div className="relative text-stone-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap font-medium">
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
                <div className={`mt-16 animate-in fade-in slide-in-from-bottom-8 duration-700 ${answer ? 'delay-200' : ''}`}>
                    <div className="flex justify-between items-center mb-6 pl-2">
                        <div className="flex items-center gap-2">
                            <BookOpen size={18} className="text-orange-500" />
                            <h3 className="text-lg font-bold text-stone-800">
                                {mode === 'ask' ? '지식베이스 인용' : '유사 문서 매칭'}
                            </h3>
                        </div>
                        <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1 rounded-md text-[10px] font-bold text-stone-500 border border-stone-200 tracking-widest">
                            <Filter size={12} />
                            MATCHED: {results.length}
                        </div>
                    </div>

                    {results.length === 0 ? (
                        <div className="text-center bg-stone-50 py-20 rounded-3xl border border-dashed border-stone-200">
                            <div className="w-16 h-16 bg-white rounded-2xl flex justify-center items-center shadow-sm border border-stone-100 mx-auto mb-4 text-stone-300">
                                <BookOpen size={32} />
                            </div>
                            <p className="text-base font-semibold text-stone-500">지식베이스에서 정보를 찾지 못했습니다.</p>
                            <p className="text-sm text-stone-400 mt-1">이 경우 AI는 웹 검색 결과를 추가로 활용합니다.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {results.map((item: SearchResult, index: number) => (
                                <div 
                                    key={item.chunk_id} 
                                    className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all overflow-hidden relative"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner shrink-0 border border-orange-100">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className="text-base font-bold text-stone-800 truncate max-w-sm">{item.filename}</h4>
                                                <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-1 uppercase font-semibold">
                                                    <span>Chunk #{item.chunk_index}</span>
                                                    <span className="w-1 h-1 bg-stone-200 rounded-full"></span>
                                                    <span>Ref: {item.chunk_id}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 bg-stone-50 px-3 py-2 rounded-lg border border-stone-100 self-start md:self-auto shrink-0">
                                            <div className="w-24 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-orange-500 rounded-full" 
                                                    style={{ width: `${item.similarity * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-orange-600 min-w-[32px] text-right">
                                                {(item.similarity * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-stone-50/50 p-5 rounded-2xl text-stone-600 text-sm md:text-base leading-relaxed border-l-4 border-orange-200 font-medium">
                                        {item.content}
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
