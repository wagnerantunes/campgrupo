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
    const [activeTab, setActiveTab] = useState<'config' | 'leads' | 'media'>('config');
    const [leads, setLeads] = useState<any[]>([]);
    const [media, setMedia] = useState<any[]>([]);
    const [loadingLeads, setLoadingLeads] = useState(false);
    const [loadingMedia, setLoadingMedia] = useState(false);

    useEffect(() => {
        if (activeTab === 'leads') {
            fetchLeads();
        } else if (activeTab === 'media') {
            fetchMedia();
        }
    }, [activeTab]);

    // Sync with parent config whenever it changes (e.g., after save)
    useEffect(() => {
        setTempConfig(currentConfig);
    }, [currentConfig]);

    const fetchLeads = async () => {
        setLoadingLeads(true);
        try {
            const response = await fetch(`${API_URL}/leads`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) setLeads(await response.json());
        } catch (error) { 
            console.error(error); 
            toast.error('Erro ao carregar leads');
        } finally {
            setLoadingLeads(false);
        }
    };

    const fetchMedia = async () => {
        setLoadingMedia(true);
        try {
            const response = await fetch(`${API_URL}/media`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) setMedia(await response.json());
        } catch (error) { 
            console.error(error);
            toast.error('Erro ao carregar mídia');
        } finally {
            setLoadingMedia(false);
        }
    };

    const deleteMedia = async (filename: string) => {
        if (!window.confirm('Excluir esta imagem permanentemente?')) return;
        try {
            const response = await fetch(`${API_URL}/media/${filename}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success('Arquivo excluído');
                fetchMedia();
            }
        } catch (error) { toast.error('Erro ao excluir'); }
    };

    const deleteLead = async (id: number) => {
        if (!window.confirm('Excluir este lead permanentemente?')) return;
        try {
            const response = await fetch(`${API_URL}/leads/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success('Lead excluído');
                fetchLeads();
            }
        } catch (error) { toast.error('Erro ao excluir'); }
    }

    const handleUpdate = (path: string, value: any) => {
        const keys = path.split('.');
        const newConfig = JSON.parse(JSON.stringify(tempConfig)); // Simple deep clone
        let current = newConfig;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setTempConfig(newConfig);
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
        <div className="fixed inset-0 z-[100] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-navy-blue to-navy-light text-white p-6 shadow-lg z-10 flex justify-between items-center shrink-0 border-b-4 border-primary">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-4xl text-primary">admin_panel_settings</span>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">Painel Administrativo</h1>
                            <p className="text-xs text-white/60 font-medium">Grupo Camp - Gestão de Conteúdo</p>
                        </div>
                    </div>
                    <div className="flex bg-black/20 rounded-xl p-1.5 shadow-inner">
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
                        </button>
                        <button
                            onClick={() => setActiveTab('media')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'media' ? 'bg-white text-navy-blue shadow-sm' : 'text-white/70 hover:text-white'}`}
                        >
                            Mídia (Imagens)
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm font-bold text-red-200 hover:text-white transition-all border border-red-400/30"
                    >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Sair
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-white/10 p-2.5 rounded-lg hover:bg-white/20 transition-all hover:rotate-90 duration-300"
                        title="Fechar Painel"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>
            </div>

            {/* Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto">

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

                            {/* Header Section */}
                            <div>
                                <h2 className="text-lg font-bold text-navy-blue mb-4 uppercase tracking-wider border-b pb-2">Navegação (Header)</h2>
                                <div className="space-y-4">
                                    {(tempConfig.header?.navLinks || []).map((link: any, index: number) => (
                                        <div key={index} className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <div className="flex-1 space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Rótulo (Texto)</label>
                                                <input
                                                    type="text"
                                                    value={link.label}
                                                    onChange={(e) => {
                                                        const newLinks = [...(tempConfig.header.navLinks || [])];
                                                        newLinks[index] = { ...link, label: e.target.value };
                                                        handleUpdate('header.navLinks', newLinks);
                                                    }}
                                                    className="border p-2 rounded-lg w-full text-sm"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Link (Href - Ex: #sobre)</label>
                                                <input
                                                    type="text"
                                                    value={link.href}
                                                    onChange={(e) => {
                                                        const newLinks = [...(tempConfig.header.navLinks || [])];
                                                        newLinks[index] = { ...link, href: e.target.value };
                                                        handleUpdate('header.navLinks', newLinks);
                                                    }}
                                                    className="border p-2 rounded-lg w-full text-sm font-mono"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newLinks = (tempConfig.header.navLinks || []).filter((_: any, i: number) => i !== index);
                                                    handleUpdate('header.navLinks', newLinks);
                                                }}
                                                className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            const newLinks = [...(tempConfig.header?.navLinks || []), { label: 'Novo Link', href: '#' }];
                                            handleUpdate('header.navLinks', newLinks);
                                        }}
                                        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">add_circle</span>
                                        Adicionar Item ao Menu
                                    </button>
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
                                            <div className="flex items-center gap-4">
                                                {tempConfig.hero.image && (
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden border bg-gray-200">
                                                        <img src={tempConfig.hero.image} alt="Thumbnail" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileUpload(e, 'hero.image')}
                                                    className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-navy-blue file:text-white hover:file:bg-navy-light cursor-pointer"
                                                />
                                            </div>
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
                                            <div className="flex items-center gap-4">
                                                {tempConfig.about.image && (
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden border bg-gray-200">
                                                        <img src={tempConfig.about.image} alt="Thumbnail" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileUpload(e, 'about.image')}
                                                    className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-navy-blue file:text-white hover:file:bg-navy-light cursor-pointer"
                                                />
                                            </div>
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
                                                    <div className="flex items-center gap-3">
                                                        {p.image && (
                                                            <div className="w-10 h-10 rounded border overflow-hidden bg-gray-200 shrink-0">
                                                                <img src={p.image} alt="Mini" className="w-full h-full object-cover" />
                                                            </div>
                                                        )}
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
                                                            className="text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-primary file:text-navy-blue cursor-pointer"
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
                                            <div className="flex items-center gap-4">
                                                {tempConfig.cta.image && (
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden border bg-gray-200">
                                                        <img src={tempConfig.cta.image} alt="Thumbnail" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileUpload(e, 'cta.image')}
                                                    className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-navy-blue file:text-white hover:file:bg-navy-light cursor-pointer"
                                                />
                                            </div>
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
                                            <label className="text-xs font-bold text-gray-500 uppercase">Google Ads ID</label>
                                            <input
                                                type="text"
                                                value={tempConfig.integrations?.googleAdsId || ''}
                                                onChange={(e) => handleUpdate('integrations.googleAdsId', e.target.value)}
                                                className="border p-3 rounded-lg w-full"
                                                placeholder="AW-XXXXXXXXX"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Google Tag Manager ID</label>
                                            <input
                                                type="text"
                                                value={tempConfig.integrations?.googleTagManagerId || ''}
                                                onChange={(e) => handleUpdate('integrations.googleTagManagerId', e.target.value)}
                                                className="border p-3 rounded-lg w-full"
                                                placeholder="GTM-XXXXXXX"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Scripts (HEAD)</label>
                                        <textarea
                                            value={tempConfig.integrations?.headScripts || ''}
                                            onChange={(e) => handleUpdate('integrations.headScripts', e.target.value)}
                                            className="border p-3 rounded-lg w-full font-mono text-xs h-24"
                                            placeholder="<script>...</script>"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Scripts (BODY)</label>
                                        <textarea
                                            value={tempConfig.integrations?.bodyScripts || ''}
                                            onChange={(e) => handleUpdate('integrations.bodyScripts', e.target.value)}
                                            className="border p-3 rounded-lg w-full font-mono text-xs h-24"
                                            placeholder="<noscript>...</noscript>"
                                        />
                                    </div>
                                </div>
                            </div>

                             {/* SEO & Favicon Section */}
                            <div>
                                <h2 className="text-lg font-bold text-navy-blue mb-4 uppercase tracking-wider border-b pb-2">SEO & Favicon</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Título da Página (SEO)</label>
                                            <input
                                                type="text"
                                                value={tempConfig.seo?.title || ''}
                                                onChange={(e) => handleUpdate('seo.title', e.target.value)}
                                                className="border p-3 rounded-lg w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Email para Cópia Oculta (BCC/CCO Leads)</label>
                                            <input
                                                type="email"
                                                value={tempConfig.seo?.bccEmail || ''}
                                                onChange={(e) => handleUpdate('seo.bccEmail', e.target.value)}
                                                className="border p-3 rounded-lg w-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Descrição (Meta Description)</label>
                                        <textarea
                                            value={tempConfig.seo?.description || ''}
                                            onChange={(e) => handleUpdate('seo.description', e.target.value)}
                                            className="border p-3 rounded-lg w-full text-sm"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Favicon (Ícone da Aba)</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'seo.faviconUrl')}
                                                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-navy-blue file:text-white"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={tempConfig.seo?.faviconUrl || ''}
                                            onChange={(e) => handleUpdate('seo.faviconUrl', e.target.value)}
                                            className="border p-2 rounded-lg w-full text-[10px]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer Section */}
                            <div>
                                <h2 className="text-lg font-bold text-navy-blue mb-4 uppercase tracking-wider border-b pb-2">Rodapé & Contato</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp (Apenas Números)</label>
                                            <input
                                                type="text"
                                                value={tempConfig.footer?.whatsapp || ''}
                                                onChange={(e) => handleUpdate('footer.whatsapp', e.target.value)}
                                                className="border p-3 rounded-lg w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                                            <input
                                                type="text"
                                                value={tempConfig.footer?.email || ''}
                                                onChange={(e) => handleUpdate('footer.email', e.target.value)}
                                                className="border p-3 rounded-lg w-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Endereço</label>
                                        <textarea
                                            value={tempConfig.footer?.address || ''}
                                            onChange={(e) => handleUpdate('footer.address', e.target.value)}
                                            className="border p-3 rounded-lg w-full"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Facebook</label>
                                            <input
                                                type="text"
                                                value={tempConfig.footer?.social?.facebook || ''}
                                                onChange={(e) => handleUpdate('footer.social.facebook', e.target.value)}
                                                className="border p-3 rounded-lg w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Instagram</label>
                                            <input
                                                type="text"
                                                value={tempConfig.footer?.social?.instagram || ''}
                                                onChange={(e) => handleUpdate('footer.social.instagram', e.target.value)}
                                                className="border p-3 rounded-lg w-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Regiões</label>
                                        <textarea
                                            value={tempConfig.footer?.regions || ''}
                                            onChange={(e) => handleUpdate('footer.regions', e.target.value)}
                                            className="border p-3 rounded-lg w-full text-[10px]"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Copyright</label>
                                        <input
                                            type="text"
                                            value={tempConfig.footer?.copyright || ''}
                                            onChange={(e) => handleUpdate('footer.copyright', e.target.value)}
                                            className="border p-3 rounded-lg w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    ) : activeTab === 'leads' ? (
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
                                            <div className="flex flex-col gap-2 items-end">
                                                {lead.message && (
                                                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 italic border-l-4 border-primary">
                                                        "{lead.message}"
                                                    </div>
                                                )}
                                                <button 
                                                    onClick={() => deleteLead(lead.id)}
                                                    className="text-red-400 hover:text-red-600 text-xs font-bold"
                                                >
                                                    Excluir Lead
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-navy-blue">Biblioteca de Mídia</h2>
                                <p className="text-sm text-gray-400">{media.length} arquivos no servidor</p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {media.length === 0 ? (
                                    <div className="col-span-full bg-white p-12 text-center text-gray-400 rounded-xl">
                                        Nenhuma imagem encontrada.
                                    </div>
                                ) : (
                                    media.map((item: any) => (
                                        <div key={item.filename} className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all aspect-square">
                                            <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                                            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                                                <div className="flex justify-between items-center text-[10px] text-white">
                                                    <button 
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(item.url);
                                                            toast.success('Link copiado!');
                                                        }}
                                                        className="hover:text-primary transition-colors text-xs font-bold"
                                                    >
                                                        Copiar Link
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteMedia(item.filename)}
                                                        className="hover:text-red-400 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                    </button>
                                                </div>
                                            </div>
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
