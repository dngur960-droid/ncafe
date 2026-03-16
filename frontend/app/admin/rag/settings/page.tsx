"use client";

import { useState, useEffect } from "react";
import { Settings, Layers, Search, Save, Info, RefreshCw, Sliders, Target } from "lucide-react";
import styles from "./settings.module.css";

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
        <div className={styles.loadingState}>
            <RefreshCw size={48} className={styles.loadingIcon} />
            <p className={styles.loadingText}>RAG 엔진 설정을 불러오는 중...</p>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <h1 className={styles.title}>
                    <Settings className={styles.titleIcon} size={24} />
                    RAG 시스템 엔진 설정
                </h1>
                <p className={styles.subtitle}>지식 추출 및 검색 알고리즘의 세부 파라미터를 조정하여 답변의 정확도를 높입니다.</p>
            </div>

            <form onSubmit={handleSave} className={styles.settingsForm}>
                {/* 청킹 파라미터 그룹 */}
                <div className={styles.settingGroup}>
                    <div className={styles.groupHeader}>
                        <div className={`${styles.groupIconWrapper} ${styles.groupIconOrange}`}>
                            <Layers size={20} />
                        </div>
                        <div>
                            <h2 className={styles.groupTitle}>문서 처리 가공 (Chunking)</h2>
                            <p className={styles.groupSubtitle}>문서를 어떤 단위로 쪼개어 학습시킬지 결정합니다.</p>
                        </div>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.fieldWrapper}>
                            <div className={styles.fieldLabelRow}>
                                <label className={styles.fieldLabel}>청크 크기</label>
                                <span className={`${styles.fieldBadge} ${styles.fieldBadgeOrange}`}>Characters</span>
                            </div>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="number"
                                    name="chunk_size"
                                    value={settings.chunk_size}
                                    onChange={handleChange}
                                    className={styles.input}
                                    min="100" max="2000" required
                                />
                                <div className={styles.inputIcon}>
                                    <Sliders size={18} />
                                </div>
                            </div>
                            <div className={styles.fieldHelper}>
                                <Info size={14} className={styles.fieldHelperIcon} />
                                <p className={styles.fieldHelperText}>한 번에 쪼갤 문단 크기. 너무 작으면 문맥이 끊기고, 너무 크면 검색 정확도가 낮아질 수 있습니다. (권장: 500~800자)</p>
                            </div>
                        </div>

                        <div className={styles.fieldWrapper}>
                            <div className={styles.fieldLabelRow}>
                                <label className={styles.fieldLabel}>오버랩 크기</label>
                                <span className={`${styles.fieldBadge} ${styles.fieldBadgeOrange}`}>Characters</span>
                            </div>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="number"
                                    name="chunk_overlap"
                                    value={settings.chunk_overlap}
                                    onChange={handleChange}
                                    className={styles.input}
                                    min="0" max="500" required
                                />
                                <div className={styles.inputIcon}>
                                    <RefreshCw size={18} />
                                </div>
                            </div>
                            <div className={styles.fieldHelper}>
                                <Info size={14} className={styles.fieldHelperIcon} />
                                <p className={styles.fieldHelperText}>문맥 유지를 위해 앞뒤 청크와 겹칠 글자 수입니다. 정보 누락을 방지합니다. (권장: 50~150자)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 검색 파라미터 그룹 */}
                <div className={styles.settingGroup}>
                    <div className={styles.groupHeader}>
                        <div className={`${styles.groupIconWrapper} ${styles.groupIconBlue}`}>
                            <Search size={20} />
                        </div>
                        <div>
                            <h2 className={styles.groupTitle}>벡터 검색 조건 (Retrieval)</h2>
                            <p className={styles.groupSubtitle}>질문과 얼마나 닮은 지식을 찾을지 결정합니다.</p>
                        </div>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.fieldWrapper}>
                            <div className={styles.fieldLabelRow}>
                                <label className={styles.fieldLabel}>검색 결과 수 (Top-K)</label>
                                <span className={`${styles.fieldBadge} ${styles.fieldBadgeBlue}`}>Nodes</span>
                            </div>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="number"
                                    name="top_k"
                                    value={settings.top_k}
                                    onChange={handleChange}
                                    className={styles.input}
                                    min="1" max="10" required
                                />
                                <div className={styles.inputIcon}>
                                    <Target size={18} />
                                </div>
                            </div>
                            <div className={styles.fieldHelper}>
                                <Info size={14} className={styles.fieldHelperIcon} />
                                <p className={styles.fieldHelperText}>가장 유사한 파편을 최대 몇 개까지 참조할지 지정합니다. (권장: 3~5)</p>
                            </div>
                        </div>

                        <div className={styles.fieldWrapper}>
                            <div className={styles.fieldLabelRow}>
                                <label className={styles.fieldLabel}>최소 유사도 임계값</label>
                                <span className={`${styles.fieldBadge} ${styles.fieldBadgeBlue}`}>Score (0~1)</span>
                            </div>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="number"
                                    step="0.05"
                                    name="similarity_threshold"
                                    value={settings.similarity_threshold}
                                    onChange={handleChange}
                                    className={styles.input}
                                    min="0.1" max="0.95" required
                                />
                                <div className={styles.inputIcon}>
                                    <Sliders size={18} />
                                </div>
                            </div>
                            <div className={styles.fieldHelper}>
                                <Info size={14} className={styles.fieldHelperIcon} />
                                <p className={styles.fieldHelperText}>이 점수 미만의 부적절한 탐색 결과는 무시합니다. (권장: 0.65~0.75)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 하단 저장 버튼 */}
                <div className={styles.actions}>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={styles.saveButton}
                    >
                        {isSaving ? (
                            <>
                                <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
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
