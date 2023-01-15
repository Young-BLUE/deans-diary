import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./utils/navigator";
import Realm from "realm";
import AppLoading from "expo-app-loading";
import { DBContext } from "./utils/context";
import {setTestDeviceIDAsync} from "expo-ads-admob";

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
  const [realm, setRealm] = useState(null);
  const startLoading = async () => {
    await setTestDeviceIDAsync("EMULATOR");
    // App 에서는 단지 realm과 커넥션 해줄뿐.
    const connection = await Realm.open({
      path: "deansDiaryDB",
      schema: [FeelingSchema],
    });
    setRealm(connection);
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
    // props 를 통하지 않고 Context 를 통해 앱 전반적으로 데이터 접근 가능 (recoil과 비슷하지만 react자체 제공 api)
    <DBContext.Provider value={realm}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </DBContext.Provider>
  );
}
