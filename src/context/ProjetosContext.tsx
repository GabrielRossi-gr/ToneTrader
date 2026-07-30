import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

import {
    atualizarImagemProjetoBanco,
    atualizarTituloProjetoBanco,
    inserirProjetoBanco,
    listarProjetosBanco,
    removerProjetoBanco,
} from '../database/projetosDatabase';

import {
    removerImagemPermanente,
    salvarImagemPermanente,
} from '../services/arquivosProjetos';

export type Projeto = {
  id: string;
  titulo: string;
  imagemUri: string;
  criadoEm: number;
};

type ProjetosContextData = {
  projetos: Projeto[];
  carregando: boolean;

  adicionarProjeto: (
    imagemUri: string,
  ) => Promise<Projeto>;

  removerProjeto: (
    id: string,
  ) => Promise<void>;

  atualizarImagemProjeto: (
    id: string,
    imagemUri: string,
  ) => Promise<void>;

  atualizarTituloProjeto: (
    id: string,
    titulo: string,
  ) => Promise<void>;

  recarregarProjetos: () => Promise<void>;
};

const ProjetosContext =
  createContext<ProjetosContextData | undefined>(
    undefined,
  );

type ProjetosProviderProps = {
  children: ReactNode;
};

export function ProjetosProvider({
  children,
}: ProjetosProviderProps) {
  const [projetos, setProjetos] =
    useState<Projeto[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const recarregarProjetos = async () => {
    const projetosSalvos =
      await listarProjetosBanco();

    setProjetos(projetosSalvos);
  };

  useEffect(() => {
    let componenteAtivo = true;

    const carregarProjetos = async () => {
      try {
        const projetosSalvos =
          await listarProjetosBanco();

        if (componenteAtivo) {
          setProjetos(projetosSalvos);
        }
      } catch (erro) {
        console.error(
          'Erro ao carregar projetos:',
          erro,
        );
      } finally {
        if (componenteAtivo) {
          setCarregando(false);
        }
      }
    };

    carregarProjetos();

    return () => {
      componenteAtivo = false;
    };
  }, []);

  const obterProximoNumeroProjeto = () => {
    return projetos.reduce((maiorNumero, projeto) => {
      const resultado =
        projeto.titulo.match(/^Projeto (\d+)$/);

      const numero = resultado
        ? Number(resultado[1])
        : 0;

      return Math.max(maiorNumero, numero);
    }, 0) + 1;
  };

  const adicionarProjeto = async (
    imagemUri: string,
  ) => {
    const id =
      `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;

    const criadoEm = Date.now();

    const titulo =
      `Projeto ${obterProximoNumeroProjeto()}`;

    const imagemPermanenteUri =
      await salvarImagemPermanente(
        imagemUri,
        id,
      );

    const novoProjeto: Projeto = {
      id,
      titulo,
      imagemUri: imagemPermanenteUri,
      criadoEm,
    };

    try {
      await inserirProjetoBanco(novoProjeto);

      setProjetos((projetosAtuais) => [
        novoProjeto,
        ...projetosAtuais,
      ]);

      return novoProjeto;
    } catch (erro) {
      removerImagemPermanente(
        imagemPermanenteUri,
      );

      throw erro;
    }
  };

  const removerProjeto = async (
    id: string,
  ) => {
    const projeto = projetos.find(
      (item) => item.id === id,
    );

    await removerProjetoBanco(id);

    setProjetos((projetosAtuais) =>
      projetosAtuais.filter(
        (item) => item.id !== id,
      ),
    );

    if (projeto) {
      removerImagemPermanente(
        projeto.imagemUri,
      );
    }
  };

  const atualizarImagemProjeto = async (
    id: string,
    novaImagemUri: string,
  ) => {
    const projeto = projetos.find(
      (item) => item.id === id,
    );

    if (!projeto) {
      throw new Error(
        'Projeto não encontrado.',
      );
    }

    if (
      novaImagemUri === projeto.imagemUri
    ) {
      return;
    }

    const imagemPermanenteUri =
      await salvarImagemPermanente(
        novaImagemUri,
        id,
      );

    try {
      await atualizarImagemProjetoBanco(
        id,
        imagemPermanenteUri,
      );

      setProjetos((projetosAtuais) =>
        projetosAtuais.map((item) =>
          item.id === id
            ? {
                ...item,
                imagemUri:
                  imagemPermanenteUri,
              }
            : item,
        ),
      );

      removerImagemPermanente(
        projeto.imagemUri,
      );
    } catch (erro) {
      removerImagemPermanente(
        imagemPermanenteUri,
      );

      throw erro;
    }
  };

  const atualizarTituloProjeto = async (
    id: string,
    titulo: string,
  ) => {
    const tituloTratado = titulo.trim();

    if (!tituloTratado) {
      throw new Error(
        'O título não pode ficar vazio.',
      );
    }

    await atualizarTituloProjetoBanco(
      id,
      tituloTratado,
    );

    setProjetos((projetosAtuais) =>
      projetosAtuais.map((projeto) =>
        projeto.id === id
          ? {
              ...projeto,
              titulo: tituloTratado,
            }
          : projeto,
      ),
    );
  };

  return (
    <ProjetosContext.Provider
      value={{
        projetos,
        carregando,
        adicionarProjeto,
        removerProjeto,
        atualizarImagemProjeto,
        atualizarTituloProjeto,
        recarregarProjetos,
      }}
    >
      {children}
    </ProjetosContext.Provider>
  );
}

export function useProjetos() {
  const contexto = useContext(
    ProjetosContext,
  );

  if (!contexto) {
    throw new Error(
      'useProjetos precisa ser usado dentro de ProjetosProvider.',
    );
  }

  return contexto;
}