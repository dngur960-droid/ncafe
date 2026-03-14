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
        <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">📁 RAG 지식베이스 관리</h1>
                    <p className="text-gray-500">AI가 학습할 문서를 업로드하고 가공 상태를 모니터링합니다.</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-gray-600">FastAPI 엔진 연결됨</span>
                </div>
            </div>

            {/* 업로드 카드 */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Upload size={120} />
                </div>
                
                <div className="relative">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-1">새로운 지식 등록</h2>
                        <p className="text-gray-400 text-sm">PDF, DOCX, TXT 형식을 지원합니다.</p>
                    </div>
                    
                    <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 group">
                            <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-orange-400 hover:bg-orange-50/30 rounded-2xl p-6 transition-all cursor-pointer h-full">
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    accept=".pdf,.docx,.txt"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    required
                                />
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-600 rounded-xl flex items-center justify-center transition-colors">
                                        <Upload size={24} />
                                    </div>
                                    <span className="text-gray-600 font-medium truncate max-w-[200px]">
                                        {file ? file.name : "파일을 선택하거나 드래그하세요"}
                                    </span>
                                </div>
                            </label>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading || !file}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-2xl font-bold shadow-lg shadow-orange-200 disabled:opacity-50 transition-all active:scale-95 whitespace-nowrap flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw size={20} className="animate-spin" />
                                    <span>분석 및 임베딩 중...</span>
                                </>
                            ) : (
                                <>
                                    <FilePlusIcon size={20} />
                                    <span>지식 추가하기</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* 문서 리스트 섹션 */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <FileText size={20} className="text-orange-600" />
                        학습된 문서 목록
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 py-1 bg-white rounded-full border border-gray-100">
                            Total: {documents.length}
                        </span>
                        <button 
                            onClick={() => fetchDocuments(true)}
                            className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-orange-600"
                        >
                            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white">
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-tighter">문서 정보</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-tighter text-center">지식 조각</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-tighter text-center">가공 상태</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-tighter">등록일</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-tighter text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {documents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <FileText size={64} />
                                            <p className="text-xl font-bold">등록된 문서가 없습니다.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                documents.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-orange-50/20 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm border
                                                    ${doc.file_type === 'pdf' ? 'bg-red-50 text-red-600 border-red-100' : 
                                                      doc.file_type === 'txt' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                                      'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                    <FileType size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{doc.filename}</div>
                                                    <div className="text-xs text-gray-400 font-mono uppercase tracking-tighter">{doc.file_type} format</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className="font-mono font-bold text-gray-700 bg-gray-100 px-4 py-1.5 rounded-xl border border-gray-200">
                                                {doc.chunk_count.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="p-6 text-center">
                                            {doc.status === 'completed' ? (
                                                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
                                                    <CheckCircle size={14} />
                                                    학습 완료
                                                </div>
                                            ) : doc.status === 'processing' ? (
                                                <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-100 animate-pulse">
                                                    <RefreshCw size={14} className="animate-spin" />
                                                    가공 중
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-xs font-bold border border-red-100">
                                                    <AlertCircle size={14} />
                                                    처리 실패
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <div className="text-sm font-medium text-gray-600">{new Date(doc.created_at).toLocaleDateString()}</div>
                                            <div className="text-[10px] text-gray-400">{new Date(doc.created_at).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <button
                                                onClick={() => handleDelete(doc.id)}
                                                className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                title="문서 삭제"
                                            >
                                                <Trash2 size={20} />
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
