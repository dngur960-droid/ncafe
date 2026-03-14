"use client";

import { useState, useEffect } from "react";
import { Settings, Layers, Search, Save, Info, RefreshCw, Sliders, Target } from "lucide-react";

interface RagSettings {
    chunk_size: string;
    chunk_overlap: string;
    top_k: string;
    similarity_threshold: string;
}

export default function RagSettingsPage() {
    const [settings, setSettings] = useState<RagSettings>({
        chunk_size: "500",
        chunk_overlap: "100",
        top_k: "3",
        similarity_threshold: "0.7",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const RAG_API_URL = "/api/rag";

    useEffect(() => {
        fetch(`${RAG_API_URL}/settings`)
            .then((res) => res.json())
            .then((data) => {
                setSettings(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("설정 불러오기 실패:", err);
                setIsLoading(false);
            });
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const res = await fetch(`${RAG_API_URL}/settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                alert("설정이 성공적으로 저장되었습니다.");
            } else {
                alert("저장 중 오류가 발생했습니다.");
            }
        } catch (err) {
            console.error(err);
            alert("백엔드 서버에 접근할 수 없습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({
            ...settings,
            [e.target.name]: e.target.value
        });
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-32 opacity-50 animate-pulse">
            <RefreshCw size={48} className="animate-spin text-orange-600 mb-6" />
            <p className="text-xl font-bold text-gray-600">RAG 엔진 설정을 불러오는 중...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-700">
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <Settings className="text-gray-400" />
                    RAG 시스템 엔진 설정
                </h1>
                <p className="text-gray-500">지식 추출 및 검색 알고리즘의 세부 파라미터를 조정하여 답변의 정확도를 높입니다.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-10">
                {/* 청킹 파라미터 그룹 */}
                <div className="group bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 transition-all hover:border-orange-200">
                    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                        <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-[1.25rem] flex items-center justify-center shadow-inner">
                            <Layers size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">문서 처리 가공 (Chunking)</h2>
                            <p className="text-sm text-gray-400 font-medium">문서를 어떤 단위로 쪼개어 학습시킬지 결정합니다.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-lg font-bold text-gray-800">청크 크기</label>
                                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-tighter">Characters</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="chunk_size"
                                    value={settings.chunk_size}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-100 p-5 rounded-2xl focus:outline-none focus:border-orange-500 bg-gray-50 focus:bg-white transition-all font-mono text-xl"
                                    min="100" max="2000" required
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">
                                    <Sliders size={20} />
                                </div>
                            </div>
                            <div className="flex items-start gap-2 px-1">
                                <Info size={14} className="text-gray-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-gray-400 leading-relaxed">한 번에 쪼갤 문단 크기입니다. 너무 작으면 문맥이 끊기고, 너무 크면 검색 정확도가 낮아질 수 있습니다. (권장: 500~800자)</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-lg font-bold text-gray-800">오버랩 크기</label>
                                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-tighter">Characters</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="chunk_overlap"
                                    value={settings.chunk_overlap}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-100 p-5 rounded-2xl focus:outline-none focus:border-orange-500 bg-gray-50 focus:bg-white transition-all font-mono text-xl"
                                    min="0" max="500" required
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">
                                    <RefreshCw size={20} />
                                </div>
                            </div>
                            <div className="flex items-start gap-2 px-1">
                                <Info size={14} className="text-gray-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-gray-400 leading-relaxed">문맥 유지를 위해 앞뒤 청크와 겹칠 글자 수입니다. 정보 누락 방지를 위해 청크 크기의 10~20% 정도를 권장합니다.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 검색 파라미터 그룹 */}
                <div className="group bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 transition-all hover:border-orange-200">
                    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-[1.25rem] flex items-center justify-center shadow-inner">
                            <Search size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">벡터 검색 조건 (Retrieval)</h2>
                            <p className="text-sm text-gray-400 font-medium">질문과 얼마나 닮은 지식을 찾을지 결정합니다.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-lg font-bold text-gray-800">검색 결과 수 (Top-K)</label>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-tighter">Nodes</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="top_k"
                                    value={settings.top_k}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-100 p-5 rounded-2xl focus:outline-none focus:border-emerald-500 bg-gray-50 focus:bg-white transition-all font-mono text-xl"
                                    min="1" max="10" required
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">
                                    <Target size={20} />
                                </div>
                            </div>
                            <div className="flex items-start gap-2 px-1">
                                <Info size={14} className="text-gray-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-gray-400 leading-relaxed">가장 유사한 파편을 최대 몇 개까지 참조할지 지정합니다. 값이 클수록 답변이 풍부해지지만, 관련 없는 정보가 섞일 수 있습니다.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-lg font-bold text-gray-800">최소 유사도 임계값</label>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-tighter">Score (0~1)</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.05"
                                    name="similarity_threshold"
                                    value={settings.similarity_threshold}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-100 p-5 rounded-2xl focus:outline-none focus:border-emerald-500 bg-gray-50 focus:bg-white transition-all font-mono text-xl"
                                    min="0.1" max="0.95" required
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">
                                    <Sliders size={20} />
                                </div>
                            </div>
                            <div className="flex items-start gap-2 px-1">
                                <Info size={14} className="text-gray-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-gray-400 leading-relaxed">이 점수 미만의 부적절한 결과는 답변 생성 시 과감하게 배제합니다. (권장: 0.65~0.75)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 하단 저장 버튼 */}
                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-black text-white px-16 py-6 rounded-[2rem] text-xl font-bold hover:bg-orange-600 disabled:opacity-50 transition-all shadow-2xl hover:shadow-orange-200 active:scale-95 flex items-center gap-3"
                    >
                        {isSaving ? (
                            <>
                                <RefreshCw size={24} className="animate-spin" />
                                <span>설정 저장 중</span>
                            </>
                        ) : (
                            <>
                                <Save size={24} />
                                <span>엔진 설정 저장하기</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
