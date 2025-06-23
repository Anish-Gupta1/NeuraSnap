import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { ReactNode } from "react";

// This component should wrap your entire application
interface CopilotKitProviderProps {
  children: ReactNode;
  publicApiKey: string;
}

const CopilotKitProvider = ({ children, publicApiKey }: CopilotKitProviderProps) => {
  return (
    <CopilotKit 
      publicApiKey={publicApiKey}
      // Optional: Configure additional settings
      // config={{
      //   // You can add custom configurations here
      //   chatSettings: {
      //     model: "gpt-4", // or "gpt-3.5-turbo"
      //     temperature: 0.7,
      //     maxTokens: 1000,
      //   }
      // }}
    >
      {children}
    </CopilotKit>
  );
};

export default CopilotKitProvider;