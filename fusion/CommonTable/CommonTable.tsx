import React, { useEffect, useMemo, useState } from 'react';
import { ColumnProps, TablePropsType } from '@alifd/next/types/table/index';
import { Message, Table } from '@alifd/next';
import { useRequest, usePrevious } from 'ahooks';
import { isEqual } from 'lodash';

import * as styles from './CommonTable.module.less';

interface IColumn extends ColumnProps {
    dataIndex: string;
    title: string;
}

export interface IProps {
    /**
     * 命名规范： 对外暴露的callback函数使用onXxxxx
     *          内部的处理函数使用xxxxHandler
     */
    extraFilter: IExtraFilter;
    isPreview?: boolean;
    visibleColumns?: string[];
}

export interface IExtraFilter {
    /* TODO: impl */
}

interface IPagination {
    pageSize: number;
    pageNo: number;
    total: number;
}

interface ITableDataItem {
    /* TODO: impl */
}

interface ITableData {
    total: number;
    items: ITableDataItem[];
}

function generatePrimaryKey(data: ITableDataItem): string {
    /**
     * TODO: impl, 包含item唯一id和展示的可变表单字段值
     * example: `${item.id}-${item.status}` status 为table中展示的可改变的字段值
     */
    return '';
}

function fetchData(params: IPagination & IExtraFilter): Promise<ITableData> {
    /**
     * TODO: impl fetch data fn
     */
    return Promise.resolve({ items: [], total: 0 });
}

export const CommonTable = (props: IProps) => {
    const { isPreview, visibleColumns, extraFilter } = props;
    const [pagination, setPagination] = useState<IPagination>({ pageSize: 10, pageNo: 1, total: 0 });
    const { loading, run: refetch, data: tableData = {items: [], total: 0} } = useRequest(fetchData, {
        manual: true,
        debounceInterval: 200,
        onSuccess: (res) => {
            return {
                ...res,
                items: res.items.map((o) => ({
                    ...o,
                    __id: generatePrimaryKey(o),
                })),
            }
        },
        onError: (error) => {
            Message.error(`获取数据失败: ${error.message}`)
        },
    });

    /**
     *  event listener
     *  统一使用xxxHandler
     */
    // refetch event
    const prevPagination = usePrevious(pagination);
    const prevExtraFilter = usePrevious(extraFilter);
    useEffect(() => {
        const extraFilterChanged = !isEqual(extraFilter, prevExtraFilter);
        const paginationChanged = !isEqual(pagination, prevPagination);
        if (!extraFilterChanged && !paginationChanged) return;
        if (extraFilterChanged) {
            setPagination({ ...pagination, pageNo: 1 });
        }
        refetch({ ...pagination, ...extraFilter })
    }, [extraFilter, pagination])

    /* pagination config */
    const pageSizeChangeHandler = (pageSize: number) => {
        setPagination({
            ...pagination,
            pageSize,
            pageNo: 1,
        })
    }

    const pageNoChangeHandler = (current: number) => {
        setPagination({
            ...pagination,
            pageNo: current,
        })
    }

    /**
     * dom render
     */
    const columns = useMemo(() => {
        /**
         * TODO: impl get columns fn
         * 若column中cell过长，且可为pure function，将对应的内容迁移至函数外
         */
        const cols: IColumn[] = [];

        return visibleColumns
            ? cols.filter((col) => props.visibleColumns?.includes(col.dataIndex))
            : cols;
    }, [visibleColumns, props.visibleColumns]);

    /**
     * actions config
     * 若aciton比较复杂，使用columns中的cell实现
     * */
    const actions: TablePropsType['actions'] = useMemo(() => {
        /**
         * TODO: impl get action fn
         */
        return undefined;
    }, []);

    /* empty content */
    const emptyContent = useMemo(() => {
        /**
         * TODO: impl empty content render
         */
        return <>isEmpty</>;
    }, [])

    /**
     * complex config
     */
    const paginationOptions = useMemo(() => {
        return {
            current: pagination.pageNo,
            pageSize: pagination.pageSize,
            size: 'medium' as const,
            onChange: pageNoChangeHandler,
            onPageSizeChange: pageSizeChangeHandler,
            showTotal: true,
            total: tableData.total,
            popupProps: {
                align: 'bl tl',
            },
        }
    }, [pagination.pageNo, pagination.pageSize, tableData.total])

    return (
        <Table
            className={styles.table}
            isLoading={loading}
            dataSource={tableData.items}
            primaryKey="__id"
            columns={columns}
            emptyContent={emptyContent}
            pagination={paginationOptions}
            actions={actions}
        />
    )
}
