import * as SQLite from 'expo-sqlite';

export type ProjetoBanco = {
  id: string;
  titulo: string;
  imagemUri: string;
  criadoEm: number;
};

type ProjetoRow = {
  id: string;
  titulo: string;
  imagem_uri: string;
  criado_em: number;
};

const NOME_BANCO = 'tonetrader.db';

let bancoPromise:
  | Promise<SQLite.SQLiteDatabase>
  | null = null;

let inicializacaoPromise: Promise<void> | null = null;

async function obterBanco() {
  if (!bancoPromise) {
    bancoPromise =
      SQLite.openDatabaseAsync(NOME_BANCO);
  }

  return bancoPromise;
}

export async function inicializarBanco() {
  if (!inicializacaoPromise) {
    inicializacaoPromise = (async () => {
      const banco = await obterBanco();

      await banco.execAsync(`
        PRAGMA journal_mode = WAL;

        CREATE TABLE IF NOT EXISTS projetos (
          id TEXT PRIMARY KEY NOT NULL,
          titulo TEXT NOT NULL,
          imagem_uri TEXT NOT NULL,
          criado_em INTEGER NOT NULL
        );
      `);
    })();
  }

  return inicializacaoPromise;
}

async function obterBancoInicializado() {
  await inicializarBanco();
  return obterBanco();
}

export async function listarProjetosBanco():
  Promise<ProjetoBanco[]> {
  const banco = await obterBancoInicializado();

  const registros =
    await banco.getAllAsync<ProjetoRow>(`
      SELECT
        id,
        titulo,
        imagem_uri,
        criado_em
      FROM projetos
      ORDER BY criado_em DESC
    `);

  return registros.map((registro) => ({
    id: registro.id,
    titulo: registro.titulo,
    imagemUri: registro.imagem_uri,
    criadoEm: registro.criado_em,
  }));
}

export async function inserirProjetoBanco(
  projeto: ProjetoBanco,
) {
  const banco = await obterBancoInicializado();

  await banco.runAsync(
    `
      INSERT INTO projetos (
        id,
        titulo,
        imagem_uri,
        criado_em
      )
      VALUES (?, ?, ?, ?)
    `,
    [
      projeto.id,
      projeto.titulo,
      projeto.imagemUri,
      projeto.criadoEm,
    ],
  );
}

export async function atualizarImagemProjetoBanco(
  id: string,
  imagemUri: string,
) {
  const banco = await obterBancoInicializado();

  await banco.runAsync(
    `
      UPDATE projetos
      SET imagem_uri = ?
      WHERE id = ?
    `,
    [imagemUri, id],
  );
}

export async function atualizarTituloProjetoBanco(
  id: string,
  titulo: string,
) {
  const banco = await obterBancoInicializado();

  await banco.runAsync(
    `
      UPDATE projetos
      SET titulo = ?
      WHERE id = ?
    `,
    [titulo, id],
  );
}

export async function removerProjetoBanco(
  id: string,
) {
  const banco = await obterBancoInicializado();

  await banco.runAsync(
    `
      DELETE FROM projetos
      WHERE id = ?
    `,
    [id],
  );
}