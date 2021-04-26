import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Products from "../screens/Products/Products";
import AddProduct from "../screens/Products/AddProduct";
import Product from "../screens/Products/Product";

const Stack = createStackNavigator();

export default function RestaurantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="products"
        component={Products}
        options={{ title: "Productos" }}
      />
      <Stack.Screen
        name="add-product"
        component={AddProduct}
        options={{ title: "Añadir Producto" }}
      />
      <Stack.Screen name="product" component={Product} />
    </Stack.Navigator>
  );
}
