import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

import {
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  useProjetos,
  type Projeto,
} from '../../context/ProjetosContext';

import { styles } from './Fotos.styles';

export default function Fotos() {
  const {
    projetos,
    adicionarProjeto,
  } = useProjetos();

  /**
   * Abre a galeria do dispositivo e cria um novo projeto
   * usando a imagem selecionada.
   */
  const escolherFoto = async () => {
    try {
      const permissao =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          'Permissão necessária',
          'Permita que o ToneTrader acesse suas fotos para criar um projeto.',
        );

        return;
      }

      const resultado =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          allowsMultipleSelection: false,
          selectionLimit: 1,

          quality:
            Platform.OS === 'web'
              ? 0.35
              : 1,
      });

      if (resultado.canceled) {
        return;
      }

      const imagemSelecionada = resultado.assets[0];

      if (!imagemSelecionada?.uri) {
        Alert.alert(
          'Imagem inválida',
          'Não foi possível acessar a imagem selecionada.',
        );

        return;
      }

    await adicionarProjeto(
    imagemSelecionada.uri,
    );
    } catch (erro) {
      console.error(
        'Erro ao selecionar imagem:',
        erro,
      );

      Alert.alert(
        'Não foi possível abrir a foto',
        'Tente selecionar a imagem novamente.',
      );
    }
  };

  /**
   * Abre o editor correspondente ao projeto selecionado.
   *
   * Apenas o ID é enviado pela navegação. O restante dos
   * dados será obtido pelo ProjetosContext.
   */
  const abrirProjeto = (projeto: Projeto) => {
    router.push({
      pathname: '/projeto/[id]',
      params: {
        id: projeto.id,
      },
    });
  };

  const renderizarProjeto: ListRenderItem<Projeto> = ({
    item,
  }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.cardProjeto,
          pressed &&
            styles.cardProjetoPressionado,
        ]}
        onPress={() => abrirProjeto(item)}
        accessibilityRole="button"
        accessibilityLabel={`Abrir ${item.titulo}`}
        accessibilityHint="Abre o editor do projeto"
      >
        <Image
          source={{
            uri: item.imagemUri,
          }}
          style={styles.imagemProjeto}
          resizeMode="cover"
          accessibilityLabel={`Imagem de capa de ${item.titulo}`}
        />

        <View style={styles.rodapeCard}>
          <Text
            style={styles.tituloProjeto}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.titulo}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#040404"
      />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titulo}>
            Projetos
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.botaoAdicionar,
              pressed &&
                styles.botaoAdicionarPressionado,
            ]}
            onPress={escolherFoto}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Criar projeto"
            accessibilityHint="Abre a galeria para escolher uma foto"
          >
            <Text style={styles.iconeAdicionar}>
              +
            </Text>
          </Pressable>
        </View>

        <FlatList
          data={projetos}
          keyExtractor={(projeto) => projeto.id}
          renderItem={renderizarProjeto}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.lista}
          columnWrapperStyle={
            projetos.length > 0
              ? styles.linhaProjetos
              : undefined
          }
          ListEmptyComponent={
            <View style={styles.estadoVazio}>
              <Text
                style={styles.tituloEstadoVazio}
              >
                Nenhum projeto
              </Text>

              <Text
                style={styles.textoEstadoVazio}
              >
                Toque no botão + para escolher uma
                foto e criar seu primeiro projeto.
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.botaoPrimeiroProjeto,
                  pressed &&
                    styles.botaoAdicionarPressionado,
                ]}
                onPress={escolherFoto}
                accessibilityRole="button"
                accessibilityLabel="Criar primeiro projeto"
              >
                <Text
                  style={
                    styles.textoBotaoPrimeiroProjeto
                  }
                >
                  Escolher foto
                </Text>
              </Pressable>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}