import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory data store replicating index.php schema
let configData = [{
  id: 1,
  senha: 'ASSGA2026',
  nome_associacao: 'ASSGA - Associação Desportiva',
  endereco: 'São Gonçalo do Amarante - RN',
  email: 'assgar2019@gmail.com',
  telefone: '(84) 99698-1248',
  cnpj: '57.242.499/0001-60'
}];

let noticiasData = [{
  id: 1,
  titulo: '2º HALLOWEEN ASSGA',
  conteudo: 'Estão abertas as inscrições para o 2º HALLOWEEN ASSGA! Prepare-se para um evento especial com muita diversão, esporte, integração e confraternização.',
  imagem: 'src/imagens/halloween-assga.jpeg',
  data: '15/08/2026'
}];

let eventosData = [{
  id: 1,
  titulo: '2º HALLOWEEN ASSGA',
  descricao: 'Evento especial esportivo e de integração com premiações e confraternização.',
  data_inicio: '15/10/2026',
  data_fim: '16/10/2026',
  local: 'Ginásio Poliesportivo de São Gonçalo do Amarante - RN',
  vagas: 100,
  valor: 50.00,
  status: 'aberto'
}];

let diretoriaData = [{
  id: 1,
  nome: 'Diretoria Executiva',
  cargo: 'Presidência',
  descricao: 'Gestão e representação da Associação Desportiva ASSGA',
  email: 'assgar2019@gmail.com',
  telefone: '(84) 99698-1248'
}];

let estatutoData = [{
  id: 1,
  conteudo: '<p>Documento oficial que regulamenta os princípios, direitos e deveres dos associados da ASSGA.</p>'
}];

let historiaData = {
  id: 1,
  titulo: 'Nossa História',
  subtitulo: 'Conheça a trajetória da ASSGA, desde sua fundação até os dias atuais.',
  data: 'Fundada em 2019',
  imagem: 'src/imagens/Assga_foto.jpg',
  texto: 'A ASSGA - Associação Desportiva foi fundada em 2019 na cidade de São Gonçalo do Amarante - RN, com o objetivo de promover o esporte, a integração social e o bem-estar da comunidade. Um grupo de apaixonados por esportes se uniu para criar uma associação que pudesse oferecer atividades esportivas de qualidade para todas as idades.',
  textoExtra: '<p><i class="fas fa-star" style="color:#ffd700;"></i> A ASSGA é feita de pessoas, histórias e conquistas. Cada passo é uma vitória!</p>',
  itens: [
    {
      id: 1,
      titulo: 'Fundação da ASSGA',
      data: '2019',
      texto: 'Início das atividades da Associação Desportiva ASSGA em São Gonçalo do Amarante - RN, unindo atletas, apoiadores e a comunidade.',
      imagem: 'src/imagens/Assga_foto.jpg'
    },
    {
      id: 2,
      titulo: 'Primeiros Torneios e Campeonatos',
      data: '2020 - 2021',
      texto: 'Realização dos primeiros campeonatos com grande participação e entusiasmo da comunidade desportiva.',
      imagem: 'src/imagens/foto1.jpg'
    },
    {
      id: 3,
      titulo: 'Expansão e Conquistas Esportivas',
      data: '2022 - 2024',
      texto: 'Crescimento contínuo, integração social e expansão de modalidades esportivas com destaque regional.',
      imagem: 'src/imagens/foto2.jpg'
    },
    {
      id: 4,
      titulo: 'Presença Digital e Eventos Especiais',
      data: '2026',
      texto: 'Consolidação da presença digital, carteirinhas de sócios e realizações como o 2º Halloween ASSGA.',
      imagem: 'src/imagens/foto3.jpg'
    }
  ]
};

let inscricoesData = [];

// API Handler supporting both `?api=<action>` and `/api/<action>`
function handleApiAction(action, req, res) {
  switch (action) {
    case 'noticias':
      return res.json([...noticiasData].reverse());
    case 'salvar_noticia': {
      const item = req.body;
      if (item.id) {
        const idx = noticiasData.findIndex(n => n.id === Number(item.id));
        if (idx !== -1) noticiasData[idx] = { ...noticiasData[idx], ...item };
      } else {
        item.id = Date.now();
        noticiasData.push(item);
      }
      return res.json({ status: 'ok' });
    }
    case 'excluir_noticia': {
      const id = Number(req.query.id);
      noticiasData = noticiasData.filter(n => n.id !== id);
      return res.json({ status: 'ok' });
    }

    case 'eventos':
      return res.json([...eventosData].reverse());
    case 'salvar_evento': {
      const item = req.body;
      if (item.id) {
        const idx = eventosData.findIndex(e => e.id === Number(item.id));
        if (idx !== -1) eventosData[idx] = { ...eventosData[idx], ...item };
      } else {
        item.id = Date.now();
        eventosData.push(item);
      }
      return res.json({ status: 'ok' });
    }
    case 'excluir_evento': {
      const id = Number(req.query.id);
      eventosData = eventosData.filter(e => e.id !== id);
      return res.json({ status: 'ok' });
    }

    case 'diretoria':
      return res.json(diretoriaData);
    case 'salvar_membro': {
      const item = req.body;
      if (item.id) {
        const idx = diretoriaData.findIndex(d => d.id === Number(item.id));
        if (idx !== -1) diretoriaData[idx] = { ...diretoriaData[idx], ...item };
      } else {
        item.id = Date.now();
        diretoriaData.push(item);
      }
      return res.json({ status: 'ok' });
    }
    case 'excluir_membro': {
      const id = Number(req.query.id);
      diretoriaData = diretoriaData.filter(d => d.id !== id);
      return res.json({ status: 'ok' });
    }

    case 'estatuto':
      return res.json(estatutoData);
    case 'salvar_estatuto': {
      const item = req.body;
      if (estatutoData.length > 0) {
        estatutoData[0].conteudo = item.conteudo;
      } else {
        estatutoData.push({ id: 1, conteudo: item.conteudo });
      }
      return res.json({ status: 'ok' });
    }

    case 'historia':
      return res.json(historiaData);
    case 'salvar_historia': {
      historiaData = { ...historiaData, ...req.body };
      return res.json({ status: 'ok' });
    }

    case 'inscricoes':
      return res.json([...inscricoesData].reverse());
    case 'salvar_inscricao': {
      const item = req.body;
      item.id = Date.now();
      item.codigo = 'ASSGA-' + Date.now();
      item.data = new Date().toLocaleString('pt-BR');
      inscricoesData.push(item);
      return res.json({ status: 'ok' });
    }
    case 'alterar_pagamento': {
      const id = Number(req.query.id);
      const status = req.query.status;
      const target = inscricoesData.find(i => i.id === id);
      if (target) target.status_pagamento = status;
      return res.json({ status: 'ok' });
    }
    case 'excluir_inscricao': {
      const id = Number(req.query.id);
      inscricoesData = inscricoesData.filter(i => i.id !== id);
      return res.json({ status: 'ok' });
    }
    case 'resetar_inscricoes': {
      inscricoesData = [];
      return res.json({ status: 'ok' });
    }

    case 'config':
      return res.json(configData);
    case 'salvar_config': {
      configData[0] = { ...configData[0], ...req.body };
      return res.json({ status: 'ok' });
    }

    case 'login': {
      const senha = req.body?.senha;
      if (senha === configData[0].senha) {
        return res.json({ status: 'ok', admin: true });
      }
      return res.json({ status: 'erro', msg: 'Senha incorreta' });
    }

    default:
      return res.json({ status: 'erro', msg: 'Ação inválida' });
  }
}

// Intercept ?api= queries on any route
app.use((req, res, next) => {
  if (req.query.api) {
    return handleApiAction(req.query.api, req, res);
  }
  next();
});

// Dedicated /api/:action route
app.all('/api/:action', (req, res) => {
  return handleApiAction(req.params.action, req, res);
});

// Backward compatibility for legacy PHP URLs
app.get('/admin.php', (req, res) => {
  res.redirect(301, '/admin.html');
});

app.get('/index.php', (req, res) => {
  res.redirect(301, '/');
});

// Serve all static files from workspace root
app.use(express.static(__dirname));

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`ASSGA site server running on http://0.0.0.0:${PORT}`);
});
