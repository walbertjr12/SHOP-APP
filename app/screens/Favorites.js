import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Loading from "../components/Loading";
import Toast from "react-native-easy-toast";

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";
import { Icon, Button, Image } from "react-native-elements";

const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {
  const { navigation } = props;
  const [products, setProducts] = useState(null);
  const [userLogged, setUserLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const toastRef = useRef();

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useFocusEffect(
    useCallback(() => {
      if (userLogged) {
        const idUser = firebase.auth().currentUser.uid;
        db.collection("favorites")
          .where("idUser", "==", idUser)
          .get()
          .then((response) => {
            const idProductsArray = [];
            response.forEach((doc) => {
              idProductsArray.push(doc.data().idProduct);
            });
            getDataProduct(idProductsArray).then((response) => {
              const productsDb = [];
              response.forEach((doc) => {
                const product = doc.data();
                product.id = doc.id;
                productsDb.push(product);
              });
              setProducts(productsDb);
            });
          });
      }
      setReloadData(false);
    }, [userLogged, reloadData])
  );

  const getDataProduct = (idProductsArray) => {
    const arrayProducts = [];
    idProductsArray.forEach((idProduct) => {
      const result = db.collection("products").doc(idProduct).get();
      arrayProducts.push(result);
    });

    return Promise.all(arrayProducts);
  };

  if (!userLogged) {
    return <UserNoLogged navigation={navigation} />;
  }

  if (products?.length === 0) {
    return <NotFoundProducts />;
  }

  return (
    <View style={styles.viewBody}>
      {products ? (
        <FlatList
          data={products}
          renderItem={(product) => (
            <Product
              product={product}
              setIsLoading={setIsLoading}
              toastRef={toastRef}
              setReloadData={setReloadData}
              navigation={navigation}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loaderProducts}>
          <ActivityIndicator size="large" />
          <Text style={{ textAlign: "center" }}>Cargando Productos</Text>
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading text="Eliminando producto" isVisible={isLoading} />
    </View>
  );
}

function NotFoundProducts() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon type="material-community" name="alert-outline" size={30} />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        No tienes productos en tu lista
      </Text>
    </View>
  );
}

function UserNoLogged(props) {
  const { navigation } = props;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon type="material-community" name="alert-outline" size={30} />
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        Necesitas estar logueado para ver esta sección
      </Text>
      <Button
        title="Ir al login"
        containerStyle={{ marginTop: 20, width: "80%" }}
        buttonStyle={{ backgroundColor: "#00a680" }}
        onPress={() => navigation.navigate("account", { screen: "login" })}
      />
    </View>
  );
}

function Product(props) {
  const { product, setIsLoading, toastRef, setReloadData, navigation } = props;
  const { name, images, id } = product.item;

  const confirmRemoveFavorite = () => {
    Alert.alert(
      "Eliminar Producto de Favoritos",
      "¿Estás seguro de que quieres eliminar el producto de favoritos?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: removeFavorite,
        },
      ],
      { cancelable: false }
    );
  };

  const removeFavorite = () => {
    setIsLoading(true);
    db.collection("favorites")
      .where("idProduct", "==", id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsLoading(false);
              setReloadData(true);
              toastRef.current.show("Producto eliminado de favoritos");
            })
            .catch(() => {
              setIsLoading(false);
              toastRef.current.show(
                "Error al eliminar el producto de favoritos"
              );
            });
        });
      });
  };

  return (
    <View style={styles.product}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("products", {
            screen: "product",
            params: { id, name },
          })
        }
      >
        <Image
          resizeMode="cover"
          style={styles.image}
          PlaceholderContent={<ActivityIndicator color="#fff" />}
          source={
            images[0]
              ? { uri: images[0] }
              : require("../../assets/img/no-image.png")
          }
        />
        <View style={styles.info}>
          <Text style={styles.name}>
            {name.substr(0, 22)} {name.length > 22 ? "..." : ""}
          </Text>
          <Icon
            type="material-community"
            name="heart"
            color="#f00"
            containerStyle={styles.favorite}
            onPress={confirmRemoveFavorite}
            underlayColor="transparent"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  loaderProducts: {
    marginTop: 10,
    marginBottom: 10,
  },
  product: {
    margin: 10,
  },
  image: {
    width: "100%",
    height: 120,
  },
  info: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: -20,
    backgroundColor: "#fff",
  },
  name: {
    fontWeight: "bold",
    fontSize: 20,
  },
  favorite: {
    marginTop: -35,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100,
  },
});
