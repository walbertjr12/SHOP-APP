import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import { Button } from "react-native-elements";

const db = firebase.firestore(firebaseApp);

export default function ListReviews(props) {
  const { navigation, idRestaurant, setRating } = props;
  const [userLogged, setUserLogged] = useState(false);
  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  return (
    <View>
      {userLogged ? (
        <Button
          title="Escriba una opinión"
          buttonStyle={styles.btnAddReview}
          titleStyle={styles.btnTitleAddReview}
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "#00a680",
          }}
          onPress={() =>
            navigation.navigate("add-review-restaurant", { idRestaurant })
          }
        />
      ) : (
        <View>
          <Text
            style={{ textAlign: "center", color: "#00a680", padding: 20 }}
            onPress={() => navigation.navigate("login")}
          >
            Para escribir un comentario es necesario estar logueado{" "}
            <Text style={{ fontWeight: "bold" }}>
              Pulsa AQUÍ para iniciar sesión
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btnAddReview: {
    backgroundColor: "transparent",
    marginBottom: 10,
  },
  btnTitleAddReview: {
    color: "#00a680",
  },
});
