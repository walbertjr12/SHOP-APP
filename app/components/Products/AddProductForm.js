import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Dimensions,
  Image,
} from "react-native";
import { Input, Button, Icon, Avatar } from "react-native-elements";
import { map, size, filter } from "lodash";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import uuid from "random-uuid-v4";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width;

export default function AddProductForm(props) {
  const { toastRef, setIsLoading, navigation } = props;
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [imageSelected, setImageSelected] = useState([]);

  const addProduct = () => {
    if (!productName || !productDescription || !productDescription) {
      toastRef.current.show("Todos los campos son obligatorios.", 3000);
    } else if (size(imageSelected) === 0) {
      toastRef.current.show(
        "El producto debe contener al menos una foto.",
        3000
      );
    } else {
      setIsLoading(true);
      uploadImageStorage().then((response) => {
        db.collection("products")
          .add({
            name: productName,
            description: productDescription,
            images: response,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0,
            createAt: new Date(),
            createBy: firebase.auth().currentUser.uid,
          })
          .then(() => {
            setIsLoading(false);
            navigation.navigate("products");
          })
          .catch(() => {
            setIsLoading(false);
            toastRef.current.show(
              "Error al subir el producto, intentelo más tarde"
            );
          });
      });
    }
  };

  const uploadImageStorage = async () => {
    const imageBlob = [];

    await Promise.all(
      map(imageSelected, async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = firebase.storage().ref("products").child(uuid());

        await ref.put(blob).then(async (result) => {
          await firebase
            .storage()
            .ref(`products/${result.metadata.name}`)
            .getDownloadURL()
            .then((photoUrl) => {
              imageBlob.push(photoUrl);
            });
        });
      })
    );
    return imageBlob;
  };

  return (
    <ScrollView style={styles.scrollView}>
      <ImageProduct imagenProduct={imageSelected[0]} />
      <FormAdd
        setProductName={setProductName}
        setProductDescription={setProductDescription}
      />
      <UploadImage
        toastRef={toastRef}
        imageSelected={imageSelected}
        setImageSelected={setImageSelected}
      />
      <Button
        title="Crear Producto"
        onPress={addProduct}
        buttonStyle={styles.btnAddProduct}
      />
    </ScrollView>
  );
}

function ImageProduct(props) {
  const { imagenProduct } = props;

  return (
    <View style={styles.viewPhoto}>
      <Image
        source={
          imagenProduct
            ? {
                uri: imagenProduct,
              }
            : require("../../../assets/img/no-image.png")
        }
        style={{ width: widthScreen, height: 200 }}
      />
    </View>
  );
}

function FormAdd(props) {
  const { setProductName, setProductDescription } = props;
  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Nombre del producto"
        containerStyle={styles.input}
        onChange={(e) => setProductName(e.nativeEvent.text)}
      />
      <Input
        placeholder="Descripción del producto"
        inputContainerStyle={styles.textArea}
        multiline
        onChange={(e) => setProductDescription(e.nativeEvent.text)}
      />
    </View>
  );
}

function UploadImage(props) {
  const { toastRef, setImageSelected, imageSelected } = props;

  const removeImage = (image) => {
    Alert.alert(
      "Eliminar Imagen",
      "¿Estas seguro de eliminar la imagen?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            setImageSelected(
              filter(imageSelected, (imageUrl) => imageUrl !== image)
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  const imageSelect = async () => {
    const resultPermissions = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (resultPermissions === "denied") {
      toastRef.current.show(
        "Es necesario darle permisos de acceso a la galería",
        3000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.cancelled) {
        toastRef.current.show(
          "Has cerrrado la galería sin seleccionar ninguna imagen",
          2000
        );
      } else {
        setImageSelected([...imageSelected, result.uri]);
      }
    }
  };

  return (
    <View style={styles.viewImage}>
      {size(imageSelected) < 4 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}
      {map(imageSelected, (imageProduct, index) => (
        <Avatar
          key={index}
          style={styles.miniatureStyle}
          source={{ uri: imageProduct }}
          onPress={() => removeImage(imageProduct)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnAddProduct: {
    backgroundColor: "#00a680",
    margin: 20,
  },
  viewImage: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  miniatureStyle: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
});
