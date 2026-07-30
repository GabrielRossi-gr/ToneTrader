import {
    ImageManipulator,
    SaveFormat,
} from 'expo-image-manipulator';

import {
    router,
    Stack,
    useLocalSearchParams,
} from 'expo-router';

import { SymbolView } from 'expo-symbols';

import {
    useEffect,
    useState,
} from 'react';

import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Pressable,
    StatusBar,
    Text,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useProjetos } from '../../context/ProjetosContext';

import { styles } from './ProjetoEditor.styles';

export default function ProjetoEditor() {
  const parametros = useLocalSearchParams<{
    id?: string | string[];
  }>();

  const id = Array.isArray(parametros.id)
    ? parametros.id[0]
    : parametros.id;

  const {
    projetos,
    carregando,
    removerProjeto,
    atualizarImagemProjeto,
  } = useProjetos();

  const projeto = projetos.find(
    (item) => item.id === id,
  );

  const [imagemAtualUri, setImagemAtualUri] =
    useState('');

  const [imagemBaseUri, setImagemBaseUri] =
    useState('');

  const [menuVisivel, setMenuVisivel] =
    useState(false);

  const [processando, setProcessando] =
    useState(false);

  /*
   * O projeto é carregado do SQLite de forma assíncrona.
   * Quando ele estiver disponível, atualizamos as imagens
   * exibidas no editor.
   */
  useEffect(() => {
    if (!projeto) {
      return;
    }

    setImagemAtualUri(projeto.imagemUri);
    setImagemBaseUri(projeto.imagemUri);
  }, [
    projeto?.id,
    projeto?.imagemUri,
  ]);

  const girarImagem = async (
    graus: number,
  ) => {
    if (
      !imagemAtualUri ||
      processando
    ) {
      return;
    }

    try {
      setProcessando(true);

      const manipulador =
        ImageManipulator.manipulate(
          imagemAtualUri,
        );

      manipulador.rotate(graus);

      const imagemRenderizada =
        await manipulador.renderAsync();

      const resultado =
        await imagemRenderizada.saveAsync({
          format: SaveFormat.JPEG,
          compress: 1,
        });

      setImagemAtualUri(resultado.uri);
    } catch (erro) {
      console.error(
        'Erro ao girar imagem:',
        erro,
      );

      Alert.alert(
        'Não foi possível editar',
        'Tente editar a imagem novamente.',
      );
    } finally {
      setProcessando(false);
    }
  };

  const restaurarImagem = () => {
    if (
      !imagemBaseUri ||
      processando
    ) {
      return;
    }

    setImagemAtualUri(imagemBaseUri);
  };

  const salvarAlteracoes =
    async () => {
      if (
        !projeto ||
        !imagemAtualUri ||
        processando
      ) {
        return;
      }

      try {
        setProcessando(true);

        await atualizarImagemProjeto(
          projeto.id,
          imagemAtualUri,
        );

        setImagemBaseUri(
          imagemAtualUri,
        );

        Alert.alert(
          'Projeto salvo',
          'As alterações da imagem foram salvas.',
        );
      } catch (erro) {
        console.error(
          'Erro ao salvar projeto:',
          erro,
        );

        Alert.alert(
          'Não foi possível salvar',
          'Tente salvar o projeto novamente.',
        );
      } finally {
        setProcessando(false);
      }
    };

  const excluirProjeto = async () => {
    if (
      !id ||
      processando
    ) {
      return;
    }

    try {
      setProcessando(true);

      await removerProjeto(id);

      /*
       * A pasta (tabs) é um grupo de rotas.
       * O endereço público da página é /fotos.
       */
      router.replace('/tabs/fotos');
    } catch (erro) {
      console.error(
        'Erro ao excluir projeto:',
        erro,
      );

      Alert.alert(
        'Não foi possível excluir',
        'Tente excluir o projeto novamente.',
      );

      setProcessando(false);
    }
  };

  const confirmarExclusao = () => {
    setMenuVisivel(false);

    Alert.alert(
      'Excluir projeto?',
      'Essa ação removerá o projeto e sua imagem do aplicativo.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            void excluirProjeto();
          },
        },
      ],
    );
  };

  /*
   * O contexto ainda está carregando os projetos
   * salvos no banco de dados.
   */
  if (carregando) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Projeto',
            headerRight: undefined,
          }}
        />

        <StatusBar
          barStyle="light-content"
          backgroundColor="#040404"
        />

        <View
          style={
            styles.projetoNaoEncontrado
          }
        >
          <ActivityIndicator
            size="large"
            color="#FF453A"
          />

          <Text
            style={
              styles.textoCarregamento
            }
          >
            Carregando projeto…
          </Text>
        </View>
      </>
    );
  }

  /*
   * O carregamento terminou, mas nenhum projeto
   * foi encontrado com o ID informado.
   */
  if (!projeto) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Projeto',
            headerRight: undefined,
          }}
        />

        <StatusBar
          barStyle="light-content"
          backgroundColor="#040404"
        />

        <View
          style={
            styles.projetoNaoEncontrado
          }
        >
          <Text
            style={
              styles.tituloProjetoNaoEncontrado
            }
          >
            Projeto não encontrado
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: projeto.titulo,

          headerRight: () => (
            <Pressable
              style={({ pressed }) => [
                styles.botaoConfiguracoes,

                pressed &&
                  styles.botaoPressionado,

                processando &&
                  styles.botaoDesabilitado,
              ]}
              onPress={() => {
                if (!processando) {
                  setMenuVisivel(true);
                }
              }}
              disabled={processando}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Abrir configurações do projeto"
            >
              <SymbolView
                name={{
                  ios: 'gearshape',
                  android: 'settings',
                  web: 'settings',
                }}
                tintColor="#FF453A"
                size={23}
                style={styles.iconeHeader}
              />
            </Pressable>
          ),
        }}
      />

      <StatusBar
        barStyle="light-content"
        backgroundColor="#040404"
      />

      <SafeAreaView
        style={styles.safeArea}
        edges={['bottom']}
      >
        <View style={styles.container}>
          <View style={styles.areaImagem}>
            {imagemAtualUri ? (
              <Image
                source={{
                  uri: imagemAtualUri,
                }}
                style={styles.imagem}
                resizeMode="contain"
                accessibilityLabel={`Imagem de ${projeto.titulo}`}
              />
            ) : (
              <View
                style={
                  styles.projetoNaoEncontrado
                }
              >
                <Text
                  style={
                    styles.tituloProjetoNaoEncontrado
                  }
                >
                  Não foi possível carregar a imagem
                </Text>
              </View>
            )}

            {processando && (
              <View
                style={
                  styles.carregamentoImagem
                }
              >
                <ActivityIndicator
                  size="large"
                  color="#FF453A"
                />

                <Text
                  style={
                    styles.textoCarregamento
                  }
                >
                  Processando imagem…
                </Text>
              </View>
            )}
          </View>

          <View style={styles.barraFerramentas}>
            <BotaoFerramenta
              titulo="Esquerda"
              simboloIOS="rotate.left"
              simboloAndroid="rotate_left"
              onPress={() => {
                void girarImagem(-90);
              }}
              desabilitado={processando}
            />

            <BotaoFerramenta
              titulo="Restaurar"
              simboloIOS="arrow.counterclockwise"
              simboloAndroid="restart_alt"
              onPress={restaurarImagem}
              desabilitado={
                processando ||
                imagemAtualUri ===
                  imagemBaseUri
              }
            />

            <BotaoFerramenta
              titulo="Direita"
              simboloIOS="rotate.right"
              simboloAndroid="rotate_right"
              onPress={() => {
                void girarImagem(90);
              }}
              desabilitado={processando}
            />

            <BotaoFerramenta
              titulo="Salvar"
              simboloIOS="square.and.arrow.down"
              simboloAndroid="save"
              onPress={() => {
                void salvarAlteracoes();
              }}
              destaque
              desabilitado={
                processando ||
                !imagemAtualUri
              }
            />
          </View>
        </View>

        <Modal
          visible={menuVisivel}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => {
            setMenuVisivel(false);
          }}
        >
          <View style={styles.modalContainer}>
            <Pressable
              style={styles.modalFundo}
              onPress={() => {
                setMenuVisivel(false);
              }}
              accessibilityRole="button"
              accessibilityLabel="Fechar configurações"
            />

            <View
              style={
                styles.menuConfiguracoes
              }
            >
              <View
                style={
                  styles.indicadorMenu
                }
              />

              <Text
                style={
                  styles.tituloConfiguracoes
                }
              >
                Configurações
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.opcaoExcluir,

                  pressed &&
                    styles.opcaoPressionada,
                ]}
                onPress={confirmarExclusao}
                accessibilityRole="button"
                accessibilityLabel="Excluir projeto"
              >
                <SymbolView
                  name={{
                    ios: 'trash',
                    android: 'delete',
                    web: 'delete',
                  }}
                  tintColor="#FF453A"
                  size={22}
                  style={
                    styles.iconeConfiguracao
                  }
                />

                <Text
                  style={
                    styles.textoOpcaoExcluir
                  }
                >
                  Excluir projeto
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.botaoCancelar,

                  pressed &&
                    styles.opcaoPressionada,
                ]}
                onPress={() => {
                  setMenuVisivel(false);
                }}
                accessibilityRole="button"
                accessibilityLabel="Cancelar"
              >
                <Text
                  style={
                    styles.textoCancelar
                  }
                >
                  Cancelar
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

type BotaoFerramentaProps = {
  titulo: string;
  simboloIOS: string;
  simboloAndroid: string;
  onPress: () => void;
  destaque?: boolean;
  desabilitado?: boolean;
};

function BotaoFerramenta({
  titulo,
  simboloIOS,
  simboloAndroid,
  onPress,
  destaque = false,
  desabilitado = false,
}: BotaoFerramentaProps) {
  const cor = destaque
    ? '#FF453A'
    : '#FFFFFF';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.botaoFerramenta,

        pressed &&
          !desabilitado &&
          styles.botaoFerramentaPressionado,

        desabilitado &&
          styles.botaoDesabilitado,
      ]}
      onPress={onPress}
      disabled={desabilitado}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{
        disabled: desabilitado,
      }}
    >
      <SymbolView
        name={{
          ios: simboloIOS as never,
          android:
            simboloAndroid as never,
          web: simboloAndroid as never,
        }}
        tintColor={cor}
        size={23}
        style={styles.iconeFerramenta}
      />

      <Text
        style={[
          styles.textoFerramenta,

          destaque &&
            styles.textoFerramentaDestaque,
        ]}
      >
        {titulo}
      </Text>
    </Pressable>
  );
}