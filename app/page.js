'use client';
import { useState } from 'react';
import { salvarUsuarioDoSite } from './actions';

export default function Home() {
  const [passo, setPasso] = useState(1);
  const [area, setArea] = useState('');
  const [tema, setTema] = useState('');
  const [email, setEmail] = useState('');
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

    const resultado = await salvarUsuarioDoSite({ area, tema, email });
    
    setCarregando(false);
    setStatusMensagem(resultado.message);
    setPasso(4);
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

        {passo === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-2">Passo 1: Qual a área do seu curso?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 mt-4">
              {areasDoCurso.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setArea(item.id); avancar(); }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    area === item.id ? 'border-lime-400 bg-lime-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <span className="text-2xl mb-2 block">{item.emoji}</span>
                  <span className="font-semibold block">{item.nome}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {passo === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-2">Passo 2: Qual o tema ou ideia do TCC?</h2>
            <textarea
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ex: O impacto da inteligência artificial..."
              className="w-full h-32 p-4 mt-4 bg-slate-800 border border-slate-700 rounded-xl focus:border-lime-400 focus:outline-none text-slate-100 mb-6 resize-none"
            />
            <div className="flex justify-between">
              <button onClick={voltar} className="px-5 py-2.5 rounded-xl border border-slate-700">Voltar</button>
              <button onClick={avancar} disabled={!tema.trim()} className="px-6 py-2.5 bg-lime-400 text-slate-950 rounded-xl font-semibold disabled:opacity-50">Continuar</button>
            </div>
          </div>
        )}

        {passo === 3 && (
          <form onSubmit={finalizarCadastro}>
            <h2 className="text-xl font-bold mb-2">Passo 3: Para qual e-mail enviar?</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@gmail.com"
              className="w-full p-4 mt-4 bg-slate-800 border border-slate-700 rounded-xl focus:border-lime-400 focus:outline-none text-slate-100 mb-6"
              required
            />
            <div className="flex justify-between">
              <button type="button" onClick={voltar} disabled={carregando} className="px-5 py-2.5 rounded-xl border border-slate-700 disabled:opacity-50">Voltar</button>
              <button type="submit" disabled={carregando} className="px-6 py-2.5 bg-gradient-to-r from-emerald-400 to-lime-400 text-slate-950 rounded-xl font-bold disabled:opacity-50">
                {carregando ? 'Processando IA...' : 'Gerar Pesquisa 🚀'}
              </button>
            </div>
          </form>
        )}

        {passo === 4 && (
          <div className="text-center py-6">
            <h2 className="text-2xl font-bold text-lime-400 mb-4">Resultado:</h2>
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-slate-100 text-sm break-words">
              {statusMensagem}
            </div>
            <button onClick={() => setPasso(1)} className="mt-8 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold text-slate-200 transition-all">
              Tentar Novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
