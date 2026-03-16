"use client";

import { useState, useEffect } from "react";
import { FileText, Upload, Trash2, CheckCircle, Clock, AlertCircle, RefreshCw, FileCode, FileType } from "lucide-react";

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
        <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
            <div className="flex justify-between items-end mb-8 border-b border-stone-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800 mb-1">지식베이스 (RAG) 관리</h1>
                    <p className="text-stone-500 text-sm md:text-base">AI가 학습할 문서를 업로드하고 가공 상태를 모니터링합니다.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-stone-600">FastAPI 연결됨</span>
                </div>
            </div>

            {/* 업로드 카드 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-100 mb-10 relative overflow-hidden transition-shadow hover:shadow-md">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                    <Upload size={120} />
                </div>
                
                <div className="relative">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-stone-800 mb-1">새로운 지식 등록</h2>
                        <p className="text-stone-500 text-sm">PDF, DOCX, TXT 형식을 지원합니다.</p>
                    </div>
                    
                    <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 align-stretch">
                        <div className="flex-1 group">
                            <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-stone-200 hover:border-orange-400 hover:bg-orange-50/50 rounded-2xl p-5 transition-all cursor-pointer h-full min-h-[5rem]">
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    accept=".pdf,.docx,.txt"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    required
                                />
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-stone-50 text-stone-400 group-hover:bg-orange-100 group-hover:text-orange-600 rounded-xl flex items-center justify-center transition-colors">
                                        <Upload size={20} />
                                    </div>
                                    <span className="text-stone-600 font-medium truncate max-w-[200px] text-sm md:text-base">
                                        {file ? file.name : "파일을 선택하거나 드래그하세요"}
                                    </span>
                                </div>
                            </label>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading || !file}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold shadow-sm shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 h-full min-h-[5rem]"
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw size={18} className="animate-spin" />
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
            </div>

            {/* 문서 리스트 섹션 */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <h3 className="text-base font-bold text-stone-800 flex items-center gap-2">
                        <FileText size={18} className="text-orange-500" />
                        학습된 문서 목록
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-stone-500 bg-white px-2.5 py-1 rounded-md border border-stone-200">
                            총 {documents.length}건
                        </span>
                        <button 
                            onClick={() => fetchDocuments(true)}
                            className="p-1.5 hover:bg-stone-200 rounded-md transition-colors text-stone-400 hover:text-stone-700"
                        >
                            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-stone-100">
                                <th className="p-4 text-xs font-semibold text-stone-500 bg-stone-50/30">문서명</th>
                                <th className="p-4 text-xs font-semibold text-stone-500 bg-stone-50/30 text-center">지식 청크</th>
                                <th className="p-4 text-xs font-semibold text-stone-500 bg-stone-50/30 text-center">진행 상태</th>
                                <th className="p-4 text-xs font-semibold text-stone-500 bg-stone-50/30 hidden md:table-cell">등록일시</th>
                                <th className="p-4 text-xs font-semibold text-stone-500 bg-stone-50/30 text-right">편집</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {documents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-stone-300">
                                            <FileText size={48} strokeWidth={1.5} />
                                            <p className="text-sm font-medium text-stone-500">등록된 문서가 없습니다.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                documents.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-stone-50/80 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold border
                                                    ${doc.file_type === 'pdf' ? 'bg-red-50 text-red-500 border-red-100' : 
                                                      doc.file_type === 'txt' ? 'bg-blue-50 text-blue-500 border-blue-100' : 
                                                      'bg-emerald-50 text-emerald-500 border-emerald-100'}`}>
                                                    <FileType size={18} />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <div className="font-semibold text-stone-700 text-sm truncate max-w-[200px] md:max-w-none group-hover:text-orange-600 transition-colors">{doc.filename}</div>
                                                    <div className="text-[11px] text-stone-400 font-medium uppercase mt-0.5">{doc.file_type} format</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="font-mono font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-md text-sm border border-stone-200">
                                                {doc.chunk_count.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {doc.status === 'completed' ? (
                                                <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-green-200">
                                                    <CheckCircle size={12} />
                                                    완료됨
                                                </div>
                                            ) : doc.status === 'processing' ? (
                                                <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-xs font-semibold border border-blue-200 animate-pulse">
                                                    <RefreshCw size={12} className="animate-spin" />
                                                    처리 중
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-1 rounded-md text-xs font-semibold border border-red-200">
                                                    <AlertCircle size={12} />
                                                    실패
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 hidden md:table-cell">
                                            <div className="text-sm text-stone-600">{new Date(doc.created_at).toLocaleDateString()}</div>
                                            <div className="text-xs text-stone-400 mt-0.5">{new Date(doc.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDelete(doc.id)}
                                                className="w-8 h-8 inline-flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
        </div>
    );
}

function FilePlusIcon({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15h6"/><path d="M12 12v6"/></svg>
    )
}
