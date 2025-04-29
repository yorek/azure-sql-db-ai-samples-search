import {
    Button,
    Link,
    SearchBox,
    Subtitle2,
    Title1,
    Title3
} from '@fluentui/react-components';

import { SearchRegular, ArrowUndoRegular } from '@fluentui/react-icons'

import HowItWorks from '../messages/HowItWorks';
import { useEffect, useState } from 'react';

import Styles from './Searchbar.styles';
import { resetSearchState, getAllSamplesAsync, getLatestSamplesAsync, searchSamplesAsync, getTotalSamplesAsync } from '../../store/slices/SearchSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';

const Searchbar = () => {

    const classes = Styles();
    const search = useSelector((state: RootState) => state.search);
    const [openDialog, setOpenDialog] = useState(false);
    const [searchValue, setSearchValue] = useState<string>('');

    const dispatch: AppDispatch = useDispatch();

    /* onLoad clean and load total and latest samples */
    useEffect(() => {
        dispatch(resetSearchState());
        dispatch(getTotalSamplesAsync());
        dispatch(getLatestSamplesAsync());
    }, [dispatch]);

    /* Search
    * @param event
    * @param data
    */
    const onSearchChange = (event: any, data: { value: string }) => {
        setSearchValue(data.value);
    };

    /* Open HowItWorks dialog */
    const handleOpen = () => {
        setOpenDialog(true);
    };

    /* Handle search */
    const handleSearch = () => {
        dispatch(resetSearchState());
        dispatch(searchSamplesAsync(searchValue));
    };

    /* Handle reset */
    const handleReset = () => {
        dispatch(resetSearchState());
        dispatch(getLatestSamplesAsync());
    };

    /* Handle all samples */
    const handleAllSamples = () => {
        dispatch(getAllSamplesAsync());
    };

    return (
        <div className={classes.root}>
            <Title1 className={classes.title}>Azure SQL DB Samples AI Agentic RAG Search</Title1>
            <Title3 className={classes.subtitle}>Find samples using AI Agents search capabilities</Title3>
            <div className={classes.fieldWrapper}>
                <SearchBox style={{ minWidth: "350px" }}
                    size="large"
                    placeholder='Samples used in Orlando Live 360 in 2024'
                    value={searchValue}
                    onChange={onSearchChange} />
                <div className={classes.buttonsWrapper}>
                    <Button
                        disabled={search.samples.status === 'loading' || searchValue === ''}
                        size='large'
                        appearance="primary"
                        icon={<SearchRegular />}
                        onClick={() => handleSearch()}>Search</Button>
                    <Button
                        disabled={search.samples.status === 'loading'}
                        size='large'
                        appearance="transparent"
                        icon={<ArrowUndoRegular />}
                        onClick={() => handleReset()}>Reset</Button>
                </div>
            </div>
            <Subtitle2 style={{ fontWeight: "normal", textAlign: "center" }}>
            {search.totalSamples.status === 'loading' && "Loading total Nr. of samples ..."}&nbsp;
            {search.totalSamples.status === 'failed' && <><strong>Failed</strong> to load Samples. <Link onClick={() => dispatch(getTotalSamplesAsync())} className={classes.link} inline>Try again</Link>.</>}&nbsp;
            {search.totalSamples.status === 'succeeded' && <>There are a total of <Link onClick={() => handleAllSamples()} className={classes.link} inline>{search.totalSamples.total} Samples</Link>.</>}&nbsp;
            You can read more on <Link className={classes.link} as="a" inline onClick={() => handleOpen()}>how it works here</Link>.&nbsp;
            You can visit our <Link className={classes.link} inline href="https://github.com/yorek/azure-sql-db-ai-samples-search" target='_blank'>GitHub repository here</Link>.

            </Subtitle2>
            <HowItWorks open={openDialog} setOpen={setOpenDialog} />
        </div>
    );
};

export default Searchbar;
