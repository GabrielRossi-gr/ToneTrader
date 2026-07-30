export type ProjetoBanco = {
  id: string;
  titulo: string;
  imagemUri: string;
  criadoEm: number;
};

type StorageWeb = {
  getItem: (chave: string) => string | null;
  setItem: (chave: string, valor: string) => void;
  removeItem: (chave: string) => void;
};

const CHAVE_PROJETOS = '@tonetrader:projetos';

let projetosEmMemoria: ProjetoBanco[] = [];

function obterLocalStorage(): StorageWeb | null {
  try {
    const ambiente = globalThis as typeof globalThis & {
      localStorage?: StorageWeb;
    };

    return ambiente.localStorage ?? null;
  } catch {
    return null;
  }
}

function lerProjetos(): ProjetoBanco[] {
  const storage = obterLocalStorage();

  if (!storage) {
    return projetosEmMemoria;
  }

  try {
    const dados = storage.getItem(CHAVE_PROJETOS);

    if (!dados) {
      return [];
    }

    const projetos = JSON.parse(dados);

    if (!Array.isArray(projetos)) {
      return [];
    }

    return projetos as ProjetoBanco[];
  } catch (erro) {
    console.error(
      'Erro ao ler projetos no navegador:',
      erro,
    );

    return [];
  }
}

function salvarProjetos(
  projetos: ProjetoBanco[],
): void {
  projetosEmMemoria = projetos;

  const storage = obterLocalStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(
      CHAVE_PROJETOS,
      JSON.stringify(projetos),
    );
  } catch (erro) {
    console.error(
      'Erro ao salvar projetos no navegador:',
      erro,
    );

    throw new Error(
      'O armazenamento do navegador está cheio. Tente usar uma imagem menor.',
    );
  }
}

export async function inicializarBanco():
  Promise<void> {
  // Na web, o localStorage não precisa ser inicializado.
}

export async function listarProjetosBanco():
  Promise<ProjetoBanco[]> {
  const projetos = lerProjetos();

  return [...projetos].sort(
    (projetoA, projetoB) =>
      projetoB.criadoEm - projetoA.criadoEm,
  );
}

export async function inserirProjetoBanco(
  projeto: ProjetoBanco,
): Promise<void> {
  const projetos = lerProjetos();

  const projetoExistente = projetos.some(
    (item) => item.id === projeto.id,
  );

  if (projetoExistente) {
    throw new Error(
      'Já existe um projeto com esse identificador.',
    );
  }

  salvarProjetos([
    projeto,
    ...projetos,
  ]);
}

export async function atualizarImagemProjetoBanco(
  id: string,
  imagemUri: string,
): Promise<void> {
  const projetos = lerProjetos();

  salvarProjetos(
    projetos.map((projeto) =>
      projeto.id === id
        ? {
            ...projeto,
            imagemUri,
          }
        : projeto,
    ),
  );
}

export async function atualizarTituloProjetoBanco(
  id: string,
  titulo: string,
): Promise<void> {
  const projetos = lerProjetos();

  salvarProjetos(
    projetos.map((projeto) =>
      projeto.id === id
        ? {
            ...projeto,
            titulo,
          }
        : projeto,
    ),
  );
}

export async function removerProjetoBanco(
  id: string,
): Promise<void> {
  const projetos = lerProjetos();

  salvarProjetos(
    projetos.filter(
      (projeto) => projeto.id !== id,
    ),
  );
}