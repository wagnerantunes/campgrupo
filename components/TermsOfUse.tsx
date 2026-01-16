
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const TermsOfUse: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
            <Link to="/" className="text-navy-blue font-bold text-sm hover:underline">&larr; Voltar para Home</Link>
        </div>
        
        <h1 className="text-4xl font-black text-navy-blue mb-8">Termos de Uso</h1>
        
        <div className="prose prose-blue max-w-none text-gray-600">
          <p className="lead text-lg font-medium mb-8">
             Bem-vindo ao site do Grupo Camp. Ao acessar e utilizar este site, você concorda com os seguintes termos e condições.
          </p>

          <h3 className="text-xl font-bold text-navy-blue mt-8 mb-4">1. Uso do Site</h3>
          <p>
            Este site tem como objetivo fornecer informações sobre nossos produtos (concreto, blocos, pisos) e permitir a solicitação de orçamentos. É proibido utilizar este site para fins ilegais ou que violem os direitos de terceiros.
          </p>

          <h3 className="text-xl font-bold text-navy-blue mt-8 mb-4">2. Propriedade Intelectual</h3>
          <p>
            Todo o conteúdo deste site, incluindo textos, imagens, logotipos e design, é de propriedade exclusiva do Grupo Camp ou de seus licenciadores e está protegido pelas leis de direitos autorais. A reprodução não autorizada é proibida.
          </p>

          <h3 className="text-xl font-bold text-navy-blue mt-8 mb-4">3. Precisão das Informações</h3>
          <p>
            Esforçamo-nos para manter as informações do site sempre atualizadas. No entanto, não garantimos que todas as descrições de produtos, preços ou outros conteúdos estejam totalmente isentos de erros. Recomendamos confirmar detalhes específicos diretamente com nossa equipe de vendas.
          </p>
          
           <h3 className="text-xl font-bold text-navy-blue mt-8 mb-4">4. Limitação de Responsabilidade</h3>
          <p>
             O Grupo Camp não se responsabiliza por quaisquer danos diretos, indiretos ou consequentes decorrentes do uso ou da impossibilidade de uso deste site.
          </p>

           <h3 className="text-xl font-bold text-navy-blue mt-8 mb-4">5. Links Externos</h3>
          <p>
            Nosso site pode conter links para sites de terceiros (como redes sociais). Não temos controle sobre o conteúdo ou práticas desses sites e não nos responsabilizamos por eles.
          </p>

          <h3 className="text-xl font-bold text-navy-blue mt-8 mb-4">6. Contato</h3>
          <p>
             Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através do e-mail: <strong className="text-navy-blue">vendas@campgrupo.com.br</strong>
          </p>
          
           <p className="mt-12 text-sm text-gray-400">
             Última atualização: {new Date().getFullYear()}
           </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
