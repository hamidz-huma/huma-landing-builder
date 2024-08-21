import type { AppProps } from "next/app";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../styles/globals.css"; // You can add global styles here
import { Provider } from "react-redux";
import store from "@/lib/store/store";

export default function App({ Component, pageProps }: AppProps) {
  
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <Component {...pageProps} />
      </DndProvider>
    </Provider>
  );
}
