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

import Style from "./CreateSample.style";
import { createSampleAsync } from "../../store/slices/SearchSlice";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { Record } from "../../types/Record";
import { useEffect } from "react";

interface CreateProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const CreateSample = (props: CreateProps) => {

    const { open, setOpen } = props;
    const dispatch: AppDispatch = useDispatch();
    const search = useSelector((state: RootState) => state.search);
    
    const classes = Style();

    useEffect(() => {
        if (search.createSample.status === 'succeeded') {
            setOpen(false);
        }
    }, [search.createSample.status, setOpen]);
    
    // form validation hook
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is a mandatory field.'),
        url: Yup.string().required('URL is a mandatory field.'),
        description: Yup.string().required('Description is a mandatory field.'),
        notes: Yup.string().optional(),
        details: Yup.string().required('Details are required, in JSON format')
    });

    const { register, trigger, formState: { errors }, reset, getValues, control } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
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
        }
      });

    // handle creation of the sample and close the dialog
    const handleClose = (target: string) => {
        if (target === 'create') {
            // validate
            trigger(['name', 'url', 'description', 'notes', 'details'])
            // get value
            const values = getValues();
            const record = new Record(values.name,values.url, values.description, values.notes ?? '', values.details);
            dispatch(createSampleAsync(JSON.stringify(record)));
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
            <DialogSurface>
                <DialogBody>
                        <DialogTitle>Create a new Sample</DialogTitle>
                        <DialogContent className={classes.content}>
                            {search.createSample.status === 'failed' &&
                                <>
                                <p className={classes.error}>Failed to create the sample. Please try again.</p>
                                <code>{search.delete.error}</code>                            
                                </>
                            }
                            {search.createSample.status === 'loading' &&
                                <Field validationMessage="Creating the record, please wait ..." validationState="none">
                                    <ProgressBar />
                                </Field>
                            }
                            {search.createSample.status === 'succeeded' &&
                                <p>Record created.</p>

}
                            <Field
                                required
                                label="Name"
                                validationState={errors.name ? 'error' : 'none'}
                                validationMessage={errors.name?.message}>
                                <Input {...register('name')} placeholder="Sample name" />
                            </Field>
                            <Field
                                required
                                label="URL"
                                validationState={errors.url ? 'error' : 'none'}
                                validationMessage={errors.url?.message}>
                                <Input {...register('url')} placeholder="https://github.com"/>
                            </Field>
                            <Field
                                required
                                label="Description"
                                validationState={errors.description ? 'error' : 'none'}
                                validationMessage={errors.description?.message}>
                                <Textarea {...register('description')} placeholder="This Sample is related to ..."/>
                            </Field>
                            <Field
                                label="Notes"
                                validationState={errors.notes ? 'error' : 'none'}
                                validationMessage={errors.notes?.message}>
                                <Textarea {...register('notes')} placeholder="In particular, it refers to ..."/>
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
                                                      "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
                                                  }}
                                            />
                                        )}
                                    />
                            </Field>
                        </DialogContent>
                        <DialogActions>
                            <DialogTrigger disableButtonEnhancement>
                                <Button id="create" appearance="primary">
                                    Create
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

export default CreateSample;