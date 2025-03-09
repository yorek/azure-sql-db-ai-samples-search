import {
    Button,
    Link,
    SearchBox,
    Subtitle2,
    Title1,
    Title3
} from '@fluentui/react-components';

import {  SearchRegular, ArrowUndoRegular} from '@fluentui/react-icons'

import HowItWorks from '../messages/HowItWorks';
import { useEffect, useState } from 'react';

import Styles from './Searchbar.styles';
import { resetSearchState, searchArticlesAsync } from '../../store/slices/SearchSlice';
import { getLatestSamplesAsync, getTotalSamplesAsync, resetHomeState } from '../../store/slices/HomeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';

const Searchbar = () => {

    const classes = Styles();
    const home = useSelector((state: RootState) => state).home;
    const search = useSelector((state: RootState) => state).search;
    const [openDialog, setOpenDialog] = useState(false);

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(resetSearchState());
        dispatch(getTotalSamplesAsync());
        dispatch(getLatestSamplesAsync());
    }, [dispatch]);

    const handleOpen = () => {
        setOpenDialog(true);
    };

    const handleSearch = () => {
        dispatch(resetHomeState());
        dispatch(searchArticlesAsync('search query'));
    };

    const handleReset = () => {
        dispatch(resetSearchState());
        dispatch(getLatestSamplesAsync());
    };

    return (
        <div className={classes.root}>
            <Title1 className={classes.title}>Azure SQL DB Samples AI Agentic RAG Search</Title1>
            <Title3 className={classes.subtitle}>Find samples using AI Agents search capabilities</Title3>
            <div className={classes.fieldWrapper}>
                <SearchBox style={{ minWidth: "350px" }}
                    size="large"
                    placeholder='Samples used in Orlando Live 360 in 2024' />
                <Button
                    disabled={home.latestSamples.status === 'loading' || search.status === 'loading'}
                    size='large'
                    appearance="primary"
                    icon={<SearchRegular />}
                    onClick={() => handleSearch()}>Search</Button>
                <Button
                    disabled={home.latestSamples.status === 'loading' || search.status === 'loading'}
                    size='large'
                    appearance="transparent"
                    icon={<ArrowUndoRegular />}
                    onClick={() => handleReset()}>Reset</Button>

            </div>
            {home.totalSamples.status === 'loading' && <Subtitle2 style={{ fontWeight: "normal", textAlign: "center" }}>Loading total Nr. of samples ...</Subtitle2>}
            {home.totalSamples.status === 'failed' && <Subtitle2 style={{ fontWeight: "normal", textAlign: "center" }}><strong>Failed</strong> to load Samples</Subtitle2>}
            {home.totalSamples.status === 'succeeded' && <Subtitle2 style={{ fontWeight: "normal", textAlign: "center" }}>There are a total of <Link className={classes.link} inline>{home.totalSamples.total} Samples</Link> in the Database.</Subtitle2>}
            <Subtitle2 style={{ fontWeight: "normal", textAlign: "center" }}>
                You can read more on <Link className={classes.link} as="a" inline onClick={() => handleOpen()}>how it works here</Link>.
                You can visit our <Link className={classes.link} inline href="https://github.com/yorek/azure-sql-db-ai-samples-search" target='_blank'>GitHub repository here</Link>.
            </Subtitle2>
            <HowItWorks open={openDialog} setOpen={setOpenDialog} />
        </div>
    );
};

export default Searchbar;
