import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import colors from "../css/colors";
import { Ionicons } from "@expo/vector-icons";
import { useDB } from "../utils/context";
import { FlatList, LayoutAnimation, TouchableOpacity } from "react-native";
import {AdMobBanner} from "expo-ads-admob";

const View = styled.View`
  flex: 1;
  //justify-content: center;
  align-items: center;
  padding: 100px 30px 0px 30px;
  background-color: ${colors.bgColor};
`;
const Title = styled.Text`
  color: ${colors.textColor};
  font-size: 38px;
  width: 100%;
  //margin-bottom: 100px;
`;
const Btn = styled.TouchableOpacity`
  position: absolute;
  bottom: 50px;
  right: 50px;
  height: 80px;
  width: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.btnColor};
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
`;

const Record = styled.View`
  background-color: ${colors.cardColor};
  flex-direction: row;
  align-items: center;
  padding: 10px 10px;
  border-radius: 10px;
`;

const Emotion = styled.Text`
  font-size: 24px;
  margin-right: 10px;
`;
const Message = styled.Text`
  font-size: 18px;
`;
const Separator = styled.View`
  height: 10px;
`;

const Home = ({ navigation: { navigate } }) => {
  const realm = useDB();
  const [feelings, setFeelings] = useState([]);
  useEffect(() => {
    const feelings = realm.objects("Feeling");
    // inserts, deletes, updates... etc whatever anything happened via addListener
    feelings.addListener((feelings) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // 변화에 대해 Animation ( 안드로이드는 추가 코드 필요)
      setFeelings(feelings.sorted("_id", false));
    });
    return () => {
      feelings.removeAllListeners();
    };
  }, []);
  const onPress = (id) => {
    // realm 의 crud 는 모두 .write 안에서 해야한다
    realm.write(() => {
      const feeling = realm.objectForPrimaryKey("Feeling", id);
      realm.delete(feeling);
    });
  };

  return (
    <View>
      <Title>나의 메모</Title>
        <AdMobBanner
            style={{ backgroundColor: 'white'}}
            bannerSize={'fullBanner'}
            adUnitID={"ca-app-pub-3940256099942544/2934735716"} />
      <FlatList
          style={{ marginVertical: 50, width: '100%'}}
        data={feelings}
        contentContainerStyle={{ paddingVertical: 10 }}
        ItemSeparatorComponent={Separator}
        keyExtractor={(feeling) => feeling.id + ""}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPress(item._id)}>
            <Record>
              <Emotion>{item.emotion}</Emotion>
              <Message>{item.message}</Message>
            </Record>
          </TouchableOpacity>
        )}
      />
      <Btn onPress={() => navigate("Write")}>
        <Ionicons name={"add"} color={"white"} size={40} />
      </Btn>
    </View>
  );
};

export default Home;
