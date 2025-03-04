import { MessageBar, MessageBarBody, MessageBarTitle } from "@fluentui/react-components";

const InstructionMessage = () => {
    return (
        <MessageBar intent="info">
            <MessageBarBody>
                <MessageBarTitle>Tip:</MessageBarTitle>
                Try asking questions like "Samples used in Orlando Live 360 in 2024" or "Show me the latest 5 samples".
            </MessageBarBody>
        </MessageBar>
    );
};

export default InstructionMessage;