import {
    Dialog,
    DialogSurface,
    DialogBody,
    DialogTitle,
    DialogContent,
    Field,
    DialogActions,
    DialogTrigger,
    Button,
    Input,
    Textarea,
    ProgressBar
} from "@fluentui/react-components";

import CodeEditor from '@uiw/react-textarea-code-editor';

import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import Styles from "./UpsertSample.style";
import { upsertSampleAsync, searchSamplesAsync, getLatestSamplesAsync, getAllSamplesAsync, getTotalSamplesAsync, resetUpsertState, getSampleDetailsAsync, resetSampleDetailsState } from "../../store/slices/SearchSlice";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { Record } from "../../types/Record";
import Sample from "../../types/Sample";
import { useEffect } from "react";

interface UpsertProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    editSample?: Sample | null; // Optional sample to edit
    isEditMode?: boolean; // Flag to indicate edit mode
}

const UpsertSample = (props: UpsertProps) => {

    const { open, setOpen, editSample = null, isEditMode = false } = props;
    const dispatch: AppDispatch = useDispatch();
    const search = useSelector((state: RootState) => state.search);
    
    const classes = Styles();

    useEffect(() => {
        const upsertSucceeded = search.upsertSample.status === 'succeeded';
        
        if (upsertSucceeded) {
            setOpen(false);
            
            // Reset the state immediately to prevent infinite loop
            dispatch(resetUpsertState());
            
            // Refresh the search results based on current state
            const urlParams = new URLSearchParams(window.location.search);
            const qParam = urlParams.get('q');
            
            // Update total samples count (only needed for create operations, but getTotalSamplesAsync will get the correct count regardless)
            dispatch(getTotalSamplesAsync());
            
            // Small delay to ensure operations are processed
            setTimeout(() => {
                if (qParam) {
                    // If there's a search query in URL, re-run the search
                    dispatch(searchSamplesAsync(qParam));
                } else {
                    // For simplicity, always refresh latest samples when no search query
                    // This covers both the "latest samples" and "show all" scenarios
                    // Users can click "Show All" again if they were in that view
                    dispatch(getLatestSamplesAsync());
                }
            }, 100);
        }
    }, [search.upsertSample.status, setOpen, dispatch]);
    
    // form validation hook
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is a mandatory field.'),
        url: Yup.string().required('URL is a mandatory field.'),
        description: Yup.string().required('Description is a mandatory field.'),
        notes: Yup.string().optional(),
        details: Yup.string().required('Details are required, in JSON format')
    });

    const getDefaultValues = () => {
        if (isEditMode && editSample) {
            // Use detailed sample data if available, otherwise fall back to editSample
            const sampleToUse = search.sampleDetails.sample || editSample;
            return {
                name: sampleToUse.name,
                url: sampleToUse.url,
                description: sampleToUse.description,
                notes: sampleToUse.notes || '',
                details: JSON.stringify(sampleToUse.details, null, 2)
            };
        }
        return {
            name: '',
            url: '',
            description: '',
            notes: '',
            details: `{
    "author": "",
    "languages": [""],        
    "services": ["Azure SQL", "SQL Server"],
    "license": "MIT",
    "tags": [""],                 
    "type": "",
    "conferences": []
}`
        };
    };

    const { register, trigger, formState: { errors }, reset, getValues, control, setValue } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: getDefaultValues()
    });

    // Fetch complete sample details when entering edit mode
    useEffect(() => {
        if (isEditMode && editSample && open) {
            // Fetch the complete sample details from the API
            dispatch(getSampleDetailsAsync(editSample.id.toString()));
        }
    }, [isEditMode, editSample, open, dispatch]);

    // Clear sample details when dialog is closed or switching to create mode
    useEffect(() => {
        if (!open || !isEditMode) {
            // Clear the sample details state when dialog closes or switching to create mode
            // This ensures clean state for next edit operation
            dispatch(resetSampleDetailsState());
        }
    }, [open, isEditMode, dispatch]);

    // Update form values when sample details are loaded or editSample changes
    useEffect(() => {
        if (isEditMode && open) {
            // Use detailed sample data if available, otherwise fall back to editSample
            const sampleToUse = search.sampleDetails.sample || editSample;
            
            if (sampleToUse) {
                setValue('name', sampleToUse.name);
                setValue('url', sampleToUse.url);
                setValue('description', sampleToUse.description);
                setValue('notes', sampleToUse.notes || '');
                setValue('details', JSON.stringify(sampleToUse.details, null, 2));
            }
        } else if (!isEditMode && open) {
            // Reset to default values when switching to create mode
            const defaultValues = getDefaultValues();
            reset(defaultValues);
        }
    }, [isEditMode, editSample, search.sampleDetails.sample, open, setValue, reset]);

    // handle creation/update of the sample and close the dialog
    const handleClose = (target: string) => {
        if (target === 'create' || target === 'update') {
            // validate
            trigger(['name', 'url', 'description', 'notes', 'details'])
            // get value
            const values = getValues();
            // upsert
            const record = new Record(values.name, values.url, values.description, values.notes ?? '', values.details);
            dispatch(upsertSampleAsync({ 
                payload: JSON.stringify(record), 
                isCreate: !isEditMode 
            }));
            reset();
        }
        if (target === 'cancel') {
            setOpen(false);
        }
    };

    if (!open) return null;

    return (
        <Dialog modalType="modal" open={open} onOpenChange={(event, data) => {
            if (data.open === false && data.type === 'triggerClick') {
                handleClose(data.event.currentTarget.id);
            }
        }}>
            <DialogSurface className={classes.dialogSurface}>
                <DialogBody>
                        <DialogTitle>{isEditMode ? 'Edit Item' : 'New Item'}</DialogTitle>
                        <DialogContent className={classes.content}>
                            {(search.upsertSample.status === 'failed' || 
                              (isEditMode && search.sampleDetails.status === 'failed')) &&
                                <>
                                <p className={classes.error}>Failed to {
                                    isEditMode && search.sampleDetails.status === 'failed' ? 'load sample details' :
                                    search.upsertSample.isCreate ? 'create' : 'update'
                                } the sample. Please try again.</p>
                                <code>{
                                    isEditMode && search.sampleDetails.status === 'failed' ? search.sampleDetails.error :
                                    search.upsertSample.error
                                }</code>                            
                                </>
                            }
                            {search.upsertSample.status === 'loading' &&
                                <Field validationMessage={`${search.upsertSample.isCreate ? 'Creating' : 'Updating'} item, please wait ...`} validationState="none">
                                    <ProgressBar />
                                </Field>
                            }
                            {(isEditMode && search.sampleDetails.status === 'loading') &&
                                <Field validationMessage="Loading item details, please wait ..." validationState="none">
                                    <ProgressBar />
                                </Field>
                            }
                            {search.upsertSample.status === 'succeeded' &&
                                <p>Record {search.upsertSample.isCreate ? 'created' : 'updated'}.</p>
                            }
                            <Field
                                required
                                label="Name"
                                validationState={errors.name ? 'error' : 'none'}
                                validationMessage={errors.name?.message}>
                                <Input {...register('name')} placeholder="Item name" />
                            </Field>
                            <Field
                                required
                                label="URL (used as unique identifier)"
                                validationState={errors.url ? 'error' : 'none'}
                                validationMessage={errors.url?.message}>
                                <Input 
                                    {...register('url')} 
                                    placeholder="https://github.com"
                                    readOnly={isEditMode}
                                    style={isEditMode ? { 
                                        backgroundColor: '#f5f5f5', 
                                        color: '#666666',
                                        cursor: 'not-allowed' 
                                    } : undefined}
                                />
                            </Field>
                            <Field
                                required
                                label="Description"
                                validationState={errors.description ? 'error' : 'none'}
                                validationMessage={errors.description?.message}>
                                <Textarea {...register('description')} placeholder="Description of the item"/>
                            </Field>
                            <Field
                                label="Notes (to give more context to the AI agent)"
                                validationState={errors.notes ? 'error' : 'none'}
                                validationMessage={errors.notes?.message}>
                                <Textarea {...register('notes')} placeholder="Details used to help the AI agent to understand what is this item about."/>
                            </Field>
                            <Field
                                required
                                label="Details (JSON object)"
                                validationState={errors.details ? 'error' : 'none'}
                                validationMessage={errors.details?.message}>
                                    <Controller
                                        name="details"
                                        control={control}
                                        render={({ field }) => (
                                            <CodeEditor
                                                value={field.value}
                                                onChange={(evn) => field.onChange(evn.target.value)}
                                                language="json"
                                                placeholder="Enter JSON details..."
                                                padding={10}
                                                rows={12}
                                                minHeight={200}
                                                style={{
                                                    fontSize: 14,
                                                    backgroundColor: "#f5f5f5",
                                                    fontFamily:
                                                      "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                                                    maxHeight: "400px",
                                                    overflow: "auto"
                                                  }}
                                            />
                                        )}
                                    />
                            </Field>
                        </DialogContent>
                        <DialogActions>
                            <DialogTrigger disableButtonEnhancement>
                                <Button id={isEditMode ? "update" : "create"} appearance="primary">
                                    {isEditMode ? 'Update' : 'Create'}
                                </Button>
                            </DialogTrigger>
                            <DialogTrigger disableButtonEnhancement>
                                <Button id="cancel" appearance="secondary">Cancel</Button>
                            </DialogTrigger>
                        </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default UpsertSample;