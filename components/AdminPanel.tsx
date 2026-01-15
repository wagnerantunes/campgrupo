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
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Escolher Foto</label>
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

                            {/* About Section */}
                            <div>
                                <h2 className="text-lg font-bold text-navy-blue mb-4 uppercase tracking-wider border-b pb-2">Seção Sobre Nós</h2>
                                <div className="flex flex-col gap-4">
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

                             {/* Products Section */}
                            <div>
                                <h2 className="text-lg font-bold text-navy-blue mb-4 uppercase tracking-wider border-b pb-2">Produtos (Imagens)</h2>
                                <div className="space-y-6">
                                    {tempConfig.products.map((p: any, i: number) => (
                                        <div key={p.id} className="flex flex-col gap-3 bg-gray-50 p-4 rounded-lg">
                                            <label className="text-sm font-black text-navy-blue">{p.title}</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase">URL</label>
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
                                <h2 className="text-lg font-bold text-navy-blue mb-4 uppercase tracking-wider border-b pb-2">Banner de Eficiência (CTA)</h2>
                                <div className="flex flex-col gap-4">
                                     <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Escolher Foto</label>
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
