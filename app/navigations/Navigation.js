import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";

import RestaurantsStack from "./RestaurantsStack";
import FavoritesStack from "./FavoritesStack";
import TopRestaurantsStack from "./TopRestaurantsStack";
import SearchStack from "./SearchStack";
import AccountStack from "./AccountStack";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="restaurants"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => screenOptions(route, color),
          tabBarActiveTintColor: "#00a680",
          tabBarInactiveTintColor: "#646464",
          headerShown: false
        })}
      >
        <Tab.Screen
          name="restaurantsStack"
          component={RestaurantsStack}
          options={{ title: "Restaurantes" }}
        />
        <Tab.Screen
          name="favoritesStack"
          component={FavoritesStack}
          options={{ title: "Favoritos" }}
        />
        <Tab.Screen
          name="top-restaurantsStack"
          component={TopRestaurantsStack}
          options={{ title: "Top 5" }}
        />
        <Tab.Screen
          name="searchStack"
          component={SearchStack}
          options={{ title: "Buscar" }}
        />
        <Tab.Screen
          name="accountStack"
          component={AccountStack}
          options={{ title: "Cuenta" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function screenOptions(route, color) {
  let iconName;

  switch (route.name) {
    case "restaurantsStack":
      iconName = "compass-outline";
      break;
    case "favoritesStack":
      iconName = "heart-outline";
      break;
    case "top-restaurantsStack":
      iconName = "star-outline";
      break;
    case "searchStack":
      iconName = "magnify";
      break;
    case "accountStack":
      iconName = "home-outline";
      break;
    default:
      break;
  }

  return (
    <Icon type="material-community" name={iconName} size={22} color={color} />
  );
}
