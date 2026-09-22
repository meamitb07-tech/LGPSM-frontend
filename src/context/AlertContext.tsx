"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import CustomAlertModal, { AlertType } from "@/components/common/CustomAlertModal";

interface AlertState {
  isOpen: boolean;
  message: string;
  title?: string;
  type?: AlertType;
  buttonText?: string;
}

interface AlertContextType {
  showAlert: (message: string, type?: AlertType, title?: string, buttonText?: string) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    message: "",
    type: "info",
  });

  const showAlert = (message: string, type: AlertType = "info", title?: string, buttonText?: string) => {
    setAlertState({
      isOpen: true,
      message,
      type,
      title,
      buttonText,
    });
  };

  const hideAlert = () => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <CustomAlertModal
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        buttonText={alertState.buttonText}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
