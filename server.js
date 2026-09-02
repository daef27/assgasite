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
