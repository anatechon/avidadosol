# ☀️ A Vida do Sol (The Life of the Sun)

> Uma experiência interativa que percorre dez bilhões de anos para acompanhar o nascimento, a expansão e o ocaso da nossa estrela.

Este é um **projeto de estudos desenvolvido por Ana Tech**, com foco em computação gráfica no navegador, shaders GLSL de alta fidelidade e design de interação física e responsiva.

---

## 🌌 Sobre o Projeto

**A Vida do Sol** recria a linha do tempo estelar em uma interface ultra minimalista sobre fundo preto absoluto. No centro superior, repousa uma esfera solar incandescente que evolui através de **10 estágios** — desde o colapso gravitacional da nebulosa primordial até o remanescente frio de uma anã branca.

Todo o visual da estrela, halos térmicos, filamentos de poeira e turbulência superficial são gerados **em tempo real** utilizando um **Fragment Shader puro em WebGL**, sem uso de texturas, imagens ou vídeos pré-renderizados.

---

## ✨ Funcionalidades Principais

- **WebGL Fragment Shader Procedimental**: 
  - Superfície solar dinâmica usando ruído fractal (*Fractional Brownian Motion - FBM*).
  - Simulação de convecção, células granulares, ejeções coronais e filamentos de nebulosa planetária.
  - Halo térmico fechado que decai a zero rapidamente, mantendo o fundo em preto puro (`#000000`).
  - Efeito de distorção e desfoque horizontal (*motion blur*) proporcional à velocidade de rotação da esfera.

- **Trilha Sonora Cósmica Generativa (Web Audio API)**:
  - Sintetizador ambiente espacial procedural sem dependência de arquivos externos pesados.
  - Camada de sub-graves (*gravitational waves* a 55Hz com batimentos binaurais).
  - Acordes etéreos abertos com modulação lenta (*LFO*) e espacialização estéreo.
  - Vento solar e ruído rosa com filtro passa-faixa dinâmico.
  - Início suave e automático, com modulação de frequência em tempo real acompanhando a evolução e intensidade de cada era solar.
  - Botão minimalista no topo para controle rápido de áudio (mutar/desmutar).

- **Física de Interação e Inércia**:
  - Cada rolagem (*scroll* / *wheel*), arraste ou movimento com o mouse aplica um impulso angular (`omega`), arremessando a esfera que desacelera organicamente por atrito.
  - Autoplay suave que avança os estágios caso o usuário fique inativo.
  - Suporte a acessibilidade (`prefers-reduced-motion`) com transições suavizadas.

- **Linha do Tempo com 37 Marcadores**:
  - Régua interativa com curva gaussiana dinâmica que reage à posição do cursor e destaca a fase ativa.
  - Navegação fluida por scroll, clique, arraste ou setas do teclado (`←`, `→`, `↑`, `↓`).

- **Tipografia e Transições**:
  - Títulos e descrições com transição suave de desfoque e opacidade a cada mudança de era.
  - Interface totalmente traduzida e adaptada para o **Português do Brasil (pt-BR)**.

---

## 🪐 As 10 Fases da Evolução Solar

1. **4,6 bilhões de anos atrás** — *Nebulosa solar*: Uma nuvem fria colapsa para o centro
2. **4,57 bilhões de anos atrás** — *Protoestrela*: A gravidade aquece o jovem núcleo
3. **4,5 bilhões de anos atrás** — *Ignição*: O hidrogênio começa a queimar
4. **Hoje** — *O Sol*: Na metade de sua vida
5. **1 bilhão de anos no futuro** — *Sol mais brilhante*: Os oceanos evaporam completamente
6. **5 bilhões de anos no futuro** — *Subgigante*: O núcleo esgota seu combustível
7. **7,6 bilhões de anos no futuro** — *Gigante vermelha*: O Sol engole Mercúrio
8. **7,7 bilhões de anos no futuro** — *Flash de hélio*: O núcleo entra em nova ignição
9. **7,8 bilhões de anos no futuro** — *Nebulosa planetária*: As camadas externas se dissipam
10. **8 bilhões de anos no futuro** — *Anã branca*: Uma brasa do tamanho da Terra

---

## 🛠️ Tecnologias Utilizadas

- **React 19**
- **TypeScript**
- **WebGL / GLSL (OpenGL Shading Language)**
- **Vite**
- **Tailwind CSS**
- **Google Fonts (Inter)**

---

## 👩‍💻 Autoria e Créditos

Projeto de estudos desenvolvido com dedicação por **Ana Tech**.  
Inspirado na beleza e dinâmica da astrofísica estelar e na precisão da arte generativa com shaders WebGL.
