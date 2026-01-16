import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { SupabaseLogin } from './SupabaseLogin';

interface AdminPanelProps {
    onClose: () => void;
    onSave: (newConfig: any) => Promise<void>;
    currentConfig: any;
}

const AdminPanelSupabase: React.FC<AdminPanelProps> = ({ onClose, onSave, currentConfig }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tempConfig, setTempConfig] = useState(currentConfig);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'config' | 'leads' | 'media'>('config');
    const [leads, setLeads] = useState<any[]>([]);
    const [media, setMedia] = useState<any[]>([]);
    const [loadingLeads, setLoadingLeads] = useState(false);
    const [loadingMedia, setLoadingMedia] = useState(false);

    // Check authentication on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        toast.success('Logout realizado');
    };

    useEffect(() => {
        if (activeTab === 'leads' && isAuthenticated) {
            fetchLeads();
        } else if (activeTab === 'media' && isAuthenticated) {
            fetchMedia();
        }
    }, [activeTab, isAuthenticated]);

    useEffect(() => {
        setTempConfig(currentConfig);
    }, [currentConfig]);

    const fetchLeads = async () => {
        setLoadingLeads(true);
        try {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLeads(data || []);
        } catch (error) {
            console.error('Erro ao carregar leads:', error);
            toast.error('Erro ao carregar leads');
        } finally {
            setLoadingLeads(false);
        }
    };

    const fetchMedia = async () => {
        setLoadingMedia(true);
        try {
            const { data, error } = await supabase.storage
                .from('uploads')
                .list();

            if (error) throw error;
            setMedia(data || []);
        } catch (error) {
            console.error('Erro ao carregar mídias:', error);
            toast.error('Erro ao carregar arquivos');
        } finally {
            setLoadingMedia(false);
        }
    };

    const handleFileUpload = async (file: File, field: string) => {
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
                .from('uploads')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('uploads')
                .getPublicUrl(fileName);

            // Update config with new URL
            const keys = field.split('.');
            let obj = { ...tempConfig };
            let current: any = obj;
            
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = publicUrl;
            
            setTempConfig(obj);
            toast.success('Imagem enviada com sucesso!');
        } catch (error) {
            console.error('Erro no upload:', error);
            toast.error('Erro ao enviar imagem');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            const { error } = await supabase
                .from('site_config')
                .update({ data: tempConfig })
                .eq('key', 'current_config');

            if (error) throw error;

            await onSave(tempConfig);
            toast.success('Configurações salvas!');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            toast.error('Erro ao salvar configurações');
        }
    };

    const deleteLead = async (id: number) => {
        if (!window.confirm('Excluir este lead?')) return;
        
        try {
            const { error } = await supabase
                .from('leads')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Lead excluído');
            fetchLeads();
        } catch (error) {
            console.error('Erro ao excluir lead:', error);
            toast.error('Erro ao excluir');
        }
    };

    const deleteMedia = async (fileName: string) => {
        if (!window.confirm('Excluir esta imagem?')) return;
        
        try {
            const { error } = await supabase.storage
                .from('uploads')
                .remove([fileName]);

            if (error) throw error;
            toast.success('Arquivo excluído');
            fetchMedia();
        } catch (error) {
            console.error('Erro ao excluir:', error);
            toast.error('Erro ao excluir arquivo');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
    }

    if (!isAuthenticated) {
        return <SupabaseLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
            <div className="min-h-screen p-4">
                <div className="bg-white rounded-lg shadow-2xl max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-2xl font-bold">Painel Admin - Supabase</h2>
                        <div className="flex gap-4">
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                            >
                                Sair
                            </button>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('config')}
                            className={`px-6 py-3 font-medium ${
                                activeTab === 'config'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600'
                            }`}
                        >
                            Configurações
                        </button>
                        <button
                            onClick={() => setActiveTab('leads')}
                            className={`px-6 py-3 font-medium ${
                                activeTab === 'leads'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600'
                            }`}
                        >
                            Leads ({leads.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('media')}
                            className={`px-6 py-3 font-medium ${
                                activeTab === 'media'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600'
                            }`}
                        >
                            Mídias ({media.length})
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {activeTab === 'config' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Logo Principal
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileUpload(file, 'logoUrl');
                                        }}
                                        className="block w-full text-sm"
                                    />
                                    {tempConfig.logoUrl && (
                                        <img
                                            src={tempConfig.logoUrl}
                                            alt="Logo"
                                            className="mt-2 h-16"
                                        />
                                    )}
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={uploading}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {uploading ? 'Enviando...' : 'Salvar Alterações'}
                                </button>
                            </div>
                        )}

                        {activeTab === 'leads' && (
                            <div>
                                {loadingLeads ? (
                                    <p>Carregando leads...</p>
                                ) : (
                                    <div className="space-y-4">
                                        {leads.map((lead) => (
                                            <div
                                                key={lead.id}
                                                className="border p-4 rounded-lg flex justify-between items-start"
                                            >
                                                <div>
                                                    <p className="font-semibold">{lead.name}</p>
                                                    <p className="text-sm text-gray-600">{lead.phone}</p>
                                                    <p className="text-sm mt-2">{lead.message}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(lead.created_at).toLocaleString('pt-BR')}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => deleteLead(lead.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'media' && (
                            <div>
                                {loadingMedia ? (
                                    <p>Carregando arquivos...</p>
                                ) : (
                                    <div className="grid grid-cols-3 gap-4">
                                        {media.map((file) => (
                                            <div key={file.name} className="border p-2 rounded">
                                                <p className="text-sm truncate">{file.name}</p>
                                                <button
                                                    onClick={() => deleteMedia(file.name)}
                                                    className="text-red-600 text-sm mt-2"
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanelSupabase;
