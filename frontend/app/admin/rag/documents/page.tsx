"use client";

import { useState, useEffect } from "react";
import { FileText, Upload, Trash2, CheckCircle, AlertCircle, RefreshCw, FileType } from "lucide-react";
import styles from "./documents.module.css";

// 타입 정의
interface RagDocument {
    id: number;
    filename: string;
    file_type: string;
    status: string;
    chunk_count: number;
    created_at: string;
}

export default function RagDocumentsPage() {
    const [documents, setDocuments] = useState<RagDocument[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [file, setFile] = useState<File | null>(null);

    // BFF(Backend For Frontend) 프록시 경로 사용
    const RAG_API_URL = "/api/rag";

    // 목록 불러오기
    const fetchDocuments = async (showLoading = false) => {
        if (showLoading) setIsFetching(true);
        try {
            const res = await fetch(`${RAG_API_URL}/documents`);
            if (res.ok) {
                const data = await res.json();
                setDocuments(data);
            }
        } catch (err) {
            console.error("문서 목록을 불러오는 중 오류 발생:", err);
        } finally {
            if (showLoading) setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchDocuments(true);
        // 5초마다 새로고침 (백그라운드 처리 현황 확인용)
        const interval = setInterval(fetchDocuments, 5000);
        return () => clearInterval(interval);
    }, []);

    // 파일 업로드 처리
    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${RAG_API_URL}/documents`, {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                setFile(null);
                (e.target as HTMLFormElement).reset();
                fetchDocuments();
            } else {
                alert("업로드 중 오류가 발생했습니다.");
            }
        } catch (err) {
            console.error(err);
            alert("서버 연결에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 문서 삭제 처리
    const handleDelete = async (id: number) => {
        if (!confirm("이 문서와 관련된 모든 벡터(청크) 정보가 삭제됩니다.\n계속하시겠습니까?")) return;

        try {
            const res = await fetch(`${RAG_API_URL}/documents/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchDocuments();
            }
        } catch (err) {
            console.error(err);
            alert("삭제 실패");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>지식베이스 (RAG) 관리</h1>
                    <p className={styles.subtitle}>AI가 학습할 문서를 업로드하고 가공 상태를 모니터링합니다.</p>
                </div>
                <div className={styles.statusBadge}>
                    <div className={styles.statusIndicator}></div>
                    <span className={styles.statusText}>FastAPI 연결됨</span>
                </div>
            </div>

            {/* 업로드 카드 */}
            <div className={styles.uploadCard}>
                <div>
                    <h2 className={styles.sectionTitle}>새로운 지식 등록</h2>
                    <p className={styles.sectionSubtitle}>PDF, DOCX, TXT 형식을 지원합니다.</p>
                </div>
                
                <form onSubmit={handleUpload} className={styles.uploadForm}>
                    <label className={styles.fileInputLabel}>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            accept=".pdf,.docx,.txt"
                            required
                            style={{ display: 'none' }}
                        />
                        <div className={styles.fileInputContent}>
                            <div className={styles.fileInputIcon}>
                                <Upload size={20} />
                            </div>
                            <span className={styles.fileName}>
                                {file ? file.name : "파일을 선택하거나 드래그하세요"}
                            </span>
                        </div>
                    </label>
                    
                    <button
                        type="submit"
                        disabled={isLoading || !file}
                        className={styles.uploadButton}
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                                <span>처리 중...</span>
                            </>
                        ) : (
                            <>
                                <FilePlusIcon size={18} />
                                <span>지식 추가하기</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* 문서 리스트 섹션 */}
            <div className={styles.listCard}>
                <div className={styles.listHeader}>
                    <h3 className={styles.listTitle}>
                        <FileText size={18} style={{ color: 'var(--color-primary)' }} />
                        학습된 문서 목록
                    </h3>
                    <div className={styles.listActions}>
                        <span className={styles.totalCount}>
                            총 {documents.length}건
                        </span>
                        <button 
                            onClick={() => fetchDocuments(true)}
                            className={styles.refreshButton}
                        >
                            <RefreshCw size={16} style={isFetching ? { animation: 'spin 1s linear infinite' } : {}} />
                        </button>
                    </div>
                </div>
                
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>문서명</th>
                                <th style={{ textAlign: 'center' }}>지식 청크</th>
                                <th style={{ textAlign: 'center' }}>진행 상태</th>
                                <th>등록일시</th>
                                <th style={{ textAlign: 'right' }}>편집</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <div className={styles.emptyState}>
                                            <FileText size={48} strokeWidth={1.5} />
                                            <p>등록된 문서가 없습니다.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                documents.map((doc) => (
                                    <tr key={doc.id} className={styles.dataRow}>
                                        <td>
                                            <div className={styles.docInfo}>
                                                <div className={`${styles.docIcon} ${doc.file_type === 'pdf' ? styles.pdfIcon : doc.file_type === 'txt' ? styles.txtIcon : styles.defaultIcon}`}>
                                                    <FileType size={18} />
                                                </div>
                                                <div>
                                                    <div className={styles.docName}>{doc.filename}</div>
                                                    <div className={styles.docFormat}>{doc.file_type} format</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className={styles.chunkBadge}>
                                                {doc.chunk_count.toLocaleString()}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {doc.status === 'completed' ? (
                                                <div className={styles.statusCompleted}>
                                                    <CheckCircle size={12} />
                                                    완료됨
                                                </div>
                                            ) : doc.status === 'processing' ? (
                                                <div className={styles.statusProcessing}>
                                                    <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />
                                                    처리 중
                                                </div>
                                            ) : (
                                                <div className={styles.statusFailed}>
                                                    <AlertCircle size={12} />
                                                    실패
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div className={styles.dateText}>{new Date(doc.created_at).toLocaleDateString()}</div>
                                            <div className={styles.timeText}>{new Date(doc.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleDelete(doc.id)}
                                                className={styles.deleteBtn}
                                                title="삭제"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <style jsx global>{`
                @keyframes spin {
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

function FilePlusIcon({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15h6"/><path d="M12 12v6"/></svg>
    )
}
