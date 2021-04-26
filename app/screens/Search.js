import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, ListView } from "react-native";
import { SearchBar, Image, ListItem, Icon } from "react-native-elements";
import { FireSQL } from "firesql";
import firebase from "firebase/app";

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

export default function Search(props) {
  const { navigation } = props;
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (search) {
      fireSQL
        .query(`SELECT * FROM products WHERE name LIKE "${search}%"`)
        .then((response) => {
          setProducts(response);
        })
        .catch((error) => {
          console.log("error");
        });
    }
  }, [search]);

  return (
    <View>
      <SearchBar
        placeholder="Busca tu producto"
        onChangeText={(e) => setSearch(e)}
        containerStyle={styles.searchBar}
        value={search}
      />
      {products.length === 0 ? (
        <NotfoundProducts />
      ) : (
        <FlatList
          data={products}
          renderItem={(product) => (
            <Product product={product} navigation={navigation} />
          )}
        />
      )}
    </View>
  );
}

function NotfoundProducts() {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Image
        source={require("../../assets/img/no-result-found.png")}
        resizeMode="cover"
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
}

function Product(props) {
  const { navigation, product } = props;
  const { id, name, images } = product.item;
  return (
    <ListItem
      title={name}
      leftAvatar={{
        source: images[0]
          ? { uri: images[0] }
          : require("../../assets/img/no-image.png"),
      }}
      rightIcon={<Icon type="material-community" name="chevron-right" />}
      onPress={() =>
        navigation.navigate("products", {
          screen: "product",
          params: { id, name },
        })
      }
    />
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20,
  },
});
