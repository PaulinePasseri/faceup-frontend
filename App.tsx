import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
let _FontAwesome = FontAwesome as React.ElementType;
import HomeScreen from "./screens/HomeScreen";
import SnapScreen from "./screens/SnapScreen";
import GalleryScreen from "./screens/GalleryScreen";

import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Provider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";

const reducers = combineReducers({ user });

const persistConfig = { key: "faceup", storage: AsyncStorage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = "";

          if (route.name === "Snap") {
            iconName = "camera";
          } else if (route.name === "Gallery") {
            iconName = "image";
          }

          return <_FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#e8be4b",
        tabBarInactiveTintColor: "#b2b2b2",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Snap" component={SnapScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
