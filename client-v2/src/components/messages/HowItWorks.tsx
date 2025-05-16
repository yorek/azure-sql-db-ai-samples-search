import { Dialog, DialogBody, DialogContent, DialogSurface, DialogTitle, Link } from "@fluentui/react-components";
import React from "react";

interface HowItWorksProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ open, setOpen }) => {
    const handleClose = () => {
        setOpen(false);
    };

    if (!open) return null;

    return (
        <Dialog modalType="modal" open={open} onOpenChange={(event, data) => {
            if (data.open === false) {
                handleClose();
            }
        }}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>How does it work?</DialogTitle>
                    <DialogContent>
                        <div>
                            This search engine uses AI Agents to find samples created over time and available at <Link href='https://github.com/Azure-Samples?q=azure-sql' target="_blank">Azure SQL Database Samples repository</Link> and <Link href='https://aka.ms/sqlai-samples' target="_blank"> Azure SQL AI Samples</Link> using a RAG pattern with structured output.
                            <ul>
                                <li>The searched text is given to an <strong>AI Agent</strong> that decide the best tool to use to answer the question, either using similarity search or generating and executing a SQL query</li>
                                <li>Similiarity search across all available resources is done using the newly introduced <Link href='https://devblogs.microsoft.com/azure-sql/exciting-announcement-public-preview-of-native-vector-support-in-azure-sql-database/' target="_blank">vector support in Azure SQL Database</Link>.</li>
                                <li>Results are then passed to a GPT-4o model to generate a sample summary and thoughts with a defined <Link href='https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/structured-outputs?tabs=rest' target="_blank">structured output</Link>.</li>
                                <li><strong>Semantic caching</strong> is used to improve the performance of the search engine and reduce LLM calls costs.</li>
                            </ul>
                            If you want to have more details and get the source code of this sample, just ask about "this agentic AI sample" or "this website sample". Read more about creating AI apps with Azure SQL here: <Link href="https://aka.ms/sqlai" target="_blank">https://aka.ms/sqlai</Link>
                        </div>
                    </DialogContent>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default HowItWorks;