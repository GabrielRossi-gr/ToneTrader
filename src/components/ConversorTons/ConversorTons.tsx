import Slider from '@react-native-community/slider';
import { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { styles } from './ConversorTons.styles';

// Escala cromática principal (12 notas)
const NOTAS = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

// Segunda camada de notas menores
const NOTAS2 = [
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  'Bd',
  ' ',
];

const ANGULO_POR_NOTA = 360 / NOTAS.length;

type ArcoCentroProps = {
  angulo: number;
};

function ArcoCentro({ angulo }: ArcoCentroProps) {
  const tamanho = 60;
  const centro = tamanho / 2;
  const raio = 27;

  const inicio = -90;
  const fim = inicio + angulo;

  const polar = (graus: number) => {
    const radianos = (graus * Math.PI) / 180;

    return {
      x: centro + raio * Math.cos(radianos),
      y: centro + raio * Math.sin(radianos),
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
        strokeWidth={4}
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
      : 360 + intervalo * ANGULO_POR_NOTA;

  const rotacaoAnimada = useRef(new Animated.Value(0)).current;
  const rotacaoAcumulada = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderMove: (_, gestureState) => {
        const novaRotacao =
          rotacaoAcumulada.current + gestureState.dx;

        rotacaoAnimada.setValue(novaRotacao);
      },

      onPanResponderRelease: (_, gestureState) => {
        const rotacaoFinal =
          rotacaoAcumulada.current + gestureState.dx;

        const passos = Math.round(
          rotacaoFinal / ANGULO_POR_NOTA,
        );

        const rotacaoSnap = passos * ANGULO_POR_NOTA;

        Animated.spring(rotacaoAnimada, {
          toValue: rotacaoSnap,
          useNativeDriver: true,
        }).start();

        rotacaoAcumulada.current = rotacaoSnap;

        let indice = (-passos) % NOTAS.length;

        if (indice < 0) {
          indice += NOTAS.length;
        }

        setIndiceNotaBase(indice);
      },
    }),
  ).current;

  const calcularIndiceDestino = () => {
    let indiceDestino =
      (indiceNotaBase + intervalo) % NOTAS.length;

    if (indiceDestino < 0) {
      indiceDestino += NOTAS.length;
    }

    return indiceDestino;
  };

  const indiceNotaDestino = calcularIndiceDestino();
  const notaBaseAlternativa = NOTAS2[indiceNotaBase].trim();
  const notaDestinoAlternativa = NOTAS2[indiceNotaDestino].trim();

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
  <SafeAreaView
    style={styles.safeArea}
    edges={['top']}
  >
    <StatusBar
      barStyle="light-content"
      backgroundColor="#040404"
    />

    <View style={styles.header}>
      <Text style={styles.titulo}>
        ToneTrader
      </Text>
    </View>

    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.trianguloIndicador} />

      <View
        style={styles.areaRoleta}
        {...panResponder.panHandlers}
      >
        <Animated.View
          style={[styles.roleta, rotacaoRoletaStyle]}
        >
          {/* Camada 1: notas principais */}
          {NOTAS.map((nota, index) => {
            const angulo = index * ANGULO_POR_NOTA;

            return (
              <View
                key={`nota1-${index}`}
                style={[
                  styles.fatiaNota,
                  {
                    transform: [
                      {
                        rotate: `${angulo}deg`,
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.textoNota}>
                  {nota}
                </Text>

                <View style={styles.linhaFatia} />
              </View>
            );
          })}

          {/* Camada 2: notas alternativas */}
          {NOTAS2.map((nota, index) => {
            if (nota.trim() === '') {
              return null;
            }

            const angulo = index * ANGULO_POR_NOTA;

            return (
              <View
                key={`nota2-${index}`}
                style={[
                  styles.fatiaNota,
                  {
                    transform: [
                      {
                        rotate: `${angulo}deg`,
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.textoNotaMenor}>
                  {nota}
                </Text>
              </View>
            );
          })}
        </Animated.View>

        <View style={styles.indicadorCentro}>
          <ArcoCentro angulo={anguloArco} />

          <View
            style={[
              styles.containerBraco,
              {
                transform: [
                  {
                    rotate: '0deg',
                  },
                ],
              },
            ]}
          >
            <View style={styles.bracoLaranja} />
          </View>

          <View
            style={[
              styles.containerBraco,
              {
                transform: [
                  {
                    rotate: `${
                      intervalo * ANGULO_POR_NOTA
                    }deg`,
                  },
                ],
              },
            ]}
          >
            <View style={styles.bracoLaranja} />
          </View>
        </View>
      </View>

      <View style={styles.painelInfo}>
        <Text style={styles.textoInfo}>
          De:{' '}
          <Text style={styles.destaque}>
            {NOTAS[indiceNotaBase]}
          </Text>

          {notaBaseAlternativa !== ''
            ? ` (${notaBaseAlternativa})`
            : ''}
        </Text>

        <Text style={styles.textoInfo}>
          Para:{' '}
          <Text style={styles.destaqueDestino}>
            {NOTAS[indiceNotaDestino]}
          </Text>

          {notaDestinoAlternativa !== ''
            ? ` (${notaDestinoAlternativa})`
            : ''}
        </Text>

        <Text style={styles.textoSub}>
          Intervalo:{' '}
          {intervalo > 0
            ? `+${intervalo}`
            : intervalo}{' '}
          semitons
        </Text>
      </View>

      <View style={styles.containerSlider}>
        <Text style={styles.textoLimiteSlider}>
          -12
        </Text>

        <Slider
          style={styles.slider}
          minimumValue={-12}
          maximumValue={12}
          step={1}
          value={intervalo}
          onValueChange={setIntervalo}
          minimumTrackTintColor="#8E8E93"
          maximumTrackTintColor="#8E8E93"
          thumbTintColor="#FF3B30"
        />

        <Text style={styles.textoLimiteSlider}>
          +12
        </Text>
      </View>
    </ScrollView>
  </SafeAreaView>
);
}