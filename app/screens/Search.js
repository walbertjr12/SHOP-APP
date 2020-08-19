import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, ListView } from "react-native";
import { SearchBar, Image, ListItem, Icon } from "react-native-elements";
import { FireSQL } from "firesql";
import firebase from "firebase/app";

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

export default function Search(props) {
  const { navigation } = props;
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (search) {
      fireSQL
        .query(`SELECT * FROM restaurants WHERE name LIKE "${search}%"`)
        .then((response) => {
          setRestaurants(response);
        })
        .catch((error) => {
          console.log("error");
        });
    }
  }, [search]);

  return (
    <View>
      <SearchBar
        placeholder="Busca tu restaurante"
        onChangeText={(e) => setSearch(e)}
        containerStyle={styles.searchBar}
        value={search}
      />
      {restaurants.length === 0 ? (
        <NotfoundRestaurants />
      ) : (
        <FlatList
          data={restaurants}
          renderItem={(restaurant) => (
            <Restaurant restaurant={restaurant} navigation={navigation} />
          )}
        />
      )}
    </View>
  );
}

function NotfoundRestaurants() {
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

function Restaurant(props) {
  const { navigation, restaurant } = props;
  const { id, name, images } = restaurant.item;
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
        navigation.navigate("restaurants", {
          screen: "restaurant",
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
