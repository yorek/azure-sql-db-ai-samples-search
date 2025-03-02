import {
    Body1,
    Button,
    Field,
    Link,
    MessageBar,
    MessageBarBody,
    MessageBarTitle,
    SearchBox,
    Subtitle1,
    Subtitle2,
    Title1,
    Title3,
    makeStyles,
    tokens
} from '@fluentui/react-components';

const useStyles = makeStyles({
    root: {
        margin: 0,
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: tokens.colorBrandBackground2,
        gap: "16px",
        alignItems: "center",
    },
    title: {
        textAlign: "center",
        padding: "16px",
    },
    fieldWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: `${tokens.spacingVerticalMNudge} ${tokens.spacingHorizontalMNudge}`,
    },
});

const Searchbar = () => {

    const classes = useStyles();

    return (
        <>
            <div className={classes.root}>
                <Title1 className={classes.title}>Azure SQL DB Samples AI Agentic RAG Search</Title1>
                <Title3 style={{fontWeight:"lighter"}}>Find samples using AI Agents search capabilities</Title3>
                <div className={classes.fieldWrapper}>
                    <SearchBox style={{width: "450px"}} size="large" placeholder='Samples used in Orlando Live 360 in 2024' />
                    <Button size='large' appearance="primary">Search</Button>
                </div>
                <Subtitle2 style={{fontWeight: "normal"}}>There are a total of <Link>0 Samples</Link> in the Database.</Subtitle2>
            </div>
            <MessageBar intent="info" style={{ margin: "8px 36px" }}>
                <MessageBarBody>
                    <MessageBarTitle>Tip:</MessageBarTitle>
                    Try asking questions like "Samples used in Orlando Live 360 in 2024" or "Show me the latest 5 samples".
                </MessageBarBody>
            </MessageBar>
            <MessageBar intent="warning" style={{ margin: "8px 36px" }}>
                <MessageBarBody>
                    <MessageBarTitle>Warning:</MessageBarTitle>
                    This sample is using free Azure OpenAI SKU so throttling and 500 errors can happen during peak usage.
                </MessageBarBody>
            </MessageBar>
        </>
    );
};

export default Searchbar;