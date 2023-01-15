import React, {useContext, useEffect, useState} from "react";
import styled from "styled-components/native";
import colors from "../css/colors";
import {Alert} from "react-native";
import {useDB} from "../utils/context";
import {AdMobInterstitial, AdMobRewarded} from "expo-ads-admob";

const View = styled.View`
  background-color: ${colors.bgColor};
  flex: 1;
  padding: 0px 30px;
`;
const Title = styled.Text`
  color: ${colors.textColor};
  margin: 50px 0px;
  text-align: center;
  font-size: 28px;
`;

const TextInput = styled.TextInput`
  background-color: white;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 18px;
`;

const Btn = styled.TouchableOpacity`
  width: 100%;
  background-color: ${colors.btnColor};
  margin-top: 30px;
  padding: 10px 20px;
  align-items: center;
  border-radius: 20px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
`;

const BtnText = styled.Text`
  color: white;
  font-weight: 500;
  font-size: 18px;
`;

const Emotions = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
  justify-content: space-between;
`;
const Emotion = styled.TouchableOpacity`
  background-color: white;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 10px;
  border-width: ${(props) => (props.selected ? "2px" : "0px")};
`;

const EmotionText = styled.Text`
  font-size: 24px;
`;

const emotions = ["😃", "🙂", "🥲", "😭", "🥰"];

const Write = ({navigation: {goBack}}) => {
    const realm = useDB();
    const [selectedEmotion, setEmotion] = useState(null);
    const [feelings, setFeelings] = useState("");
    const onChangeText = (text) => setFeelings(text);
    const onEmotionPress = (face) => {
        setEmotion(face);
    };
    const onSubmit = async () => {
        if (feelings === "" || selectedEmotion == null) {
            return Alert.alert("Please complete form.");
        }
        await AdMobRewarded.setAdUnitID("ca-app-pub-3940256099942544/1712485313");
        await AdMobRewarded.requestAdAsync();
        await AdMobRewarded.showAdAsync();
        AdMobRewarded.addEventListener("rewardedVideoUserDidEarnReward",
            () => {
                AdMobRewarded.addEventListener("rewardedVideoDidDismiss", () => {
                    realm.write(() => {
                        // 타입스크립트로 하면 model 정의해서 필수값 누락 안되게 할 수 있을듯
                        realm.create("Feeling", {
                            _id: Date.now(),
                            emotion: selectedEmotion,
                            message: feelings,
                        });
                    });
                    goBack(); // navigation props 에 의해 제공되는 함수
                })
            })
    };
    return (
        <View>
            <Title>오늘 당신의 하루는 어땠나요?</Title>
            <Emotions>
                {emotions.map((emotion, index) => (
                    <Emotion
                        key={index}
                        onPress={() => onEmotionPress(emotion)}
                        selected={emotion === selectedEmotion}
                    >
                        <EmotionText>{emotion}</EmotionText>
                    </Emotion>
                ))}
            </Emotions>
            <TextInput
                value={feelings}
                returnKeyType={"done"}
                onSubmitEditing={onSubmit}
                onChangeText={onChangeText}
                placeholder="오늘 느낀 감정을 얘기해주세요."
                placeholderTextColor={"#bababa"}
            />
            <Btn onPress={onSubmit}>
                <BtnText>Save</BtnText>
            </Btn>
        </View>
    );
};

export default Write;
