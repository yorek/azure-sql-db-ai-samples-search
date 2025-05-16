import React from 'react';
import Sample from '../../types/Sample';
import { Field, makeStyles, Tag } from '@fluentui/react-components';

interface TagsGeneratorProps {
    sample: Sample | undefined;
};

const Style = makeStyles({
    tags: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '100%',
        overflowWrap: 'normal',
    }
})

const TagsGenerator = (props: TagsGeneratorProps) => {

    const classes = Style();
    const { sample } = props;

    if (!sample) return null;

    const renderValue = (value: any) => {
        if (Array.isArray(value)) {
            return value.map((item, index) => (
                <Tag key={index}>{item.toString()}</Tag>
            ));
        }
        // return value;
        return <Tag>{value.toString()}</Tag>
    };

    return (
        <div className={classes.tags}>
            
            {sample.details && Object.entries(sample.details).map(([key, value]) => (
                <Field key={key} label={key}
                    style={{ fontWeight: 'bold', textTransform: 'capitalize', display: 'flex', flexDirection: 'row', gap: '10px', flexWrap: 'wrap' }}>
                    {renderValue(value)}
                </Field>
                //   <div key={key} className="detail-item">
                //     <strong>{key}:</strong>{' '}
                //   </div>
            ))}
        </div>
    );
};
export default TagsGenerator;