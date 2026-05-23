'use server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';

// Inicializando as conexões com as chaves da Vercel
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function salvarUsuarioDoSite(dados) {
  const { area, tema, email } = dados;
  const emailLimpo = email.toLowerCase().trim();

  try {
    // 1. Salva o e-mail no Banco de Dados
    const { error: dbError } = await supabase
      .from('usuarios')
      .upsert(
        { email: emailLimpo, nome: `Estudante de ${area}`, plano: 'gratis', buscas_realizadas: 1 },
        { onConflict: 'email' }
      );
    if (dbError) throw dbError;

    // 2. Aciona o Google Gemini para criar a pesquisa
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

    return { success: true, message: "Pesquisa gerada com sucesso! Verifique sua caixa de entrada." };

  } catch (error) {
    console.error("Erro no processo completo:", error);
    return { success: false, message: "Tivemos um problema ao processar sua requisição." };
  }
}'use server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function salvarUsuarioDoSite(dados) {
  const { area, tema, email } = dados;

  // Converte o email para minúsculo e remove espaços em branco
  const emailLimpo = email.toLowerCase().trim();

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .upsert(
        { 
          email: emailLimpo,
          nome: `Estudante de ${area}`,
          plano: 'gratis',
          buscas_realizadas: 1 
        },
        { onConflict: 'email' }
      )
      .select();

    if (error) throw error;
    return { success: true, message: "Cadastro realizado com sucesso!" };

  } catch (error) {
    console.error("Erro ao salvar no Supabase:", error);
    return { success: false, message: "Erro ao conectar com o banco de dados." };
  }
}
