import { useContext, useState } from "react";
import { Button, Text, View } from "react-native";

import { AuthContext } from "../../utils/AuthContext";
import { getData } from "../../utils/storage";
import { getListAccounts } from "../../services/account";
import { getAllAsyncDataActions } from "../../services/asyncData";

export default function More() {
  const { logoutAuthContext } = useContext(AuthContext);
  const [log, setLog] = useState("");

  const hanldeGetToken = async () => {
    const storedToken = await getData("userToken");
    console.log("Token: ", storedToken);
  };

  const hanldeGetAccounts = async () => {
    const accounts = await getListAccounts();
    if (accounts) {
      console.log(accounts);
      setLog(JSON.stringify(accounts, null, 2));
    }
  };

  const handleTest = () => {
    const testfunc = async () => {
      const test = await getAllAsyncDataActions();
      setLog(JSON.stringify(test, null, 2));
    };

    testfunc();
  };

  return (
    <View>
      <Text>More page</Text>
      <Button title="Đăng xuất" onPress={logoutAuthContext} />
      <Button title="check token" onPress={() => hanldeGetToken()} />
      <Button title="get Account" onPress={() => hanldeGetAccounts()} />
      <Button title="test" onPress={() => handleTest()} />
      <Text selectable={true}>Log: {log}</Text>
    </View>
  );
}
