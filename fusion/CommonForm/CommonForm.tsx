import React from 'react';
import { useRequest } from 'ahooks';
import { Form, FormItem, FormButtonGroup, Submit } from '@formily/next';
import { Input } from '@formily/next-components';
import { Button, Message } from '@alifd/next';
import * as styles from './CommonForm.module.less';

export interface IProps {
    /**
     * 除极个别简单场景（如只有一个输入框）所有数据需要加载时需要重新获取
     * 禁止传入其他渲染数据
     * 不使用cache，每次变化在父组件中判断是否展示
     * 通常父组件使用方式: {visible && <CommonForm xxxx/>}
     */
    isPreview?: boolean;
    isNew?: boolean;
    // TODO: 根据业务场景修改 唯一id名称, tpl中所有itemId需要根据实际情况进行重命名
    itemId: string | number;
    /**
     * 命名规范： 对外暴露的callback函数使用onXxxxx
     *          内部的处理函数使用xxxxHandler
     */
    // 取消回调
    onCancel?: () => void;
    // 成果回调
    onSuccess?: () => void;
    // 失败回调
    onFailure?: () => void;
}

interface IDataSource {
    /**
     * impl data source
     */
}

const fetchDataSource = (): IDataSource => {
    /**
     * TODO: impl data source
     * 将所有如select下拉内容等一并获取
     * 若存在分页请求、交互加载更多等无法与其他一起fetchAll，则单独定义该请求
     */
    return Promise.resolve({})

}

interface IForm {
    /**
     * TODO: impl, 表单内容; 通常extends 详情接口返回即可
     * 若存在新字段数据转换，则增加字段定义
     * 文案展示映射逻辑，建议放在渲染逻辑中，不在接口层进行转换
     * itemId不包含在表单定义中
     */
}

const fetchDetail = (data: { itemId: string | number, isNew: boolean }): IForm => {
    /**
     * TODO: impl
     * 获取详情内容接口
     * 若为新增，则返回所有表单默认至
     */

    if (data.isNew) {
        /**
         * 返回表单默认值
         */
        return Promise.resolve({})
    }

    return Promise.resolve({})
}

const create = (data: IForm) => {
    return Promise.resolve()
}

const update = (data: IForm & { itemId: string | number }) => {
    return Promise.resolve()
}

export const CommonForm = (props: IProps) => {
    const { isPreview, isNew, itemId } = props;
    const dataSourceRequest = useRequest(fetchDataSource);
    const detailRequest = useRequest(fetchDetail);
    const createRequest = useRequest(create, { manual: true });
    const updateRequest = useRequest(update, { manual: true });

    // event handlers
    const submitHandler = (values: IForm) => {
        let req = isNew
            ? createRequest.run(values)
            : updateRequest.run({ ...values, itemId })
        return req
            .then(res => {
                Message.success("success")
                props.onSuccess()
            })
            .catch(err => {
                Message.error(err.localizedMessage)
                props.onFailure()
            })
    }

    if (dataSourceRequest.loading || detailRequest.loading) {
        // TODO: impl loading, 一个项目可定义通用loading进行复用
        return <></>
    }

    if (dataSourceRequest.error || detailRequest.error) {
        // TODO: impl error, 一个项目可定义通用error
        return <></>
    }

    return (
        <Form
            editable={!isPreview}
            className={styles.form}
            initialValues={detailRequest.data}
        >
            <FormItem
                // form data key
                name={""}
                placeholder={""}
                label={""}
                component={Input}
                rules={[
                    // validator: https://formilyjs.org/iframe.html?path=/opt/build/repo/packages/next/README.zh-cn.md#customvalidator
                    /**
                     * 1. 若存在复杂校验逻辑，将校验逻辑提取到单独函数定义中
                     * 2. 若表单字段过多，将校验函数定义放入单独文件中
                     * 3. 支持rule数组，业务线通用校验如车牌号校验等，提取至项目的统一校验tools or dir下面
                     */
                    {
                        min: 5,
                        max: 10,
                        validator(value) {
                            return value.includes("haha") ? '' : '必须存在haha'
                        }
                    }
                ]}
            />
            <FormButtonGroup align="right">
                {
                    !isPreview && (
                        <Submit
                            onSubmit={submitHandler}
                        />
                    )
                }
                <Button type="normal" onClick={props.onCancel}>
                    取消
                </Button>
            </FormButtonGroup>
        </Form>
    )
}
