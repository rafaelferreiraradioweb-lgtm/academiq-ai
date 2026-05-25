'use server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';

export async function salvarUsuarioDoSite(dados) {
  const { area, tema, email } = dados;
  const emailLimpo = email.toLowerCase().trim();

  try {
    // 1. CONEXÃO SUPABASE
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { error: dbError } = await supabase
      .from('usuarios')
      .upsert({ email: emailLimpo, nome: `Estudante de ${area}`, plano: 'gratis', buscas_realizadas: 1 }, { onConflict: 'email' });
    
    if (dbError) throw new Error(`SUPABASE: ${dbError.message}`);

    // 2. CONEXÃO GEMINI (Modelo 1.5 Flash - Versão mais rápida e atual)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Atue como um assistente acadêmico especialista em ABNT. O aluno é da área de ${area} e o tema do TCC é: "${tema}". Crie um resumo acadêmico de 2 parágrafos sobre o tema e sugira 3 referências bibliográficas realistas, formatadas rigorosamente nas normas da ABNT. Formate sua resposta APENAS em HTML básico usando tags como <h2>, <b>, <p> e <br>. Não use markdown.`;
    
    const result = await model.generateContent(prompt).catch(e => { throw new Error(`GEMINI: ${e.message}`) });
    const textoGerado = result.response.text();

    // 3. CONEXÃO RESEND
    const resend = new Resend(process.env.RESEND_API_KEY || '');
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
          <p>Bons estudos!</p>
        </div>
      `
    });

    if (emailError) throw new Error(`RESEND: ${emailError.message}`);

    return { success: true, message: "🎉 Sucesso! A IA enviou a pesquisa. Olhe sua caixa de entrada e o Lixo Eletrônico/Spam!" };

  } catch (error) {
    console.error(error);
    return { success: false, message: `❌ ERRO DETECTADO: ${error.message}` };
  }
}
