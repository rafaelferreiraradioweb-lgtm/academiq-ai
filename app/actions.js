'use server';
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
