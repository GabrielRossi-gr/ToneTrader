

  // const tone = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B','Bd']


import Slider from '@react-native-community/slider';
import { useRef, useState } from 'react';
import Svg, { Path } from 'react-native-svg';


import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const TAMANHO_ROLETA = width * 0.8;
const RAIO = TAMANHO_ROLETA / 2;
const DISTANCIA_CENTRO = 28; // espaço entre o centro e o início do ponteiro


// Escala cromática principal (12 notas)
const NOTAS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Segunda camada de notas menores (exemplo fornecido)
const NOTAS2 = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Bd', ' '];

const ANGULO_POR_NOTA = 360 / 12; // 30 graus

// Binding element 'angulo' implicitly has an 'any' type.
function ArcoCentro({ angulo }: { angulo: number }) {

  const tamanho = 60;
  const centro = tamanho / 2;

  const raio = 27;

  const inicio = -90;
  const fim = inicio + angulo;

  const polar = (graus: number) => {
    const rad = (graus * Math.PI) / 180;

    return {
      x: centro + raio * Math.cos(rad),
      y: centro + raio * Math.sin(rad),
    };
  };

  const inicioPonto = polar(inicio);
  const fimPonto = polar(fim);

  const grandeArco = angulo > 180 ? 1 : 0;

  const caminho = `
    M ${inicioPonto.x} ${inicioPonto.y}
    A ${raio} ${raio} 0 ${grandeArco} 1 ${fimPonto.x} ${fimPonto.y}
  `;

  return (
    <Svg
      width={tamanho}
      height={tamanho}
      viewBox={`0 0 ${tamanho} ${tamanho}`}
    >
      <Path
        d={caminho}
        stroke="#FF3B30"
        strokeWidth="4"
        fill="none"
        strokeLinecap="square"
      />
    </Svg>
  );
}




export default function ConversorTons() {
  const [intervalo, setIntervalo] = useState(2);
  const [indiceNotaBase, setIndiceNotaBase] = useState(0);
  const anguloArco =
    intervalo >= 0
      ? intervalo * ANGULO_POR_NOTA
      : 360 + (intervalo * ANGULO_POR_NOTA);

  const angulo1 = 0;
  const angulo2 = intervalo * ANGULO_POR_NOTA;
  const anguloCentro = (angulo1 + angulo2) / 2;

  const rotacaoAnimada = useRef(new Animated.Value(0)).current;
  const rotacaoAcumulada = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const novaRotacao = rotacaoAcumulada.current + gestureState.dx;
        rotacaoAnimada.setValue(novaRotacao);
      },
      onPanResponderRelease: (_, gestureState) => {
        const rotacaoFinal = rotacaoAcumulada.current + gestureState.dx;
        const passos = Math.round(rotacaoFinal / ANGULO_POR_NOTA);
        const rotacaoSnap = passos * ANGULO_POR_NOTA;

        Animated.spring(rotacaoAnimada, {
          toValue: rotacaoSnap,
          useNativeDriver: true,
        }).start();

        rotacaoAcumulada.current = rotacaoSnap;

        let indice = (-passos) % 12;
        if (indice < 0) indice += 12;
        setIndiceNotaBase(indice);
      },
    })
  ).current;

  const calcularNotaDestino = () => {
    let indiceDestino = (indiceNotaBase + intervalo) % 12;
    if (indiceDestino < 0) indiceDestino += 12;
    return NOTAS[indiceDestino];
  };

  const calcularNotaDestino2 = () => {
    let indiceDestino = (indiceNotaBase + intervalo) % 12;
    if (indiceDestino < 0) indiceDestino += 12;
    return NOTAS2[indiceDestino];
  };

  const rotacaoRoletaStyle = {
    transform: [
      {
        rotate: rotacaoAnimada.interpolate({
          inputRange: [0, 360],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.titulo}>
          ToneTrader
        </Text>
      </View>

      <View style={styles.trianguloIndicador} />

      <View style={styles.areaRoleta} {...panResponder.panHandlers}>
        <Animated.View style={[styles.roleta, rotacaoRoletaStyle]}>
          
          {/* Camada 1: Notas Principais */}
          {NOTAS.map((nota, index) => {
            const angulo = index * ANGULO_POR_NOTA;
            return (
              <View
                key={`nota1-${index}`}
                style={[
                  styles.fatiaNota,
                  { transform: [{ rotate: `${angulo}deg` }] },
                ]}
              >
                <Text style={styles.textoNota}>{nota}</Text>
                <View style={styles.linhaFatia} />
              </View>
            );
          })}

          {/* Camada 2: Notas Menores (Logo abaixo das principais) */}
          {NOTAS2.map((nota2, index) => {
            if (nota2.trim() === '') return null; // Ignora se estiver vazio
            const angulo = index * ANGULO_POR_NOTA;
            return (
              <View
                key={`nota2-${index}`}
                style={[
                  styles.fatiaNota,
                  { transform: [{ rotate: `${angulo}deg` }] },
                ]}
              >
                <Text style={styles.textoNotaMenor}>{nota2}</Text>
              </View>
            );
          })}
        </Animated.View>

        <View style={styles.indicadorCentro}>
          <ArcoCentro angulo={anguloArco}/>
          <View
            style={[
              styles.containerBraco,
              { transform: [{ rotate: '0deg' }] },
            ]}
          >
            <View style={styles.bracoLaranja}/>
          </View>

          <View
            style={[
              styles.containerBraco,
              {
                transform: [
                  { rotate: `${intervalo * ANGULO_POR_NOTA}deg` },
                ],
              },
            ]}
          >
            <View style={styles.bracoLaranja}/>
          </View>
        </View>

      </View>
      <View style={styles.painelInfo}>
        <Text style={styles.textoInfo}>
          De: <Text style={styles.destaque}>{NOTAS[indiceNotaBase]}</Text> 
          {NOTAS2[indiceNotaBase].trim() !== '' ? ` (${NOTAS2[indiceNotaBase]})` : ''}
        </Text>
        <Text style={styles.textoInfo}>
          Para: <Text style={styles.destaqueDestino}>{calcularNotaDestino()}</Text>
          {calcularNotaDestino2().trim() !== '' ? ` (${calcularNotaDestino2()})` : ''}
        </Text>
        <Text style={styles.textoSub}>Intervalo: {intervalo > 0 ? `+${intervalo}` : intervalo} semitons</Text>
      </View>

      <View style={styles.containerSlider}>
        <Text style={{ color: '#8E8E93' }}>-12</Text>
        <Slider
          style={styles.slider}
          minimumValue={-12}
          maximumValue={12}
          step={1}
          value={2}
          onValueChange={(valor) => setIntervalo(valor)}
          minimumTrackTintColor="#8E8E93"
          maximumTrackTintColor="#8E8E93"
          thumbTintColor="#FF0000"
        />
        <Text style={{ color: '#8E8E93' }}>+12</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040404',
    alignItems: 'center',
    paddingTop: 35,
  },
  header: {
    width: '100%',
    paddingLeft: 20,
    marginBottom: 30,
    alignItems: 'flex-start',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  trianguloIndicador: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 15,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FF0000',
    marginBottom: 10,
    zIndex: 10,
  },
  areaRoleta: {
    width: TAMANHO_ROLETA,
    height: TAMANHO_ROLETA,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleta: {
    width: TAMANHO_ROLETA,
    height: TAMANHO_ROLETA,
    borderRadius: RAIO,
    backgroundColor: '#b2b2b2',
    borderWidth: 1,
    borderColor: '#ffffff',
    position: 'absolute',
    overflow: 'hidden',
  },
  fatiaNota: {
    position: 'absolute',
    width: TAMANHO_ROLETA,
    height: TAMANHO_ROLETA,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textoNota: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  textoNotaMenor: {
    marginTop: 45, // Joga a nota menor mais para o centro da roleta
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  linhaFatia: {
    position: 'absolute',
    width: 1,
    height: RAIO,
    backgroundColor: '#636366',
    top: 0,
    left: RAIO - 0.5,
    transform: [{ rotate: '15deg' }],
    transformOrigin: 'bottom',
  },
  containerBraco: {
    position: 'absolute',
    width: 0,
    height: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerArcoCentro: {
    position: 'absolute',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  indicadorCentro: {
    position: 'absolute',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  
  pontoCentroLaranja: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  mascaraCentro: {
    position: 'absolute',
    width: 20,
    height: 40,
    backgroundColor: '#FF0000', // mesma cor da roleta
    top: -2,
    left: 7.5,
    borderRadius: 20,
  },
  bracoLaranja: {
    position: 'absolute',
    width: 4,
    height: RAIO * 0.15,
    backgroundColor: 'red',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    // afasta o ponteiro do centro
    bottom: DISTANCIA_CENTRO,
  },
  painelInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  textoInfo: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 0,
  },
  destaque: {
    fontWeight: 'bold',
  },
  destaqueDestino: {
    fontWeight: 'bold',
    color: 'red',
    fontSize: 20,
  },
  textoSub: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 0,
  },
  containerSlider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginTop: 16,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 15,
  },
});