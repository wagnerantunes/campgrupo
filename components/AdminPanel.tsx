import React, { useState, useEffect } from 'react';
import API_URL, { UPLOAD_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface AdminPanelProps {
    onClose: () => void;
    onSave: (newConfig: any) => Promise<void>;
    currentConfig: any;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onSave, currentConfig }) => {
    const { token, logout } = useAuth();
    const [tempConfig, setTempConfig] = useState(currentConfig);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'config' | 'leads'>('config');
    const [leads, setLeads] = useState<any[]>([]);

    useEffect(() => {
        if (activeTab === 'leads') {
            fetchLeads();
        }
    }, [activeTab]);

    const fetchLeads = async () => {
        try {
            const response = await fetch(`${API_URL}/leads`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setLeads(data);
            } else {
                toast.error('Erro ao carregar leads');
            }
        } catch (error) {
            console.error(error);
            toast.error('Erro de conexão');
        }
    };

    const handleUpdate = (path: string, value: string) => {
        const keys = path.split('.');
        const newConfig = { ...tempConfig };
        let current = newConfig;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setTempConfig({ ...newConfig });
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, path: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const loadingToast = toast.loading('Enviando imagem...');
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });
            const data = await response.json();
            if (data.url) {
                handleUpdate(path, data.url);
                toast.success('Imagem atualizada!', { id: loadingToast });
            } else {
                toast.error('Erro no upload', { id: loadingToast });
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Erro ao subir imagem', { id: loadingToast });
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        const loadingToast = toast.loading('Salvando alterações...');
        try {
            await onSave(tempConfig);
            toast.success('Site atualizado com sucesso!', { id: loadingToast });
            onClose();
        } catch (error) {
            toast.error('Erro ao salvar', { id: loadingToast });
        }
    };

    const handleLogout = () => {
        logout();
        onClose();
        toast.success('Logout realizado');
    };

    return (
        <div className="fixed inset-0 z-[100] bg-white overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-navy-blue text-white p-4 shadow-md z-10 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-black tracking-wider">PAINEL ADMINISTRATIVO</h1>
                    <div className="flex bg-navy-light/30 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('config')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'config' ? 'bg-white text-navy-blue shadow-sm' : 'text-white/70 hover:text-white'}`}
                        >
                            Conteúdo do Site
                        </button>
                        <button
                            onClick={() => setActiveTab('leads')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'leads' ? 'bg-white text-navy-blue shadow-sm' : 'text-white/70 hover:text-white'}`}
                        >
                            Leads (Contatos)
                            {/* Badge count could go here */}
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleLogout} className="px-4 py-2 hover:bg-white/10 rounded-lg text-sm font-bold text-red-300">
                        Sair
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>
            </div>

            {/* Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                <div className="max-w-5xl mx-auto">

                    {activeTab === 'config' ? (
                        <section className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            {/* Logo Section */}
                            <div>
                                <h2 className="text-lg font-bold text-navy-blue mb-4 uppercase tracking-wider border-b pb-2">Identidade (Logotipo)</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Texto do Logo</label>
                                        <input
                                            type="text"
                                            value={tempConfig.logo.text}
                                            onChange={(e) => handleUpdate('logo.text', e.target.value)}
                                            className="border p-3 rounded-lg w-full"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Ícone (Material Icon Name)</label>
                                        <input
                                            type="text"
                                            value={tempConfig.logo.icon}
                                            onChange={(e) => handleUpdate('logo.icon', e.target.value)}
                                            className="border p-3 rounded-lg w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Hero Section */}
                            <div>
                                <h2 className="text-lg font-bold text-navy-blue mb-4 uppercase tracking-wider border-b pb-2">Banner Principal (Hero)</h2>
                                <div className="flex flex-col gap-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Título Principal</label>
                                            <textarea
                                                value={tempConfig.hero.title}
                                                onChange={(e) => handleUpdate('hero.title', e.target.value)}
                                                className="border p-3 rounded-lg w-full font-bold"
                                                rows={2}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Subtítulo</label>
                                            <textarea
                                                value={tempConfig.hero.subtitle}
                                                onChange={(e) => handleUpdate('hero.subtitle', e.target.value)}
                                                className="border p-3 rounded-lg w-full text-sm"
                                                rows={2}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Texto do Botão (CTA)</label>
                                            <input
                                                type="text"
                                                value={tempConfig.hero.ctaText}
                                                onChange={(e) => handleUpdate('hero.ctaText', e.target.value)}
                                                className="border p-3 rounded-lg w-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Escolher Foto de Fundo</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'hero.image')}
                                                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-navy-blue file:text-white hover:file:bg-navy-light cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Ou URL da Imagem</label>
                                            <input
                                                type="text"
                                                value={tempConfig.hero.image}
                                                onChange={(e) => handleUpdate('hero.image', e.target.value)}
                                                className="border p-3 rounded-lg w-full text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* About Section */}
                            <div>
                                <h2 className="text-lg font-bold text-navy-blue mb-4 uppercase tracking-wider border-b pb-2">Seção Sobre Nós</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Título da Seção (Pequeno)</label>
                                            <input
                                                type="text"
                                                value={tempConfig.about.sectionTitle}
                                                onChange={(e) => handleUpdate('about.sectionTitle', e.target.value)}
                                                className="border p-3 rounded-lg w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Título Grande</label>
                                            <input
                                                type="text"
                                                value={tempConfig.about.title}
                                                onChange={(e) => handleUpdate('about.title', e.target.value)}
                                                className="border p-3 rounded-lg w-full font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Parágrafo 1</label>
                                        <textarea
                                            value={tempConfig.about.description1}
                                            onChange={(e) => handleUpdate('about.description1', e.target.value)}
                                            className="border p-3 rounded-lg w-full"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Parágrafo 2</label>
                                        <textarea
                                            value={tempConfig.about.description2}
                                            onChange={(e) => handleUpdate('about.description2', e.target.value)}
                                            className="border p-3 rounded-lg w-full"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Título do Badge (Foto)</label>
                                            <input
                                                type="text"
                                                value={tempConfig.about.badgeTitle}
                                                onChange={(e) => handleUpdate('about.badgeTitle', e.target.value)}
                                                className="border p-3 rounded-lg w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Subtítulo do Badge</label>
                                            <input
                                                type="text"
                                                value={tempConfig.about.badgeSubtitle}
                                                onChange={(e) => handleUpdate('about.badgeSubtitle', e.target.value)}
                                                className="border p-3 rounded-lg w-full text-xs"
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Escolher Foto da Fábrica</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'about.image')}
                                                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-navy-blue file:text-white hover:file:bg-navy-light cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Ou URL da Imagem</label>
                                            <input
                                                type="text"
                                                value={tempConfig.about.image}
                                                onChange={(e) => handleUpdate('about.image', e.target.value)}
                                                className="border p-3 rounded-lg w-full text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Products Section */}
                            <div>
                                <h2 className="text-lg font-bold text-navy-blue mb-4 uppercase tracking-wider border-b pb-2">Produtos (Catálogo)</h2>
                                <div className="space-y-6">
                                    {tempConfig.products.map((p: any, i: number) => (
                                        <div key={p.id} className="flex flex-col gap-3 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Título do Produto</label>
                                                    <input
                                                        type="text"
                                                        value={p.title}
                                                        onChange={(e) => {
                                                            const newProducts = [...tempConfig.products];
                                                            newProducts[i].title = e.target.value;
                                                            setTempConfig({ ...tempConfig, products: newProducts });
                                                        }}
                                                        className="border p-3 rounded-lg w-full font-bold"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Etiqueta (Tag)</label>
                                                    <input
                                                        type="text"
                                                        value={p.tag || ''}
                                                        onChange={(e) => {
                                                            const newProducts = [...tempConfig.products];
                                                            newProducts[i].tag = e.target.value;
                                                            setTempConfig({ ...tempConfig, products: newProducts });
                                                        }}
                                                        className="border p-3 rounded-lg w-full text-xs"
                                                        placeholder="Ex: NOVIDADE, DESTAQUE"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase">Descrição</label>
                                                <textarea
                                                    value={p.description}
                                                    onChange={(e) => {
                                                        const newProducts = [...tempConfig.products];
                                                        newProducts[i].description = e.target.value;
                                                        setTempConfig({ ...tempConfig, products: newProducts });
                                                    }}
                                                    className="border p-3 rounded-lg w-full text-sm"
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Subir Foto</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const path = `products.${i}.image`;
                                                                handleFileUpload(e, path);
                                                            }
                                                        }}
                                                        className="text-xs file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-navy-blue cursor-pointer"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase">URL ou Caminho</label>
                                                    <input
                                                        type="text"
                                                        value={p.image}
                                                        onChange={(e) => {
                                                            const newProducts = [...tempConfig.products];
                                                            newProducts[i].image = e.target.value;
                                                            setTempConfig({ ...tempConfig, products: newProducts });
                                                        }}
                                                        className="border p-2 rounded-lg w-full text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Section */}
                            <div>
                                <h2 className="text-lg font-bold text-navy-blue mb-4 uppercase tracking-wider border-b pb-2">Banner de Impacto Final (CTA)</h2>
                                <div className="flex flex-col gap-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Título de Impacto</label>
                                            <textarea
                                                value={tempConfig.cta.title}
                                                onChange={(e) => handleUpdate('cta.title', e.target.value)}
                                                className="border p-3 rounded-lg w-full font-bold text-lg"
                                                rows={2}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Texto Secundário (Opcional)</label>
                                            <input
                                                type="text"
                                                value={tempConfig.cta.subtitle || ''}
                                                onChange={(e) => handleUpdate('cta.subtitle', e.target.value)}
                                                className="border p-3 rounded-lg w-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl space-y-4 mt-2">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Escolher Foto de Fundo</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'cta.image')}
                                                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-navy-blue file:text-white hover:file:bg-navy-light cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Ou URL da Imagem</label>
                                            <input
                                                type="text"
                                                value={tempConfig.cta.image}
                                                onChange={(e) => handleUpdate('cta.image', e.target.value)}
                                                className="border p-3 rounded-lg w-full text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Integrations Section */}
                            <div>
                                <h2 className="text-lg font-bold text-navy-blue mb-4 uppercase tracking-wider border-b pb-2">Integrações e Tags</h2>
                                <div className="flex flex-col gap-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Google Ads ID (Ex: AW-123456789)</label>
                                            <input
                                                type="text"
                                                value={tempConfig.integrations?.googleAdsId || ''}
                                                onChange={(e) => handleUpdate('integrations.googleAdsId', e.target.value)}
                                                className="border p-3 rounded-lg w-full"
                                                placeholder="AW-XXXXXXXXX"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Google Tag Manager ID (Ex: GTM-XXXX)</label>
                                            <input
                                                type="text"
                                                value={tempConfig.integrations?.googleTagManagerId || ''}
                                                onChange={(e) => handleUpdate('integrations.googleTagManagerId', e.target.value)}
                                                className="border p-3 rounded-lg w-full"
                                                placeholder="GTM-XXXXXXX"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Facebook Pixel ID</label>
                                            <input
                                                type="text"
                                                value={tempConfig.integrations?.facebookPixelId || ''}
                                                onChange={(e) => handleUpdate('integrations.facebookPixelId', e.target.value)}
                                                className="border p-3 rounded-lg w-full"
                                                placeholder="123456789012345"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Scripts Personalizados (HEAD)</label>
                                        <p className="text-[10px] text-gray-400">Cole aqui códigos que devem ir dentro da tag &lt;head&gt;. Ex: Meta verification, Scripts de Analytics.</p>
                                        <textarea
                                            value={tempConfig.integrations?.headScripts || ''}
                                            onChange={(e) => handleUpdate('integrations.headScripts', e.target.value)}
                                            className="border p-3 rounded-lg w-full font-mono text-xs h-32"
                                            placeholder="<script>...</script>"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Scripts Personalizados (BODY)</label>
                                        <p className="text-[10px] text-gray-400">Cole aqui códigos que devem ir no início da tag &lt;body&gt;. Ex: GTM noscript.</p>
                                        <textarea
                                            value={tempConfig.integrations?.bodyScripts || ''}
                                            onChange={(e) => handleUpdate('integrations.bodyScripts', e.target.value)}
                                            className="border p-3 rounded-lg w-full font-mono text-xs h-32"
                                            placeholder="<noscript>...</noscript>"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-navy-blue">Leads Capturados</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {leads.length === 0 ? (
                                    <div className="bg-white p-12 text-center text-gray-400 rounded-xl">
                                        Nenhum contato recebido ainda.
                                    </div>
                                ) : (
                                    leads.map((lead: any) => (
                                        <div key={lead.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-bold text-lg text-navy-blue">{lead.name}</h3>
                                                    <span className="text-xs bg-primary/20 text-navy-blue px-2 py-0.5 rounded-full font-bold">
                                                        {new Date(lead.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    <p className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-sm">mail</span>
                                                        {lead.email || 'Não informado'}
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-sm">call</span>
                                                        {lead.phone || 'Não informado'}
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-sm">location_on</span>
                                                        {lead.city || 'Não informado'}
                                                    </p>
                                                </div>
                                            </div>
                                            {lead.message && (
                                                <div className="flex-1 bg-gray-50 p-4 rounded-lg text-sm text-gray-700 italic border-l-4 border-primary">
                                                    "{lead.message}"
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Actions (Only for Config) */}
            {activeTab === 'config' && (
                <div className="bg-white border-t p-4 flex gap-4 justify-end shrink-0 z-10">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-8 py-3 bg-navy-blue text-white rounded-xl font-bold text-lg hover:bg-navy-light shadow-xl transition-all"
                    >
                        Salvar Alterações
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
