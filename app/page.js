'use client';
import { useState } from 'react';
import { salvarUsuarioDoSite } from './actions';

export default function Home() {
  const [passo, setPasso] = useState(1);
  const [area, setArea] = useState('');
  const [tema, setTema] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [statusMensagem, setStatusMensagem] = useState('');

  const areasDoCurso = [
    { id: 'humanas', nome: 'Humanas & Sociais', emoji: '📚', desc: 'História, Letras, Pedagogia...' },
    { id: 'exatas', nome: 'Exatas & Engenharia', emoji: '📐', desc: 'Matemática, Civil, Mecânica...' },
    { id: 'saude', nome: 'Saúde & Biológicas', emoji: '🧬', desc: 'Medicina, Enfermagem, Ed. Física...' },
    { id: 'tecnologia', nome: 'Tecnologia & TI', emoji: '💻', desc: 'Sistemas, Computação, TI...' },
  ];

  const avancar = () => setPasso((p) => p + 1);
  const voltar = () => setPasso((p) => p - 1);

  const finalizarCadastro = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setStatusMensagem('');

    const resultado = await salvarUsuarioDoSite({ area, tema, whatsapp });
    setCarregando(false);

    if (resultado.success) {
      setStatusMensagem('🎉 Sucesso! Seu tema foi recebido. Agora ative o robô para receber os resumos e fontes na estrutura da ABNT.');
      setPasso(4);
    } else {
      setStatusMensagem('❌ Ops! Falha ao conectar. Lembre-se de configurar as chaves do Supabase na Vercel.');
      setPasso(4); // Vai para a tela final de qualquer forma para não travar o teste visual
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col items-center justify-center p-4">
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
          Academiq.ai
        </h1>
        <p className="text-slate-400 mt-2">Seu assistente de TCC inteligente guiado por IA</p>
      </div>

      <div className="w-full max-w-xl bg-[#1E293B] border border-slate-700/50 rounded-2xl p-6 shadow-2xl transition-all">
        
        {passo < 4 && (
          <div className="flex items-center justify-between mb-8 px-2">
            <div className={`h-2 flex-1 rounded-full ${passo >= 1 ? 'bg-lime-400' : 'bg-slate-700'}`}></div>
            <div className="w-4"></div>
            <div className={`h-2 flex-1 rounded-full ${passo >= 2 ? 'bg-lime-400' : 'bg-slate-700'}`}></div>
            <div className="w-4"></div>
            <div className={`h-2 flex-1 rounded-full ${passo >= 3 ? 'bg-lime-400' : 'bg-slate-700'}`}></div>
          </div>
        )}

        {/* PASSO 1 */}
        {passo === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-2">Passo 1: Qual a área do seu curso?</h2>
            <p className="text-slate-400 text-sm mb-6">Isso ajuda nossa IA a buscar nos repositórios científicos certos.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {areasDoCurso.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setArea(item.id); avancar(); }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    area === item.id 
                      ? 'border-lime-400 bg-lime-500/10' 
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <span className="text-2xl mb-2 block">{item.emoji}</span>
                  <span className="font-semibold block">{item.nome}</span>
                  <span className="text-xs text-slate-400">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PASSO 2 */}
        {passo === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-2">Passo 2: Qual o tema ou ideia do seu TCC?</h2>
            <p className="text-slate-400 text-sm mb-4">Escreva de forma simples, como se estivesse explicando para um amigo.</p>
            
            <textarea
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ex: O uso de aplicativos de entrega e o impacto na saúde mental dos entregadores em capitais brasileiras..."
              className="w-full h-32 p-4 bg-slate-800 border border-slate-700 rounded-xl focus:border-lime-400 focus:outline-none text-slate-100 placeholder-slate-500 text-sm mb-6 resize-none"
            />

            <div className="flex justify-between">
              <button onClick={voltar} className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium">
                Voltar
              </button>
              <button 
                onClick={avancar} 
                disabled={!tema.trim()} 
                className="px-6 py-2.5 bg-lime-400 text-slate-950 rounded-xl font-semibold hover:bg-lime-300 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* PASSO 3 */}
        {passo === 3 && (
          <form onSubmit={finalizarCadastro}>
            <h2 className="text-xl font-bold mb-2">Passo 3: Onde quer receber sua pesquisa?</h2>
            <p className="text-slate-400 text-sm mb-6">Nossa IA vai te enviar os resumos e fontes formatadas em ABNT direto no seu celular.</p>
            
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2 tracking-wider">Número do WhatsApp com DDD</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Ex: 82999998888"
                className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl focus:border-lime-400 focus:outline-none text-slate-100 placeholder-slate-500 text-sm"
                required
              />
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={voltar} disabled={carregando} className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium disabled:opacity-50">
                Voltar
              </button>
              <button 
                type="submit"
                disabled={carregando}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-400 to-lime-400 text-slate-950 rounded-xl font-bold hover:shadow-lg hover:shadow-lime-500/20 transition-all text-sm disabled:opacity-50"
              >
                {carregando ? 'Salvando...' : 'Ativar Robô no WhatsApp 🚀'}
              </button>
            </div>
          </form>
        )}

        {/* PASSO 4 */}
        {passo === 4 && (
          <div className="text-center py-6">
            <span className="text-5xl block mb-4">🤖🔥</span>
            <h2 className="text-2xl font-bold text-lime-400 mb-4">Tudo Pronto!</h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-md mx-auto mb-6">
              {statusMensagem}
            </p>
            <a 
              href="https://wa.me/5582999999999" 
              target="_blank" 
              className="inline-block bg-emerald-500 text-slate-950 font-extrabold px-8 py-3 rounded-xl hover:bg-emerald-400 transition-all text-sm shadow-lg shadow-emerald-500/20"
            >
              Chamar no WhatsApp Agora
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
