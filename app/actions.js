'use server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function salvarUsuarioDoSite(dados) {
  const { area, tema, whatsapp } = dados;
  const numeroLimpo = whatsapp.replace(/\D/g, '');

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .upsert(
        { 
          whatsapp_numero: numeroLimpo,
          nome: `Estudante de ${area}`,
          plano: 'gratis',
          buscas_realizadas: 1 
        },
        { onConflict: 'whatsapp_numero' }
      )
      .select();

    if (error) throw error;
    return { success: true, message: "Usuário registrado com sucesso!" };

  } catch (error) {
    console.error("Erro ao salvar no Supabase:", error);
    return { success: false, message: "Erro ao conectar com o banco de dados." };
  }
}
