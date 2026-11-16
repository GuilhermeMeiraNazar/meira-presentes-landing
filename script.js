const WHATSAPP = '554299654614';

// Mantém os CTAs de produto editáveis no HTML e acrescenta uma mensagem contextual.
document.querySelectorAll('[data-whatsapp]').forEach((link) => {
  const message = link.dataset.whatsapp || 'Olá! Quero conhecer a Meira Presentes.';
  link.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
});

const ADS_WEBHOOK_URL = 'https://crm.meirapresentes.frontly.com.br/api/webhooks/ads';
// Defina este valor na configuração da página, sem versioná-lo no repositório.
const ADS_WEBHOOK_TOKEN = window.MEIRA_WEBHOOK_TOKEN || '';

const form = document.querySelector('#lead-form');
const status = document.querySelector('#form-status');
if (form && status) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!ADS_WEBHOOK_TOKEN) {
      status.textContent = 'O formulário está temporariamente indisponível. Fale conosco pelo WhatsApp.';
      return;
    }

    const data = new FormData(form);
    const params = new URLSearchParams(window.location.search);
    const payload = {
      name: String(data.get('nome') || '').trim(),
      phone: String(data.get('telefone') || '').trim(),
      email: String(data.get('email') || '').trim(),
      source: 'landing_page',
    };

    // Preserve campaign identifiers when the visitor arrives from an ad.
    for (const field of ['campaign_name', 'ad_id', 'form_id']) {
      const value = params.get(field);
      if (value) payload[field] = value;
    }

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = 'Enviando seus dados…';

    try {
      const response = await fetch(ADS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-token': ADS_WEBHOOK_TOKEN,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Webhook returned ${response.status}`);

      form.reset();
      status.textContent = 'Dados enviados. Nossa equipe falará com você em breve.';
    } catch (error) {
      console.error('Falha ao enviar lead para o CRM:', error);
      status.textContent = 'Não foi possível enviar seus dados. Tente novamente ou fale pelo WhatsApp.';
    } finally {
      button.disabled = false;
    }
  });
}
