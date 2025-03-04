import { MessageBar, MessageBarBody, MessageBarTitle } from "@fluentui/react-components";

const InstructionMessage = () => {
    return (
        <MessageBar intent="warning">
            <MessageBarBody>
                <MessageBarTitle>Warning:</MessageBarTitle>
                This sample is using free Azure OpenAI SKU so throttling and 500 errors can happen during peak usage.
            </MessageBarBody>
        </MessageBar>
    );
};

export default InstructionMessage;