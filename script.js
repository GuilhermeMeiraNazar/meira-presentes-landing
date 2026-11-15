const WHATSAPP = '554299654614';

// Mantém os CTAs de produto editáveis no HTML e acrescenta uma mensagem contextual.
document.querySelectorAll('[data-whatsapp]').forEach((link) => {
  const message = link.dataset.whatsapp || 'Olá! Quero conhecer a Meira Presentes.';
  link.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
});

// Captura inicial de lead: substitua este encaminhamento pela API do CRM quando o endpoint estiver definido.
const form = document.querySelector('#lead-form');
const status = document.querySelector('#form-status');
if (form && status) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const message = `Olá! Quero atendimento da Meira Presentes.\nNome: ${data.get('nome')}\nE-mail: ${data.get('email')}\nCelular: ${data.get('telefone')}`;
    status.textContent = 'Abrindo o WhatsApp para concluir seu atendimento…';
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
}
