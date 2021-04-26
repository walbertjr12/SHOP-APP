import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import { map } from "lodash";
import Loading from "../../components/Loading";
import { useFocusEffect } from "@react-navigation/native";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Carousel from "../../components/Carousel";
import { Rating, ListItem, Icon } from "react-native-elements";
import Map from "../../components/Map";
import Toast from "react-native-easy-toast";

const db = firebase.firestore(firebaseApp);
const screeWidth = Dimensions.get("window").width;

export default function Product(props) {
  const { navigation, route } = props;
  const { name, id } = route.params;
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const toastRef = useRef();

  navigation.setOptions({
    title: name.substr(0, 20),
  });

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useFocusEffect(
    useCallback(() => {
      db.collection("products")
        .doc(id)
        .get()
        .then((response) => {
          const data = response.data();
          data.id = response.id;

          setProduct(data);
          setRating(data.rating);
        });
    }, [id])
  );

  useEffect(() => {
    if (userLogged && product) {
      db.collection("favorites")
        .where("idProduct", "==", product.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
          if (response.docs.length === 1) {
            setIsFavorite(true);
          } else {
            setIsFavorite(false);
          }
        });
    }
  }, [userLogged, product]);

  const addFavorite = () => {
    if (!userLogged) {
      toastRef.current.show(
        "Para usar el sistema de favoritos tienes que estar logueado."
      );
    } else {
      setIsFavorite(true);
      const payload = {
        idUser: firebase.auth().currentUser.uid,
        idProduct: product.id,
      };

      db.collection("favorites")
        .add(payload)
        .then(() => {
          toastRef.current.show("Producto añadido a favoritos.");
        })
        .catch(() => {
          setIsFavorite(false);
          toastRef.current.show("Error al añadir el producto a favoritos.");
        });
    }
  };

  const removeFavorite = () => {
    setIsFavorite(false);
    db.collection("favorites")
      .where("idProduct", "==", product.id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              toastRef.current.show("Producto eliminado de favoritos");
            })
            .catch(() => {
              setIsFavorite(true);
              toastRef.current.show(
                "Error al eliminar el producto de favoritos"
              );
            });
        });
      });
  };

  if (!product) return <Loading isVisible={true} text="Cargando..." />;

  return (
    <ScrollView vertical style={styles.viewBody}>
      <View style={styles.viewFavorite}>
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color={isFavorite ? "#f00" : "#000"}
          size={35}
          underlayColor="transparent"
        />
      </View>
      <Carousel arrayImages={product.images} height={250} width={screeWidth} />
      <TitleProduct
        name={product.name}
        description={product.description}
        rating={rating}
      />
      <ProductInfo name={product.name} />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </ScrollView>
  );
}

function TitleProduct(props) {
  const { name, description, rating } = props;

  return (
    <View style={styles.viewProductTitle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.nameProduct}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)}
        />
      </View>
      <Text style={styles.descriptionProduct}>{description}</Text>
    </View>
  );
}

function ProductInfo(props) {
  const { name } = props;

  const listInfo = [
    // {
    //   text: address,
    //   iconName: "map-marker",
    //   iconType: "material-community",
    //   action: null,
    // }
  ];

  return (
    <View style={styles.viewProductInfo}>
      <Text style={styles.productInfoTitle}>Información sobre el producto</Text>
      {map(listInfo, (item, index) => (
        <ListItem
          key={index}
          title={item.text}
          leftIcon={{
            name: item.iconName,
            type: item.iconType,
            color: "#00a680",
          }}
          containerStyle={styles.containerListItem}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewProductTitle: {
    padding: 15,
  },
  nameProduct: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descriptionProduct: {
    marginTop: 5,
    color: "grey",
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  viewProductInfo: {
    margin: 15,
    marginTop: 0,
  },
  productInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerListItem: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1,
  },
  viewFavorite: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 100,
    padding: 5,
    paddingLeft: 12,
  },
});
