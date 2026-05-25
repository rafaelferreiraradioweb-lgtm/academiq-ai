'use server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';

// Inicialização segura para a Vercel não travar
const url = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const key = process.env.SUPABASE_ANON_KEY || 'placeholder';

const supabase = createClient(url, key);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'placeholder');
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function salvarUsuarioDoSite(dados) {
  const { area, tema, email } = dados;
  const emailLimpo = email.toLowerCase().trim();

  try {
    // 1. Salva no banco de dados
    const { error: dbError } = await supabase
      .from('usuarios')
      .upsert(
        { email: emailLimpo, nome: `Estudante de ${area}`, plano: 'gratis', buscas_realizadas: 1 },
        { onConflict: 'email' }
      );
    if (dbError) throw dbError;

    // 2. Aciona o Gemini para criar a pesquisa
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Atue como um assistente acadêmico especialista em ABNT. O aluno é da área de ${area} e o tema do TCC é: "${tema}". 
    Crie um resumo acadêmico de 2 parágrafos sobre o tema e sugira 3 referências bibliográficas realistas, formatadas rigorosamente nas normas da ABNT. 
    Formate sua resposta APENAS em HTML básico usando tags como <h2>, <b>, <p> e <br>. Não use markdown (como ** ou #).`;
    
    const result = await model.generateContent(prompt);
    const textoGerado = result.response.text();

    // 3. Dispara o E-mail usando o Resend
    const { error: emailError } = await resend.emails.send({
      from: 'Academiq AI <onboarding@resend.dev>',
      to: emailLimpo, 
      subject: '🎓 Sua Pesquisa Acadêmica e Fontes ABNT',
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto;">
          <h1 style="color: #4ade80;">Olá, Estudante!</h1>
          <p>Nossa inteligência artificial analisou o seu tema (<b>${tema}</b>) e preparou este material de base para o seu TCC:</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          ${textoGerado}
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p>Bons estudos! Continue usando o Academiq.ai para turbinar suas pesquisas.</p>
        </div>
      `
    });

    if (emailError) throw emailError;

    return { success: true, message: "Pesquisa gerada com sucesso!" };

  } catch (error) {
    console.error("Erro no processo completo:", error);
    return { success: false, message: "Erro ao processar requisição." };
  }
}
