import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import * as firebase from "firebase";
import "firebase/firestore";
import ListProducts from "../../components/Products/ListProducts";

const db = firebase.firestore(firebaseApp);

export default function Restaurants(props) {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [startProducts, setStartProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const limitProducts = 10;

  useFocusEffect(
    useCallback(() => {
      db.collection("products")
        .get()
        .then((snap) => {
          setTotalProducts(snap.docs.length);
        });

      const resultProducts = [];

      db.collection("products")
        .orderBy("createAt", "desc")
        .limit(limitProducts)
        .get()
        .then((response) => {
          setStartProducts(response.docs[response.docs.length - 1]);

          response.forEach((doc) => {
            const product = doc.data();
            product.id = doc.id;
            resultProducts.push(product);
          });

          setProducts(resultProducts);
        });
    }, [])
  );

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  const handleLoadMore = () => {
    const resultProducts = [];

    products.length < totalProducts && setIsLoading(true);

    db.collection("products")
      .orderBy("createAt", "desc")
      .startAfter(startProducts.data().createAt)
      .limit(limitProducts)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          setStartProducts(response.docs[response.docs.length - 1]);
        } else {
          setIsLoading(false);
        }

        response.forEach((doc) => {
          const product = doc.data();
          product.id = doc.id;
          resultProducts.push(product);
        });

        setProducts([...products, ...resultProducts]);
      });
  };

  return (
    <View style={styles.viewBody}>
      <ListProducts
        products={products}
        handleLoadMore={handleLoadMore}
        isLoading={isLoading}
      />
      {user && (
        <Icon
          reverse
          type="material-community"
          name="plus"
          color="#00a680"
          containerStyle={styles.btnContainer}
          onPress={() => navigation.navigate("add-product")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  btnContainer: {
    position: "absolute",
    bottom: 20,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
});
