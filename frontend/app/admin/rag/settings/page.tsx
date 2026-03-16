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
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
            <div className="mb-10 border-b border-stone-200 pb-4">
                <h1 className="text-2xl font-bold text-stone-800 mb-1 flex items-center gap-2">
                    <Settings className="text-stone-400" size={24} />
                    RAG 시스템 엔진 설정
                </h1>
                <p className="text-stone-500 text-sm lg:text-base">지식 추출 및 검색 알고리즘의 세부 파라미터를 조정하여 답변의 정확도를 높입니다.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* 청킹 파라미터 그룹 */}
                <div className="group bg-white p-8 rounded-3xl shadow-sm border border-stone-200 transition-all hover:border-orange-200">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stone-100">
                        <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center font-bold">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-stone-800">문서 처리 가공 (Chunking)</h2>
                            <p className="text-xs text-stone-500 font-medium">문서를 어떤 단위로 쪼개어 학습시킬지 결정합니다.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-stone-700">청크 크기</label>
                                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md uppercase">Characters</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="chunk_size"
                                    value={settings.chunk_size}
                                    onChange={handleChange}
                                    className="w-full border border-stone-200 p-3.5 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 bg-stone-50/50 hover:bg-white transition-all font-mono text-base"
                                    min="100" max="2000" required
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400">
                                    <Sliders size={18} />
                                </div>
                            </div>
                            <div className="flex items-start gap-1.5 px-1">
                                <Info size={14} className="text-stone-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-stone-500 leading-relaxed">한 번에 쪼갤 문단 크기. 너무 작으면 문맥이 끊기고, 너무 크면 검색 정확도가 낮아질 수 있습니다. (권장: 500~800자)</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-stone-700">오버랩 크기</label>
                                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md uppercase">Characters</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="chunk_overlap"
                                    value={settings.chunk_overlap}
                                    onChange={handleChange}
                                    className="w-full border border-stone-200 p-3.5 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 bg-stone-50/50 hover:bg-white transition-all font-mono text-base"
                                    min="0" max="500" required
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400">
                                    <RefreshCw size={18} />
                                </div>
                            </div>
                            <div className="flex items-start gap-1.5 px-1">
                                <Info size={14} className="text-stone-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-stone-500 leading-relaxed">문맥 유지를 위해 앞뒤 청크와 겹칠 글자 수입니다. 정보 누락을 방지합니다. (권장: 50~150자)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 검색 파라미터 그룹 */}
                <div className="group bg-white p-8 rounded-3xl shadow-sm border border-stone-200 transition-all hover:border-orange-200">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stone-100">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center font-bold">
                            <Search size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-stone-800">벡터 검색 조건 (Retrieval)</h2>
                            <p className="text-xs text-stone-500 font-medium">질문과 얼마나 닮은 지식을 찾을지 결정합니다.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-stone-700">검색 결과 수 (Top-K)</label>
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase">Nodes</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="top_k"
                                    value={settings.top_k}
                                    onChange={handleChange}
                                    className="w-full border border-stone-200 p-3.5 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-stone-50/50 hover:bg-white transition-all font-mono text-base"
                                    min="1" max="10" required
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400">
                                    <Target size={18} />
                                </div>
                            </div>
                            <div className="flex items-start gap-1.5 px-1">
                                <Info size={14} className="text-stone-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-stone-500 leading-relaxed">가장 유사한 파편을 최대 몇 개까지 참조할지 지정합니다. (권장: 3~5)</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-stone-700">최소 유사도 임계값</label>
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase">Score (0~1)</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.05"
                                    name="similarity_threshold"
                                    value={settings.similarity_threshold}
                                    onChange={handleChange}
                                    className="w-full border border-stone-200 p-3.5 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-stone-50/50 hover:bg-white transition-all font-mono text-base"
                                    min="0.1" max="0.95" required
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400">
                                    <Sliders size={18} />
                                </div>
                            </div>
                            <div className="flex items-start gap-1.5 px-1">
                                <Info size={14} className="text-stone-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-stone-500 leading-relaxed">이 점수 미만의 부적절한 탐색 결과는 무시합니다. (권장: 0.65~0.75)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 하단 저장 버튼 */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-stone-800 text-white px-10 py-3.5 rounded-2xl text-base font-bold hover:bg-orange-500 disabled:opacity-50 transition-all shadow-sm hover:shadow-orange-200 active:scale-95 flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <RefreshCw size={18} className="animate-spin" />
                                <span>저장 중...</span>
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                <span>설정 저장하기</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
