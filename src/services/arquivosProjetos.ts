import {
    Directory,
    File,
    Paths,
} from 'expo-file-system';

const diretorioProjetos = new Directory(
  Paths.document,
  'projetos',
);

function garantirDiretorioProjetos() {
  diretorioProjetos.create({
    idempotent: true,
    intermediates: true,
  });
}

function obterExtensao(uri: string) {
  const uriSemParametros = uri.split('?')[0];
  const extensao = Paths.extname(uriSemParametros);

  if (!extensao || extensao.length > 10) {
    return '.jpg';
  }

  return extensao.toLowerCase();
}

export async function salvarImagemPermanente(
  imagemUri: string,
  projetoId: string,
) {
  garantirDiretorioProjetos();

  const arquivoOrigem = new File(imagemUri);

  if (!arquivoOrigem.exists) {
    throw new Error(
      'O arquivo de imagem selecionado não existe.',
    );
  }

  const extensao = obterExtensao(imagemUri);

  const nomeArquivo =
    `${projetoId}-${Date.now()}${extensao}`;

  const arquivoDestino = new File(
    diretorioProjetos,
    nomeArquivo,
  );

  await arquivoOrigem.copy(arquivoDestino);

  return arquivoDestino.uri;
}

export function removerImagemPermanente(
  imagemUri: string,
) {
  if (!imagemUri) {
    return;
  }

  try {
    const arquivo = new File(imagemUri);

    if (arquivo.exists) {
      arquivo.delete();
    }
  } catch (erro) {
    console.warn(
      'Não foi possível excluir a imagem:',
      erro,
    );
  }
}