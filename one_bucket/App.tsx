/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

<<<<<<< Updated upstream
=======
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { darkColors, lightColors } from 'constants/colors';
>>>>>>> Stashed changes
import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import StackNavigation from 'screens/navigation/StackNavigation';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

<<<<<<< Updated upstream
function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
=======
const isDarkMode = useColorScheme() === 'dark';
const colors = isDarkMode ? darkColors : lightColors

const MainScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home">
      {mainRoutes.map(route => (
        <Tab.Screen
          key={`screen-${route.name}`}
          name={route.name}
          component={route.component}
          options={{
            headerStyle: {
              backgroundColor: colors.ICON_BG
            },
            headerTintColor: colors.ICON_TEXT,
            tabBarIcon: ({ focused }) => {
              return (
                <Image
                  testID={`tabIcon-${route.name}`}
                  source={focused ? route.activeIcon : route.inactiveIcon}
                  style={{ width: 20, height: 20 }}
                />
              )
            }
          }}
        />
      ))}
    </Tab.Navigator>
  )
>>>>>>> Stashed changes
}

function App(): React.JSX.Element {
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };3

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
      <StackNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
