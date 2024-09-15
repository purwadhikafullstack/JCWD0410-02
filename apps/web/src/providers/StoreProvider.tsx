'use client';
import { AppStore, makeStore } from '@/redux/store';
import { useRef } from 'react';
import { Provider } from 'react-redux';
// import { PersistGate } from "redux-persist/integration/react";
// import { persistStore } from "redux-persist";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      {/* <PersistGate
        persistor={persistStore(storeRef.current)}
        loading={
          <h1 className="mt-20 flex justify-center text-3xl">Loading...</h1>
        }
      > */}
      {children}
      {/* </PersistGate> */}
    </Provider>
  );
}
