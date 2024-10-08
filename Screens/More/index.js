import { useContext } from "react";
import { Button, Text, View } from "react-native";

import { AuthContext } from "../../utils/AuthContext";
import { getData } from "../../utils/storage";
import { getListAccounts } from "../../services/account";

export default function More() {
  const { logoutAuthContext } = useContext(AuthContext);

  const hanldeGetToken = async () => {
    const storedToken = await getData("userToken");
    console.log("Token: ", storedToken);
  };

  const hanldeGetAccounts = async () => {
    const accounts = await getListAccounts();
    if (accounts) {
      console.log(accounts);
    }
  };

  return (
    <View>
      <Text>More page</Text>
      <Button title="Đăng xuất" onPress={logoutAuthContext} />
      <Button title="check token" onPress={() => hanldeGetToken()} />
      <Button title="get Account" onPress={() => hanldeGetAccounts()} />
    </View>
  );
}
