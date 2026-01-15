
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
            <Link to="/" className="text-navy-blue font-bold text-sm hover:underline">&larr; Voltar para Home</Link>
        </div>
        
        <h1 className="text-4xl font-black text-navy-blue mb-8">Política de Privacidade</h1>
        
        <div className="prose prose-blue max-w-none text-gray-600">
          <p className="lead text-lg font-medium mb-8">
             No Grupo Camp, a privacidade e a segurança dos seus dados são nossa prioridade. Esta política explica de forma clara como coletamos, usamos e protegemos suas informações.
          </p>

          <h3 className="text-xl font-bold text-navy-blue mt-8 mb-4">1. Coleta de Informações</h3>
          <p>
            Coletamos informações que você nos fornece diretamente ao preencher formulários em nosso site, como:
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Nome</li>
                <li>Telefone / WhatsApp</li>
                <li>Endereço de E-mail</li>
                <li>Cidade e Detalhes da Solicitação</li>
            </ul>
          </p>

          <h3 className="text-xl font-bold text-navy-blue mt-8 mb-4">2. Uso das Informações</h3>
          <p>
            Utilizamos seus dados exclusivamente para:
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Responder às suas solicitações de orçamento.</li>
                <li>Entrar em contato para tirar dúvidas sobre nossos produtos.</li>
                <li>Enviar comunicações sobre seu pedido.</li>
            </ul>
            <strong>Não vendemos nem compartilhamos seus dados pessoais com terceiros para fins comerciais.</strong>
          </p>

          <h3 className="text-xl font-bold text-navy-blue mt-8 mb-4">3. Cookies e Rastreamento</h3>
          <p>
            Utilizamos cookies primários e de terceiros (como Google Ads e Facebook Pixel) para:
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Melhorar a funcionalidade do nosso site.</li>
                <li>Analisar o tráfego e o comportamento dos visitantes.</li>
                <li>Exibir anúncios mais relevantes para você.</li>
            </ul>
            Você pode gerenciar suas preferências de cookies a qualquer momento através do nosso banner de consentimento ou das configurações do seu navegador.
          </p>
          
           <h3 className="text-xl font-bold text-navy-blue mt-8 mb-4">4. Segurança</h3>
          <p>
            Adotamos medidas de segurança adequadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição.
          </p>

           <h3 className="text-xl font-bold text-navy-blue mt-8 mb-4">5. Seus Direitos</h3>
          <p>
            Conforme a LGPD (Lei Geral de Proteção de Dados), você tem direito a:
            <ul className="list-disc pl-5 mt-2 space-y-1">
               <li>Confirmar a existência de tratamento de dados.</li>
               <li>Acessar seus dados.</li>
               <li>Corrigir dados incompletos ou desatualizados.</li>
               <li>Solicitar a exclusão de seus dados pessoais.</li>
            </ul>
            Para exercer seus direitos, entre em contato conosco pelo e-mail: <strong className="text-navy-blue">vendas@campgrupo.com.br</strong>
          </p>

          <h3 className="text-xl font-bold text-navy-blue mt-8 mb-4">6. Alterações</h3>
          <p>
             Podemos atualizar esta política periodicamente. A versão mais recente estará sempre disponível nesta página.
          </p>
          
           <p className="mt-12 text-sm text-gray-400">
             Última atualização: {new Date().getFullYear()}
           </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
