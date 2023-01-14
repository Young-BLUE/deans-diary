import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./utils/navigator";
import Realm from "realm";
import AppLoading from "expo-app-loading";

const FeelingSchema = {
  name: "Feeling",
  properties: {
    _id: "int",
    emotion: "string",
    message: "string",
  },
  primaryKey: "_id",
};

export default function App() {
  const [ready, setReady] = useState(false);
  const startLoading = async () => {
    // App 에서는 단지 realm과 커넥션 해줄뿐.
    const realm = await Realm.open({
      path: "deansDiaryDB",
      schema: [FeelingSchema],
    });
    console.log("realm: ", realm);
  };
  const onFinish = () => setReady(true);
  if (!ready) {
    return (
      <AppLoading
        onError={console.error}
        startAsync={startLoading}
        onFinish={onFinish}
      />
    );
  }
  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}
