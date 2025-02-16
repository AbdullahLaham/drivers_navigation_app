import { I18nManager } from "react-native";
import * as RNLocalize from "react-native-localize";

// دالة للتحقق من لغة الجهاز وتفعيل RTL إذا كانت لغة من اليمين إلى اليسار
const enableRTL = () => {
  const isRTL = RNLocalize.getLocales()[0]?.isRTL || false;

  if (isRTL !== I18nManager.isRTL) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(isRTL);
  }
};

export default enableRTL;

