import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

// This component should wrap your entire application
const CopilotKitProvider = ({ children, publicApiKey }) => {
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