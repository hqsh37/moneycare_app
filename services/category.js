import api, { setAuthToken } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getListCategory = async () => {
  try {
    const response = await api.get("/categories");
    if ((data = response.data?.data)) {
      return data;
    } else {
      return 0;
    }
  } catch (error) {
    if (error.response) {
      console.log("Error data:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
    return false;
  }
};

export const getListCategoryDefault = async () => {
  try {
    const response = await api.get("/categories/default");
    if ((data = response.data?.data)) {
      return data;
    } else {
      return 0;
    }
  } catch (error) {
    if (error.response) {
      console.log("Error data:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
    return false;
  }
};

export const getaCategory = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`);
    if ((token = response.data?.data?.token)) {
      await AsyncStorage.setItem("token", token);
      setAuthToken(token);
      return token;
    } else {
      console.log("No token received");
    }
    return token;
  } catch (error) {
    if (error.response) {
      console.log("Error data:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
    return false;
  }
};

export const convertCategoriesWithReplace = (data) => {
  const itemMap = {
    chi: {},
    thu: {},
  };

  // Step 1: Build the initial map and handle replacements and deletions
  data.forEach((item) => {
    const { id, categoryReplaceId, hanmuccha, loaihangmuc } = item;

    // Determine the type (chi or thu) and choose the right map
    const mapType = loaihangmuc === "chi" ? "chi" : "thu";

    // If categoryReplaceId is valid and loaihangmuc is "remove", delete the item
    if (
      categoryReplaceId &&
      categoryReplaceId !== "0" &&
      categoryReplaceId !== null
    ) {
      if (loaihangmuc == "remove") {
        console.log("loại item map: ", itemMap[mapType][categoryReplaceId]);
        if (itemMap["chi"][categoryReplaceId] !== undefined) {
          delete itemMap["chi"][categoryReplaceId];
        } else {
          delete itemMap["thu"][categoryReplaceId];
        }
      } else {
        // If not removing, replace properties in the target categoryx
        const targetId = categoryReplaceId;
        if (itemMap[mapType][targetId]) {
          itemMap[mapType][targetId] = {
            ...itemMap[mapType][targetId],
            name: item.tenhangmuc,
            icon: item.icon,
            iconLib: item.iconlib,
            hanmuccha: hanmuccha,
            ReplaceId: item.id,
            cateDefault: item.id_user == 0,
          };
        } else {
          itemMap[mapType][targetId] = { ...item };
        }
      }
    } else {
      // Otherwise, add or update the item in the map normally
      itemMap[mapType][id] = {
        id: parseInt(id, 10),
        name: item.tenhangmuc,
        icon: item.icon,
        iconLib: item.iconlib,
        hanmuccha: hanmuccha,
        cateDefault: item.id_user == 0,
      };
    }
  });

  // Step 2: Organize into hierarchy based on hanmuccha
  const nestedCategoriesChi = [];
  const nestedCategoriesThu = [];

  const buildHierarchy = (itemMap, targetArray) => {
    Object.values(itemMap).forEach((item) => {
      if (item.hanmuccha === "0") {
        // Root-level item, add directly to targetArray
        targetArray.push(item);
      } else {
        // Child item, add to its parent's children array (create if necessary)
        const parent = itemMap[item.hanmuccha];
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(item);
        }
      }
    });
  };

  buildHierarchy(itemMap.chi, nestedCategoriesChi);
  buildHierarchy(itemMap.thu, nestedCategoriesThu);

  return {
    chi: nestedCategoriesChi,
    thu: nestedCategoriesThu,
  };
};
