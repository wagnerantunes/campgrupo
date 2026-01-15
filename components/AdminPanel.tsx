
import React, { useState } from 'react';
import { assetConfig as initialConfig } from '../assetConfig';

interface AdminPanelProps {
    onClose: () => void;
    onSave: (newConfig: any) => void;
    currentConfig: any;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onSave, currentConfig }) => {
    const [tempConfig, setTempConfig] = useState(currentConfig);
    const [uploading, setUploading] = useState(false);

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
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:3001/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.url) {
                handleUpdate(path, data.url);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Erro ao subir imagem');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = () => {
        onSave(tempConfig);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-12 border-b pb-6">
                    <h1 className="text-4xl font-black text-navy-blue">Painel Administrativo</h1>
                    <button
                        onClick={onClose}
                        className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <section className="space-y-12">
                    {/* Logo Section */}
                    <div>
                        <h2 className="text-xl font-bold text-navy-blue mb-4 uppercase tracking-wider">Identidade (Logotipo)</h2>
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
                        <h2 className="text-xl font-bold text-navy-blue mb-4 uppercase tracking-wider">Banner Principal (Hero)</h2>
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
                        <h2 className="text-xl font-bold text-navy-blue mb-4 uppercase tracking-wider">Seção Sobre Nós</h2>
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
                        <h2 className="text-xl font-bold text-navy-blue mb-4 uppercase tracking-wider">Produtos (Imagens)</h2>
                        <div className="space-y-6">
                            {tempConfig.products.map((p: any, i: number) => (
                                <div key={p.id} className="flex flex-col gap-3 border-l-4 border-primary pl-4 py-2">
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

                    {/* Supplies Section */}
                    <div>
                        <h2 className="text-xl font-bold text-navy-blue mb-4 uppercase tracking-wider">Materiais (Imagens)</h2>
                        <div className="space-y-6">
                            {tempConfig.supplies.map((s: any, i: number) => (
                                <div key={s.name} className="flex flex-col gap-3 border-l-4 border-navy-blue pl-4 py-2">
                                    <label className="text-sm font-black text-navy-blue">{s.name}</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase">Subir Foto</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const path = `supplies.${i}.image`;
                                                    handleFileUpload(e, path);
                                                }}
                                                className="text-xs file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-navy-blue file:text-white cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase">URL</label>
                                            <input
                                                type="text"
                                                value={s.image}
                                                onChange={(e) => {
                                                    const newSupplies = [...tempConfig.supplies];
                                                    newSupplies[i].image = e.target.value;
                                                    setTempConfig({ ...tempConfig, supplies: newSupplies });
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
                        <h2 className="text-xl font-bold text-navy-blue mb-4 uppercase tracking-wider">Banner de Eficiência (CTA)</h2>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Escolher Foto do Banner</label>
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

                <div className="mt-16 flex gap-4 border-t pt-8">
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-navy-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-navy-light shadow-xl transition-all"
                    >
                        Salvar Alterações
                    </button>
                    <button
                        onClick={onClose}
                        className="px-8 border py-4 rounded-xl font-bold text-lg hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
