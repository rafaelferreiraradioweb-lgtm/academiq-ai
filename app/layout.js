import './globals.css';

export const metadata = {
  title: 'Academiq.ai - Assistente de TCC',
  description: 'Gere suas pesquisas e formatações ABNT via IA e WhatsApp',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#0F172A] text-slate-100">{children}</body>
    </html>
  );
}
