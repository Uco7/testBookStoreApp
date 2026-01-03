import { useContext } from "react";
import { BookContext } from "../context/bookContext";

export function useBook() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBook must be used within a BookProvider");
  }
  return context;
}
