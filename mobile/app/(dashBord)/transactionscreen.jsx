import React, { useMemo, useState } from "react";
import {
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import CardTheme from "../../component/CardTheme";
import { colors } from "../../constant/colors";
import { useSubscription } from "../../hook/Usesubscription";
import { BannerAdComponent } from "../../component/AdsManager";


const STATUS_COLORS = {
  success: "#059669",
  pending: "#d97706",
  failed: "#dc2626",
};

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const TransactionItem = ({ item }) => {
  const statusColor = STATUS_COLORS[item.status] || "#6b7280";

  return (
    <CardTheme style={styles.item}>
      <View style={styles.itemTopRow}>
        <View style={styles.planIconWrap}>
          <Ionicons
            name="diamond-outline"
            size={18}
            color="#059669"
          />
        </View>

        <View style={{ flex: 1 }}>
          <ThemeText style={styles.itemPlan}>
            {capitalize(item.plan)} Plan
          </ThemeText>

          <ThemeText style={styles.itemDate}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )
              : "—"}
          </ThemeText>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <ThemeText style={styles.itemAmount}>
            ₦{Number(item.amount || 0).toLocaleString()}
          </ThemeText>

          <ThemeText
            style={[
              styles.itemStatus,
              { color: statusColor },
            ]}
          >
            {capitalize(item.status)}
          </ThemeText>
        </View>
      </View>

      {item.reference && (
        <View style={styles.itemFooter}>
          <ThemeText style={styles.itemRef}>
            Ref: {item.reference}
          </ThemeText>
        </View>
      )}
    </CardTheme>
  );
};

export default function TransactionScreen() {
  const router = useRouter();

  const {
    transactions,
    currentSubscription,
    loading,
    error,
    fetchTransactions,
    getCurrentSubscription,
  } = useSubscription();

  console.log("Current Subscription:", currentSubscription);
  console.log(
  "Premium Plan:",
  currentSubscription?.premiumPlan
);
  const [search, setSearch] = useState("");

  const refreshData = async () => {
    await Promise.all([
      fetchTransactions(),
      getCurrentSubscription(),
    ]);
  };

  const filteredTransactions = useMemo(() => {
    if (!search.trim()) return transactions;

    const term = search.toLowerCase();

    return transactions.filter((item) => {
      const amount = String(item.amount || "");

      const plan = item.plan?.toLowerCase() || "";

      const status =
        item.status?.toLowerCase() || "";

      const date = item.createdAt
        ? new Date(item.createdAt)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .toLowerCase()
        : "";

      const month = item.createdAt
        ? new Date(item.createdAt)
            .toLocaleString("default", {
              month: "long",
            })
            .toLowerCase()
        : "";

      return (
        amount.includes(term) ||
        plan.includes(term) ||
        status.includes(term) ||
        date.includes(term) ||
        month.includes(term)
      );
    });
  }, [transactions, search]);

 const currentPlan = useMemo(() => {
  if (currentSubscription?.status === "success") {
    return currentSubscription;
  }

  // fallback: latest successful transaction
  const latestSuccess = [...transactions]
    .filter((t) => t.status === "success")
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )[0];

  return latestSuccess || null;
}, [currentSubscription, transactions]);

  const lastSuccessfulPlan = [...transactions]
    .filter((t) => t.status === "success")
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )[0];

  return (
    <ThemeView safe style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.primary || "#6366f1"}
          />
        </Pressable>

        <ThemeText style={styles.headerTitle}>
          Subscription
        </ThemeText>

        <View style={{ width: 32 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={18}
          color="#6b7280"
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search amount, month, date, plan..."
          style={styles.searchInput}
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.summaryRow}>
        <CardTheme style={styles.summaryCard}>
          <Ionicons
            name="diamond"
            size={24}
            color="#059669"
          />

          <ThemeText style={styles.summaryTitle}>
            Current Plan
          </ThemeText>

          <ThemeText style={styles.summaryValue}>
            {currentPlan?.status === "success"
                ? `${capitalize(currentPlan.plan)}`
                : "No Active Plan"}
           
          </ThemeText>
        </CardTheme>

        <CardTheme style={styles.summaryCard}>
          <Ionicons
            name="time"
            size={24}
            color="#d97706"
          />

          <ThemeText style={styles.summaryTitle}>
            Last Plan
          </ThemeText>

          <ThemeText style={styles.summaryValue}>
            {lastSuccessfulPlan?.plan
              ? capitalize(
                  lastSuccessfulPlan.plan
                )
              : "None"}
          </ThemeText>
        </CardTheme>
      </View>

      <CardTheme style={styles.totalCard}>
        <ThemeText style={styles.totalTitle}>
          Total Transactions
        </ThemeText>

        <ThemeText style={styles.totalValue}>
          {transactions.length}
        </ThemeText>

        {currentPlan?.premiumExpiresAt && (
          <ThemeText
            style={styles.expiryText}
          >
            Expires:{" "}
            {new Date(
              currentPlan.premiumExpiresAt
            ).toLocaleDateString()}
          </ThemeText>
        )}
      </CardTheme>

      {loading &&
      transactions.length === 0 ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" />
          <ThemeText
            style={{ marginTop: 12 }}
          >
            Loading...
          </ThemeText>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TransactionItem item={item} />
          )}
          contentContainerStyle={
            styles.list
          }
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refreshData}
            />
          }
          ListEmptyComponent={
            <View style={styles.centerWrap}>
              <Ionicons
                name="search-outline"
                size={40}
                color="#9ca3af"
              />

              <ThemeText
                style={styles.centerText}
              >
                No matching transactions
              </ThemeText>
            </View>
          }
        />
      )}

            <BannerAdComponent />
      
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  backBtn: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },

  summaryRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 12,
  },

  summaryCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  summaryTitle: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 6,
  },

  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },

  totalCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
  },

  totalTitle: {
    opacity: 0.6,
    fontSize: 13,
  },

  totalValue: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
  },

  expiryText: {
    marginTop: 8,
    opacity: 0.6,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  item: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  itemTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  planIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#d1fae5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  itemPlan: {
    fontSize: 14,
    fontWeight: "700",
  },

  itemDate: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },

  itemAmount: {
    fontSize: 14,
    fontWeight: "800",
  },

  itemStatus: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },

  itemFooter: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor:
      "rgba(0,0,0,0.05)",
  },

  itemRef: {
    fontSize: 11,
    opacity: 0.4,
  },

  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  centerText: {
    marginTop: 8,
    textAlign: "center",
    opacity: 0.7,
  },
});