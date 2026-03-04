import { FontAwesome6 } from "@expo/vector-icons";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Dimensions, Pressable, Text, View } from "react-native";

export default function Header() {
  const width = Dimensions.get("screen").width * 0.9;
  return (
    <View
      style={{
        backgroundColor: "#e17100",
        height: 150,
        borderBottomEndRadius: 12,
        borderBottomLeftRadius: 12,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <View style={{ display: "flex", flexDirection: "row", padding: 10 }}>
          <View
            style={{
              backgroundColor: "#ff8904",
              justifyContent: "center",
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "#fff",
                fontWeight: "bold",
                padding: 6,
              }}
            >
              T
            </Text>
          </View>

          <Text
            style={{
              fontSize: 20,
              color: "#fff",
              fontWeight: "bold",
              padding: 6,
            }}
          >
            Traducteur
          </Text>
        </View>
        <Pressable
          style={{
            backgroundColor: "#ff8904",
            justifyContent: "center",
            borderRadius: 100,
            position: "absolute",
            right: 5,
            top: 8,
          }}
          onPress={() => console.log("homme presser")}
        >
          <Ionicons
            name="settings-outline"
            size={19}
            color={"#fff"}
            style={{ padding: 10 }}
          />
        </Pressable>
      </View>

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 9,
          padding: 12,
          paddingBottom: 12,
          width,
          alignSelf: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Pressable
          style={{
            alignSelf: "center",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            columnGap: 5,
          }}
        >
          <Text>Anglais</Text>
          <Ionicons name="chevron-up-outline" />
        </Pressable>

        <View
          style={{
            backgroundColor: "#ffb86a",
            borderRadius: 150,
            height: 40,
            width: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome6
            name="arrow-right-arrow-left"
            size={20}
            color="#e17100"
          />
        </View>
        <Pressable
          style={{
            alignSelf: "center",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            columnGap: 5,
            backgroundColor: "#ff8904",
            borderRadius: 8,
          }}
        >
          <Text style={{ padding: 6, color: "#fff" }}>Francais</Text>
          <Ionicons name="chevron-up-outline" />
        </Pressable>
      </View>
    </View>
  );
}
