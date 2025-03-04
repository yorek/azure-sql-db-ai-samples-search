import {
    Button,
    Link,
    SearchBox,
    Subtitle2,
    Title1,
    Title3
} from '@fluentui/react-components';

import HowItWorks from '../messages/HowItWorks';
import { useState } from 'react';

import Styles from './Searchbar.styles';

const Searchbar = () => {

    const classes = Styles();
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpen = () => {
        setOpenDialog(true);
    };
    
    const handleSearch = () => {

    };

    return (
        <div className={classes.root}>
            <Title1 className={classes.title}>Azure SQL DB Samples AI Agentic RAG Search</Title1>
            <Title3 className={classes.subtitle}>Find samples using AI Agents search capabilities</Title3>
            <div className={classes.fieldWrapper}>
                <SearchBox style={{ minWidth: "350px" }} size="large" placeholder='Samples used in Orlando Live 360 in 2024' />
                <Button size='large' appearance="primary" onClick={() => handleSearch()}>Search</Button>
            </div>
            <Subtitle2 style={{ fontWeight: "normal", textAlign: "center" }}>
                There are a total of <Link className={classes.link} inline>0 Samples</Link> in the Database.
            </Subtitle2>
            <Subtitle2 style={{ fontWeight: "normal", textAlign: "center" }}>
                You can read more on <Link className={classes.link} as="a" inline onClick={() => handleOpen()}>how it works here</Link>. 
                You can visit our <Link className={classes.link} inline href="https://github.com/yorek/azure-sql-db-ai-samples-search" target='_blank'>GitHub repository here</Link>.
            </Subtitle2>
            <HowItWorks open={openDialog} setOpen={setOpenDialog} />
        </div>
    );
};

export default Searchbar;