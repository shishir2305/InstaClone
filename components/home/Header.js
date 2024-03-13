import { View, TouchableOpacity, StyleSheet, Text, Alert } from "react-native";
import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { UserContext } from "../../contexts/UserContext";
import FeatherIcons from "react-native-vector-icons/Feather";

const addPostIcon = <FeatherIcons name="plus-square" size={30} color="white" />;

const likesIcon = <FeatherIcons name="heart" size={30} color="white" />;

const messageIcon = (
  <FeatherIcons name="message-square" size={30} color="white" />
);

const Header = ({ navigation }) => {
  const { setUser } = useContext(UserContext);
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={async () => {
            await signOut(auth)
              .then(() => {
                Alert.alert("logged out");
              })
              .catch((error) => {
                Alert.alert(error);
              });
            setUser(null);
          }}
        >
          <Text style={styles.logo}>INSTAGRAM</Text>
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("NewPostScreen")}
          >
            {addPostIcon}
          </TouchableOpacity>
          <TouchableOpacity>{likesIcon}</TouchableOpacity>
          <TouchableOpacity>{messageIcon}</TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 70,
    padding: 10,
    alignItems: "center",
    marginTop: 12,
  },
  iconContainer: {
    flexDirection: "row",
    gap: 20,
  },
  logo: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    marginStart: 5,
  },
  icons: {
    width: 30,
    height: 30,
    margin: 5,
    backgroundColor: "orange",
    borderRadius: 10,
  },
  badge: {
    position: "absolute",
    backgroundColor: "red",
    borderRadius: 5,
    width: 23,
    zIndex: 100,
    left: 20,
    top: -8,
  },

  badgeText: {
    color: "white",
  },
});

export default Header;
