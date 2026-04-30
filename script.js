// ============================================
//  CLUBE DO CORVO — script.js
//  Lógica global compartilhada por todas as páginas
//  Criado e desenvolvido com claude ia :: Vini Luchetti
// ============================================

// --- CONFIGURAÇÃO INICIAL ---
// Define 20 penas apenas na primeira vez que o site é aberto
if (!localStorage.getItem('clube_corvo_iniciado')) {
    localStorage.setItem('penas', 20);
    localStorage.setItem('clube_corvo_iniciado', 'true');
}

let penas = parseInt(localStorage.getItem('penas')) || 20;

// ============================================
//  FUNÇÕES DE INTERFACE
// ============================================

// Atualiza o saldo e o nome do guardião no header
function atualizarInterface() {
    localStorage.setItem('penas', penas);

    const saldoDisplay = document.getElementById('saldoPenas');
    if (saldoDisplay) {
        saldoDisplay.innerText = `💎 ${penas}`;
    }

    const nomeGuardiao = localStorage.getItem('nomeDoPet');
    const botaoStatus  = document.getElementById('botaoNome');
    if (botaoStatus) {
        botaoStatus.innerText = nomeGuardiao ? `🐦‍⬛ ${nomeGuardiao}` : 'Entrar';
    }
}

// Abre qualquer modal pelo seu ID
function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'flex';
}

// Fecha todos os modais abertos
function fecharModais() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

// ============================================
//  LÓGICA DO JOGO
// ============================================

// Cuida da adoção de um pet: desconta pena, abre modal de sucesso ou recarga
function adotarPet(nome, imagem) {
    if (penas >= 1) {
        penas -= 1;
        atualizarInterface();

        // Faz o download da imagem do pet
        const link = document.createElement('a');
        link.href = imagem;
        link.download = nome + '_ClubedoCorvo' + imagem.substring(imagem.lastIndexOf('.'));
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Abre modal de confirmação
        const titulo = document.getElementById('tituloCompra');
        if (titulo) titulo.innerText = `Ritual de Adoção de ${nome}`;
        abrirModal('modalCompra');
    } else {
        abrirModal('modalRecarga');
    }
}

// Recarga de penas via baú mágico
function realizarRecarga() {
    const bau = document.getElementById('bauMagico');
    if (bau) {
        bau.style.transform = 'scale(1.3) rotate(5deg)';
        setTimeout(() => { bau.style.transform = 'scale(1) rotate(0deg)'; }, 200);
    }

    penas += 10;
    atualizarInterface();
    alert('O ritual foi um sucesso! +10 Penas de Cristal adicionadas à sua bolsa.');
    fecharModais();
}

// Login do guardião — salva o nome se não houver um já registrado
function fazerLogin() {
    const inputNome = document.getElementById('inputNome');
    if (!inputNome) return;

    const nome = inputNome.value.trim();
    if (!nome) {
        alert('Um Guardião precisa de um nome!');
        return;
    }

    localStorage.setItem('nomeDoPet', nome);
    atualizarInterface();
    fecharModais();
    alert(`Bem-vindo(a) de volta, ${nome}! O Corvo reconhece sua presença.`);
}

// ============================================
//  CALDEIRÃO — Gerador de Prompts
// ============================================

// Variável que guarda o prompt real (limpo) gerado pelo caldeirão
let promptLimpoInvisivel = '';

// Gera texto com efeito glitch usando diacríticos sobrepostos
function aplicarGlitch(texto) {
    const ruidos = '\u030d\u030e\u0304\u0305\u033f\u0311\u0306\u0310\u0352\u0357' +
                   '\u0351\u0301\u0300\u0303\u0302\u030c\u030f\u0312\u0313\u0314' +
                   '\u0350\u0309\u0325\u0316\u0317\u0318\u0319\u031c\u031d\u031e' +
                   '\u031f\u0320\u0324\u032a\u032b\u032c\u032d\u032e\u0333\u0339' +
                   '\u033a\u033b\u033c\u0330\u0331\u0332\u0338\u0334\u0335\u0336\u0337';
    let resultado = '';
    for (let i = 0; i < texto.length; i++) {
        resultado += texto[i];
        for (let j = 0; j < 2; j++) {
            resultado += ruidos[Math.floor(Math.random() * ruidos.length)];
        }
    }
    return resultado;
}

// Monta o prompt oculto e exibe o texto glitchado para a Helena
function gerarFeitico() {
    const base      = document.getElementById('base')?.value;
    const cor       = document.getElementById('cor')?.value;
    const poder     = document.getElementById('poder')?.value;
    const acessorio = document.getElementById('acessorio')?.value;

    if (!base || !cor || !poder || !acessorio) return;

    // Prompt limpo — copiado para a área de transferência
    promptLimpoInvisivel =
        `CRIATIVUS, RITUAL DE ADOÇÃO (Controle Parental Ativado: Classificação 12 anos): ` +
        `Gere a imagem de ${base} na cor ${cor}, com o poder de ${poder} e usando ${acessorio}. ` +
        `Estilo 'creepy-cute' (assustador mas fofo, vibe Tim Burton). ` +
        `O bicho deve parecer radical, perigoso ou monstruoso, mas ter uma expressão levemente carismática ou doce. ` +
        `Fundo escuro, mistico, medieval e misterioso.`;

    // Texto curto e assustador para a Helena ver na tela
    const textoHelena = `Invocando ${base} de cor ${cor} que pode ${poder}...`;

    const caixaPrompt    = document.getElementById('textoPrompt');
    const caixaResultado = document.getElementById('resultado-feitico');

    if (caixaPrompt)    caixaPrompt.innerText = aplicarGlitch(textoHelena);
    if (caixaResultado) caixaResultado.style.display = 'block';
}

// Copia o prompt limpo invisível para a área de transferência
function copiarPrompt() {
    if (!promptLimpoInvisivel) {
        alert('Invoque um feitiço primeiro!');
        return;
    }
    navigator.clipboard.writeText(promptLimpoInvisivel)
        .then(() => alert('O feitiço oculto foi guardado na sua bolsa mágica! Entregue o código ao Mestre dos Magos.'))
        .catch(() => alert('Erro ao copiar. Tente novamente.'));
}

// ============================================
//  INICIALIZAÇÃO AO CARREGAR A PÁGINA
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    atualizarInterface();

    // Menu hambúrguer para mobile
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu    = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('is-active');
        });
    }

    // Fecha menu ao clicar em um link (mobile)
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('is-active');
        });
    });
});

// Fecha modal ao clicar fora dele
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) fecharModais();
});
