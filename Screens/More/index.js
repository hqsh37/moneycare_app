import { useContext, useEffect, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import { AuthContext } from "../../utils/AuthContext";
import { getData } from "../../utils/storage";
import { getListAccounts } from "../../services/account";
import {
  deleteAsyncDataActions,
  getAllAsyncDataActions,
} from "../../services/asyncData";
import { asyncDataAction } from "../../services/asyncDataCloud";
import { deleteCategorySpend } from "../../stores/categorySpend";
import { asyncDataCloud } from "../../handlers/dataAsyncHandle";
import { getTimestamps } from "../../stores/Timestamp";
import {
  getListCategory,
  getListCategoryDefault,
} from "../../services/category";
import { getInfo } from "../../services/auth";
import { deleteAccountData, getAccountData } from "../../stores/accountStorage";

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
      setLog(JSON.stringify(accounts, null, 2));
    }
  };

  const handleTest = () => {
    const testfunc = async () => {
      const test = await getAllAsyncDataActions();
      if (test.length === 0) {
        setLog("empty test");
      } else {
        setLog(JSON.stringify(test, null, 2));
      }
    };

    testfunc();

    // const fetchDataIfOnline = async () => {
    //   const isConnected = await checkNetworkStatus();
    //   if (isConnected) {
    //     setLog("Device is online");
    //   } else {
    //     setLog("Device is offline");
    //   }
    // };

    // fetchDataIfOnline();

    // const dataActions = [
    //   {
    //     type: "create",
    //     tbl: "category",
    //     id: "category_5265539",
    //     data: {
    //       id: "category_5265539",
    //       name: "sang",
    //       icon: "car",
    //       iconLib: "FontAwesome5",
    //       type: "chi",
    //       categoryParentId: 0,
    //       desc: "",
    //     },
    //   },
    // ];

    // // Call the asyncDataAction function
    // asyncDataAction(dataActions)
    //   .then((response) => {
    //     console.log("Async data action completed successfully:", response);
    //   })
    //   .catch((error) => {
    //     console.error("Failed to complete async data action:", error);
    //   });
  };

  return (
    <View style={{ flex: 1 }}>
      <Text>More page</Text>
      <Button title="Đăng xuất" onPress={logoutAuthContext} />
      <Button title="check token" onPress={() => hanldeGetToken()} />
      <Button title="get Account" onPress={() => hanldeGetAccounts()} />
      <Button title="test" onPress={() => handleTest()} />
      <Button title="test async" onPress={() => asyncDataCloud()} />
      <Button title="remove data" onPress={() => deleteAccountData()} />
      <Button title="remove action" onPress={() => deleteAsyncDataActions()} />
      <ScrollView style={{ flex: 1 }}>
        <Text selectable={true}>Log: {log}</Text>
      </ScrollView>
    </View>
  );
}
