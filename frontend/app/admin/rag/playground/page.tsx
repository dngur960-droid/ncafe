"use client";

import { useState } from "react";
import { Search, MessageSquare, ChevronRight, BookOpen, Clock, AlertCircle, Globe, ExternalLink, Sparkles, Filter } from "lucide-react";
import styles from "./playground.module.css";

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
        <div className={styles.container}>
            {/* 헤더 섹션 */}
            <div className={styles.pageHeader}>
                <div>
                    <div className={styles.titleWrapper}>
                        <span className={styles.experimentalTag}>Experimental</span>
                        <h1 className={styles.title}>지식 플레이그라운드</h1>
                    </div>
                    <p className={styles.subtitle}>사내 문서(RAG)와 실시간 웹(Google)을 결합한 하이브리드 AI 에이전트입니다.</p>
                </div>
                
                <div className={styles.modeSelector}>
                    <button
                        onClick={() => setMode("ask")}
                        className={`${styles.modeButton} ${mode === 'ask' ? styles.modeButtonActive : ''}`}
                    >
                        <MessageSquare size={16} /> AI 답변
                    </button>
                    <button
                        onClick={() => setMode("search")}
                        className={`${styles.modeButton} ${mode === 'search' ? styles.modeButtonActive : ''}`}
                    >
                        <Search size={16} /> 지식 검색
                    </button>
                </div>
            </div>

            {/* 검색창 섹션 */}
            <div className={`${styles.searchContainer} ${isLoading ? styles.searchContainerLoading : ''}`}>
                <form onSubmit={handleAsk} className={styles.searchForm}>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={mode === 'ask' ? "지식베이스나 웹 검색에 대해 물어보세요..." : "유사한 지식 조각을 찾을 키워드를 입력하세요..."}
                            className={styles.searchInput}
                        />
                        <div className={`${styles.searchIcon} ${isLoading ? styles.searchIconLoading : ''}`}>
                            {mode === 'ask' ? <Sparkles size={20} /> : <Search size={20} />}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className={styles.submitButton}
                    >
                        {isLoading ? (
                            <div className={styles.spinner}></div>
                        ) : (
                            <ChevronRight size={24} />
                        )}
                    </button>
                </form>
            </div>

            {error && (
                <div className={styles.errorBox}>
                    <div className={styles.errorIcon}>
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className={styles.errorTitle}>연결 분석 오류</p>
                        <p className={styles.errorMessage}>{error}</p>
                    </div>
                </div>
            )}

            {/* AI 답변 영역 */}
            {mode === 'ask' && answer && (
                <div className={styles.section}>
                    {/* 도구 실행 로그 */}
                    {toolLogs && toolLogs.length > 0 && (
                        <section className={styles.toolLogsSection}>
                            <div className={styles.toolLogsHeader}>
                                <div className={styles.toolLogsIcon}>
                                    <Clock size={16} />
                                </div>
                                <h4 className={styles.toolLogsTitle}>에이전트 실행 로그 (Tool Activity)</h4>
                            </div>
                            <div className={styles.toolLogList}>
                                {toolLogs.map((log: ToolLog, idx: number) => (
                                    <div key={idx} className={styles.toolLogItem}>
                                        <div className={styles.toolLogInfo}>
                                            <div className={styles.toolLogBadge}>
                                                CALL
                                            </div>
                                            <div>
                                                <p className={styles.toolLogCall}>{log.tool}({JSON.stringify(log.args)})</p>
                                                <p className={styles.toolLogDesc}>AI 툴백엔드 호출 이력</p>
                                            </div>
                                        </div>
                                        <div className={styles.toolLogResultWrapper}>
                                            <div className={styles.toolLogLine}></div>
                                            <div className={styles.toolLogResult}>
                                                RESULT: {log.result}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className={styles.section}>
                        <div className={styles.answerHeader}>
                            <div className={styles.answerIcon}>
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h3 className={styles.answerTitle}>AI 에이전트 답변</h3>
                                <p className={styles.answerSubtitle}>Hybrid Knowledge Analysis</p>
                            </div>
                        </div>
                        
                        <div className={styles.answerCard}>
                            {answer}
                        </div>
                    </section>

                    {/* 구글 검색 출처 */}
                    {googleSources && googleSources.length > 0 && (
                        <section className={styles.googleSourcesSection}>
                            <div className={styles.googleSourcesHeader}>
                                <Globe size={18} style={{ color: '#3b82f6' }} />
                                <h4 className={styles.googleSourcesTitle}>실시간 웹 검색 소스</h4>
                            </div>
                            <div className={styles.googleSourcesList}>
                                {googleSources.map((source: GoogleSource, idx: number) => (
                                    <a 
                                        key={idx}
                                        href={source.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.googleSourceItem}
                                    >
                                        <div className={styles.googleSourceIcon}>
                                            <Globe size={12} />
                                        </div>
                                        <span className={styles.googleSourceTitle}>{source.title}</span>
                                        <ExternalLink size={14} className={styles.googleSourceLinkIcon} />
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}

            {/* 지식 근거 리스트 */}
            {results !== null && (
                <div className={styles.section}>
                    <div className={styles.matchesHeader}>
                        <div className={styles.matchesTitleWrapper}>
                            <BookOpen size={18} style={{ color: 'var(--color-primary)' }} />
                            <h3 className={styles.matchesTitle}>
                                {mode === 'ask' ? '지식베이스 인용' : '유사 문서 매칭'}
                            </h3>
                        </div>
                        <div className={styles.matchesCount}>
                            <Filter size={12} />
                            MATCHED: {results.length}
                        </div>
                    </div>

                    {results.length === 0 ? (
                        <div className={styles.matchesEmpty}>
                            <div className={styles.matchesEmptyIcon}>
                                <BookOpen size={32} />
                            </div>
                            <p className={styles.matchesEmptyTitle}>지식베이스에서 정보를 찾지 못했습니다.</p>
                            <p className={styles.matchesEmptyDesc}>이 경우 AI는 웹 검색 결과를 추가로 활용합니다.</p>
                        </div>
                    ) : (
                        <div className={styles.matchesList}>
                            {results.map((item: SearchResult, index: number) => (
                                <div key={item.chunk_id} className={styles.matchCard}>
                                    <div className={styles.matchCardHeader}>
                                        <div className={styles.matchCardInfo}>
                                            <div className={styles.matchCardIndex}>
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                            <div>
                                                <h4 className={styles.matchCardFilename}>{item.filename}</h4>
                                                <div className={styles.matchCardMeta}>
                                                    <span>Chunk #{item.chunk_index}</span>
                                                    <span className={styles.matchCardDot}></span>
                                                    <span>Ref: {item.chunk_id}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.matchCardSim}>
                                            <div className={styles.matchCardSimBar}>
                                                <div 
                                                    className={styles.matchCardSimFill} 
                                                    style={{ width: `${item.similarity * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className={styles.matchCardSimText}>
                                                {(item.similarity * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.matchCardContent}>
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
