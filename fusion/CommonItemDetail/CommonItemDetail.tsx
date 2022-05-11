import * as React from 'react';
import {useRequest} from 'ahooks';
import * as styles from './CommonItemDetail.module.less';

/**
 * 详情页面禁止使用cache
 * id、visible等变动在 父级组件中控制
 * 禁止监听 id、visible变化,做reload操作
 */
export interface IProps {
    itemId: string | number;
    isPreview?: boolean;
}

// TODO: impl async fetch data response data
interface IDetail {

}

function fetchDetailInfo(data: { id: string | number }): Promise<IDetail> {
    // TODO: impl fetch detail info
    return Promise.resolve({})
}

export const CommonItemDetail = (props: IProps) => {
    const { data, loading, error } = useRequest(() => fetchDetailInfo({ id: props.itemId }));

    if (loading) {
        // TODO: impl loading render
        return <></>
    }

    if (error) {
        // TODO: impl error render
        return <></>
    }

    return (
        <div>
        </div>
    )
}
