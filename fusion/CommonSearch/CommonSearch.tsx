import * as React from 'react'
import { Form, FormItem } from '@formily/next'
import { Input, Select } from '@formily/next-components'
import { IFormEffect, FormEffectHooks } from "@formily/react";
import { useRequest } from 'ahooks';
import * as styles from './CommonSearch.module.less';

const { onFieldValueChange$ } = FormEffectHooks

export interface ISearchFields {
    // TODO: add all search field declare here
}

export interface IProps {
    // 初始化search默认值
    initialFields: ISearchFields;
    onChange: (searchFields: ISearchFields) => void;
}

// datasource map declare
// TODO: if has async data source impl; remove if not
interface IDataSources {
    // example
    select: string[]
}

const fetchDataSource: () => Promise<IDataSources> = async () => {
    const results = await Promise.all([]);
    return {
        // example
        select: []
    }
}

export const CommonSearch = (props: IProps) => {
    /**
     * TODO: if not async datasource, clean bellow; and mv dataSource out function as a const
     */
    const {data: dataSources, loading, error} = useRequest(fetchDataSource)

    // 数据联动
    // example; to see more: https://formilyjs.org/#/xbS7SW/NrIZI6F1
    const formEffects: IFormEffect = ({ setFieldState }) => {
        onFieldValueChange$('select')
            .subscribe((fieldState) => {
                setFieldState('input', state => state.value = fieldState.value)
            })
    }

    const onFormChange = (values: ISearchFields) => {
        props.onChange(values)
    }

    // TODO: impl and change name or delete
    const input = (
        <FormItem
            label="input"
            name="input"
            component={Input}
        />
    )

    // TODO: impl and change name or delete
    const select = (
        <FormItem
            label=""
            name=""
            component={Select}
            dataSource={dataSources.select}
        />
    )

    if (error) {
        // TODO: impl error display
        return <></>
    }

    if (loading) {
        // TODO: impl loading display
        return <></>
    }

    return (
        <Form
            effects={formEffects}
            onChange={onFormChange}
            initialValues={props.initialFields}
        >
            {input}
        </Form>
    )
}
