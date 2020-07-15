import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button, Icon } from "react-native-elements";

export default function ChangeDisplayNameForm(props) {
  const { displayName, setShowModal, toastRef } = props;
  return (
    <View style={styles.view}>
      <Text>Cambiando Nombre y Apellidos</Text>
      <Input
        placeholder="Nombre y Apellidos"
        containerStyle={styles.input}
        rightIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#c2c2c2",
        }}
        defaultValue={displayName || ""}
      />
      <Button
        title="Cambiar nombre"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    marginBottom: 10,
    marginTop: 20,
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680",
  },
});
