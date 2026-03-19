import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddFavoriteUnfavorite, getAll, toutDelete } from "../../lib/database";
import HistoriqueHeader from "../hooks/HistoriqueHeader";

const Historique = () => {
  const [donne, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const setup = async () => {
        const data = await getAll();
        setData(data);
      };
      setup();
    }, []),
  );

  const openModal = (item) => {
    setSelected(item);
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setSelected(null);
  };

  const handleDeleteAll = async () => {
    await toutDelete();
    setData([]);
  };

  const handleToggleFavorite = async (item) => {
    const newValue = item.isfavorite ? 0 : 1;
    await AddFavoriteUnfavorite(item.id, newValue);
    setData((prev) =>
      prev.map((d) => (d.id === item.id ? { ...d, isfavorite: newValue } : d)),
    );
  };

  const renderItem = ({ item }) => (
    <View className="flex-row items-center mx-3 my-2">
      <Pressable
        onPress={() => openModal(item)}
        className="flex-1 bg-white p-4 rounded-xl shadow"
      >
        <Text className="font-bold">{item.message}</Text>
        <Text className="text-orange-500">{item.sortie}</Text>
        <Text className="text-gray-500 text-sm">
          {item.langueActuel} → {item.langueCible}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => handleToggleFavorite(item)}
        className="ml-2 p-3 bg-white rounded-full shadow"
      >
        <Feather
          name="star"
          color={item.isfavorite ? "#facc15" : "#d1d5db"}
          size={20}
        />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <HistoriqueHeader />

      <View className="flex-row justify-between items-center p-4">
        <Text className="text-xl font-semibold">Historique</Text>
        <Pressable
          onPress={handleDeleteAll}
          className="flex-row gap-2 items-center"
        >
          <Text className="text-red-500 text-xl">Effacer</Text>
          <Feather name="trash" color={"red"} size={20} />
        </Pressable>
      </View>

      <FlatList
        data={donne}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="text-center mt-10 text-gray-400">
            Aucun historique
          </Text>
        }
      />

      <Modal visible={visible} animationType="slide" transparent>
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={closeModal}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-white p-5 rounded-t-2xl"
          >
            {selected && (
              <>
                <Text className="text-lg font-bold mb-2">
                  {selected.message}
                </Text>
                <Text className="text-orange-500 text-2xl mb-2">
                  {selected.sortie}
                </Text>
                <Text className="text-gray-500 mb-4">
                  {selected.allocution}
                </Text>
                <Text className="font-semibold">Exemple :</Text>
                <Text className="text-gray-600 mb-4">{selected.exemple}</Text>
                <Text className="text-sm text-gray-400 mb-4">
                  {selected.langueActuel} → {selected.langueCible}
                </Text>
                <Pressable
                  onPress={closeModal}
                  className="bg-orange-400 p-3 rounded-lg items-center"
                >
                  <Text className="text-white font-bold">Fermer</Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default Historique;
