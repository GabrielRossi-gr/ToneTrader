import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import {
    Platform,
    StyleSheet,
} from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // Cores semelhantes às utilizadas no iOS em modo escuro
        tabBarActiveTintColor: '#FF453A',
        tabBarInactiveTintColor: '#8E8E93',

        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarHideOnKeyboard: true,
        tabBarVariant: 'uikit',

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: -2,
        },

        tabBarIconStyle: {
          marginTop: 2,
        },

        tabBarItemStyle: {
          paddingTop: 4,
        },

        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',

          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: 'rgba(84, 84, 88, 0.65)',

          height: Platform.OS === 'ios' ? 88 : 70,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 22 : 8,

          elevation: 0,
          shadowOpacity: 0,
        },

        tabBarBackground: () => (
          <BlurView
            intensity={75}
            tint="systemChromeMaterialDark"
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >

      <Tabs.Screen
        name="sobre"
        options={{
          title: 'Sobre',
          tabBarAccessibilityLabel:
            'Abrir informações sobre o aplicativo',

          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={{
                ios: focused
                  ? 'info.circle.fill'
                  : 'info.circle',
                android: 'info',
                web: 'info',
              }}
              tintColor={color}
              size={25}
              style={styles.icone}
            />
          ),
        }}
      />

    <Tabs.Screen
    name="index"
    options={{
        title: 'Roleta',

        tabBarIcon: ({ color, focused }) => (
        <SymbolView
            name={{
            ios: focused
                ? 'dial.high.fill'
                : 'dial.high',
            android: 'explore',
            web: 'explore',
            }}
            tintColor={color}
            size={26}
            style={styles.icone}
        />
        ),
    }}
    />


    </Tabs>
  );
}

const styles = StyleSheet.create({
  icone: {
    width: 27,
    height: 27,
  },
});